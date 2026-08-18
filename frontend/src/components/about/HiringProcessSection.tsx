import { SectionKicker } from "@/components/about/SectionKicker";
import { HiringFilterDemo } from "@/components/about/HiringFilterDemo";

/** HIRING PROCESS FILTER — intro copy plus the live filter demo. */
export function HiringProcessSection() {
  return (
    <section className="border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-[1240px] px-8 py-16 md:py-24">
        <div className="mx-auto mb-12 flex max-w-[640px] flex-col items-center gap-9 text-center">
          <SectionKicker>HIRING PROCESS FILTER</SectionKicker>
          <h2 className="text-heading-2 text-gray-950">
            구직자는
            <br />
            원하는 채용 방식의 회사를 더 쉽게 찾습니다.
          </h2>
          <p className="text-body-md leading-8 text-gray-700">
            구직자는 일하는 방식뿐 아니라 <strong className="font-bold text-gray-950">내가 원하는 채용 전형을 기준으로 공고를 찾을 수 있습니다.</strong>
            <br/>공고마다 숨어 있던 포트폴리오, 과제, 면접 횟수, 커피챗 등 채용 과정을 검색 조건으로 바꿔 원하는 기회를 더 빠르게 찾습니다.
          </p>
        </div>

        <HiringFilterDemo />
      </div>
    </section>
  );
}
