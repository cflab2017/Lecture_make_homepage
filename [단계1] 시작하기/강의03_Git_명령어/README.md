# Git 명령어로 진짜 개발자처럼 일하기
> **대상:** 강의1·2를 완료한 수강생 (GitHub 웹에서 클릭으로 업로드해본 경험 있음)
> **시간:** 1~2시간 특강
> **준비물:** 강의1·2에서 만든 GitHub 저장소, 노트북 (Windows/Mac/Linux 무관)
> **결과물:** 터미널에서 `git commit`, `git push`로 코드를 올릴 수 있는 능력

---

## 강의 흐름 한눈에 보기

| 시간 | 단계 | 무엇을 배우나 |
|---|---|---|
| 0:00 ~ 0:15 | 1. Git이 뭔가요? | 버전 관리 개념 |
| 0:15 ~ 0:30 | 2. Git 설치 & 초기 설정 | 사용자 정보, 인증 |
| 0:30 ~ 0:50 | 3. 저장소 가져오기 (clone) | 내 컴퓨터로 내려받기 |
| 0:50 ~ 1:15 | 4. 핵심 4명령 (status, add, commit, push) | 실제 워크플로 |
| 1:15 ~ 1:35 | 5. 변경 이력 보기 (log, diff) | 과거 추적하기 |
| 1:35 ~ 1:50 | 6. 자주 만나는 문제 해결 | 충돌, 실수 되돌리기 |
| 1:50 ~ 2:00 | 7. 마무리 & 다음 단계 | 브랜치 예고 |

---

## 1. Git이 뭔가요? (15분)

### 강의1에서 했던 일을 다시 떠올려보세요

```
파일 만들기 → GitHub 웹에서 Upload → Commit changes 클릭
```

이건 **Git의 아주 일부 기능**을 GitHub 웹사이트가 대신 해준 것입니다.
이번 강의에서는 **터미널에서 직접 Git을 다루는 법**을 배웁니다.

### Git이 정확히 뭔가요?

Git은 **파일의 변경 이력을 관리해주는 프로그램**입니다.

```
오늘 작성한 코드 → "세이브 포인트 1" 저장
내일 수정한 코드 → "세이브 포인트 2" 저장
모레 또 수정     → "세이브 포인트 3" 저장
```

이렇게 매 시점을 저장해두면:
- 언제든 **과거 시점으로 되돌릴 수 있음**
- **누가 언제 어떤 줄을 바꿨는지** 추적 가능
- **여러 명이 동시에 작업**해도 충돌 없이 합칠 수 있음

### Git vs GitHub 다시 정리

| | Git | GitHub |
|---|---|---|
| 정체 | 프로그램 (도구) | 웹 서비스 (회사) |
| 어디서 동작 | 내 컴퓨터 | 인터넷 (서버) |
| 비유 | 게임의 "세이브" 기능 | 세이브 파일을 클라우드에 백업하는 서비스 |

쉽게 말해 Git은 **내 컴퓨터에서 돌아가는 도구**, GitHub는 그걸 **인터넷에 공유하는 장소**입니다.

### 왜 터미널을 배워야 하나?

웹 클릭도 가능한데 굳이 터미널을 쓰는 이유:

- **속도**: 클릭 10번 < 명령어 1줄
- **자동화**: 명령어는 스크립트로 묶을 수 있음
- **원격 서버**: 회사 서버는 GUI가 없는 경우가 많음
- **표준**: 모든 개발자 자료, 튜토리얼이 명령어 기준

처음엔 어색하지만, 몇 번만 익숙해지면 훨씬 빠릅니다.

---

## 2. Git 설치 & 초기 설정 (15분)

### 2-1. 설치 확인

먼저 터미널을 엽니다.

- **Windows**: 시작 메뉴에서 **Git Bash** 검색 (없으면 아래 설치)
- **Mac**: **Terminal** 또는 **iTerm**
- **Linux**: **Terminal**

