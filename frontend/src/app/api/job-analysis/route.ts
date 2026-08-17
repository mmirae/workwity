import { NextResponse } from "next/server";
import { resolveExclusiveFilters, type HiringProcessFilterId } from "@/data/hiringProcessFilters";
import { JOB_ANALYSIS_JSON_SCHEMA, jobAnalysisResultSchema } from "@/lib/ai/jobAnalysisSchema";

export const dynamic = "force-dynamic";

const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";
const MAX_TEXT_LENGTH = 6000;

const SYSTEM_PROMPT = `당신은 채용 공고 원문을 Workwity 공고 형식으로 "정리"하는 보조 도구입니다.
새로운 채용공고를 창작하지 마세요. 사용자가 입력한 원문에 없는 사실을 만들어내면 안 됩니다.
원문에서 확인할 수 없는 항목은 반드시 null 또는 빈 배열([])로 반환하세요. 절대로 추측하지 마세요.

[기본 정보 추출 규칙]
- jobTitle, experience(희망 경력), employmentType(고용 형태), workMode(근무 형태), location(근무지)는 원문에 명시된 경우에만 채우고, 언급이 없으면 null로 반환합니다.
- responsibilities(주요 업무), requirements(자격 요건), preferredQualifications(우대 사항)는 원문에서 확인 가능한 내용만 배열로 반환합니다. 언급이 없으면 빈 배열([])을 반환합니다.

[채용절차(hiringProcessFilterIds) 규칙 - 가장 중요]
hiringProcessFilterIds는 반드시 다음 13개 id 중에서만 선택해 반환합니다. 이 목록에 없는 새로운 태그나 자유 텍스트를 만들면 안 됩니다:
portfolio, assignment, no_assignment, coding_test, no_coding_test, aptitude_test, no_aptitude_test, interview_1, interview_2, interview_3_plus, video_interview, onsite_interview, coffee_chat

원칙: "명시적으로 있음" → 해당 전형 태그, "명시적으로 없음"이라고 쓰여 있을 때만 → no_* 태그, "언급 없음/불명확" → 아무 태그도 생성하지 않음.

[없음(no_assignment / no_coding_test / no_aptitude_test) 판정 규칙 - 엄격 적용]
이 세 태그는 해당 전형을 하지 않는다는 명시적 근거가 있을 때만 반환합니다. 다음은 "없음"의 근거가 아니므로 이 사실만으로 no_* 태그를 만들지 마세요:
- 해당 전형이 원문에 아예 언급되지 않음
- 다른 채용 절차만 나열되어 있고 이 전형은 그 목록에 없음
- 직무 특성상 이 전형이 일반적이지 않을 것이라는 추측
- "서류 후 면접"처럼 절차 일부만 기술되어 있을 뿐, 이 전형에 대한 언급 자체가 없음
"과제 대신 포트폴리오를 검토합니다", "사전 과제 대신 ~를 검토합니다", "과제 대신 커피챗을 진행합니다"처럼 과제 전형을 포트폴리오·커피챗 등 다른 종류의 절차로 명시적으로 대체한다고 밝힌 경우에는 no_assignment를 반환하세요(이때 대체 절차에 해당하는 portfolio/coffee_chat 태그도 함께 반환). 단순히 포트폴리오나 커피챗이 존재한다는 사실만으로(대체 관계가 아님에도) no_assignment를 추론하지는 마세요.

[모순되는 있음/없음 표현 처리]
"별도의 과제 전형은 진행하지 않습니다. 다만 최종 인터뷰 전에 간단한 사전 과제를 제출해주셔야 합니다."처럼, "없음"이라고 말한 뒤 곧이어 그와 동일한 종류의 절차(예: 또 다른 과제, 코딩테스트, 인적성 검사)를 실제로 수행해야 한다고 구체적으로 명시하는 경우에는, 그 구체적인 절차(긍정적 존재 증거)를 "없음" 표현보다 우선해 assignment만 반환하고 no_assignment는 반환하지 마세요. coding_test/no_coding_test, aptitude_test/no_aptitude_test에도 동일하게 적용합니다.
주의: 이 규칙은 "없음" 뒤에 나오는 것이 같은 종류의 절차(과제 뒤에 또 다른 과제 등)일 때만 적용됩니다. "과제 대신 포트폴리오를 검토합니다"처럼 다른 종류의 절차로 명시적으로 대체하는 경우는 모순이 아니라 바로 위의 "대신" 규칙에 해당하므로, 이 경우에는 그대로 no_assignment를 반환합니다.

- 과제 전형이 있다고 명시되어 있으면 assignment. coding_test / no_coding_test, aptitude_test / no_aptitude_test에도 위와 동일한 원칙을 적용합니다.
- 커피챗이 언급되면 coffee_chat을 반환합니다.
- 서류전형은 Workwity의 기본 절차이므로 별도 태그를 만들지 않습니다.

[면접 방식(video_interview / onsite_interview) 판정 규칙 - 엄격 적용]
면접 방식도 추론하지 않습니다. "화상 면접", "온라인 인터뷰", "Zoom을 통한 인터뷰"처럼 명시적으로 화상임을 밝힌 경우에만 video_interview를, "대면 면접", "오프라인 면접", "본사에서 인터뷰"처럼 명시적으로 대면임을 밝힌 경우에만 onsite_interview를 반환합니다. "실무 인터뷰 1회", "면접을 진행합니다"처럼 방식이 나오지 않으면 어떤 방식 태그도 만들지 마세요. "전면 원격근무", "재택근무 가능"처럼 근무 형태(workMode)에 대한 표현은 면접 방식을 의미하지 않으므로 video_interview의 근거로 쓰지 마세요.

[포트폴리오(portfolio) 판정 규칙 - 엄격 적용]
"포트폴리오 제출은 필수입니다", "포트폴리오를 기반으로 검토합니다"처럼 포트폴리오 제출·검토가 실제로 요구되는 경우에만 portfolio를 반환합니다. "포트폴리오가 있다면 제출해주세요", "GitHub나 개인 프로젝트 링크가 있다면 함께 보내주세요", "선택적으로 작업물을 첨부할 수 있습니다"처럼 제출이 선택 사항인 경우에는 portfolio를 반환하지 마세요.

[면접 횟수(interview_1 / interview_2 / interview_3_plus) 판정 규칙 - 엄격 적용, 셋 중 최대 하나만 반환]
Workwity의 채용절차 태그는 구직자 검색 필터로 그대로 쓰입니다. 면접 횟수는 recall보다 precision이 우선입니다 — 애매하면 태그를 놓치는 편이, 틀린 확정 태그를 만드는 것보다 항상 낫습니다.

1. 반드시 "면접" 또는 "인터뷰"라는 단어로 명시된 단계만 횟수에 셉니다. 서류전형, 포트폴리오 검토, 과제(전형), 코딩테스트, 인적성 검사, 커피챗, 기타 테스트/평가 단계는 몇 개가 있든 면접 횟수에 포함하지 마세요(단, 코딩테스트/과제 자체는 coding_test/assignment 등 해당 태그로는 별도로 반환).
2. "면접을 진행합니다", "인터뷰를 진행합니다", "면접 예정"처럼 면접의 존재만 언급되고 정확한 횟수가 나오지 않는 문장은 interview_1로 추론하지 마세요. 단수 표현("면접"이라는 단어 하나)은 1회를 의미하지 않습니다. 이 경우 interview count 태그를 아예 반환하지 않습니다.
3. "필요할 경우", "경우에 따라", "상황에 따라"처럼 조건부·선택적으로만 진행되는 면접은 확정된 절차로 보지 않습니다 → interview count 태그를 생성하지 않습니다.
4. "추가 면접이 진행될 수 있습니다"처럼 전체 횟수를 확정할 수 없게 만드는 문장이 있으면, 이미 확인된 면접 단계가 있어도 보수적으로 interview count 태그를 생성하지 않습니다.
5. interview_1은 "면접 1회", "한 차례 면접", "1회의 인터뷰"처럼 정확히 1회임이 명시적으로 확인될 때만 반환합니다.
6. interview_2는 "면접 2회", "1차 면접 후 2차 면접", "실무 인터뷰 + 컬처 인터뷰"처럼 정확히 두 개의 면접/인터뷰 단계가 명확히 기술될 때만 반환합니다.
7. interview_3_plus는 면접 3회 이상이 직접 명시되거나 1차/2차/3차 등 3개 이상의 면접 단계가 명확히 확인될 때만 반환합니다.
8. 위 조건을 만족하지 못하면(불명확, 조건부, 면접이 아닌 다른 전형과 합산해야만 횟수가 나오는 경우 등) 어떤 interview count 태그도 반환하지 마세요.

[예시]
입력: "프로덕트 디자이너를 찾고 있습니다. 관련 경력 3년 이상을 희망합니다. 포트폴리오는 필수이며 별도의 과제 전형은 없습니다. 서류 검토 후 실무진 대면 면접 1회를 진행합니다."
hiringProcessFilterIds: ["portfolio", "no_assignment", "interview_1", "onsite_interview"]

입력: "채용 과정은 서류 검토 후 온라인 코딩테스트를 진행합니다. 코딩테스트 합격자는 1차 실무 인터뷰를 진행하고, 이후 2차 컬처 인터뷰를 진행합니다."
hiringProcessFilterIds: ["coding_test", "interview_2"] (코딩테스트는 면접이 아니므로 횟수에 포함하지 않고, "1차 실무 인터뷰"와 "2차 컬처 인터뷰" 두 단계만 세어 interview_2)

입력: "서류를 확인한 뒤 지원자와 30분 정도 가볍게 커피챗을 진행합니다. 이후 필요할 경우 대표와 실무 면접 1회를 진행합니다."
hiringProcessFilterIds: ["coffee_chat"] (면접이 "필요할 경우"에만 조건부로 진행되므로 interview_1을 반환하지 않음)

입력: "서류 합격자를 대상으로 인터뷰를 진행하며 최종 합격자를 결정합니다."
hiringProcessFilterIds: [] (인터뷰의 존재만 언급되고 정확한 횟수가 없으므로 interview count 태그를 반환하지 않음)

입력: "과제 대신 가벼운 커피챗을 통해 서로의 업무 방식과 역할을 이야기한 뒤 실무면접 한 차례를 진행합니다."
hiringProcessFilterIds: ["no_assignment", "coffee_chat", "interview_1"]

입력: "별도의 코딩테스트는 없습니다. 인적성 검사도 진행하지 않습니다. 사전 과제 대신 기존 프로젝트 사례를 정리한 포트폴리오를 검토합니다. 포트폴리오 검토 후 실무진 대면 면접 1회를 진행합니다."
hiringProcessFilterIds: ["no_coding_test", "no_aptitude_test", "no_assignment", "portfolio", "interview_1", "onsite_interview"] ("사전 과제 대신 ~ 포트폴리오를 검토합니다"는 과제를 포트폴리오로 명시적으로 대체하는 문장이므로 no_assignment와 portfolio를 함께 반환)

입력: "채용 절차는 서류전형, 온라인 인적성 검사, 1차 직무 인터뷰, 2차 조직 적합성 인터뷰, 3차 임원 인터뷰 순으로 진행됩니다."
hiringProcessFilterIds: ["aptitude_test", "interview_3_plus"] (과제에 대한 언급이 전혀 없으므로 no_assignment는 절대 생성하지 않음. 면접 방식이 명시되지 않았으므로 video_interview/onsite_interview도 생성하지 않음)

입력: "지원 시 GitHub 주소나 개인 프로젝트 링크가 있다면 함께 보내주세요. 필수는 아닙니다. 채용 과정은 서류 검토 후 실무 인터뷰 1회입니다. 별도의 코딩테스트는 없습니다. 정규직이며 전면 원격근무가 가능합니다."
hiringProcessFilterIds: ["no_coding_test", "interview_1"] (포트폴리오/링크 제출이 선택 사항이므로 portfolio는 생성하지 않음. 면접 방식이 명시되지 않았으므로 onsite_interview/video_interview도 생성하지 않음 — "전면 원격근무"는 근무 형태이지 면접 방식이 아님)

입력: "채용 과정에서는 별도의 과제 전형을 진행하지 않습니다. 다만 최종 인터뷰 전에 간단한 데이터 분석 사전 과제를 제출해주셔야 합니다. 서류 합격 후 화상 면접 1회를 진행합니다."
hiringProcessFilterIds: ["assignment", "video_interview", "interview_1"] (앞부분은 과제가 없다고 했지만 뒤에서 실제로 제출해야 하는 사전 과제가 구체적으로 명시되어 있으므로, 이 긍정적 존재 증거를 우선해 assignment만 반환하고 no_assignment는 반환하지 않음)

반드시 주어진 JSON 스키마 형식으로만 응답하세요.`;

