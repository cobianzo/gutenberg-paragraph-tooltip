#!/bin/bash

# Al ejecutar esto, se comprimira el plugin listo para distribucion
# y su zip de resultado se hara push en la rama de git 'distribution-zip'
# After executing this, we'll be back in the 'main' branch but the vendor and node_modules
# will be deleted. You can run 'npm install' and 'composer install' to get them back.

# Configuración de variables
BRANCH_DISTRIBUTION="distribution"
BRANCH_MAIN="main"
BRANCH_DISTRIBUTION_ZIP="distribution-zip"
ZIP_FILE="gb-css-tooltip.zip"
# Añade aquí los archivos o carpetas que quieres excluir. We just need plugin.php, readme.txt and build/ folder
# When using WP CLI dist-archive, we'll put these ones in the .distignore file
EXCLUDE_FILES=(
    "README.md"
    "AI-AGENT.md"
    "webpack.config.js"
    ".DS_Store"
    ".wp-env.json"
    "composer.json"
    ".vscode"
    "composer.lock"
    "e2e"
    "package-lock.json"
    "phpstan.neon"
    "phpunit.xml.dist"
    "playwright.config.ts"
    "schemas"
    "tests"
    "tsconfig.json"
    "phpcs.xml.dist"
    ".editorconfig"
    ".prettierrc.js"
    ".eslintrc.js"
    ".distignore"
    ".DS_Store"
    "vendor/"
    "node_modules/"
    ".env"
    ".env.test"
    "/test-results/"
    "/playwright-report/"
    "/blob-report/"
    "/playwright/.cache/"
    "/artifacts/"
    "/tests/e2e/__snapshots__"
    ".phpunit.result.cache"
    "phpunit.xml"
    "/tests/_wordpress"
    "tests-examples/demo-todo-app.spec.ts"
)
# Paso 1: Eliminar la rama 'distribution', si existe
git branch -D $BRANCH_DISTRIBUTION 2>/dev/null

# Paso 2: Volver a hacer checkout de la rama 'distribution' a partir de la rama 'main'
git checkout -b $BRANCH_DISTRIBUTION $BRANCH_MAIN

# Paso 3: Ejecutar 'npm run build'
echo -e "\e[33mWe are building the files for distribution\e[0m"
npm run build

# Paso 4: Borrar archivos especificados en el array EXCLUDE_FILES
echo -e "\e[33mDelete all development files that we don't need in distribution\e[0m"
for file in "${EXCLUDE_FILES[@]}"; do rm -rf "$file"; done

# Paso 5: Hacer commit de todos los cambios y hacer push
git add .
git commit -m "Preparing distribution branch on $(date +"%Y-%m-%d %H:%M")"
git push -f origin $BRANCH_DISTRIBUTION

# Paso 6: Borrar la rama 'distribution-zip' si existe
git branch -D $BRANCH_DISTRIBUTION_ZIP 2>/dev/null

# Paso 7: Crear de nuevo la rama 'distribution-zip' a partir de la rama 'distribution'
git checkout -b $BRANCH_DISTRIBUTION_ZIP $BRANCH_DISTRIBUTION
echo -e "\e[33mWe are in branch 'distribution-zip'. Let zip it up \e[0m"

# Paso 8: Crear un zip con todos los archivos del plugin, llamado 'gb-css-tooltip'
zip -r "$ZIP_FILE" . --exclude "*.git/*" ".gitignore" "deploy.sh"

# Paso 9: Eliminar cualquier archivo que no sea el .zip ni .git ni .gitignore
find . -type f ! -name "*.zip" ! -path "./.git/*" ! -name "readme.txt" -exec rm -f {} +
echo "Archivos eliminados excepto .zip, .git y .gitignore."

# Paso 10: Hacer commit y push de todos los cambios
git add .
git commit -m "Adding distribution zip on $(date +"%Y-%m-%d %H:%M")"
git push -f origin $BRANCH_DISTRIBUTION_ZIP

echo -e "\e[33mAll done. Check 'git remote -v' \e[0m"
REMOTE_URL=$(git config --get remote.origin.url)
# Verifica si es SSH y convierte a HTTPS
if [[ $REMOTE_URL == git@github.com:* ]]; then
    HTTPS_URL="https://github.com/${REMOTE_URL#git@github.com:}"
    echo "URL: $HTTPS_URL"
else
    echo "the URL: $REMOTE_URL"
fi

# Volver a la rama main
git checkout $BRANCH_MAIN

echo "Deployment complete!"
