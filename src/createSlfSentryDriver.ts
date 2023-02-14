import { captureException, captureMessage, init, Integrations, SeverityLevel, withScope } from '@sentry/node';
import { Event } from 'slf';
import createIntegrationOptions from './createIntegrationOptions';

export type IntegrationsOptions = {
  [key in keyof typeof Integrations]: ConstructorParameters<typeof Integrations[key]>[0];
};

export interface CreateSlfSentryLoggerOptions {
  debug?: boolean;
  level?: string;
  environment?: string;
  levels?: Array<string>;
  integrationsOptions?: Partial<IntegrationsOptions>;
}

let isInitialized = false;

export default function createSlfSentryDriver(
  sentryUrl: string,
  { debug, environment = process.env.SENTRY_ENV ?? 'dev', level = 'error', levels = ['error'], integrationsOptions }: CreateSlfSentryLoggerOptions = {}
) {
  const levelIndex = levels.indexOf(level);

  if (!isInitialized) {
    try {
      init({
        dsn: sentryUrl,
        tracesSampleRate: 1.0,
        debug: debug ?? ['fat', 'dev'].includes(environment.toLowerCase()),
        environment,
        // eslint-disable-next-line max-len
        // @ts-expect-error ts(2322) - Integration type from @sentry/types is not compatible with @sentry/node's Integration type, even if they are the same type from same library
        integrations: createIntegrationOptions(integrationsOptions)
      });
      isInitialized = true;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('Failed to initialize logging to Sentry with the given url: %s', sentryUrl);
      // eslint-disable-next-line no-console
      console.error(err);
    }
  }

  function getErrorIfAny(event: Event): Error | undefined {
    return event.params.find((param) => param instanceof Error) as Error | undefined;
  }

  function checkIsEventLevelSameOrAbove(eventLogLevel: string): boolean {
    const eventLevelIndex = levels.indexOf(eventLogLevel);
    return levelIndex <= eventLevelIndex;
  }

  return (event: Event) => {
    if (!checkIsEventLevelSameOrAbove(event.level)) {
      return;
    }

    if (!(event.name && event.level && event.params)) {
      // @ts-expect-error TS2345 Sentry CaptureContext and SLF Event should be compatible
      captureMessage(JSON.stringify(event.params), event);
      return;
    }

    const error = getErrorIfAny(event);

    withScope((scope) => {
      scope.setLevel(event.level as SeverityLevel);

      const params = event.params;
      const msg = params.slice(0, 1)[0] as string;
      const extras: Array<unknown> = params.slice(1);

      extras.forEach((extra, index) => {
        scope.setExtra(`param-${index + 1}`, extra);
      });

      if (error) {
        scope.setExtra('error-msg', msg);
        captureException(error);
      } else {
        captureMessage(msg);
      }
    });
  };
}
