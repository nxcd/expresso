# Expresso

> Simple yet useful opinated express boilerplate as a module

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/425fae656657499b8ecdaf6204ecca50)](https://www.codacy.com/app/rjmunhoz/expresso?utm_source=gitlab.com&amp;utm_medium=referral&amp;utm_content=rjmunhoz/expresso&amp;utm_campaign=Badge_Grade)
[![node](https://img.shields.io/node/v/@rjmunhoz/expresso.svg)](https://npmjs.com/package/@rjmunhoz/expresso)
[![npm](https://img.shields.io/npm/v/@rjmunhoz/expresso.svg)](https://npmjs.com/package/@rjmunhoz/expresso)
[![npm](https://img.shields.io/npm/dt/@rjmunhoz/expresso.svg)](https://npmjs.com/package/@rjmunhoz/expresso)
[![NpmLicense](https://img.shields.io/npm/l/@rjmunhoz/expresso.svg)](https://gitlab.com/rjmunhoz/expresso)
[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg)](https://gitlab.com/rjmunhoz/expresso)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?)](http://standardjs.com)
[![Telegram](https://img.shields.io/badge/telegram-@rjmunhoz-blue.svg?colorB=2CA5E0)](https://t.me/rjmunhoz)

## Summary

<!-- TOC -->

- [Expresso](#expresso)
  - [Summary](#summary)
  - [What is Expresso](#what-is-expresso)
    - [What does Expresso includes](#what-does-expresso-includes)
  - [Getting Started](#getting-started)
    - [The config object](#the-config-object)
    - [Option object](#option-object)
  - [Tools](#tools)
    - [Auth](#auth)
      - [Usage](#usage)
      - [Auth Options](#auth-options)
    - [Scopes](#scopes)
    - [Built-in server](#built-in-server)

<!-- /TOC -->

## What is Expresso

Expresso is a Express wrapper. It contains several pre-built configurations which allows the developer to stop thinking about starter boilerplates and start thinking about routes and logic.

### What does Expresso includes

- [JWT Authentication](https://github.com/auth0/express-jwt#readme)
- [Morgan](https://www.npmjs.com/package/morgan)
- [Deep Trace](https://github.com/deep-trace/nodejs-plugins/tree/master/packages/deeptrace-express)
- User Behalf headers
- Error middlewares
- Validations
- [CORS](https://github.com/expressjs/cors#readme)
- [Body Parser](https://www.npmjs.com/package/body-parser)
- [Helmet](https://helmetjs.github.io/)
- [JWKS RSA](https://github.com/auth0/node-jwks-rsa)
- [Debug](https://github.com/visionmedia/debug)

## Getting Started

Expresso exposes a function, this functions receives another function with two arguments, the first argument is an Express app and the second is a configuration object. Then it returns a factory function which will receive an `options` object and a string containing your current environment name (e.g: `production`):

```js
const expresso = require('@rjmunhoz/expresso')

const apiFactory = expresso((app, config) => {
  app.post('/your-path/:with-params', middleware, middleware, middleware)
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

### The config object

This object is an object containing all user configurations you might wanna set. It can be anything, and it'll be passed to your app inside the function.

```js
const expresso = require('@rjmunhoz/expresso')

const apiFactory = expresso((app, config) => {
  const myUsefulConfig = config.myProp.myValue

  app.post('/your-path/:with-params', middleware, middleware, middleware(myUsefulConfig))
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

### Option object

The option object is a simple object containing the application configuration that is gonna be passed to the whole express application:

- `name`: Is the name of your application. It'll be used as the default name for logging
  - Type: *string*
  - Default: `process.env.APP_NAME` || `process.env.npm_package_name` || `app`
- `version`: The version of your app
  - Type: *string*
  - Default: `process.env.GIT_RELEASE`
- `deeptrace`: Deeptrace configuration object
  - Type: *object*
  - Properties:
    - `dsn` **(Required if using Deeptrace)**: Deeptrace API URL
      - Type: *string*
      - Default: `undefined`, it'll error if you try to use Deeptrace without setting it
    - `timeout`: Timeout before Deeptrace gives up on registering the sent request
      - Type: *number*
      - Default: `process.env.DEEPTRACE_TIMEOUT` || `3000`
    - `tags`: Tags that will be applied to each registered request
      - Type: *Object*
      - Default:
        - `environment`: Environment string passed as mentioned above
        - `service`: `process.env.DEEPTRACE_TAGS_SERVICE` || `name` property on this same object
        - `commit`: `process.env.DEEPTRACE_TAGS_COMMIT` || `process.env.GIT_COMMIT`
        - `release`: `process.env.DEEPTRACE_TAGS_RELEASE` || `process.env.GIT_RELEASE`
- `morgan`: Morgan configuration object
  - Type: *Object*
  - Default:
    - `format`: `':method :url :status :: :response-time ms :: :res[deeptrace-id]'`
- `cors`: CORS configuration object
  - Type: *Object*
  - Default:
    - `origin`: `*`
    - `methods`: `['GET', 'POST', 'PUT', 'PATCH', 'DELETE']`
    - `preflightContinue`: `false`
    - `optionsSuccessStatus`: `204`

Any other keys will be **ignored** by expresso, but they'll be passed to your application anyway; all configs can be overriden by passing an object with the same keys but different values.

## Tools

Expresso comes with a set of optional tools which aims to help the developer in the coding process.

### Auth

The authentication tool provides full JWT authentication with RSA public key criptography.

#### Usage

```js
const expresso = require('@rjmunhoz/expresso')
const { auth } = require('@rjmunhoz/expresso')

const apiFactory = expresso((app, config) => {
  const {jwt} = auth.factory(config.auth)
  app.post('/your-path/:with-params', jwt, middleware, middleware)
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

#### Auth Options

### Scopes

### Built-in server