```bash
git --version
```

`git version 2.40.x` 같은 게 나오면 OK. 없다고 나오면 설치 필요:

- Windows: [https://git-scm.com](https://git-scm.com) → 다운로드 → 다음·다음·다음 (모든 옵션 기본값)
- Mac: 터미널에서 `xcode-select --install` 또는 [https://git-scm.com](https://git-scm.com)
- Linux: `sudo apt install git` (Ubuntu) / `sudo dnf install git` (Fedora)

### 2-2. 사용자 정보 등록 (한 번만)

매 커밋에 "누가 작성했는지" 기록되므로 처음에 설정해야 합니다.

```bash
git config --global user.name "김지훈"
git config --global user.email "jihoon@example.com"
```

> ⚠️ **이메일은 GitHub 가입 이메일과 동일하게!** 그래야 GitHub 프로필에 잔디(컨트리뷰션 그래프)가 잘 찍힙니다.

확인:

```bash
git config --global --list
```

### 2-3. GitHub 인증 설정

터미널에서 GitHub에 푸시할 때 인증이 필요합니다. 비밀번호는 더 이상 안 쓰고, **PAT(Personal Access Token)** 또는 **SSH 키**를 씁니다.

**입문자 추천: PAT**

1. GitHub → 우측 상단 프로필 → **Settings**
2. 좌측 맨 아래 **Developer settings**
3. **Personal access tokens** → **Tokens (classic)** → **Generate new token (classic)**
4. **Note**에 이름 (예: `my-laptop`)
5. **Expiration**: 90일 또는 No expiration
6. 권한 체크: **`repo`** 만 체크하면 충분
7. **Generate token** → **나타난 토큰을 즉시 복사** (다시 못 봅니다!)

이 토큰은 나중에 푸시할 때 비밀번호 대신 입력하게 됩니다. 한 번 입력하면 OS가 기억해줍니다.

> 💡 SSH 키 방식이 더 편하긴 하지만 입문 단계에선 PAT가 직관적입니다.

---

## 3. 저장소 가져오기 — clone (20분)

### 3-1. clone이 뭐예요?

GitHub에 있는 저장소를 **내 컴퓨터로 통째로 복사**해 오는 것입니다.

```
[GitHub의 my-website 저장소] ──clone──> [내 컴퓨터의 my-website 폴더]
```

### 3-2. 실습: 강의1에서 만든 저장소 clone하기

GitHub에서 본인의 `my-website` 저장소 페이지로 이동 → 초록색 **`< > Code`** 버튼 → **HTTPS 탭** → URL 복사.

URL은 이런 형태입니다:
```
https://github.com/jihoon-dev/my-website.git
```

이제 터미널에서 작업할 폴더로 이동:

```bash
cd ~/Desktop      # Mac/Linux
cd C:/Users/사용자명/Desktop   # Windows (Git Bash)
```

clone 실행:

```bash
git clone https://github.com/jihoon-dev/my-website.git
```

(URL은 본인 것으로 바꿔야 합니다)

폴더로 들어가기:

```bash
cd my-website
ls          # 파일 목록 확인 (Mac/Linux)
dir         # 파일 목록 확인 (Windows)
```

`index.html`, `README.md` 등이 보이면 성공.

### 3-3. 자주 헷갈리는 명령어

| 명령 | 하는 일 |
|---|---|
| `pwd` | 지금 어느 폴더에 있는지 |
| `ls` (Mac/Linux) / `dir` (Windows) | 현재 폴더 파일 목록 |
| `cd 폴더이름` | 해당 폴더로 들어가기 |
| `cd ..` | 상위 폴더로 |
| `cd ~` | 홈 디렉토리로 |
| `clear` | 화면 깨끗이 |

---

## 4. 핵심 4명령 — status, add, commit, push (25분)

진짜 워크플로의 핵심입니다. 이 4개만 알면 90%의 작업이 됩니다.

### 4-1. 작업 흐름 한눈에

```
[파일 수정]
    ↓
git status     ← 무엇이 바뀌었는지 확인
    ↓
git add 파일명  ← 커밋할 파일 선택
    ↓
git commit -m "메시지"  ← 세이브 포인트 만들기
    ↓
git push       ← GitHub에 올리기
    ↓
[Vercel 자동 배포]
```

### 4-2. git status — 현재 상태 보기

```bash
git status
```

지금 어떤 파일이 수정/추가/삭제되었는지 알려줍니다. **막힐 때마다 일단 `git status` 부터** 치는 습관을 들이세요.

출력 예시:
```
Changes not staged for commit:
  modified:   index.html

Untracked files:
  about.html
```

- `modified`: 기존 파일이 수정됨
- `Untracked`: Git이 아직 모르는 새 파일

### 4-3. git add — 커밋할 파일 고르기

```bash
git add index.html       # 특정 파일만
git add .                # 변경된 모든 파일
```

> 💡 **왜 이 단계가 있나요?** 파일을 10개 수정했어도 그 중 5개만 커밋하고 싶을 수 있습니다. `add`는 "이번 커밋에 포함할 파일"을 고르는 단계예요.

### 4-4. git commit — 세이브 포인트 만들기

```bash
git commit -m "헤더 색상을 파란색으로 변경"
```

`-m` 뒤에는 **변경 내용을 한 줄로 요약**한 메시지. 이게 나중에 이력 추적할 때 단서가 됩니다.

**좋은 커밋 메시지**
- ✅ `로그인 버튼 hover 효과 추가`
- ✅ `메인 페이지 폰트 크기 수정`

**나쁜 커밋 메시지**
- ❌ `수정`
- ❌ `asdf`
- ❌ `update`

### 4-5. git push — GitHub에 올리기

```bash
git push
```

처음 한 번은 인증이 필요합니다.
- Username: GitHub 사용자명
- Password: 아까 만든 **PAT 토큰** (GitHub 비밀번호 X)

성공하면 GitHub 저장소를 새로고침했을 때 변경사항이 보입니다. **그리고 Vercel이 자동으로 새 빌드를 시작합니다.**

### 4-6. 실습 시나리오

`index.html`을 열어서 글자 하나만 바꿔봅니다. 그리고:

```bash
git status
git add index.html
git commit -m "환영 문구 수정"
git push
```

GitHub 저장소 → 변경 반영 확인 → Vercel 대시보드 → 새 배포 진행 중 → 사이트 새로고침 → 변경됨!

**이게 진짜 개발자가 일하는 방식입니다.**

---

## 5. 변경 이력 보기 — log, diff (20분)

### 5-1. git log — 과거 커밋 목록

```bash
git log
```

지금까지의 모든 커밋이 최신순으로 나옵니다.

```
commit a1b2c3d4...
Author: 김지훈 <jihoon@example.com>
Date:   Fri May 7 14:30 2026

    환영 문구 수정
```

`q` 키로 빠져나옵니다.

**한 줄로 보기 (실무에서 더 많이 씀)**

```bash
git log --oneline
```

```
a1b2c3d 환영 문구 수정
e5f6g7h 카드 레이아웃 추가
i9j0k1l 첫 커밋
```

### 5-2. git diff — 변경 내용 확인

수정 후 커밋 전에 "내가 정확히 뭘 바꿨지?"를 보고 싶을 때.

```bash
git diff              # 아직 add 안 한 변경사항
git diff --staged     # 이미 add한 변경사항
```

빨간색(`-`)이 삭제된 줄, 초록색(`+`)이 추가된 줄입니다.

### 5-3. git show — 특정 커밋 자세히 보기

```bash
git show a1b2c3d
```

해당 커밋이 어떤 변경을 포함했는지 자세히 볼 수 있습니다.

---

## 6. 자주 만나는 문제 해결 (15분)

### 6-1. "방금 한 커밋 메시지를 잘못 썼어요"

**아직 push 전이면**:
```bash
git commit --amend -m "올바른 메시지"
```

**이미 push했으면**: 그냥 두세요. 커밋 메시지 수정하려고 강제 푸시(force push)하다 사고 납니다.

### 6-2. "수정한 내용을 다 날리고 마지막 커밋 상태로 돌아가고 싶어요"

```bash
git restore 파일명          # 특정 파일만
git restore .              # 모든 파일
```

⚠️ **이 명령은 되돌릴 수 없습니다.** 정말 버려도 되는 변경사항인지 확인 후 사용.

### 6-3. "잘못 add 했어요"

```bash
git restore --staged 파일명
```

add는 취소되지만 파일 변경은 그대로 유지됩니다.

### 6-4. "push가 거부됐어요 (rejected)"

이런 메시지가 뜬다면:
```
! [rejected] main -> main (fetch first)
```

**원인**: GitHub에 내 컴퓨터에 없는 변경사항이 있음 (웹에서 직접 수정했거나, 다른 컴퓨터에서 푸시했거나)

**해결**:
```bash
git pull
git push
```

`pull`은 GitHub의 변경사항을 내 컴퓨터로 가져오는 명령입니다.

### 6-5. "merge conflict가 발생했어요"

내 변경과 GitHub의 변경이 **같은 줄을 다르게** 수정했을 때 발생합니다.

파일을 열면 이런 게 보입니다:
```
<<<<<<< HEAD
내 컴퓨터의 내용
=======
GitHub의 내용
>>>>>>> origin/main
```

직접 편집해서 둘 중 어느 쪽을 살릴지(또는 둘 다 합칠지) 정하고, 표시 기호(`<<<`, `===`, `>>>`)를 모두 지운 뒤:

```bash
git add .
git commit -m "충돌 해결"
git push
```

> 💡 입문 단계에선 혼자 작업하므로 충돌이 거의 없습니다. 만약 발생해도 당황 말고 위 절차대로.

---

## 7. 마무리 & 다음 단계 (10분)

### 오늘 익힌 명령어 정리

```bash
# 초기 설정 (한 번만)
git config --global user.name "이름"
git config --global user.email "이메일"

# 저장소 가져오기
git clone <URL>

# 핵심 4명령 (매번 반복)
git status
git add <파일>
git commit -m "메시지"
git push

# 이력 보기
git log --oneline
git diff

# 가져오기
git pull

# 되돌리기
git restore <파일>
git restore --staged <파일>
```

이 정도만 익히면 **혼자 작업하는 개발자의 90%는 해결**됩니다.

### 한 장으로 보는 워크플로

```
GitHub 저장소
   │
   │ git clone   (처음 한 번)
   ↓
내 컴퓨터에서 코드 작성
   │
   │ git status   (뭐 바뀌었지?)
   │ git add .    (이걸 커밋할게)
   │ git commit -m "..."  (세이브 포인트)
   │ git push     (GitHub에 올림)
   ↓
GitHub 저장소 (업데이트됨)
   │
   │ Vercel 자동 감지
   ↓
홈페이지 자동 재배포 ✨
```

### 다음에 배우면 좋은 것들

| 단계 | 무엇을 | 왜 |
|---|---|---|
| 다음주 | **브랜치(branch)** | 안전하게 실험하기 |
| 그 다음 | **GitHub Pull Request** | 협업의 기본 |
| 한 달 후 | **JavaScript 기초** | 동적 웹페이지 |
| 두 달 후 | **VS Code Git 통합** | GUI로 더 빠르게 |

### 추천 학습 자료 (모두 무료)

- **Pro Git 책 (한국어)** ([https://git-scm.com/book/ko/v2](https://git-scm.com/book/ko/v2)) — 공식 무료 책
- **Learn Git Branching** ([https://learngitbranching.js.org/?locale=ko](https://learngitbranching.js.org/?locale=ko)) — 게임으로 배우는 Git
- **GitHub Skills** ([https://skills.github.com](https://skills.github.com)) — GitHub 공식 인터랙티브 튜토리얼

### 마지막 한 마디

처음엔 명령어가 어색합니다. 하지만 **일주일만 매일 한 번씩 push해보면** 손이 외웁니다.
실수해도 괜찮습니다. Git은 거의 모든 실수를 되돌릴 수 있도록 설계됐습니다.

오늘부터 모든 코드 변경은 **터미널에서 push** 해보세요. 그게 진짜 개발자입니다. 🎉

---

## 부록 A. 자주 묻는 질문 (FAQ)

**Q. PAT 토큰을 잃어버렸어요.**
다시 발급받으세요. 토큰은 GitHub도 다시 보여주지 못합니다. 새로 만들고 OS의 자격 증명 관리자(Windows: 자격 증명 관리자, Mac: 키체인)에서 기존 항목 삭제 후 재시도.

**Q. `git push`할 때마다 비밀번호를 물어봐요.**
처음 한 번 PAT 입력 후 OS가 저장합니다. 안 저장되면 다음 명령으로 캐시 활성화:
```bash
git config --global credential.helper store
```
(주의: 평문으로 저장됩니다. 공용 컴퓨터에선 비추천)

**Q. `cd` 명령어로 폴더에 못 들어가요. 띄어쓰기가 있는 폴더예요.**
따옴표로 감싸세요: `cd "My Documents"`

**Q. Git은 좋은데 너무 명령어가 많아요. GUI 없어요?**
- VS Code 내장 Git (좌측 사이드바 분기 모양 아이콘)
- GitHub Desktop ([https://desktop.github.com](https://desktop.github.com))
- SourceTree ([https://www.sourcetreeapp.com](https://www.sourcetreeapp.com))

다만 명령어를 먼저 익히고 GUI를 쓰는 게 나중에 더 강력합니다. GUI도 결국 명령어를 대신 실행해주는 것이라 원리를 모르면 막힐 때 더 답답합니다.

**Q. `.gitignore`라는 게 보이는데 뭐예요?**
"이 파일은 Git이 추적하지 마"라고 알려주는 파일입니다. 비밀키, 빌드 결과물, OS 시스템 파일(`.DS_Store`, `Thumbs.db`) 같은 걸 제외할 때 씁니다. 다음 강의에서 다룰 예정.

---

## 부록 B. 강사용 운영 팁

- **OS 차이를 미리 안내하세요.** Windows는 Git Bash, Mac/Linux는 Terminal. 명령어는 거의 동일하지만 경로 구분자(`/` vs `\`)와 일부 명령(`ls` vs `dir`)이 다릅니다.
- **PAT 발급 단계에서 가장 많이 막힙니다.** GitHub UI가 자주 바뀌고, 토큰 권한 선택을 어려워합니다. 강의 직전에 본인이 한 번 다시 해보고 스크린샷 갱신 권장.
- **터미널 폰트 크기를 키우세요.** 기본 크기로 시연하면 뒷자리에서 안 보입니다. 18~20pt 추천.
- **`git status`를 명령어 사이마다 반복하게 시키세요.** "뭘 했는지 확인하는 습관"이 자기주도 학습의 핵심입니다.
- **충돌 해결은 가급적 가볍게.** 입문자에게 머지 충돌은 압도적입니다. "발생할 수 있다"는 정도만 알리고, 실제 시연은 다음 협업 강의에서.
- **실시간 시연 중 오타 나도 당황 말고 그대로 보여주세요.** "에러 메시지 읽는 법"이 진짜 가르쳐야 할 스킬입니다.

---

*문서 작성: 2026-05 / 라이선스: 자유롭게 수정·재배포 가능*
