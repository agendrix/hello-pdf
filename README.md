# HelloPdf

HTML to PDF generator micro service built using [Express](https://github.com/expressjs/express), [Bull](https://github.com/OptimalBits/bull) and [Puppeteer](https://github.com/puppeteer/puppeteer)

<!-- prettier-ignore -->
| `master` | `develop` |
| -------- | --------- |
| ![Tests](https://github.com/agendrix/hello-pdf/workflows/tests/badge.svg?branch=master) ![Deploy](https://github.com/agendrix/hello-pdf/workflows/deploy-to-master/badge.svg) |  ![Tests](https://github.com/agendrix/hello-pdf/workflows/tests/badge.svg?branch=develop) ![Deploy](https://github.com/agendrix/hello-pdf/workflows/deploy-to-staging/badge.svg) |

## Prerequisites

Run the following command to install the project prerequisites:

_We currently run Node version 16 in production but as far as we know HelloPdf supports other major versions_.

```
brew install node
brew install yarn
```

## Setup

Run the following commands to install our dependencies and enable git-hooks

```
yarn install
npx husky install
```

## Start the project

```
yarn start
```

Please look at the scripts section of our [package.json](./package.json) file for further options.

## Project components

Hello pdf micro service is made of three main components each running independently:

1. [Server](./src/server): Enqueue a job for every html files to convert in a remote Redis queue.

2. [Worker](./src/worker): Consume the jobs enqueued by the server and convert the corresponding html files to pdf

3. [Events logger](./src/eventsLogger): Log events related to job executions

## Tests

We use [jest](https://github.com/facebook/jest) and [supertest](https://github.com/visionmedia/supertest) to build our test suites.
Run the following command to start the tests:

```
yarn test
```

## Node module

Hello pdf can also be incorporated in an existing project as a node module:

```
yarn add git+ssh://git@github.com:agendrix/hello-pdf.git#v1.0.0
yarn hello-pdf
```

```
yarn test
```

## Debugging

To debug Hello pdf, use the environment variable `DEBUG=hello-pdf:*` to see debugging logs.
To debug Pupeteer, use the environment variable `DEBUG=puppeteer:*` to see all communications between Puppeteer and the Chrome instance.

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/agendrix/hello-pdf.
