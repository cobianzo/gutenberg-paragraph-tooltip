#!/bin/bash

# Configuración de variables
BRANCH_DISTRIBUTION="distribution"
BRANCH_MAIN="main"
BRANCH_DISTRIBUTION_ZIP="distribution-zip"
ZIP_FILE="gb-css-tooltip.zip"
EXCLUDE_FILES=(".wp-env.json" "vendor" "node_modules") # Añade aquí los archivos o carpetas que quieres excluir

# Paso 1: Eliminar la rama 'distribution', si existe
git branch -D $BRANCH_DISTRIBUTION 2>/dev/null

# Paso 2: Volver a hacer checkout de la rama 'distribution' a partir de la rama 'main'
git checkout -b $BRANCH_DISTRIBUTION $BRANCH_MAIN

# Paso 3: Ejecutar 'npm run build'
npm run build

# Paso 4: Borrar archivos especificados en el array EXCLUDE_FILES
for file in "${EXCLUDE_FILES[@]}"; do
    rm -rf $file
done

# Paso 5: Hacer commit de todos los cambios y hacer push
git add .
git commit -m "Preparing distribution branch"
git push -f origin $BRANCH_DISTRIBUTION

# Paso 6: Borrar la rama 'distribution-zip' si existe
git branch -D $BRANCH_DISTRIBUTION_ZIP 2>/dev/null

# Paso 7: Crear de nuevo la rama 'distribution-zip' a partir de la rama 'distribution'
git checkout -b $BRANCH_DISTRIBUTION_ZIP $BRANCH_DISTRIBUTION

# Paso 8: Crear un zip con todos los archivos del plugin, llamado 'gb-css-tooltip'
zip -r $ZIP_FILE .

# Paso 9: Eliminar cualquier archivo que no sea el .zip ni .git ni .gitignore
find . -type f ! -name "$ZIP_FILE" ! -name ".gitignore" -delete
find . -type d ! -name "." ! -name ".git" -exec rm -rf {} +

# Paso 10: Hacer commit y push de todos los cambios
git add .
git commit -m "Adding distribution zip"
git push -f origin $BRANCH_DISTRIBUTION_ZIP

# Volver a la rama main
git checkout $BRANCH_MAIN

echo "Deployment complete!"