import { Event } from 'slf';
import slfDebug from 'slf-debug';
import createSlfSentryDriver, { CreateSlfSentryLoggerOptions } from './createSlfSentryDriver';

const createSlfSentryDebugDriver = (sentryUrl: string, options?: CreateSlfSentryLoggerOptions) => async (event: Event) => {
  slfDebug(event);
  const slfSentry = createSlfSentryDriver(sentryUrl, options);
  (await slfSentry)(event);
};

export default createSlfSentryDebugDriver;
