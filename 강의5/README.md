# React + Next.js로 진짜 웹앱 만들기
> **대상:** 강의1~4를 완료한 수강생 (HTML/CSS/JS 기본기, Git push, DOM 조작 가능)
> **시간:** 1~2시간 특강
> **준비물:** Node.js 설치된 노트북, VS Code, GitHub 계정
> **결과물:** Next.js로 만든 진짜 웹앱이 Vercel에 배포된 상태 — `https://my-next-app.vercel.app`

---

## 강의 흐름 한눈에 보기

| 시간 | 단계 | 무엇을 배우나 |
|---|---|---|
| 0:00 ~ 0:15 | 1. React/Next.js가 뭔가요? | 왜 필요한가 |
| 0:15 ~ 0:30 | 2. Node.js 설치 & 프로젝트 생성 | 환경 준비 |
| 0:30 ~ 0:50 | 3. Next.js 프로젝트 구조 이해 | 폴더가 뭐가 뭔지 |
| 0:50 ~ 1:15 | 4. 컴포넌트와 props | React의 핵심 |
| 1:15 ~ 1:35 | 5. useState로 상태 관리 | 동적인 UI |
| 1:35 ~ 1:50 | 6. 페이지 추가 & 라우팅 | 여러 페이지 만들기 |
| 1:50 ~ 2:00 | 7. Vercel 배포 & 마무리 | 진짜 본업 |

---

## 1. React/Next.js가 뭔가요? (15분)

### 강의4까지의 한계

지금까지 한 페이지에 다 때려박았습니다.

```html
<!-- index.html -->
<head>
    <style>...수백 줄의 CSS...</style>
</head>
<body>
    ...수백 줄의 HTML...
    <script>
        ...수백 줄의 JS...
    </script>
</body>
```

페이지가 10개, 100개로 늘어나면? 똑같은 헤더를 매번 복붙? 한 곳만 고치면 다 같이 고쳐지면 좋을 텐데...

### React의 아이디어

**"화면을 작은 부품(컴포넌트)으로 쪼개서 조립하자"**

```
[App]
  ├─ [Header]
  ├─ [Hero]
  ├─ [CardList]
  │     ├─ [Card]
  │     ├─ [Card]
  │     └─ [Card]
  └─ [Footer]
```

각 부품을 한 번 만들어두면 어디서든 가져다 쓸 수 있고, 한 곳을 고치면 모든 곳에서 반영됩니다.

### Next.js는 뭔가요?

React는 "부품을 만드는 도구"이지, 그것만으로는 웹사이트가 안 됩니다. **라우팅, SEO, 빌드, 서버 기능** 등이 추가로 필요합니다.

**Next.js = React + 웹사이트에 필요한 모든 것**

> 💡 React가 "엔진"이라면 Next.js는 "엔진이 들어간 완성된 자동차"입니다.

### 왜 Vercel에서 강조하나?

Next.js는 **Vercel 회사가 직접 만든 프레임워크**입니다. 그래서 Vercel에 배포하면 **자동으로 모든 게 최적화**됩니다.

```
Next.js 코드 → GitHub → Vercel
                          ↓
        자동으로 빠른 사이트, 자동 SEO, 자동 이미지 최적화...
```

### 진짜 회사들도 이걸 쓰나요?

쓰고 있습니다. **Netflix, TikTok, 토스, 당근마켓, 우아한형제들** 등 수많은 회사가 Next.js + Vercel 또는 그 변종을 사용합니다. 입문자가 익혀두면 **현업으로 바로 이어지는** 가장 가까운 길입니다.

---

## 2. Node.js 설치 & 프로젝트 생성 (15분)

### 2-1. Node.js가 왜 필요해요?

지금까지 우리는 브라우저에서만 JS를 실행했습니다. **Node.js는 컴퓨터 안에서 JS를 실행할 수 있게 해주는 런타임**입니다. Next.js 프로젝트를 만들고, 빌드하고, 개발 서버를 띄우려면 필요합니다.

