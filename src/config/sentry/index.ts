import * as Sentry from '@sentry/node';
import '@sentry/tracing';

import { SENTRY_DSN } from '../../config';

export const initSentry = () => {
  if (!SENTRY_DSN) {
    return;
  }
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
  });
};

export const captureException = (error: Error) => {
  if (!SENTRY_DSN) {
    return;
  }
  Sentry.captureException(error);
};
