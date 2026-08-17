import { z } from "zod";
import { HIRING_PROCESS_FILTER_IDS, type HiringProcessFilterId } from "@/data/hiringProcessFilters";

const FILTER_ID_TUPLE = HIRING_PROCESS_FILTER_IDS as [HiringProcessFilterId, ...HiringProcessFilterId[]];

export const hiringProcessFilterIdSchema = z.enum(FILTER_ID_TUPLE);

/**
 * Shape of the AI job-posting analysis result. Mirrors the free-text fields a
 * company posting is made of; anything not explicitly stated in the source
 * text must come back as null / an empty array rather than being guessed.
 */
export const jobAnalysisResultSchema = z.object({
  jobTitle: z.string().nullable(),
  experience: z.string().nullable(),
  employmentType: z.string().nullable(),
  workMode: z.string().nullable(),
  location: z.string().nullable(),
  responsibilities: z.array(z.string()),
  requirements: z.array(z.string()),
  preferredQualifications: z.array(z.string()),
  hiringProcessFilterIds: z.array(hiringProcessFilterIdSchema),
});

export type JobAnalysisResult = z.infer<typeof jobAnalysisResultSchema>;

/**
 * JSON Schema handed to the OpenAI Structured Outputs API. Strict mode
 * requires every property to be listed in `required` (nullable fields use a
 * `["string", "null"]` type instead of being optional) and
 * `additionalProperties: false` on every object.
 */
export const JOB_ANALYSIS_JSON_SCHEMA = {
  name: "job_analysis_result",
  strict: true,
  schema: {
    type: "object",
    properties: {
      jobTitle: { type: ["string", "null"] },
      experience: { type: ["string", "null"] },
      employmentType: { type: ["string", "null"] },
      workMode: { type: ["string", "null"] },
      location: { type: ["string", "null"] },
      responsibilities: { type: "array", items: { type: "string" } },
      requirements: { type: "array", items: { type: "string" } },
      preferredQualifications: { type: "array", items: { type: "string" } },
      hiringProcessFilterIds: {
        type: "array",
        items: { type: "string", enum: HIRING_PROCESS_FILTER_IDS },
      },
    },
    required: [
      "jobTitle",
      "experience",
      "employmentType",
      "workMode",
      "location",
      "responsibilities",
      "requirements",
      "preferredQualifications",
      "hiringProcessFilterIds",
    ],
    additionalProperties: false,
  },
} as const;
