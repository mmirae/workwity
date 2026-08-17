# Workwity Design System v1.0

> Workwity 제품 전반의 UI 일관성, 접근성, 구현 기준을 정의하는 문서  
> Brand language reference: `Workwity_Brand_Language.md`  
> Last updated: 2026-08-07

---

## 1. Design Principles

### Clarity First

사용자는 화면을 해석하기 위해 고민하지 않아야 합니다. 메뉴, 상태, 버튼, Match, 채용 전형은 한눈에 이해되어야 합니다.

### Calm Trust

밝은 배경, 충분한 여백, 절제된 색상과 모션으로 차분하고 신뢰감 있는 인상을 만듭니다.

### Identity, Not Evaluation

결과와 Match를 서열이나 평가처럼 표현하지 않습니다. 서로의 방향과 관계를 이해하는 정보로 보여줍니다.

### Visible by Default

핵심 정보는 클릭하거나 탭을 전환하지 않아도 기본 상태에서 보여야 합니다. 인터랙션은 정보를 숨기기보다 이해를 돕는 역할을 합니다.

### Product, Not Component Showcase

각 섹션은 컴포넌트 전시장이 아니라 사용자 흐름과 브랜드 스토리를 전달해야 합니다.

---

## 2. Color System

### Primary

| Token | Value | Usage |
|---|---:|---|
| `primary-600` | `#2563EB` | 주요 CTA, 활성 메뉴, 핵심 링크 |
| `primary-700` | `#1D4ED8` | Hover, 강조 상태 |
| `primary-800` | `#1E40AF` | Pressed, 강한 텍스트 강조 |
| `primary-100` | `#DBEAFE` | 선택 배경, 정보 카드, Orbit 보조 면 |
| `primary-50` | `#EFF6FF` | 섹션 배경, 약한 하이라이트 |

### Neutrals

| Token | Value | Usage |
|---|---:|---|
| `gray-950` | `#0F172A` | 핵심 제목 |
| `gray-900` | `#111827` | 기본 본문 강조 |
| `gray-700` | `#374151` | 본문 |
| `gray-600` | `#4B5563` | 보조 본문 |
| `gray-500` | `#6B7280` | 메타 정보 |
| `gray-300` | `#D1D5DB` | 비활성 테두리 |
| `gray-200` | `#E5E7EB` | 기본 테두리 |
| `gray-100` | `#F3F4F6` | 보조 배경 |
| `gray-50` | `#F9FAFB` | 페이지 보조 배경 |
| `white` | `#FFFFFF` | 기본 배경 |

### Semantic

| Token | Value | Usage |
|---|---:|---|
| `success-600` | `#059669` | 완료, 발행, 확인 |
| `success-100` | `#D1FAE5` | 성공 배경 |
| `warning-600` | `#D97706` | 확인 필요, 주의 |
| `warning-100` | `#FEF3C7` | 주의 배경 |
| `danger-600` | `#DC2626` | 오류, 삭제 |
| `danger-100` | `#FEE2E2` | 오류 배경 |
| `info-600` | `#2563EB` | 안내 |
| `info-100` | `#DBEAFE` | 안내 배경 |

### Orbit Colors

| Token | Value | Usage |
|---|---:|---|
| `orbit-user` | `#5B7CFA` | 구직자 Orbit |
| `orbit-user-soft` | `#C7D2FE` | 구직자 Orbit 면과 궤도 |
| `orbit-company` | `#7BC9A4` | 기업 Orbit |
| `orbit-company-soft` | `#D1FAE5` | 기업 Orbit 면과 궤도 |
| `orbit-match` | `#8B5CF6` | Match Core, 겹침 강조 |
| `orbit-accent` | `#F59E8B` | 제한적 보조 포인트 |

### Work Style Axis Colors

Work-TI 결과 페이지의 4축(S/L, E/Y, M/D, G/A) 전용 색상입니다. 대시보드 KPI처럼 보이지 않도록 채도를 낮춘 4색 세트이며, 구직자·기업 리포트가 항상 동일한 값을 공유합니다.

