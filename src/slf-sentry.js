const Raven = require('raven');
const initalized = true;
/*
@Param: https://<key>:<secret>@sentry.io/<project>
*/
const sentryLogger = function (sentryUrl, level, additionlParams = [], logLevels = ['debug', 'info', 'warn', 'error']) {
  const levelIndex = logLevels.findIndex(level);
  if (!initalized) {
    try {
      Raven.config(sentryUrl).install();
    } catch (e) {
      console.log(`failed to initialize logging to sentry with the given url ${sentryUrl}`);
      console.log(e);
    }
  }

  if (!additionlParams) {
    additionlParams = {};
  }

  function _addParamsToEvent(event) {
    Object.keys(additionlParams).forEach((key) => {
      event[key] = additionlParams[key];
    });
    return event;
  }

  function _isEventLevelSameOrAbove(event) {
    const eventLevelIndex = logLevels.findIndex(event.level);
    return levelIndex <= eventLevelIndex; // eventLevelIndex = -1 wil not return true
  }

  const factory = (event) => {
    const extendedEvent = _addParamsToEvent(event);
    if (_isEventLevelSameOrAbove(event.level) && additionlParams.environment) {
      if (additionlParams.environment !== 'localhost') {
        Raven.captureException(extendedEvent);
      }
      console.log(extendedEvent);
    }
  };
  return factory;
};

export default sentryLogger;
