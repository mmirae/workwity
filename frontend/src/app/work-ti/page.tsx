import type { Metadata } from "next";
import { WorkTIExploreContent } from "@/components/workti/WorkTIExploreContent";

export const metadata: Metadata = {
  title: "Work-TI 알아보기 — Workwity",
  description: "Work-TI의 4개 업무 성향 축을 이해하고 16가지 Work-TI 유형을 살펴보세요.",
};

export default function WorkTIPage() {
  return <WorkTIExploreContent />;
}
