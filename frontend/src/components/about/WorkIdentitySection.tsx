import { SectionKicker } from "@/components/about/SectionKicker";

function DialoguePreview() {
  return (
    <div className="order-1 flex flex-col gap-7">
      <div className="flex max-w-[78%] flex-col items-start gap-2 self-start">
        <span className="text-caption font-bold tracking-wide text-primary-600">구직자</span>
        <p className="rounded-lg rounded-tl-[4px] bg-primary-50 px-5 py-4 text-body-md font-semibold leading-6 text-gray-900">
          &ldquo;저는 빠르게 결정하고
          <br />
          자율적으로 움직일 때 편해요.&rdquo;
        </p>
      </div>
      <div className="flex max-w-[78%] flex-col items-end gap-2 self-end">
        <span className="text-caption font-bold tracking-wide text-primary-600">회사</span>
        <p className="rounded-lg rounded-tr-[4px] bg-gray-100 px-5 py-4 text-body-md font-semibold leading-6 text-gray-900">
          &ldquo;저희는 충분히 논의하고
          <br />
          정해진 프로세스로 움직여요.&rdquo;
        </p>
      </div>
      <p className="mt-1 text-center text-body-sm leading-7 text-gray-400">
        둘 다 좋은 방식입니다.
        <br />
        다만, 서로 맞는 방식인지는 다를 수 있습니다.
      </p>
    </div>
  );
}

/**
 * WORK IDENTITY — two-column: an editorial dialogue illustration (asymmetric
 * seeker/company quote bubbles, not a messenger-app UI) alongside the section
 * copy. The copy sits first in DOM (heading before illustration for reading
 * order) while `order-1`/`order-2` puts the dialogue visually first, on both
 * mobile and desktop, matching the reference design.
 */
export function WorkIdentitySection() {
  return (
    <section className="border-b border-gray-200 bg-white">
      <div className="mx-auto grid max-w-[1080px] items-center gap-16 px-8 py-16 md:grid-cols-[0.85fr_1.15fr] md:py-24">
        <div className="order-2 flex flex-col gap-5">
          <SectionKicker>WORK IDENTITY</SectionKicker>
          <h2 className="text-heading-2 text-gray-950">
            좋은 회사와 좋은 사람도,
            <br />
            일하는 방식이 다르면 맞지 않을 수 있습니다.
          </h2>
          <p className="text-body-md leading-8 text-gray-700">
            누군가는 빠른 실행과 자율적인 환경에서 힘을 얻고, 누군가는 충분한 논의와 명확한 체계 속에서 더 좋은
            결과를 만듭니다.
          </p>
          <p className="text-body-md font-semibold leading-8 text-gray-950">
            어느 한쪽이 더 좋은 방식인 것은 아닙니다.
          </p>
          <p className="text-body-md leading-8 text-gray-700">
            Workwity는 구직자와 회사가 서로의{" "}
            <strong className="font-semibold text-gray-950">
              Work Identity, 일하는 방식과 환경에 대한 선호
            </strong>
            를 미리 이해하고 참고할 수 있도록 돕습니다.
          </p>
          <p className="text-body-md leading-8 text-gray-700">
            좋은 사람을 찾는 것에서 한 걸음 더 나아가,{" "}
            <strong className="font-semibold text-gray-950">
              서로 잘 맞는 방식으로 일할 수 있는지를 함께 살펴봅니다.
            </strong>
          </p>
        </div>

        <DialoguePreview />
      </div>
    </section>
  );
}
