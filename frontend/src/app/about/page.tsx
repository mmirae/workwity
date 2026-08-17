import type { Metadata } from "next";
import { AboutBrandSection } from "@/components/about/AboutBrandSection";
import { WorkIdentitySection } from "@/components/about/WorkIdentitySection";
import { WorkTISection } from "@/components/about/WorkTISection";
import { HiringProcessSection } from "@/components/about/HiringProcessSection";
import { AIJobAnalysisSection } from "@/components/about/AIJobAnalysisSection";
import { AboutCTA } from "@/components/about/AboutCTA";

export const metadata: Metadata = {
  title: "서비스 소개 — Workwity",
  description: "Workwity가 Work Identity를 통해 구직자와 기업의 일하는 방식을 잇는 방법을 소개합니다.",
};

export default function AboutPage() {
  return (
    <>
      <AboutBrandSection />
      <WorkIdentitySection />
      <WorkTISection />
      <HiringProcessSection />
      <AIJobAnalysisSection />
      <AboutCTA />
    </>
  );
}
