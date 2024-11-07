# Desciption of my project to ask more changes

I am working in a Wordpress plugin development using a local package of `wp-env`. My `package.json` runs the env using

```
"scripts": {
    "up": "wp-env start",
```

I have setup typescript as well.
I am working in a git repository.

# Questions for the AI agent to develop this project

1. Help me creating a new project in wordpress, using wp-env (I don't want to install it globally, I want a local dependency of wp-env for development).

> This will give you the commands `npm init`, `npm install wp-env -D`, and the starting data for `plugin.php`. Then add in `package.json` the `"scripts": "up" : "wp-env start"` and you have an instance running (Docker must be running)

2. I want to setup my wordpress project for typescript, using @wordpress/scripts package for compiling my files, which will be in the /src folder, compiling into /build.

> This will give you the `npx tsc --init` and `tsconfig.json` setup.
