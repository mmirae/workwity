import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "개인정보처리방침 — Workwity",
  description: "Workwity 데모 서비스의 개인정보처리방침입니다.",
};

const analyticsItems = [
  "방문 페이지와 페이지 조회",
  "스크롤 및 외부 링크 클릭",
  "서비스 이용 흐름",
  "접속 기기와 브라우저 관련 정보",
  "대략적인 지역 정보 등 Google Analytics가 자동으로 수집하는 통계 정보",
];

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      <article className="mx-auto flex max-w-[760px] flex-col gap-10 px-5 py-12 sm:px-8 md:py-20">
        <header className="flex flex-col gap-4 border-b border-gray-200 pb-8">
          <p className="text-code-sm text-primary-600">PRIVACY POLICY</p>
          <h1 className="text-heading-1 text-gray-950">개인정보처리방침</h1>
          <p className="text-body-md leading-8 text-gray-600">
            Workwity는 서비스 이용 현황을 이해하고 더 나은 사용자 경험을 제공하기 위해 필요한 범위에서 이용
            통계를 확인합니다. 이 페이지는 현재 데모/MVP 서비스에 적용되는 내용을 안내합니다.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-3 text-gray-950">1. 개인정보처리방침의 목적</h2>
          <p className="text-body-md leading-8 text-gray-700">
            이 개인정보처리방침은 Workwity에서 어떤 서비스 이용 통계가 수집될 수 있으며, 해당 정보를 어떤
            목적으로 사용하는지 알리기 위해 마련되었습니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-3 text-gray-950">2. 데모/MVP 서비스 안내</h2>
          <p className="text-body-md leading-8 text-gray-700">
            Workwity는 현재 서비스 기능을 시험하고 개선하기 위한 데모/MVP 단계입니다. 현재 서비스는 별도의
            회원가입, 결제 또는 서버 데이터베이스 기반 사용자 프로필 저장 기능을 제공하지 않습니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-3 text-gray-950">3. Google Analytics 4 이용</h2>
          <p className="text-body-md leading-8 text-gray-700">
            Workwity는 서비스 이용 현황을 분석하기 위해 Google Analytics 4를 사용합니다. Google Analytics를
            통해 다음과 같은 통계 정보가 자동으로 수집될 수 있습니다.
          </p>
          <ul className="flex flex-col gap-2 rounded-lg bg-gray-50 px-5 py-4">
            {analyticsItems.map((item) => (
              <li key={item} className="flex gap-3 text-body-sm leading-7 text-gray-700">
                <span className="mt-3 size-1.5 shrink-0 rounded-full bg-primary-600" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="text-body-md leading-8 text-gray-700">
            수집될 수 있는 통계 정보는 서비스 이용 현황을 분석하고 사용자 경험을 개선하는 목적으로 사용합니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-3 text-gray-950">4. 개인식별정보 처리</h2>
          <p className="text-body-md leading-8 text-gray-700">
            Workwity는 Google Analytics 이벤트 데이터에 이름, 이메일 주소 등 사용자를 직접 식별할 수 있는
            정보를 의도적으로 전송하지 않습니다. Google Analytics를 통한 데이터 처리는 Google의 관련 정책과
            약관에 따라 이루어집니다.
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-heading-3 text-gray-950">5. 방침의 변경</h2>
          <p className="text-body-md leading-8 text-gray-700">
            향후 서비스 기능이나 수집되는 통계 항목이 변경되는 경우 이 개인정보처리방침도 변경될 수 있습니다.
            변경된 내용은 이 페이지를 통해 안내합니다.
          </p>
        </section>

        <footer className="border-t border-gray-200 pt-6">
          <p className="text-body-sm text-gray-500">시행일: 2026년 9월 23일</p>
        </footer>
      </article>
    </div>
  );
}
