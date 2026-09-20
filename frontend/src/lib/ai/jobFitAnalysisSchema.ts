import { z } from "zod";

export const WORK_STYLE_AXES = ["S/L", "E/Y", "M/D", "G/A"] as const;

export const WORK_STYLE_AXIS_META = {
  "S/L": { name: "Execution Style", S: "S · Seed · 가설실행형", L: "L · Leaf · 리서치분석형" },
  "E/Y": { name: "Decision Making", E: "E · sElf · 자율주도형", Y: "Y · sYstem · 체계합의형" },
  "M/D": { name: "Speed & Quality", M: "M · Minimum · 스피드/린", D: "D · Detail · 완성도/디테일" },
  "G/A": { name: "Value Orientation", G: "G · Growth · 성장모험형", A: "A · stAbility · 안정조화형" },
} as const;

export const WORK_STYLE_TENDENCY_LABELS = {
  S: "S · Seed · 가설실행형",
  L: "L · Leaf · 리서치분석형",
  E: "E · sElf · 자율주도형",
  Y: "Y · sYstem · 체계합의형",
  M: "M · Minimum · 스피드/린",
  D: "D · Detail · 완성도/디테일",
  G: "G · Growth · 성장모험형",
  A: "A · stAbility · 안정조화형",
} as const;

const sharedSignalFields = {
  reason: z.string(),
};

const workStyleSignalSchema = z.discriminatedUnion("axis", [
  z.object({ axis: z.literal("S/L"), tendency: z.enum(["S", "L", "혼합", "판단 근거 부족"]), ...sharedSignalFields }),
  z.object({ axis: z.literal("E/Y"), tendency: z.enum(["E", "Y", "혼합", "판단 근거 부족"]), ...sharedSignalFields }),
  z.object({ axis: z.literal("M/D"), tendency: z.enum(["M", "D", "혼합", "판단 근거 부족"]), ...sharedSignalFields }),
  z.object({ axis: z.literal("G/A"), tendency: z.enum(["G", "A", "혼합", "판단 근거 부족"]), ...sharedSignalFields }),
]);

export const jobFitAnalysisResultSchema = z.object({
  summary: z.string(),
  coreCompetencies: z.array(z.string()).min(1).max(5),
  workStyleSignals: z
    .array(
      workStyleSignalSchema
    )
    .length(4),
  fitPoints: z.array(z.string()).max(4),
  checkPoints: z.array(z.string()).max(4),
  cultureSignals: z.array(z.string()).max(3),
  highlightExperiences: z
    .array(z.object({ experience: z.string(), reason: z.string() }))
    .length(3),
  interviewQuestions: z.array(z.string()).length(5),
});

export type JobFitAnalysisResult = z.infer<typeof jobFitAnalysisResultSchema>;

const evidenceListSchema = z.array(z.string()).max(3);

export const jobFitEvidenceExtractionSchema = z.object({
  summary: z.string(),
  coreCompetencies: z
    .array(z.object({ competency: z.string(), evidence: z.string() }))
    .min(1)
    .max(5),
  workStyleEvidence: z.object({
    "S/L": z.object({ S: evidenceListSchema, L: evidenceListSchema }),
    "E/Y": z.object({ E: evidenceListSchema, Y: evidenceListSchema }),
    "M/D": z.object({ M: evidenceListSchema, D: evidenceListSchema }),
    "G/A": z.object({ G: evidenceListSchema, A: evidenceListSchema }),
  }),
  cultureSignals: z
    .array(z.object({ signal: z.string(), evidence: z.string() }))
    .max(3),
  highlightExperiences: z
    .array(
      z.object({
        experience: z.string(),
        reason: z.string(),
        competency: z.string(),
      })
    )
    .length(3),
  interviewQuestions: z
    .array(
      z.object({
        question: z.string(),
        evidence: z.string(),
        evaluationPoint: z.string(),
        competency: z.string(),
      })
    )
    .length(5),
});

export type JobFitEvidenceExtraction = z.infer<typeof jobFitEvidenceExtractionSchema>;

export const JOB_FIT_EVIDENCE_JSON_SCHEMA = {
  name: "job_fit_evidence_extraction",
  strict: true,
  schema: {
    type: "object",
    properties: {
      summary: { type: "string" },
      coreCompetencies: {
        type: "array",
        minItems: 1,
        maxItems: 5,
        items: {
          type: "object",
          properties: {
            competency: { type: "string" },
            evidence: { type: "string" },
          },
          required: ["competency", "evidence"],
          additionalProperties: false,
        },
      },
      workStyleEvidence: {
        type: "object",
        properties: {
          "S/L": {
            type: "object",
            properties: {
              S: { type: "array", maxItems: 3, items: { type: "string" } },
              L: { type: "array", maxItems: 3, items: { type: "string" } },
            },
            required: ["S", "L"],
            additionalProperties: false,
          },
          "E/Y": {
            type: "object",
            properties: {
              E: { type: "array", maxItems: 3, items: { type: "string" } },
              Y: { type: "array", maxItems: 3, items: { type: "string" } },
            },
            required: ["E", "Y"],
            additionalProperties: false,
          },
          "M/D": {
            type: "object",
            properties: {
              M: { type: "array", maxItems: 3, items: { type: "string" } },
              D: { type: "array", maxItems: 3, items: { type: "string" } },
            },
            required: ["M", "D"],
            additionalProperties: false,
          },
          "G/A": {
            type: "object",
            properties: {
              G: { type: "array", maxItems: 3, items: { type: "string" } },
              A: { type: "array", maxItems: 3, items: { type: "string" } },
            },
            required: ["G", "A"],
            additionalProperties: false,
          },
        },
        required: ["S/L", "E/Y", "M/D", "G/A"],
        additionalProperties: false,
      },
      cultureSignals: {
        type: "array",
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            signal: { type: "string" },
            evidence: { type: "string" },
          },
          required: ["signal", "evidence"],
          additionalProperties: false,
        },
      },
      highlightExperiences: {
        type: "array",
        minItems: 3,
        maxItems: 3,
        items: {
          type: "object",
          properties: {
            experience: { type: "string" },
            reason: { type: "string" },
            competency: { type: "string" },
          },
          required: ["experience", "reason", "competency"],
          additionalProperties: false,
        },
      },
      interviewQuestions: {
        type: "array",
        minItems: 5,
        maxItems: 5,
        items: {
          type: "object",
          properties: {
            question: { type: "string" },
            evidence: { type: "string" },
            evaluationPoint: { type: "string" },
            competency: { type: "string" },
          },
          required: ["question", "evidence", "evaluationPoint", "competency"],
          additionalProperties: false,
        },
      },
    },
    required: [
      "summary",
      "coreCompetencies",
      "workStyleEvidence",
      "cultureSignals",
      "highlightExperiences",
      "interviewQuestions",
    ],
    additionalProperties: false,
  },
} as const;
