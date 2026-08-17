import { Suspense } from "react";
import CompanyMyPageClient from "./CompanyMyPageClient";

export default function CompanyMyPage() {
  return (
    <Suspense fallback={null}>
      <CompanyMyPageClient />
    </Suspense>
  );
}
