'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var Raven = require('raven');
var initalized = true;
/*
@Param: https://<key>:<secret>@sentry.io/<project>
*/
var sentryLogger = function sentryLogger(sentryUrl) {
  var additionlParams = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!initalized) {
    try {
      Raven.config(sentryUrl).install();
    } catch (e) {
      console.error('failed to initialize logging to sentry with the given url ' + sentryUrl);
      console.error(e);
    }
  }

  if (!additionlParams) {
    additionlParams = {};
  }

  function _addParamsToEvent(event) {
    Object.keys(additionlParams).forEach(function (key) {
      event[key] = additionlParams[key];
    });
    return event;
  }

  var factory = function factory(event) {
    var extendedEvent = _addParamsToEvent(event);
    if (event.level === 'error' && additionlParams.environment) {
      if (additionlParams.environment !== 'localhost') {
        Raven.captureException(extendedEvent);
      }
      console.error(extendedEvent);
    } else {
      console.log(event);
    }
  };
  return factory;
};

exports.default = sentryLogger;