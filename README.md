# GB CSS Plugin

This is the source code for the WordPress plugin 'gb-css-plugin'. The distribution file will be
placed in the branch 'distribution-zip' of this repository.

This plugin consists in a simple functionality that includes an extra option when editing a link
 within the block editor: nice CSS tooltips.


# TODO

- Install `dist-archive` package and create distribution process through WP CLI instead of deploy.sh
- make the restriction of BLOCKS work (now it applies to all blocks. Test it in other blocks like blockquotes
- fix phpunit test
- Make it multilingual compatible (test it at least)
- Make more e2e testings.
- Nice to have: Make a mobile friendly alternative

## bugs:

- making only a change in a tooltip does not activate the Save button on the page editor.


# Development notes

Open Docker and sequence to start working:

```
npm install; composer install;
npm run up; npm run start
```

you might also want to run a quick test (with the wp-env instance up):

```
npx playwright install
npm run test:js
```

Visit the site:

-   http://localhost:8888/wp-admin/
-   Use user: admin / pw: password to login

If you want to make changes I suggest you setup the playwright environment and run `npm run test:js:watch`
to monitorize if you break something (or watch it with the UI or the VSCode Playwright plugin)

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

`npx playwright install`

In VSCode, use the extension for Playwright (with the icon of the laboratory on the left),
 or use `npm run test:js -- --ui`

Or from command line use any of these:
```
npm run test:js
npm run test:js:watch
npm run test:js:report
```
