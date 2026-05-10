# 강의02 — 충돌 해결 (Merge Conflict)

## 학습 목표

- 충돌이 발생하는 원인을 이해한다.
- 충돌 마커(`<<<<<<<`, `=======`, `>>>>>>>`)를 읽고 해석할 수 있다.
- 충돌을 수동으로 해결하고 병합을 완료할 수 있다.
- `git rebase`와 `git merge`의 차이를 이해한다.
- `git log --graph`로 브랜치 히스토리를 시각적으로 확인한다.

---

## 1. Merge Conflict 발생 원인

**두 브랜치가 같은 파일의 같은 위치를 다르게 수정**했을 때 충돌이 발생합니다.

```
공통 조상(A):
  button { color: blue; }

main(B):                     feature(C):
  button { color: red; }       button { color: green; }

→ Git이 판단 불가 → 충돌!
```

Git이 자동으로 합칠 수 있는 경우는 병합됩니다:
- 다른 파일 수정 → 자동 병합
- 같은 파일, 다른 위치 수정 → 자동 병합
- 같은 파일, 같은 위치 다르게 수정 → **충돌!**

---

## 2. 3-way Merge 개념

```
공통 조상(Base)  ←──┐
                     ├── Git이 세 가지를 비교해 최선의 결과 도출
main의 끝(Ours)  ←──┤
feature의 끝(Theirs) ←──┘
```

- Base에서 변경된 부분을 두 브랜치에서 각각 확인
- 한 쪽만 변경했으면 그 쪽을 채택
- 둘 다 변경했으면 **충돌** → 사람이 해결

---

## 3. 충돌 마커 읽는 법

```
<<<<<<< HEAD          ← 현재 브랜치(내 코드) 시작
button { color: red; }   ← 현재 브랜치(HEAD)의 내용
=======               ← 구분선
button { color: green; } ← 병합하려는 브랜치(feature)의 내용
>>>>>>> feature/login  ← 병합하려는 브랜치 이름
```

### 해결 방법 3가지

```bash
# 방법 1: 내 것(HEAD) 선택
button { color: red; }

# 방법 2: 상대방 것(feature) 선택
button { color: green; }

# 방법 3: 두 가지 모두 포함하거나 새로 작성
button { color: blue; /* 팀 결정: 파란색으로 통일 */ }
```

---

## 4. 충돌 해결 절차

```bash
# 1. 충돌 발생 확인
git merge feature/login
# CONFLICT (content): Merge conflict in style.css
# Automatic merge failed

# 2. 충돌 파일 확인
git status
# both modified: style.css   ← 충돌 파일

# 3. 충돌 파일 열어서 마커 제거 + 원하는 내용으로 편집
# (에디터에서 직접 수정)

# 4. 해결 후 스테이징
git add style.css

# 5. 병합 커밋 생성
git commit
# (에디터가 열리면 기본 메시지 그대로 저장 OK)

# ── 중간에 병합을 취소하고 싶을 때 ──
git merge --abort   # 충돌 해결 전에만 가능
```

---

## 5. git rebase vs git merge

### merge — 병합 커밋으로 합치기

```
Before:  A---B---C (main)
               \
                D---E (feature)

After (merge):
         A---B---C---M (main, M: 병합 커밋)
               \   /
                D-E
```

**장점**: 브랜치 히스토리가 정직하게 보존됨  
**단점**: 병합 커밋이 많아지면 `git log`가 복잡해짐

### rebase — 히스토리를 선형으로 재작성

```
Before:  A---B---C (main)
               \
                D---E (feature)

After (rebase feature onto main):
         A---B---C---D'---E' (feature가 C 뒤에 붙음)

After (fast-forward merge):
         A---B---C---D'---E' (main)
```

```bash
# feature 브랜치에서 main 기준으로 rebase
git switch feature/login
git rebase main        # feature의 커밋들을 main 최신 커밋 위에 재적용

# rebase 후 main에서 fast-forward merge
git switch main
git merge feature/login   # 이제 Fast-forward!
```

**장점**: 히스토리가 깔끔한 선형 구조  
**단점**: 커밋 해시가 바뀜 (공유된 브랜치에선 위험!)

> **규칙**: `git rebase`는 혼자 사용하는 로컬 브랜치에만 사용하세요.  
> 팀원과 공유된 브랜치를 rebase하면 다른 팀원의 히스토리가 엉킵니다.

---

## 6. git log --graph로 히스토리 시각화

```bash
# 모든 브랜치의 히스토리를 그래프로 표시
git log --oneline --graph --all

# 예시 출력:
# *   abc1234 (HEAD -> main) Merge branch 'feature/login'
# |\
# | * def5678 (feature/login) feat: 로그인 검증 추가
# | * ghi9012 feat: 로그인 페이지 추가
# * | jkl3456 feat: 소개 페이지 추가
# |/
# * mno7890 init: 프로젝트 초기화
```

---

## 핵심 정리

- 충돌은 **오류가 아니라 정상적인 현상**이다 — 수동으로 해결하면 된다.
- `<<<<<<< HEAD / ======= / >>>>>>>` 마커를 찾아 제거하고 원하는 내용으로 교체한다.
- 해결 후 `git add` → `git commit` 순서를 따른다.
- `merge`는 히스토리 보존, `rebase`는 선형 히스토리 — 공유 브랜치엔 rebase 금지.