| Token | Value | Usage |
|---|---:|---|
| `teal-600` | `#0E8F9E` | E/Y(의사결정) 축 강조, 배지 |
| `teal-100` | `#D7EFF2` | E/Y 축 배경 |
| `violet-600` | `#7C3AED` | M/D(속도) 축 강조, 배지 |
| `violet-100` | `#EDE9FE` | M/D 축 배경 |
| `coral-600` | `#D9704F` | G/A(가치) 축 강조, 배지 |
| `coral-100` | `#F8E0D7` | G/A 축 배경 |

S/L(실행) 축은 별도 토큰 없이 `primary-600` / `primary-50`을 그대로 사용합니다.

### Color Rules

- Royal Blue는 브랜드의 중심색입니다.
- Orbit 색상은 결과 비교와 관계 시각화에서만 사용합니다.
- 검정색 대형 배경과 짙은 네이비 섹션을 반복하지 않습니다.
- Match가 낮더라도 위험색을 사용하지 않습니다.
- 색상만으로 상태를 구분하지 않고 아이콘, 라벨, 텍스트를 함께 사용합니다.

---

## 3. Typography

### Font Family

```css
font-family:
  Pretendard,
  -apple-system,
  BlinkMacSystemFont,
  "Segoe UI",
  sans-serif;
```

유형 코드와 짧은 영어 키커에는 선택적으로 다음을 사용합니다.

```css
font-family:
  "JetBrains Mono",
  ui-monospace,
  SFMono-Regular,
  monospace;
```

### Type Scale

| Token | Desktop | Mobile | Weight | Usage |
|---|---:|---:|---:|---|
| `display-xl` | 56px / 1.15 | 40px / 1.2 | 700 | 핵심 Hero |
| `display-lg` | 48px / 1.2 | 36px / 1.25 | 700 | 브랜드 선언 |
| `heading-1` | 40px / 1.25 | 32px / 1.3 | 700 | 페이지 제목 |
| `heading-2` | 32px / 1.3 | 28px / 1.35 | 700 | 섹션 제목 |
| `heading-3` | 24px / 1.4 | 22px / 1.4 | 600 | 카드 제목 |
| `body-lg` | 18px / 1.7 | 17px / 1.65 | 400 | 주요 설명 |
| `body-md` | 16px / 1.65 | 16px / 1.6 | 400 | 기본 본문 |
| `body-sm` | 14px / 1.55 | 14px / 1.5 | 400 | 보조 정보 |
| `caption` | 12px / 1.45 | 12px / 1.4 | 500 | 라벨, 메타 |
| `code-lg` | 28px / 1.2 | 24px / 1.2 | 700 | Work-TI 유형 코드 |
| `code-sm` | 13px / 1.4 | 12px / 1.4 | 600 | 영어 키커 |

### Typography Rules

- 본문 한 줄은 데스크톱 기준 약 55~75자를 넘기지 않습니다.
- 한글 본문에 지나친 자간을 사용하지 않습니다.
- 모든 섹션에 영어 키커를 반복하지 않습니다.
- 영문 대문자 라벨은 핵심 섹션에 제한적으로 사용합니다.
- 제목은 2~3줄을 넘기지 않습니다.

---

## 4. Spacing

8px 기반 간격 체계를 사용합니다.

| Token | Value |
|---|---:|
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |
| `space-20` | 80px |
| `space-24` | 96px |
| `space-30` | 120px |

### Section Spacing

- 일반 페이지 섹션: 데스크톱 80~96px, 모바일 56~72px
- Hero: 데스크톱 96~128px, 모바일 72~88px
- 카드 내부: 24~32px
- 작은 정보 카드: 16~24px
- 목록 간격: 12~20px

모든 섹션에 동일한 상하 패딩을 반복하지 않습니다.

---

## 5. Layout and Grid

### Container

| Type | Max Width |
|---|---:|
| Wide | 1280px |
| Default | 1200px |
| Reading | 760px |
| Compact | 560px |

