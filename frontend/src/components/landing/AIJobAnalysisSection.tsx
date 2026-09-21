import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionKicker } from "@/components/about/SectionKicker";

const ANALYSIS_FEATURES = [
  {
    number: "01",
    title: "핵심 역량",
    description: "공고에서 반복되거나 중요하게 요구하는 역량을 찾아 정리합니다.",
  },
  {
    number: "02",
    title: "강조할 경험",
    description: "이 공고에 지원할 때 강조하면 좋은 경험의 유형을 제안합니다.",
  },
  {
    number: "03",
    title: "Work-TI 관점 분석",
    description: "공고에 드러난 업무 방식을 Work-TI의 4가지 축을 기준으로 살펴봅니다.",
  },
  {
    number: "04",
    title: "면접 질문",
    description: "공고의 주요 업무와 핵심 역량을 바탕으로 예상 면접 질문을 제안합니다.",
  },
];

export function AIJobAnalysisSection() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-[1200px] px-8 py-16 md:py-24">
        <div className="flex flex-col gap-10 rounded-xl bg-gray-50 px-6 py-10 sm:px-8 md:px-12 md:py-14">
          <div className="mx-auto flex max-w-[760px] flex-col items-center gap-4 text-center">
            <SectionKicker>AI JOB ANALYSIS</SectionKicker>
            <h2 className="text-heading-2 text-gray-950">내 Work-TI로, 채용공고를 더 깊게 읽어보세요</h2>
            <p className="text-body-md leading-8 text-gray-600">
              채용공고에는 필요한 역량은 적혀 있어도 실제로 어떻게 일하는지는 충분히 드러나지 않는 경우가
              많습니다. Workwity AI는 채용공고에 나타난 정보를 분석해 지원 전에 확인해야 할 업무 특성과 준비
              포인트를 정리합니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ANALYSIS_FEATURES.map((feature) => (
              <Card key={feature.title} className="flex h-full flex-col gap-4">
                <span className="flex size-9 items-center justify-center rounded-md bg-primary-50 text-code-sm text-primary-600">
                  {feature.number}
                </span>
                <div className="flex flex-col gap-2">
                  <h3 className="text-body-lg font-bold text-gray-950">{feature.title}</h3>
                  <p className="text-body-sm leading-7 text-gray-600">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="rounded-lg border border-primary-100 bg-primary-50 px-5 py-4 sm:px-6">
            <div className="flex items-start gap-3">
              <span
                className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-bold text-primary-700"
                aria-hidden="true"
              >
                i
              </span>
              <p className="text-body-sm leading-7 text-gray-700">
                공고에서 확인할 수 없는 내용은 추측하지 않습니다. 근거가 부족한 경우 &lsquo;판단 근거 부족&rsquo;,
                해석이 엇갈리는 경우 &lsquo;혼합&rsquo;으로 표시해 사용자가 직접 확인할 수 있도록 돕습니다.
              </p>
            </div>
          </div>

          <div className="flex justify-center">
            <Button href="/job-analysis" variant="primary" size="lg" className="w-full sm:w-auto">
              AI로 채용공고 분석하기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
