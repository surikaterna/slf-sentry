// eslint-disable-next-line import/no-extraneous-dependencies
import { SeverityLevel } from '@sentry/browser';
import { Event } from 'slf';

export interface CreateSlfSentryLoggerOptions {
  debug?: boolean;
  level?: string;
  environment?: string;
  levels?: Array<string>;
  mode?: 'node' | 'browser';
}

let isInitialized = false;

export default async function createSlfSentryDriver(
  sentryUrl: string,
  {
    debug,
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/ban-ts-comment
    environment = process.env.SENTRY_ENV ?? 'dev',
    level = 'error',
    levels = ['error'],
    mode = 'node'
  }: CreateSlfSentryLoggerOptions = {}
) {
  const { init, captureException, captureMessage, withScope } = await import(`@sentry/${mode}`) as typeof import('@sentry/browser');
  const levelIndex = levels.indexOf(level);

  if (!isInitialized) {
    try {
      init({
        dsn: sentryUrl,
        tracesSampleRate: 1.0,
        debug: debug ?? ['fat', 'dev'].includes(environment.toLowerCase()),
        environment
      });
      isInitialized = true;
    } catch (err) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      console.log('Failed to initialize logging to Sentry with the given url: %s', sentryUrl);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-console, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
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
