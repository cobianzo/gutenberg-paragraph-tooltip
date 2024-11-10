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
I am working in a git repository:

When running the environment (npm run up) I get:

```
WordPress development site started at http://localhost:8888
WordPress test site started at http://localhost:8889
MySQL is listening on port 62691
MySQL for automated testing is listening on port 62782
```

# Questions for the AI agent to develop this project

1. Help me creating a new project in wordpress, using wp-env (I don't want to install it globally, I want a local dependency of wp-env for development).

> This will give you the commands `npm init`, `npm install wp-env -D`, and the starting data for `plugin.php`. Then add in `package.json` the `"scripts": "up" : "wp-env start"` and you have an instance running (Docker must be running)

2. I want to setup my wordpress project for typescript, using @wordpress/scripts package for compiling my files, which will be in the /src folder, compiling into /build.

> This will give you the `npx tsc --init` and `tsconfig.json` setup installation of the packages

3. I want to setup the phpcs and phpcbf. First with command line. I want to install it with composer locally. This is a wordpress project, so I want to setup the wordpress VIP rules, and include the right script commands for composer, but include them also in npm

4. I have simple setup of PHPUnit wirh
- `phpunit.xml`, calling `<phpunit bootstrap="tests/bootstrap.php" ... `
- `tests/` folder, with `tests/bootstrap.php`. That file includes the hook:
`tests_add_filter( 'muplugins_loaded', '_manually_load_plugin' );` so we require the code of our plugin.
- `tests/test_plugin.php` with an initial test that checks that the plugin is correctly activated with `$this->assertTrue( class_exists( 'GutenbergTooltip\Plugin' ), 'El plugin no se ha cargado correctamente' );`

Now I want to integrate WPBrowser. I have included the library and run the command
`❯ vendor/bin/codecept init wpbrowser`. It has created several subdirectories under `/tests/`. None of those test files is currently loaded due to the rules in `<testsuites>`, in `phpunit.xml`.

I want you to help me to build a simple test that connects to the admin of WP, creates a new page, and asserts that that page has loaded the script that my plugin has enqueued with
`wp_enqueue_script( 'gutenberg-tooltip-script', plugins_url( 'build/index.js', __FILE__ ), ... )`

What kind of test would be this one? Integration test?
