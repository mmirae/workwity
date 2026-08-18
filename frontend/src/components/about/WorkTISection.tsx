import { WORK_TI_RESULTS, WORK_TI_RESULT_DETAILS } from "@/data/workti/worktiData";
import { WorkTICharacterImage } from "@/components/workti/WorkTICharacterImage";
import { SectionKicker } from "@/components/about/SectionKicker";

// Real Work-TI result data (not sample/fabricated) — used as the product
// preview so the section shows an actual result instead of invented axes,
// percentages, or copy. See docs/about page-copy requirement: no fake scores.
const PREVIEW_CODE = "LYDG" as const;
const previewResult = WORK_TI_RESULTS[PREVIEW_CODE];
const previewDetail = WORK_TI_RESULT_DETAILS[PREVIEW_CODE];

function WorkTIResultPreview() {
  return (
    <div className="flex w-full max-w-[420px] flex-col items-center gap-4 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-md">
      <span className="text-code-sm text-primary-600">{previewResult.code}</span>
      <div className="size-36">
        <WorkTICharacterImage
          code={PREVIEW_CODE}
          fallbackIcon={previewDetail.characterIcon}
          frameless
          size={144}
          alt={`Work-TI 결과 예시 — ${previewResult.code} ${previewResult.title}`}
        />
      </div>
      <h3 className="text-heading-3 text-gray-950">{previewResult.title}</h3>
      <blockquote className="rounded-md bg-primary-50 px-5 py-4 text-body-md font-medium leading-7 text-primary-800">
        &ldquo;{previewResult.catchphrase}&rdquo;
      </blockquote>
      <div className="flex flex-wrap justify-center gap-2">
        {previewResult.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-gray-100 px-3.5 py-1.5 text-body-sm font-semibold text-gray-700">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

/** WORK-TI — explanation on the left, a real Work-TI result (LYDG) as the product preview on the right. */
export function WorkTISection() {
  return (
    <section className="bg-gray-50">
      <div className="mx-auto grid max-w-[1140px] items-center gap-16 px-8 py-16 md:grid-cols-[0.95fr_1.05fr] md:py-24">
        <div className="flex flex-col gap-5">
          <SectionKicker>HOW IT WORKS</SectionKicker>
          <h2 className="text-heading-2 text-gray-950">Work-TI란 무엇인가요?</h2>
          <p className="text-body-md leading-8 text-gray-700">
            워크티는 구직자와 기업이 일하는 방식의 대한 이해를 돕기 위한 테스트로, <br />
          </p>
          <p className="text-body-md leading-8 text-gray-700">
            구직자와 기업이 각각 자신의 업무 성향을 가볍게 확인하고, 서로 어떤 방식으로 일하기를
            선호하는지 이해하기 위한 테스트입니다.
          </p>
          <div className="flex flex-col gap-2">
            <p className="text-body-sm leading-7 text-gray-700">
              <strong className="font-bold text-primary-600">구직자</strong> — 내가 편하게 일할 수 있는 환경을
              생각해봅니다
            </p>
            <p className="text-body-sm leading-7 text-gray-700">
              <strong className="font-bold text-primary-600">기업</strong> — 우리 조직이 실제로 일하는 방식을
              돌아봅니다
            </p>
          </div>
          <p className="text-body-md leading-7 text-gray-700">
            두 결과는 채용 과정에서 서로를 이해하기 위한 참고 정보로 활용됩니다.
          </p>

          <div className="flex items-start gap-2.5">
            <span
              className="mt-0.5 flex size-[18px] shrink-0 items-center justify-center rounded-full bg-gray-200 text-[11px] font-bold text-gray-600"
              aria-hidden="true"
            >
              i
            </span>
            <p className="text-caption leading-7 text-gray-400">
              Work-TI는 전문 심리검사나 적성검사가 아닙니다. 전문가의 진단이나 과학적 평가를 목적으로 설계된
              테스트가 아니며, 결과의 정확성이나 신뢰도를 보장하지 않습니다. 나의 일하는 모습을 가볍게 돌아보고
              설명해보는 하나의 &lsquo;업무 성향 이미지 카드&rsquo;처럼 즐겨주세요.
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <WorkTIResultPreview />
        </div>
      </div>
    </section>
  );
}
