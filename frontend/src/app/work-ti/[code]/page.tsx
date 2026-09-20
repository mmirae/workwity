import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicWorkTIProfile } from "@/components/workti/PublicWorkTIProfile";
import {
  WORK_TI_RESULT_DETAILS,
  WORK_TI_RESULTS,
  type WorkTICode,
} from "@/data/workti/worktiData";

interface WorkTITypePageProps {
  params: Promise<{ code: string }>;
}

const WORK_TI_CODES = Object.keys(WORK_TI_RESULTS) as WorkTICode[];

function isWorkTICode(value: string): value is WorkTICode {
  return Object.hasOwn(WORK_TI_RESULTS, value);
}

export function generateStaticParams() {
  return WORK_TI_CODES.map((code) => ({ code }));
}

export async function generateMetadata({ params }: WorkTITypePageProps): Promise<Metadata> {
  const { code } = await params;

  if (!isWorkTICode(code)) {
    return { title: "Work-TI 유형을 찾을 수 없습니다 — Workwity" };
  }

  const definition = WORK_TI_RESULTS[code];
  const detail = WORK_TI_RESULT_DETAILS[code];

  return {
    title: `${code} ${definition.title} — Workwity`,
    description: detail.oneLiner,
  };
}

export default async function WorkTITypePage({ params }: WorkTITypePageProps) {
  const { code } = await params;

  if (!isWorkTICode(code)) {
    notFound();
  }

  return <PublicWorkTIProfile code={code} />;
}
