# 강의01 — 브랜치 전략

## 학습 목표

- 브랜치가 무엇인지, 왜 사용하는지 이해한다.
- `git branch`, `git switch`, `git checkout` 명령어를 사용할 수 있다.
- HEAD의 개념을 이해한다.
- Fast-forward merge와 3-way merge의 차이를 안다.
- Feature 브랜치 워크플로와 GitHub Flow를 설명할 수 있다.

---

## 1. 브랜치(Branch)란?

브랜치는 **커밋의 포인터(가지)**입니다.  
독립적인 작업 흐름을 만들어 메인 코드에 영향 없이 개발할 수 있습니다.

```
main:    A --- B --- C
                      \
feature/login:         D --- E
```

`feature/login` 브랜치에서 D, E 커밋을 만들어도 `main` 브랜치는 C에 그대로 있습니다.

---

## 2. 브랜치 기본 명령어

```bash
# 현재 브랜치 목록 확인
git branch

# 원격 포함 모든 브랜치 확인
git branch -a

# 새 브랜치 생성
git branch feature/login

# 브랜치 이동 (현대적 방법 — Git 2.23+)
git switch feature/login

# 브랜치 생성 + 이동 (한 번에)
git switch -c feature/login

# 구버전 방식 (여전히 많이 쓰임)
git checkout feature/login
git checkout -b feature/login  # 생성 + 이동

# 브랜치 삭제 (병합된 브랜치만)
git branch -d feature/login

# 강제 삭제 (병합 안 됐어도)
git branch -D feature/login
```

---

## 3. HEAD란?

**HEAD**는 현재 체크아웃한 브랜치(또는 커밋)를 가리키는 포인터입니다.

```bash
# HEAD가 어디를 가리키는지 확인
cat .git/HEAD
# 출력: ref: refs/heads/main  (main 브랜치를 가리킴)

# 브랜치 이동 시 HEAD도 함께 이동
git switch feature/login
cat .git/HEAD
# 출력: ref: refs/heads/feature/login
```

---

## 4. Fast-forward Merge

`feature` 브랜치가 `main`보다 앞에 있고, `main`에 추가 커밋이 없을 때 발생합니다.  
단순히 포인터를 앞으로 이동합니다 (새 커밋 없음).

```
병합 전:
main:      A --- B
                  \
feature:           C --- D

병합 후 (Fast-forward):
main:      A --- B --- C --- D
feature:   (삭제)
```

```bash
git switch main
git merge feature/login       # Fast-forward merge
git branch -d feature/login   # 병합 후 브랜치 삭제
```

---

## 5. 3-way Merge

`main`과 `feature` 두 브랜치 모두에 새 커밋이 있을 때 발생합니다.  
두 브랜치의 공통 조상과 두 브랜치 끝을 비교해 **병합 커밋**을 만듭니다.

```
병합 전:
main:    A --- B --- C
                \
feature:         D --- E

병합 후 (3-way merge):
main:    A --- B --- C ------- M (병합 커밋)
                \           /
feature:         D --- E ---
```

```bash
git switch main
git merge feature/login    # 3-way merge → 에디터에서 커밋 메시지 입력
```

---

## 6. Feature 브랜치 워크플로

```
1. main에서 feature 브랜치 생성
2. feature 브랜치에서 작업 (여러 커밋)
3. main에 병합
4. feature 브랜치 삭제
```

```bash
git switch main
git switch -c feature/login    # 1. 브랜치 생성

# 2. 작업 후 커밋
echo "login.js" > login.js
git add login.js
git commit -m "feat: 로그인 기능 추가"

# 3. main에 병합
git switch main
git merge feature/login

# 4. 브랜치 삭제
git branch -d feature/login
```

---

## 7. GitHub Flow

GitHub Flow는 **단순하고 빠른** 브랜치 전략입니다.

```
main (항상 배포 가능한 상태)
  ↓ switch -c
feature/기능명
  ↓ 작업 + 커밋
  ↓ push
  ↓ Pull Request
  ↓ 코드 리뷰
  ↓ merge → main
  ↓ 배포
```

**규칙:**
- `main`은 항상 배포 가능한 상태를 유지한다.
- 새 작업은 무조건 브랜치에서 한다.
- 코드 리뷰(PR)를 거쳐야만 main에 병합한다.

---

## 유용한 로그 명령어

```bash
# 그래프로 브랜치 구조 확인 (자주 사용!)
git log --oneline --graph --all

# 한 줄씩 간략히 보기
git log --oneline

# 특정 브랜치의 로그
git log feature/login --oneline
```

---

## 핵심 정리

- 브랜치는 독립적인 작업 공간이다.
- `git switch -c 브랜치명`으로 생성 + 이동을 한 번에 한다.
- Fast-forward: 포인터 이동만 / 3-way merge: 병합 커밋 생성.
- Feature 브랜치 → PR → 리뷰 → merge 순서를 지킨다.
