"use client";

import { sendGAEvent } from "@next/third-parties/google";

export type WorkwityAnalyticsEvent =
  | "workti_test_start"
  | "workti_test_complete"
  | "workti_result_view"
  | "job_analysis_start"
  | "job_analysis_complete"
  | "job_detail_view";

type AnalyticsParameters = Record<string, string | number | boolean>;

export function trackAnalyticsEvent(
  eventName: WorkwityAnalyticsEvent,
  parameters: AnalyticsParameters = {}
) {
  if (process.env.NODE_ENV !== "production" || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
    return;
  }

  sendGAEvent("event", eventName, parameters);
}
