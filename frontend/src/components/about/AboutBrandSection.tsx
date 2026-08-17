import { SectionKicker } from "@/components/about/SectionKicker";

function MeaningBlock({ label, heading, lines }: { label: string; heading: string; lines: [string, string] }) {
  return (
    <div className="flex flex-col items-center gap-3">
      <span className="text-[20px] font-bold tracking-[0.12em] text-primary-600/70">{label}</span>
      <h2 className="text-heading-3 text-gray-500">{heading}</h2>
      <p className="text-body-md leading-8 text-gray-700">
        {lines[0]}
        <br />
        {lines[1]}
      </p>
    </div>
  );
}

/**
 * ABOUT WORKWITY — centered editorial typography section. Deliberately plain
 * (no cards, no motion): the "Work with Identity" / "Witty" naming story is
 * meant to read like a short essay, not a feature callout.
 */
export function AboutBrandSection() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-[680px] flex-col items-center gap-6 px-8 py-16 text-center md:py-24">
        <SectionKicker>ABOUT WORKWITY</SectionKicker>

        <MeaningBlock
          label="WORK WITH IDENTITY"
          heading="일과 정체성"
          lines={["나의 정체성과 일하는 방식을 잃지 않고,", "나에게 맞는 곳에서 일할 수 있도록."]}
        />

        <span className="text-[18px] font-semibold text-gray-400" aria-hidden="true">
          ＋
        </span>

        <MeaningBlock
          label="WITTY"
          heading="조금 더 쉽고 재치 있는 방식"
          lines={["취업과 채용이라는 조금은 무거운 과정을,", "조금 더 쉽고 재치 있게 풀어낼 수 있도록."]}
        />

        <p className="mt-2 text-display-lg text-primary-600">Workwity</p>

        <p className="max-w-[520px] text-heading-3 leading-[1.8] text-gray-700">
          <strong className="font-bold text-gray-950">&lsquo;일과 정체성&rsquo;</strong>, 그리고{" "}
          <strong className="font-bold text-gray-950">&lsquo;재치 있는 방식&rsquo;</strong>.
          <br />두 가지 의미에서 <strong className="font-bold text-gray-950">Workwity</strong>는 시작했습니다.
        </p>
      </div>
    </section>
  );
}
