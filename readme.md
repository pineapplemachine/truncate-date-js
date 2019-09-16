# @pinemach/truncate-date

[![Coverage Status][coverage-image]][coverage-url]
[![Build Status][travis-image]][travis-url]
[![NPM version][npm-version-image]][npm-url]
[![MIT License][license-image]][license]

**@pinemach/truncate-date** is a small JavaScript package with a single concern:
truncating datetime inputs to remove all precision past a given time unit.

You can read the full API documentation at 
**[pineapplemachine.github.io/truncate-date-js/](https://pineapplemachine.github.io/truncate-date-js/)**.

[license-image]: http://img.shields.io/badge/license-MIT-blue.svg
[license]: https://github.com/pineapplemachine/truncate-date-js/blob/master/LICENSE

[travis-url]: https://travis-ci.org/pineapplemachine/truncate-date-js
[travis-image]: https://travis-ci.org/pineapplemachine/truncate-date-js.svg?branch=master

[npm-url]: https://www.npmjs.com/package/@pinemach/truncate-date
[npm-version-image]: https://badge.fury.io/js/%40pinemach%2Ftruncate-date.svg

[coverage-url]: https://coveralls.io/github/pineapplemachine/truncate-date-js?branch=master
[coverage-image]: https://coveralls.io/repos/github/pineapplemachine/truncate-date-js/badge.svg?branch=master

## Installation

You can install this package with the package manager of your choice. For example,

```
npm install @pinemach/truncate-date
```

You can then import and use the module like so:

``` js
const truncateDate = require("@pinemach/truncate-date").truncateDate; // CommonJS
```

``` js
import {truncateDate} from "@pinemach/truncate-date"; // ES6 modules
```

## Usage

This package exports the **truncateDate** function, which accepts a Date
object or other time value input and a time unit to truncate that value to.

Truncation occurs in the UTC timezone.

``` js
import {truncateDate} from "@pinemach/truncate-date";

const myDate = new Date("2020-04-15T12:30:15.123Z");

// Logs "2020-04-15T12:30:15.000Z"
console.log(truncateDate("second", myDate));

// Logs "2020-04-15T12:00:00.000Z"
console.log(truncateDate("hour", myDate));

// Logs "2020-04-15T00:00:00.000Z"
console.log(truncateDate("day", myDate));

// Logs "2020-01-01T00:00:00.000Z"
console.log(truncateDate("year", myDate));
```
