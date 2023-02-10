import createSlfSentryDriver from './createSlfSentryDriver';

describe('#createSlfSentryDriver', () => {
  it.todo('should send exception to Sentry if there is an error in the parameters');
  it.todo('should send message to Sentry if there are no errors in the parameters');
  it.todo('should provide context parameters to Sentry if provided in the event');
  it.todo('should not send to Sentry if the log level is below specified error level');
  it.todo('should not send to Sentry if the log level is not found in error levels');
  it('should be possible to change a integration option', () => {
    const sentryUrl = 'https://sentry.io';
    const logger = createSlfSentryDriver(sentryUrl, {
      integrationsOptions: {
        OnUncaughtException: {
          onFatalError() {}
        },
        Http: {
          tracing: true
        }
      }
    });

    expect(logger).toBeDefined();
  });
});
