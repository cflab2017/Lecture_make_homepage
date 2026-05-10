# 강의03 — GitHub Pull Request 리뷰

## 학습 목표

- Pull Request의 개념과 팀 협업에서의 역할을 이해한다.
- 좋은 PR을 작성하는 요령을 익힌다.
- 리뷰 요청, 코멘트, approve, request changes를 처리할 수 있다.
- squash merge와 merge commit의 차이를 이해한다.
- PR 템플릿을 만들어 팀 전체가 일관된 PR을 작성하게 한다.

---

## 1. Pull Request란?

**Pull Request(PR)**는 브랜치의 변경사항을 다른 브랜치로 병합하기 전에  
**팀원에게 리뷰를 요청하는 GitHub 기능**입니다.

```
1. 개발자가 feature 브랜치에서 작업
2. GitHub에 push
3. PR 생성 — "이 변경사항을 main에 병합해주세요"
4. 팀원이 코드 리뷰
5. 승인(approve) 후 병합(merge)
```

**PR의 이점:**
- 코드 품질 검증 (버그 사전 발견)
- 지식 공유 (다른 팀원이 변경사항 파악)
- 히스토리 추적 (왜 이렇게 변경했는지 문서화)

---

## 2. PR 작성 요령

### 좋은 PR 제목

```
# ✅ 좋은 예
feat: 로그인 페이지 UI 구현
fix: 모바일에서 네비게이션 버튼 클릭 안 되는 문제 수정
refactor: UserCard 컴포넌트 단일 책임 원칙 적용

# ❌ 나쁜 예
수정함
작업완료
fix
```

### PR 본문 구성

```markdown
## 변경 내용 (What)
- 로그인 페이지 HTML/CSS 추가
- 이메일 형식 검증 로직 구현
- "비밀번호 찾기" 링크 추가

## 변경 이유 (Why)
기존에 로그인 기능이 없어 모든 사용자가 관리자 페이지에 접근 가능했음

## 스크린샷
![로그인 페이지](screenshot.png)

## 테스트 방법
1. `npm start`로 앱 실행
2. `/login`으로 이동
3. 잘못된 이메일 형식 입력 시 오류 메시지 확인
4. 올바른 정보 입력 시 `/dashboard`로 이동 확인

## 관련 이슈
Closes #42
```

---

## 3. 리뷰 요청 및 처리

### 리뷰어 지정

GitHub PR 페이지 우측의 "Reviewers" 섹션에서 팀원 지정

### 리뷰 타입

| 타입 | 설명 |
|------|------|
| **Comment** | 일반 의견 — 병합을 막지 않음 |
| **Approve** | 변경사항 승인 — 병합 가능 |
| **Request Changes** | 수정 요청 — 해결 전까지 병합 불가 |

### 리뷰 코멘트 작성 방법

```
# ✅ 좋은 리뷰 코멘트
"이 함수가 null을 반환할 수 있는데, 호출 지점에서 처리가 없네요.
Optional chaining(`user?.name`)을 사용하거나 기본값을 지정하면 어떨까요?"

"성능 개선 제안: map 안에서 filter를 호출하고 있는데,
reduce 하나로 합치면 O(n)으로 줄일 수 있어요."

# ❌ 나쁜 리뷰 코멘트
"이거 왜 이렇게 했어요?"
"코드 이상함"
```

---

## 4. squash merge vs merge commit

### merge commit (기본)

```
feature 브랜치의 모든 커밋이 main에 그대로 추가됨

main: A --- B --- M (병합 커밋)
                /
feature: C - D - E
```

### squash merge

```
feature 브랜치의 모든 커밋을 하나로 합쳐서 main에 추가

main: A --- B --- S (스쿼시 커밋 — C+D+E 내용이 하나로)
```

```bash
# 로컬에서 squash merge
git merge --squash feature/login
git commit -m "feat: 로그인 기능 구현 (#PR번호)"
```

**언제 사용?**
- `merge commit`: 각 커밋이 의미 있고, 기여자별 히스토리 보존이 중요할 때
- `squash merge`: WIP 커밋이 많아 히스토리를 깔끔하게 유지하고 싶을 때

---

## 5. PR 템플릿 (.github/pull_request_template.md)

저장소 루트에 `.github/pull_request_template.md` 파일을 만들면  
PR 생성 시 자동으로 이 내용이 본문에 채워집니다.

```markdown
## Summary
<!-- 변경 내용을 간략히 설명해주세요 -->
-
-

## Type of Change
- [ ] 새 기능 (feat)
- [ ] 버그 수정 (fix)
- [ ] 리팩토링 (refactor)
- [ ] 문서 수정 (docs)

## Test
<!-- 어떻게 테스트했는지 설명해주세요 -->
- [ ] 로컬에서 빌드 성공
- [ ] 관련 기능 수동 테스트

## Screenshots
<!-- 변경 전/후 스크린샷 (UI 변경 시) -->

## Related Issue
<!-- 관련 이슈 번호 (예: Closes #42) -->
```

---

## PR 관련 GitHub 단축키

| 단축키 | 기능 |
|--------|------|
| `Ctrl+Enter` | 코멘트 제출 |
| `r` | Reply to comment |
| `p` | Permalink to comment |

---

## 핵심 정리

- PR은 코드 리뷰의 공식 채널 — 작게, 자주, 명확하게 작성한다.
- 좋은 PR 제목은 `타입: 무엇을 했는지` 형태로 쓴다.
- Request Changes가 있으면 해결 후 Re-request review를 요청한다.
- squash merge로 WIP 커밋을 정리해 main 히스토리를 깔끔하게 유지한다.
- PR 템플릿으로 팀 전체가 일관된 품질의 PR을 작성하게 한다.