### Grid

- Desktop: 12 columns, 24px gutter, 32px 이상 page padding
- Tablet: 8 columns, 20px gutter, 24px page padding
- Mobile: 4 columns, 16px gutter, 20px page padding

### Layout Rules

- 랜딩 Hero는 중앙 정렬을 사용할 수 있습니다.
- 서비스 소개 Hero는 비대칭 2열 구조를 우선합니다.
- 중요한 데모는 페이지 전체 폭을 활용할 수 있습니다.
- 동일한 `제목 → 설명 → 카드 3개` 패턴을 연속해서 반복하지 않습니다.
- 텍스트 중심, 비교형, 중앙 집중형, 제품 데모형 레이아웃을 섞어 리듬을 만듭니다.

---

## 6. Radius and Shadows

### Radius

| Token | Value | Usage |
|---|---:|---|
| `radius-sm` | 8px | 입력, 작은 칩 |
| `radius-md` | 12px | 기본 버튼, 카드 |
| `radius-lg` | 16px | 주요 카드, 모달 |
| `radius-xl` | 24px | Hero 데모, 브랜드 패널 |
| `radius-full` | 9999px | 배지, 토글, Orbit 노드 |

### Shadows

| Token | Value |
|---|---|
| `shadow-xs` | `0 1px 2px rgba(15, 23, 42, 0.05)` |
| `shadow-sm` | `0 4px 12px rgba(15, 23, 42, 0.06)` |
| `shadow-md` | `0 12px 30px rgba(15, 23, 42, 0.08)` |
| `shadow-focus` | `0 0 0 4px rgba(37, 99, 235, 0.18)` |

카드에는 그림자를 남발하지 않고, Orbit Core에는 강한 글로우를 사용하지 않습니다.

---

## 7. Borders

- 기본 테두리: `1px solid #E5E7EB`
- 강조 테두리: `1px solid #BFDBFE`
- 활성 테두리: `1.5px solid #2563EB`
- 구분선: `1px solid #F1F5F9`

대형 섹션마다 하단 테두리를 반복하지 않습니다.

---

## 8. Buttons

### Primary

- Background: `primary-600`
- Text: white
- Hover: `primary-700`
- Active: `primary-800`
- Focus: `shadow-focus`

### Secondary

- White background
- `gray-300` border
- `gray-900` text
- Hover: `gray-50`

### Ghost

- Transparent background
- `gray-700` text
- Hover: `gray-100`

### Sizes

| Size | Height | Padding | Text |
|---|---:|---:|---:|
| Small | 36px | 12px 14px | 14px |
| Medium | 44px | 14px 18px | 15~16px |
| Large | 52px | 16px 24px | 16~17px |

### Rules

- CTA 문구는 동사로 시작합니다.
- 한 화면의 강한 Primary CTA는 가급적 하나만 둡니다.
- 아이콘만 있는 버튼에는 `aria-label`을 제공합니다.
- 과도한 스케일 애니메이션은 사용하지 않습니다.

---

## 9. Cards

### Base Card

- Background: white
- Border: `gray-200`
- Radius: `radius-md`
- Padding: 24px
- Shadow: none 또는 `shadow-xs`

### Featured Card

- Border: `primary-100`
- Background: white 또는 `primary-50`
- Radius: `radius-lg`
- Padding: 28~32px
- Shadow: `shadow-sm`

### Interactive Card

- Hover: border와 그림자만 미세하게 증가
- Active: `primary-50` 배경 또는 `primary-600` 테두리
- Focus: 명확한 포커스 링

### Rules

- 정보를 숨기는 탭형 카드보다 기본 노출을 우선합니다.
- 동일한 크기의 카드 세 개를 모든 섹션에서 반복하지 않습니다.
- 카드 자체보다 핵심 정보의 위계를 먼저 설계합니다.

---

## 10. Forms