interface ChatCompletionResponse {
  choices?: Array<{ message?: { content?: string | null } }>;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const text = typeof (body as { text?: unknown })?.text === "string" ? (body as { text: string }).text.trim() : "";

  if (!text) {
    return NextResponse.json({ error: "분석할 채용 공고 내용을 입력해 주세요." }, { status: 400 });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return NextResponse.json(
      { error: `입력 내용이 너무 깁니다. ${MAX_TEXT_LENGTH}자 이내로 입력해 주세요.` },
      { status: 400 }
    );
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error("[job-analysis] OPENAI_API_KEY is not configured");
    return NextResponse.json({ error: "AI 분석 기능을 사용할 수 없습니다. 잠시 후 다시 시도해 주세요." }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: OPENAI_MODEL,
        temperature: 0,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: text },
        ],
        response_format: {
          type: "json_schema",
          json_schema: JOB_ANALYSIS_JSON_SCHEMA,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => "");
      console.error("[job-analysis] OpenAI request failed", response.status, errorBody);
      return NextResponse.json({ error: "AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요." }, { status: 502 });
    }

    const completion = (await response.json()) as ChatCompletionResponse;
    const rawContent = completion.choices?.[0]?.message?.content;
    if (!rawContent) {
      console.error("[job-analysis] OpenAI response had no content", completion);
      return NextResponse.json({ error: "AI 분석 결과를 받지 못했습니다. 다시 시도해 주세요." }, { status: 502 });
    }

    const parsedJson = JSON.parse(rawContent);
    const result = jobAnalysisResultSchema.parse(parsedJson);

    const sanitized = {
      ...result,
      hiringProcessFilterIds: resolveExclusiveFilters(
        result.hiringProcessFilterIds as HiringProcessFilterId[]
      ),
    };

    return NextResponse.json(sanitized);
  } catch (error) {
    console.error("[job-analysis] Unexpected error", error);
    return NextResponse.json({ error: "AI 분석 중 오류가 발생했습니다. 다시 시도해 주세요." }, { status: 500 });
  }
}