### 2-2. 설치

[https://nodejs.org](https://nodejs.org) → **LTS** 버전 다운로드 → 설치 (모든 옵션 기본값).

확인:

```bash
node --version    # v20.x.x 정도
npm --version     # 10.x.x 정도
```

> 💡 `npm`은 Node와 함께 깔리는 **패키지 매니저**입니다. 다른 사람이 만든 라이브러리를 가져올 때 씁니다.

### 2-3. Next.js 프로젝트 만들기

작업 폴더로 이동 후:

```bash
npx create-next-app@latest my-next-app
```

**선택 질문이 나오면 다음과 같이 답하세요** (Enter로 기본값 가능):

```
Would you like to use TypeScript?      → No
Would you like to use ESLint?          → Yes
Would you like to use Tailwind CSS?    → Yes
Would you like your code inside `src/`?→ Yes
Would you like to use App Router?      → Yes (recommended)
Use Turbopack for `next dev`?          → Yes
Would you like to customize import alias? → No
```

설치가 끝나면:

```bash
cd my-next-app
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 열기 — Next.js 시작 화면이 보입니다. **이미 웹앱이 돌아가고 있습니다.**

> ⚠️ 터미널 창은 그대로 두세요. 닫으면 서버가 꺼집니다. 코드 수정 시간 동안 이 창은 계속 켜둡니다.

---

## 3. Next.js 프로젝트 구조 이해 (20분)

VS Code에서 `my-next-app` 폴더를 열어보세요.

### 3-1. 주요 폴더/파일

```
my-next-app/
├── src/
│   └── app/
│       ├── page.js        ← 메인 페이지 (/)
│       ├── layout.js      ← 모든 페이지의 공통 레이아웃
│       └── globals.css    ← 전역 CSS
├── public/                ← 이미지, 아이콘 등 정적 파일
├── package.json           ← 프로젝트 정보, 의존성 목록
└── next.config.mjs        ← Next.js 설정
```

### 3-2. 핵심 규칙: 폴더 = 경로

```
app/page.js              → /            (메인)
app/about/page.js        → /about       (소개 페이지)
app/blog/page.js         → /blog        (블로그)
app/blog/post/page.js    → /blog/post
```

**폴더 만들기 = 새 페이지 만들기.** 강의1에서 `about.html`을 따로 만들었던 것의 자동화 버전입니다.

### 3-3. page.js 열어보기

`src/app/page.js`를 열면:

```javascript
export default function Home() {
    return (
        <main>
            <h1>Welcome to Next.js</h1>
        </main>
    );
}
```

이게 **컴포넌트**입니다. 함수 하나가 화면 하나의 부품을 그립니다.

### 3-4. 첫 수정

`page.js`의 내용을 다음으로 교체:

```javascript
export default function Home() {
    return (
        <main style={{ padding: 40, fontFamily: "sans-serif" }}>
            <h1>안녕하세요, 김지훈입니다 👋</h1>
            <p>Next.js로 만든 첫 페이지!</p>
        </main>
    );
}
```

저장 → 브라우저 자동 새로고침 → **바로 반영됩니다.** (이걸 *Hot Reload*라 부름)

### 3-5. 잠깐, 이거 HTML이에요? JS예요?

```javascript
return (
    <main>
        <h1>안녕</h1>
    </main>
);
```

이건 **JSX** — JavaScript 안에 HTML을 직접 쓸 수 있게 해주는 문법입니다.

**HTML과 다른 점**:
- `class` → `className`
- `for` → `htmlFor`
- 스타일은 객체로: `style={{ color: "red" }}`
- 모든 태그는 닫혀야 함: `<img />`, `<br />`

---

## 4. 컴포넌트와 props (25분) ⭐ 핵심

### 4-1. 첫 컴포넌트 만들기

`src/app/` 안에 `Card.js` 파일 생성:

```javascript
export default function Card() {
    return (
        <div style={{
            padding: 20,
            background: "#f3f4f6",
            borderRadius: 8,
            marginTop: 20
        }}>
            <h2>관심사</h2>
            <p>웹 개발</p>
        </div>
    );
}
```

`page.js`에서 사용:

```javascript
import Card from "./Card";

export default function Home() {
    return (
        <main style={{ padding: 40, fontFamily: "sans-serif" }}>
            <h1>안녕하세요 👋</h1>
            <Card />
            <Card />
            <Card />
        </main>
    );
}
```

같은 카드가 3개 나옵니다. **부품을 만들어 재활용한 첫 순간입니다.**

### 4-2. 그런데 다 똑같은 카드네요?

다르게 만들고 싶다면? **props**를 사용합니다.

`Card.js` 수정:

```javascript
export default function Card({ title, content }) {
    return (
        <div style={{
            padding: 20,
            background: "#f3f4f6",
            borderRadius: 8,
            marginTop: 20
        }}>
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    );
}
```

`page.js`에서:

```javascript
import Card from "./Card";

export default function Home() {
    return (
        <main style={{ padding: 40, fontFamily: "sans-serif" }}>
            <h1>안녕하세요 👋</h1>
            <Card title="관심사" content="웹 프론트엔드, 게임 개발" />
            <Card title="연락처" content="jihoon@example.com" />
            <Card title="좋아하는 것" content="커피 ☕" />
        </main>
    );
}
```

각 카드가 **다른 내용으로** 그려집니다.

### 4-3. props가 핵심입니다

```
[부모 컴포넌트] ──(props 전달)──> [자식 컴포넌트]
     page.js                          Card.js
```

함수에 인자를 넘기는 것과 같은 개념. 이 구조 덕분에 **같은 부품으로 무한히 다양한 화면**을 만들 수 있습니다.

### 4-4. 배열로 깔끔하게

데이터가 많아지면 배열로 관리:

```javascript
import Card from "./Card";

const cards = [
    { title: "관심사", content: "웹 프론트엔드" },
    { title: "연락처", content: "jihoon@example.com" },
    { title: "좋아하는 것", content: "커피 ☕" },
];

export default function Home() {
    return (
        <main style={{ padding: 40, fontFamily: "sans-serif" }}>
            <h1>안녕하세요 👋</h1>
            {cards.map((c, i) => (
                <Card key={i} title={c.title} content={c.content} />
            ))}
        </main>
    );
}
```

`map`은 배열의 각 항목을 컴포넌트로 변환해줍니다. **데이터만 추가하면 화면이 자동으로 늘어납니다.**

---

## 5. useState로 상태 관리 (20분)

### 5-1. 강의4의 카운터를 React로

강의4에서 만든 클릭 카운터를 React로 다시 만들어봅시다. `app/` 안에 `Counter.js`:

```javascript
"use client";

import { useState } from "react";

export default function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div style={{ marginTop: 20 }}>
            <p>버튼을 누른 횟수: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                눌러보세요
            </button>
        </div>
    );
}
```

`page.js`에서 사용:

```javascript
import Counter from "./Counter";

