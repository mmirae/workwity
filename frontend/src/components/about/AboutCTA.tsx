import Link from "next/link";

/** FINAL CTA — Royal Blue closing band with the two Work-TI entry points. */
export function AboutCTA() {
  return (
    <section className="bg-primary-600 text-center text-white">
      <div className="mx-auto flex max-w-[900px] flex-col items-center gap-8 px-8 py-20 md:py-28">
        <h2 className="text-heading-2">
          일하는 데 정답은 없지만,
          <br />
          나에게 맞는 회사는 있습니다.
        </h2>
        <p className="text-body-lg text-primary-100">
          나에게 딱 맞는 회사 찾기, <strong className="font-bold text-white">Work with Identity.</strong>
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          <Link
            href="/test"
            className="rounded-full bg-white px-8 py-4 text-body-md font-bold text-primary-600 transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:shadow-focus"
          >
            내 Work-TI 알아보기 →
          </Link>
          <Link
            href="/company/onboarding"
            className="rounded-full border border-white/50 bg-white/10 px-8 py-4 text-body-md font-bold text-white transition-colors hover:bg-white/20 focus-visible:outline-none focus-visible:shadow-focus"
          >
            우리 회사 Work-TI 알아보기 →
          </Link>
        </div>
      </div>
    </section>
  );
}
