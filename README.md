# TODO


- Add e2e testing
- Add label on top of input for tooltip
- Remove the add listener to the pencil button and replace it with a mutation observer,
which should be enough
- When the tooltip
- make the restriction of BLOCKS work (now it applies to all blocks)
- fix bug, closing and opening Advanced panel
- fix phpunit test


# Development notes

Open Docker and sequence to start working:

```
npm install; composer install;
npm run up; npm run start
```

-   http://localhost:8888/wp-admin/
-   Use user: admin / pw: password to login

## Run commands in the env

In development instance:
`npx wp-env run cli wp plugin list`

In test instance:
`npx wp-env run tests-cli wp shell`

## Linting

`npm run lint`

It will lint all : js, css, php with phpcs and phpstan.
There are individual commands for each type of linting, check `package.json`.

# Testing PHP

## @TODO: Testing with WP Browser

It is not yet installed. It should be installed with
❯ composer require --dev lucatume/wp-browser

Before you start testing you need to edit:
`tests/.env`
and probably the _bootstrap.php for every suite to activate the plugin.

You'll need to connect it to the wp-env source code and the mysql test database.

```
composer install
vendor/bin/codecept init wpbrowser
```

Execute the integration tests (we don't use `npm run test:php`)

```
vendor/bin/codecept run Integration
```

## Testing without WPBrowser

> npx wp-env run tests-cli --env-cwd=wp-content/plugins/wordpress-paragraph-tooltip phpunit
❯ npm run test:php

# Testing E2E JS

In VSCode, use the extension for Playwright (with the icon of the laboratory on the left)
Or: 
```
npm run test:js
npm run test:js:watch
npm run test:js:report
```

# DEVELOPMENT STEPS:

## Basic boilerplate, corresponding to git commits

1. git setup
2. wp-env setup
3. typescript setup, wp-scripts setup and enqueue
4. Linting setup js, stylelint: command line and vscode
5. Linging setup phpcs, phpcbf and phpstan
6. Testing setup
7. CI/CD (husky?)