// ... Home 함수 안에 <Counter /> 추가
```

### 5-2. 무슨 일이 일어난 건가요?

**`useState(0)`** = "값이 0으로 시작하는 상태를 만들어줘"

반환되는 두 개:
- `count` — 현재 값
- `setCount` — 값을 바꾸는 함수

```javascript
const [count, setCount] = useState(0);
//      ↑          ↑           ↑
//   현재 값   바꾸는 함수    초기값
```

### 5-3. 왜 그냥 변수를 안 써요?

```javascript
let count = 0;  // ❌ React에선 안 됨
count = count + 1;
```

이러면 값은 바뀌지만 **React가 화면을 다시 그릴 줄을 모릅니다.**
`setCount`를 써야 React가 "어, 값이 바뀌었네, 화면 다시 그려야지" 하고 자동으로 업데이트합니다.

### 5-4. "use client"는 뭐예요?

Next.js의 컴포넌트는 기본이 **서버 컴포넌트**입니다. 사용자 동작에 반응(클릭 등)하려면 브라우저에서 실행돼야 하므로 파일 맨 위에 `"use client";`를 적어줍니다.

> 💡 처음엔 "useState나 onClick 쓰면 `"use client"` 붙인다"로 외워두면 됩니다. 자세한 건 나중에.

---

## 6. 페이지 추가 & 라우팅 (15분)

### 6-1. About 페이지 만들기

`src/app/` 안에 `about` 폴더 생성 → 그 안에 `page.js` 생성:

```javascript
export default function About() {
    return (
        <main style={{ padding: 40, fontFamily: "sans-serif" }}>
            <h1>소개</h1>
            <p>웹 개발을 배우고 있는 김지훈입니다.</p>
        </main>
    );
}
```

브라우저에서 [http://localhost:3000/about](http://localhost:3000/about) — 새 페이지가 보입니다. **파일 만든 것밖에 안 했는데 새 URL이 생겼습니다.**

### 6-2. 페이지 간 링크

`page.js`에 추가:

```javascript
import Link from "next/link";