- Input height: 44px
- Radius: 10~12px
- Border: `gray-300`
- Focus border: `primary-600`
- Focus ring: `shadow-focus`
- Placeholder: `gray-500`
- Textarea minimum height: 120px
- Label: 14px, weight 600

오류 메시지는 입력 바로 아래에 배치하고 아이콘, 텍스트, 색상을 함께 사용합니다.

---

## 11. Chips, Tags and Badges

### Filter Chip

- 기본: white + gray border
- 선택: `primary-100` background + `primary-700` text
- 체크 표시 포함
- 모바일 터치 영역 최소 40px

### Match Badge

권장 표기:

```text
Work Identity Match
92%
```

작은 카드에서는:

```text
Match 92%
```

- 높은 Match를 성공색으로만 표현하지 않습니다.
- 낮은 Match를 위험색으로 표현하지 않습니다.
- `primary` 또는 `orbit-match` 계열을 사용합니다.

### Language Patch

- `#판교사투리_환영`
- `#상호존댓말_선호`
- `#돌직구_직설형`

---

## 12. Navigation

### Public

- 서비스 소개
- 공고 찾기
- Work-TI
- 로그인

### Job Seeker

- 서비스 소개
- 공고 찾기
- 내 Work-TI
- 프로필 메뉴

프로필 메뉴:

- 마이페이지
- 로그아웃

### Company

- 서비스 소개
- 채용 관리
- 기업 Work-TI
- 기업 프로필 메뉴

기업 프로필 메뉴:

- 기업 마이페이지
- 로그아웃

### Rules

- 현재 메뉴에는 명확한 활성 상태를 제공합니다.
- 동일한 메뉴를 헤더와 프로필 드롭다운에 중복하지 않습니다.
- 로고 클릭 시 메인 랜딩으로 이동합니다.

---

## 13. Work Orbit Component

### Anatomy

- Core
- Primary Orbit
- Secondary Orbit
- Axis Nodes
- User Path
- Company Path
- Match Label
- Optional axis labels

### Variants

| Variant | Usage |
|---|---|
| `orbit-personal` | 개인 WORK-TI 결과 |
| `orbit-company` | 기업 WORK-TI 결과 |
| `orbit-match` | 개인과 기업 비교 |
| `orbit-mini` | 공고 카드와 리스트 |
| `orbit-share` | 공유 이미지 |
| `orbit-hero` | 서비스 소개 Hero |

### Behavior

- 기본 정보는 모션 없이도 이해 가능해야 합니다.
- Hero와 Match에서는 느린 회전 또는 노드 이동을 사용할 수 있습니다.
- Hover 시 해당 축의 라벨과 설명을 강조할 수 있습니다.
- 비교 상태에서는 두 Orbit를 색과 선 패턴으로 구분합니다.
- 색맹 사용자를 위해 실선·점선 등 선 패턴 보조를 고려합니다.

### Motion Timing

| Motion | Duration |
|---|---:|
| Hover feedback | 120~180ms |
| State transition | 180~240ms |
| Orbit merge | 700~1000ms |
| Match reveal | 400~600ms |
| Slow ambient rotation | 20~40s per revolution |
| Filter demo step | 500~800ms |

---

## 14. Match Presentation

### 구성 순서

1. `Work Identity Match 92%`
2. 한 줄 요약
3. 잘 맞는 축
4. 차이가 있는 축
5. 면책 문구

### 예시

```text
Work Identity Match 92%

빠르게 실행하고 자율적으로 결정하는 방식이 잘 맞습니다.
완성도 기준에는 약간의 차이가 있어 업무 시작 전에 합의하면 좋습니다.

잘 맞는 축
- 실행 스타일
- 의사결정
- 가치 지향

차이가 있는 축
- 속도·디테일
```

### 면책 문구

> Match는 합격 가능성이나 업무 능력을 평가하는 점수가 아닙니다.  
> 서로의 일하는 방식을 이해하기 위한 참고 지표입니다.

---

## 15. Motion and Interaction

### Scroll-triggered Demo

