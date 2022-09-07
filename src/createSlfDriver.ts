import slfDebug from 'slf-debug';
import createSlfSentryDebugDriver from './createSlfSentryDebugDriver';
import { CreateSlfSentryLoggerOptions } from './createSlfSentryDriver';

const createSlfDriver = (sentryUrl?: string, options?: CreateSlfSentryLoggerOptions) => {
  if (!sentryUrl) {
    return slfDebug;
  }

  return createSlfSentryDebugDriver(sentryUrl, options);
};

export default createSlfDriver;
