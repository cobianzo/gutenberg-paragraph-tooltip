# Desciption of my project to ask more changes

I am working in a Wordpress plugin development using a local package of `wp-env`. My `package.json` runs the env using
```
"scripts": {
    "up": "wp-env start",
    "down": "wp-env stop",
    "start": "wp-scripts start",
    "build": "wp-scripts build",
```

I have setup typescript as well.
I am working in a git repository.

# Questions for the AI agent to develop this project

1. Help me creating a new project in wordpress, using wp-env (I don't want to install it globally, I want a local dependency of wp-env for development).

> This will give you the commands `npm init`, `npm install wp-env -D`, and the starting data for `plugin.php`. Then add in `package.json` the `"scripts": "up" : "wp-env start"` and you have an instance running (Docker must be running)

2. I want to setup my wordpress project for typescript, using @wordpress/scripts package for compiling my files, which will be in the /src folder, compiling into /build.

> This will give you the `npx tsc --init` and `tsconfig.json` setup installation of the packages

3. I want to setup the phpcs and phpcbf. First with command line. I want to install it with composer locally. This is a wordpress project, so I want to setup the wordpress VIP rules, and include the right script commands for composer, but include them also in npm