자동 데모는 해당 섹션이 뷰포트에 진입했을 때 한 번 실행합니다. 페이지 진입 즉시 실행하지 않습니다.

### Filter Demo

1. 전체 공고 수 표시
2. 필터 자동 선택
3. 결과 수 변화
4. 카드 재정렬
5. 직접 조작 안내 표시

### AI Analysis Demo

1. 원문 표시
2. 근거 문장 하이라이트
3. 태그와 연결
4. 기업 확인 상태
5. 수정 후 발행

### Rules

- 핵심 정보는 클릭 없이도 볼 수 있어야 합니다.
- 숨겨진 탭 안에 중요한 설명을 넣지 않습니다.
- 자동 재생은 한 번만 실행합니다.
- 사용자가 조작하면 자동 데모를 중단합니다.
- 모션은 사용자 행동을 방해하지 않습니다.

---

## 16. States

모든 주요 컴포넌트는 다음 상태를 갖습니다.

- Default
- Hover
- Active / Pressed
- Focus-visible
- Disabled
- Loading
- Empty
- Success
- Error

Loading은 현재 단계를 표시하고, Empty 상태에는 이유와 다음 행동을 제공합니다.

---

## 17. Accessibility

- WCAG 2.1 AA 수준의 색 대비를 목표로 합니다.
- 모든 클릭 가능한 요소는 키보드로 접근할 수 있어야 합니다.
- `Enter`와 `Space`로 활성화할 수 있어야 합니다.
- `focus-visible` 상태를 제거하지 않습니다.
- 아이콘 단독 버튼에는 `aria-label`을 제공합니다.
- 모달은 포커스 트랩과 Escape 닫기를 지원합니다.
- 최소 터치 영역은 44×44px을 권장합니다.
- `prefers-reduced-motion`을 존중합니다.
- Orbit와 차트 정보는 텍스트 형태로도 제공합니다.

---

## 18. Responsive Rules

### Desktop

- 제품 데모와 Orbit 시각화를 적극적으로 사용합니다.
- 2열 비교와 비대칭 레이아웃을 허용합니다.

### Tablet

- 2열을 유지하되 폭이 좁으면 1열로 전환합니다.
- Orbit 크기를 줄이고 라벨 겹침을 방지합니다.

### Mobile

- Match 숫자와 한 줄 요약을 먼저 표시합니다.
- Orbit는 전체 너비 안에서 잘리지 않아야 합니다.
- 필터는 가로 스크롤 칩 또는 접기 가능한 패널로 제공합니다.
- 표는 카드형 목록으로 전환합니다.

---

## 19. Iconography

- 1.5~2px 라인 아이콘을 사용합니다.
- 채움 아이콘과 라인 아이콘을 혼용하지 않습니다.
- 로봇, 뇌, 회로, 로켓, 행성 아이콘을 사용하지 않습니다.
- 아이콘은 텍스트 라벨을 대체하지 않습니다.

---

## 20. Content Rules

### 대표 CTA

- `3분 만에 내 Work-TI 알아보기`
- `나와 맞는 공고 보기`
- `지원하기`
- `우리 회사 Work-TI 시작하기`
- `채용공고 등록하기`

### 용어 일관성

권장:

- 채용 전형
- Work-TI
- WORK-TI REPORT
- Work Identity
- Work Identity Match
- Work Orbit
- 조직 언어 패치

확정된 브랜드 카피와 `worktiData.ts`의 질문·결과 문구는 임의로 수정하지 않습니다.

---

## 21. Page-specific Direction

### Main Landing

- 목적: Work-TI 시작 유도
- 중앙 정렬 허용
- 강한 CTA
- 짧고 명확한 가치 제안

### Service Introduction

- 목적: 브랜드 철학과 작동 방식 이해
- 비대칭 Hero
- Orbit 키 비주얼
- 클릭 없이 이해 가능한 흐름
- Work-TI, Match, 채용 전형 필터, AI 정리, 브랜드 원칙으로 구성

### WORK-TI REPORT

