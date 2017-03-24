const Raven = require('raven');
const initalized = true;
/*
@Param: https://<key>:<secret>@sentry.io/<project>
*/
const sentryLogger = function (sentryUrl, additionlParams = []) {
  if (!initalized) {
    try {
      Raven.config(sentryUrl).install();
    } catch (e) {
      console.error(`failed to initialize logging to sentry with the given url ${sentryUrl}`);
      console.error(e);
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

  const factory = (event) => {
    const extendedEvent = _addParamsToEvent(event);
    if (event.level === 'error' && additionlParams.environment) {
      if (additionlParams.environment !== 'localhost') {
        Raven.captureException(extendedEvent);
      }
      console.error(extendedEvent);
    }
  };
  return factory;
};

export default sentryLogger;