// ... 적당한 위치에
<Link href="/about">소개 페이지로</Link>
```

`<a>` 대신 `<Link>`를 쓰면 **새로고침 없이 페이지가 전환**됩니다 (Next.js의 핵심 최적화).

---

## 7. Vercel 배포 & 마무리 (10분)

### 7-1. GitHub에 올리기

```bash
git init
git add .
git commit -m "초기 Next.js 프로젝트"
```

GitHub에서 새 저장소 `my-next-app` 생성 (README 생성 X).

```bash
git remote add origin https://github.com/내아이디/my-next-app.git
git branch -M main
git push -u origin main
```

### 7-2. Vercel 배포

[https://vercel.com/dashboard](https://vercel.com/dashboard) → **Add New** → **Project** → `my-next-app` Import → **Deploy**.

**아무 설정도 건드릴 필요 없습니다.** Vercel은 Next.js를 자동 감지하고 모든 걸 알아서 합니다.

30초~1분 후 — 배포 완료. `https://my-next-app-xxx.vercel.app` 주소로 진짜 웹앱이 떴습니다.

> 💡 강의1과 다른 점: 그땐 정적 HTML이었지만, 이번엔 **빌드 과정**이 들어갑니다. Vercel이 그걸 자동으로 처리하는 게 진짜 마법입니다.

### 7-3. 오늘 배운 것

```
React/Next.js의 의의: 웹앱을 부품으로 조립
   ↓
프로젝트 생성 (npx create-next-app)
   ↓
폴더 = 페이지 라우팅
   ↓
컴포넌트 + props로 재사용
   ↓
useState로 동적 상태
   ↓
Vercel 자동 배포
```

이제 여러분은 **현업 프론트엔드 개발자가 매일 쓰는 도구**의 기본을 익혔습니다.

### 다음에 배우면 좋은 것들

| 단계 | 무엇을 | 왜 |
|---|---|---|
| 다음주 | **Tailwind CSS 본격 활용** | 빠른 디자인 |
| 그 다음 | **fetch + API Routes** | 백엔드 통신 |
| 한 달 후 | **데이터베이스 연결 (Supabase, Prisma)** | 진짜 앱 |
| 두 달 후 | **인증 (NextAuth.js)** | 로그인 기능 |
| 그 후 | **TypeScript** | 더 안전한 코드 |

### 추천 학습 자료 (모두 무료)