- Orbit를 주인공으로 배치
- 유형 코드와 캐릭터 네이밍
- 네 축의 결과
- 조직 언어 패치
- 결과 공유와 이미지 저장

### Job List

- 채용 전형 필터 우선
- 공고 카드에 Match 배지
- Match는 추천 근거와 함께 제공

### Job Detail

- 채용 전형 프로세스 명시
- Match와 축별 설명
- AI 요약은 원문을 대체하지 않음
- 지원 CTA는 명확하게 유지

### Company

- 실제 팀의 Work Identity 표현
- 지원자를 점수 순으로 평가하는 인상 금지
- 공통점과 차이를 대화의 시작점으로 제공

---

## 22. Design QA Checklist

### Brand

- [ ] Orbit가 단순 장식이 아니라 정보를 전달하는가?
- [ ] 사람을 평가하거나 서열화하는 인상이 없는가?
- [ ] Work Compass와 Work Orbit의 역할이 구분되는가?
- [ ] 우주 콘셉트가 과도하지 않은가?

### UI

- [ ] 기본·Hover·Active·Focus·Disabled 상태가 있는가?
- [ ] 동일한 카드 패턴이 과도하게 반복되지 않는가?
- [ ] 중요한 정보가 클릭 없이 보이는가?
- [ ] CTA 위계가 명확한가?
- [ ] 모바일에서 정보가 잘리지 않는가?

### Content

- [ ] 확정 카피가 변경되지 않았는가?
- [ ] Work-TI 데이터는 `worktiData.ts`를 기준으로 하는가?
- [ ] Match가 합격 가능성처럼 표현되지 않았는가?
- [ ] AI 분석 결과에 근거가 표시되는가?

### Accessibility

- [ ] 키보드만으로 사용할 수 있는가?
- [ ] 포커스 링이 보이는가?
- [ ] 아이콘 버튼에 접근 가능한 이름이 있는가?
- [ ] 색상 외에 상태 구분 수단이 있는가?
- [ ] 모션 축소 설정을 지원하는가?

---

## 23. Suggested CSS Variables

```css
:root {
  --color-primary-600: #2563EB;
  --color-primary-700: #1D4ED8;
  --color-primary-100: #DBEAFE;
  --color-primary-50: #EFF6FF;

  --color-gray-950: #0F172A;
  --color-gray-700: #374151;
  --color-gray-500: #6B7280;
  --color-gray-200: #E5E7EB;
  --color-gray-50: #F9FAFB;
  --color-white: #FFFFFF;

  --color-success-600: #059669;
  --color-warning-600: #D97706;
  --color-danger-600: #DC2626;

  --color-teal-600: #0E8F9E;
  --color-teal-100: #D7EFF2;
  --color-violet-600: #7C3AED;
  --color-violet-100: #EDE9FE;
  --color-coral-600: #D9704F;
  --color-coral-100: #F8E0D7;

  --color-orbit-user: #5B7CFA;
  --color-orbit-user-soft: #C7D2FE;
  --color-orbit-company: #7BC9A4;
  --color-orbit-company-soft: #D1FAE5;
  --color-orbit-match: #8B5CF6;
  --color-orbit-accent: #F59E8B;

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 24px;

  --shadow-xs: 0 1px 2px rgba(15, 23, 42, 0.05);
  --shadow-sm: 0 4px 12px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 12px 30px rgba(15, 23, 42, 0.08);
  --shadow-focus: 0 0 0 4px rgba(37, 99, 235, 0.18);
}
```

---

## 24. Source of Truth

- 제품 목표와 기능 범위: `workwity PRD.md`
- 정보 구조: `workwity IA.html`
- 사용자 흐름: `workwity UserFlow.html`
- 와이어프레임: `workwity Wireframe.html`
- 브랜드 언어: `Workwity_Brand_Language.md`
- UI 시스템: `Workwity_Design_System.md`
- 질문·결과·계산 데이터: `worktiData.ts`
- 시각·인터랙션 참고: `Workwity Prototype.dc.html`
