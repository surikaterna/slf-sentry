import { Event } from 'slf';
import slfDebug from 'slf-debug';
import createSlfSentryDriver, { CreateSlfSentryLoggerOptions } from './createSlfSentryDriver';

const createSlfSentryDebugDriver = (
  sentryUrl: string,
  options?: CreateSlfSentryLoggerOptions
) => {
  return (event: Event) => {
    slfDebug(event);
    const slfSentry = createSlfSentryDriver(sentryUrl, options);
    slfSentry(event);
  };
};

export default createSlfSentryDebugDriver;
