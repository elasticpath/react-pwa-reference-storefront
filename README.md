
# Reference Experience Monorepo

Reference experience store project broken up into multiple sub-projects. Optimized for fast development and easy deployment and consumption through `npm`.

Main project folders are:
- `/app` - reference store front application. 
- `/components` - reference components that will be published to `@elasticpath/store-components`.
- `/storybook` - a storybook project demonstrating the use of all of the components.
- `/cortexjs` - javascript library responsible for all networking calls to cortex.

## Requirements

Project depends on yarn [workspaces](https://yarnpkg.com/en/docs/workspaces) and in order to work with it you need to have `yarn` package manager globally installed. An easiest way to install it is with `npm`:

```
$ npm install -g yarn
```

## How to run it

After running git clone, `cd` into the folder and run:

```bash
$ yarn
```

This will install all the dependencies for all sub-project and create necessary symlinks in-between them. Before running the application you first need to build `cortexjs` by running:

```bash
$ cd cortexjs
$ yarn build
```

In order to run main application run:

```bash
$ cd app
$ yarn start
```

In order to run the storybook project run:
```bash
$ cd storybook
$ yarn storybook
```
