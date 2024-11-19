import * as Sentry from "@sentry/node";
import { nodeProfilingIntegration } from "@sentry/profiling-node";

Sentry.init({
  dsn: "https://5050d3f394890e696c100fa13afcc36c@o4508317223485440.ingest.de.sentry.io/4508318144528464",
  integrations: [nodeProfilingIntegration()],
  tracesSampleRate: 1.0,
});

Sentry.profiler.startProfiler();

Sentry.startSpan(
  {
    name: "My First Transaction",
  },
  () => {
    console.log("Transaction is being profiled");
  }
);

Sentry.profiler.stopProfiler();