- **Next.js 공식 학습 코스** ([https://nextjs.org/learn](https://nextjs.org/learn)) — 만들면서 배우는 튜토리얼
- **React 공식 문서 (한국어)** ([https://ko.react.dev](https://ko.react.dev)) — 진짜 친절함
- **Vercel Templates** ([https://vercel.com/templates](https://vercel.com/templates)) — 잘 만들어진 예제 모음

### 마지막 한 마디

5강에 걸쳐 여러분은 **HTML 한 줄 → 진짜 웹앱**까지 왔습니다.

처음엔 막연했던 것들이 이젠 다 익숙한 단어가 됐을 겁니다.
- HTML / CSS / JS / Git / GitHub / Vercel / React / Next.js / 컴포넌트 / 라우팅 / 배포

이 단어들이 입에 붙는다는 건 **개발자 세계의 기본 어휘를 갖췄다**는 뜻입니다. 여기서부터는 만들고 싶은 걸 만들면서 자연스럽게 자라면 됩니다.

오늘 만든 앱은 계속 살아있고, 여러분의 GitHub에는 진짜 코드가 쌓였습니다. **이제 진짜 시작입니다.** 🚀

---

## 부록 A. 자주 묻는 질문 (FAQ)

**Q. `npm install` 했는데 너무 오래 걸려요.**
처음엔 의존성을 다 받아야 해서 1~3분 걸립니다. 이후엔 캐시되어 빠릅니다. 만약 5분 넘게 멈춘 것 같으면 Ctrl+C로 끊고 다시 시도.

**Q. `node_modules` 폴더가 너무 커요. GitHub에 올라가나요?**
안 올라갑니다. Next.js가 자동으로 만든 `.gitignore`에 `node_modules`가 들어 있어요. Vercel은 `package.json`만 보고 알아서 다시 설치합니다.

**Q. 빌드 에러 떴어요.**
- 터미널의 빨간 메시지 첫 줄을 그대로 검색하세요.
- 자주 발생하는 원인: `"use client"` 빠뜨림, `import` 경로 오타, 컴포넌트 이름이 소문자(컴포넌트명은 항상 대문자로 시작!)

**Q. Tailwind를 안 쓰고 그냥 CSS 파일을 쓸 수도 있나요?**
가능. `Card.module.css` 같은 파일 만들어서 import. 다만 Tailwind를 한 번 익혀두면 훨씬 빠릅니다. 다음 강의에서 다룰 예정.

**Q. React vs Vue vs Svelte 뭐가 좋아요?**
입문자에게는 **React가 압도적으로 추천**됩니다. 자료가 가장 많고, 일자리가 가장 많고, Next.js 같은 좋은 프레임워크가 받쳐줍니다. 한 가지 잘 익히고 나면 다른 건 빠르게 배울 수 있어요.

**Q. 모바일 앱은 못 만들어요?**
React를 익혀두면 **React Native**로 모바일 앱도 만들 수 있습니다. 같은 개념이 그대로 통하므로 진입장벽이 낮습니다.

---

## 부록 B. 강사용 운영 팁

- **`npx create-next-app`의 옵션 질문**은 강의 직전에 한번 따라해보세요. 옵션이 1~2년에 한 번씩 추가/변경됩니다.
- **JSX의 `className` 함정**은 여러 번 강조해도 모자랍니다. 첫 시간에 적어도 3번은 짚어주세요.
- **`"use client"`를 빼먹어서 막히는 사고**가 가장 흔합니다. useState/onClick 쓰는 컴포넌트는 무조건 붙인다고 단순화해서 알려주세요.
- **터미널 두 개 띄우기**를 안내하세요: 하나는 `npm run dev` (계속 실행), 다른 하나는 git 명령용.
- **Hot Reload가 안 되는 경우**가 종종 있습니다. 파일 저장 안 됨, 다른 포트에서 실행 중 등. 침착하게 서버 재시작.
- **컴포넌트 분리 욕심을 자제**하세요. 입문 단계에선 모든 걸 잘게 쪼개기보다 **`Card` 정도만 분리**해서 props 개념만 확실히 이해시키는 게 우선입니다.
- **Tailwind를 빠르게 훑어주는 5분**을 따로 두면 좋습니다. 입문자는 `bg-blue-500` 같은 이상한 글자가 어디서 오는지 궁금해합니다.

---

*문서 작성: 2026-05 / 라이선스: 자유롭게 수정·재배포 가능*
