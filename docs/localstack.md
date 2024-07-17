# Union Audio Backend Monorepo

## Installation

```bash
$ yarn install
```

## Pre start

```bash
$ docker compose up -d
```

### Migrations

```bash
# generate
$ yarn nx run <app-name>:migration-generate --args="--name=example"

#run
$ yarn nx run <app-name>:migration-run
```

## Start the app

```bash
$ yarn start <app-name>
```

## Test

```bash
# unit tests
$ yarn test <app-name>

# e2e tests
$ yarn e2e <app-name>
```

## Build

```bash
$ yarn build <app-name>
```

## Useful Tips:

### Nx

Generate a new app (use the flag `--e2eTestRunner none` for not generating e2e tests app):

```bash
$ yarn nx g @nx/nest:app <app-name>
```

> Obs: After the app creation, copy configs of project.json and orm configs from another existent app

Generate a new lib (optional flags: --buildable/--publishable):

```bash
$ yarn nx g @nx/nest:lib libs/<lib-name>
```

> Obs: After the lib creation, edit alias path in tsconfig.base.json

Show project info:

```bash
$ yarn nx show project <app-name> --web
```

### Localstack

Learn how to use localstack for AWS local development:

[Localstack setup](./docs/localstack.md)
