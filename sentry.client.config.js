import * as Sentry from '@sentry/nextjs'

Sentry.init({
    dsn: "https://04508253348f4055b2023d0be3c42deb@o4505566670749696.ingest.sentry.io/4505605609816064",
    integrations: [
        new Sentry.BrowserTracing(),
        new Sentry.Replay(),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0, // Capture 100% of the transactions, reduce in production!
    // Session Replay
    replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
    replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});
