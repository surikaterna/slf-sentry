const Raven = require('raven');
let isInitialized = false;
/*
@Param: https://<key>:<secret>@sentry.io/<project>
*/
const sentryLogger = function (sentryUrl, level, additionlParams = [], logLevels = ['debug', 'info', 'warn', 'error']) {
  const levelIndex = logLevels.indexOf(level);
  if (!isInitialized) {
    try {
      Raven.config(sentryUrl).install();
      isInitialized = true;
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

  function _isEventLevelSameOrAbove(eventLogLevel) {
    const eventLevelIndex = logLevels.indexOf(eventLogLevel);
    return levelIndex <= eventLevelIndex; // eventLevelIndex = -1 wil not return true
  }

  const factory = (event) => {
    const extendedEvent = _addParamsToEvent(event);
    if (_isEventLevelSameOrAbove(event.level) && additionlParams.environment && additionlParams.environment !== 'localhost') {
      Raven.captureMessage(JSON.stringify(extendedEvent.params), extendedEvent);
    }
  };
  return factory;
};

export default sentryLogger;
