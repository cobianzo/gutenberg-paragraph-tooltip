# Development notes

Open Docker and sequence to start working:

```
npm install; npm run up; npm run start
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

# Testing

> npx wp-env run tests-cli --env-cwd=wp-content/plugins/gutenberg-paragraph-tooltip phpunit
❯ npm run test:php

# DEVELOPMENT STEPS:

## Basic boilerplate, corresponding to git commits

1. git setup
2. wp-env setup
3. typescript setup, wp-scripts setup and enqueue
4. Linting setup js, stylelint: command line and vscode
5. Linging setup phpcs, phpcbf and phpstan
6. Testing setup
7. CI/CD (husky?)
