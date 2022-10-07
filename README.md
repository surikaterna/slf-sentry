SLF Sentry Driver
=================

[SLF Sentry Driver](https://github.com/surikaterna/slf-sentry) is a factory for
sending [SLF](https://github.com/surikaterna/slf) logs to Sentry if matching by configured severity level. Exports a
factory to create a driver sending all events to the [SLF Debug Driver](https://github.com/surikaterna/slf-debug) as
well.

* [Purpose](#purpose)
* [Installation](#installation)
* [Usage](#usage)

# Purpose

Provide logs of configured severity level to Sentry to assist with investigating issues.

# Installation

Install the _SLF Sentry Driver_ as well as the _SLF Debug Driver_ and _Debug.js_.

```shell
npm install slf-sentry slf-debug debug
```

# Usage

Provide the returned value of the SLF Sentry Driver factory when configuring SLF.

Will send all logs to the SLF Debug Driver. If a Sentry URL is provided, it will also send the logs of configured
severity level to Sentry. Takes an optional second options argument to configure severity levels.

```typescript
import debug from 'debug';
import { LoggerFactory } from 'slf';
import createSlfDriver from 'slf-sentry';

debug.enable('viewdb:*');
LoggerFactory.setFactory(createSlfDriver(process.env.SENTRY_URL, {
  level: 'warn',
  environment: 'fat',
  levels: ['warn', 'error']
}));
```

### Simple usage
```typescript
import { LoggerFactory } from 'slf';
import createSlfDriver from 'slf-sentry';

LoggerFactory.setFactory(createSlfDriver(process.env.SENTRY_URL));
```