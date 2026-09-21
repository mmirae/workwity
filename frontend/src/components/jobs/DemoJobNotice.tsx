export function DemoJobBadge() {
  return (
    <span className="w-fit rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-caption font-semibold text-gray-500">
      데모 공고
    </span>
  );
}

export function DemoJobNotice({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-lg border border-primary-100 bg-primary-50 px-5 py-4">
      <span
        className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-primary-100 text-caption font-bold text-primary-700"
        aria-hidden="true"
      >
        i
      </span>
      {compact ? (
        <p className="min-w-0 break-words text-body-sm leading-7 text-gray-700">
          이 공고는 Workwity 기능 시연용 예시 공고입니다.
        </p>
      ) : (
        <div className="flex flex-col gap-1">
          <p className="text-body-sm font-bold text-gray-950">데모 안내</p>
          <p className="min-w-0 break-words text-body-sm leading-7 text-gray-700">
            현재 표시되는 채용공고는 서비스 기능 시연을 위해 생성된 예시 데이터입니다.
            <br className="hidden sm:block" /> 실제 채용 중인 공고가 아닙니다.
          </p>
        </div>
      )}
    </div>
  );
}
