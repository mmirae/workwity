import { SectionKicker } from "@/components/about/SectionKicker";
import { HiringFilterDemo } from "@/components/about/HiringFilterDemo";

/** HIRING PROCESS FILTER — intro copy plus the live filter demo. */
export function HiringProcessSection() {
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-[1240px] px-8 py-16 md:py-24">
        <div className="mx-auto mb-12 flex max-w-[640px] flex-col items-center gap-3.5 text-center">
          <SectionKicker>HIRING PROCESS FILTER</SectionKicker>
          <h2 className="text-heading-2 text-gray-950">
            일하는 방식뿐 아니라,
            <br />
            채용 전형도 직접 고릅니다.
          </h2>
          <p className="text-body-md leading-8 text-gray-700">
            구직자는 공고를 하나씩 열어보지 않아도 원하는 채용 전형을 기준으로 공고를 찾을 수 있습니다. 복잡하게
            숨어 있던 채용 과정을 <strong className="font-bold text-gray-950">검색할 수 있는 조건</strong>으로
            바꿉니다.
          </p>
        </div>

        <HiringFilterDemo />
      </div>
    </section>
  );
}
