import { Button } from "@/components/ui/Button";

export default function WorkTITypeNotFound() {
  return (
    <div className="mx-auto flex min-h-[560px] max-w-[760px] flex-col items-center justify-center px-5 py-20 text-center sm:px-8">
      <p className="text-code-sm text-primary-600">UNKNOWN WORK-TI</p>
      <h1 className="mt-3 text-heading-1 text-gray-950">해당 Work-TI 유형을 찾을 수 없습니다.</h1>
      <p className="mt-3 text-body-lg text-gray-600">16가지 공개 유형 목록에서 원하는 Work-TI를 다시 선택해 주세요.</p>
      <Button href="/work-ti" variant="primary" size="lg" className="mt-8">
        16가지 유형 보기
      </Button>
    </div>
  );
}
