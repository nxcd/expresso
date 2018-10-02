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
    - [Why expresso](#why-expresso)
    - [What does Expresso include](#what-does-expresso-include)
  - [Getting Started](#getting-started)
    - [The config object](#the-config-object)
    - [Option object](#option-object)
  - [Tools](#tools)
    - [Auth](#auth)
      - [Usage](#usage)
      - [Auth Options](#auth-options)
    - [Scopes](#scopes)
      - [Usage](#usage-1)
    - [Built-in server](#built-in-server)
      - [Usage](#usage-2)

<!-- /TOC -->

## What is Expresso

Expresso is a Express wrapper. It contains several pre-built configurations which allows the developer to stop thinking about starter boilerplates and start thinking about routes and logic.

### Why expresso

See this?

```js
```

With Expresso, that, becomes this:

```js
```

Interested? See below.

### What does Expresso include

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
- `server` **(Required if you are using the [built-in server](#built-in-server))**: Webserver configuration options
  - Type: *Object*
  - Properties:
    - `binding.ip`: IP on which the server will be bound to
      - Type: *string*
      - Default: `process.env.SERVER_BINDING_IP` || `0.0.0.0`
    - `binding.port`: Port to bind the server to
      - Type: *number*
      - Default: `process.env.SERVER_BINDING_PORT` || `3000`
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

The auth options is an object with the following structure:

- `jwks` **(Required)**: JWKS options
  - Type: *Object*
  - Properties:
    - `uri` **(Required)**: JWKS URI to fetch a public key
      - Type: *string*
    - `cache`: Should JWKS use cache first to retrieve the public key
      - Type: *Boolean*
      - Default: true
    - `rateLimit`: Should JWKS limit the amount of calls to retrieve the public key
      - Type: *Boolean*
      - Default: true
    - `requestsPerMinute`: Amount of requests per minute to retrieve the JWKS key
      - Type: *number*
      - Default: 6
- `jwt` **(Required)**:
  - Type: *Object*
  - Properties:
    - `audience` **(Required)**: The JWT audience to be used
      - Type: *string*
    - `issuer` **(Required)**: The JWT issuer to be used
      - Type: *string*

Example:

```js
const authOptions = {
  jwks: {
    uri: 'http://api.authenticator.127.0.0.1.nip.io/.well-known/jwks.json'
  },
  jwt: {
    audience: 'urn:app:yourapp',
    issuer: 'urn:authority:authenticator:env:development'
  }
}
```

### Scopes

Scopes is a built-in tool that allows you to set user-level permissions based on multi-level scope strings, for example, let's say you have a scope called `yourapp.batch.upload` and another `yourapp.batch.read`, if your user has a scope called `yourapp.batch.*` and your application asks for a scope `yourapp.batch.upload` then the user **will be allowed** to perform the action, since he has all `batch` scopes.

However, on the other hand, if your user has the `yourapp.batch.read` and your application requests `yourapp.batch.*` **will not be allowed to perform the action** because your user only has one scope, and there's no way to know if `yourapp.batch.read` is all the `batch` scopes there are.

If the user is not allowed, an 401 status code will be returned.

> **Important Notice**
> `scopes` **must always** be used along (and after) the `jwt` middleware

#### Usage

**Single scope**:

```js
const expresso = require('@rjmunhoz/expresso')
const { auth } = require('@rjmunhoz/expresso')

const apiFactory = expresso((app, config) => {
  const {jwt, scopes} = auth.factory(config.auth)
  app.post('/your-path/:with-params', jwt, scopes('yourapp.batch.read'), middleware)
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

**Multi Scopes**

You can request multiple scopes to be present in the same route. They **will always** be matched using an `AND` operator.

You can pass a series of space-delimited strings:

```js
const expresso = require('@rjmunhoz/expresso')
const { auth } = require('@rjmunhoz/expresso')

const apiFactory = expresso((app, config) => {
  const {jwt, scopes} = auth.factory(config.auth)
  app.post('/your-path/:with-params', jwt, scopes('yourapp.batch.read yourapp.batch.write'), middleware)
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

Or you can pass an array:

```js
const expresso = require('@rjmunhoz/expresso')
const { auth } = require('@rjmunhoz/expresso')

const apiFactory = expresso((app, config) => {
  const {jwt, scopes} = auth.factory(config.auth)
  app.post('/your-path/:with-params', jwt, scopes(['yourapp.batch.read', 'yourapp.batch.write']), middleware)
})

apiFactory(options, environment)
  .then(app => app.listen(8080))
```

In both cases the user needs to have both the `yourapp.batch.read` **AND** `yourapp.batch.write` scopes in order for the permittion to work.

### Built-in server

Expresso comes with a built-in webserver containing some preconfigured options that can be overridden following the [configuration options](#option-object).

#### Usage

```js
const expresso = require('@rjmunhoz/expresso')
const { auth, server } = require('@rjmunhoz/expresso')

const apiFactory = expresso((app, config) => {
  const {jwt, scopes} = auth.factory(config.auth)
  app.post('/your-path/:with-params', jwt, scopes(['yourapp.batch.read', 'yourapp.batch.write']), middleware)
})

server.start(appFactory, options)
```
