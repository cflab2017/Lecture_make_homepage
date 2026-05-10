# 강의04 — Git 심화

## 학습 목표

- `git stash`로 작업을 임시 저장하고 복원할 수 있다.
- `git reset`의 세 가지 모드(`--soft`, `--mixed`, `--hard`)를 구분해 사용한다.
- `git revert`로 공개된 커밋을 안전하게 되돌린다.
- `git cherry-pick`으로 특정 커밋만 가져올 수 있다.
- `git tag`로 버전을 표시한다.
- `git reflog`로 잃어버린 커밋을 복구한다.

---

## 1. git stash — 임시 저장

작업 도중 갑자기 다른 브랜치로 이동해야 할 때, 커밋하기엔 아직 이른 변경사항을 임시 저장합니다.

```bash
# 현재 작업 중인 변경사항 임시 저장
git stash
# 또는 메시지 포함
git stash push -m "로그인 폼 절반 완성"

# 저장된 stash 목록 확인
git stash list
# stash@{0}: On main: 로그인 폼 절반 완성
# stash@{1}: WIP on feature/login: abc1234 이전 커밋

# 가장 최근 stash 복원 + 목록에서 제거
git stash pop

# 특정 stash 복원 (목록에 유지)
git stash apply stash@{1}

# 특정 stash 삭제
git stash drop stash@{0}

# 모든 stash 삭제
git stash clear
```

### 언제 사용?

```bash
# 시나리오: feature 브랜치에서 작업 중 긴급 수정 요청
git switch feature/login
# ... 작업 중 ...

# 긴급 수정 요청! 커밋하기엔 미완성이라 stash로 임시 저장
git stash push -m "로그인 폼 작업 중"

git switch main
git switch -c hotfix/button-bug
# 긴급 수정 후 커밋 + 병합

# 다시 feature로 돌아와서 작업 복원
git switch feature/login
git stash pop   # 임시 저장했던 내용 복원
```

---

## 2. git reset — 커밋 되돌리기 (로컬 전용)

### --soft: 커밋만 취소, 변경사항은 스테이징 상태로 유지

```bash
git reset --soft HEAD~1   # 가장 최근 커밋 1개 취소
# 커밋이 사라지고 변경사항은 git add된 상태로 남음
# 커밋 메시지를 바꾸고 싶을 때 유용
```

### --mixed: 커밋 취소 + 스테이징 해제 (기본값)

```bash
git reset HEAD~1          # --mixed가 기본값
git reset --mixed HEAD~1  # 동일
# 커밋이 사라지고 변경사항은 unstaged 상태로 남음
# 실수로 git add한 파일을 되돌릴 때도 사용
```

### --hard: 커밋 취소 + 변경사항 완전 삭제 ⚠️

```bash
git reset --hard HEAD~1
# 커밋이 사라지고 변경사항도 모두 제거됨 (파일 복구 어려움!)
# 완전히 버리고 싶을 때만 사용
```

| 옵션 | 커밋 | 스테이징 | 작업 디렉토리 |
|------|------|---------|-------------|
| `--soft` | 취소 | 유지 | 유지 |
| `--mixed` | 취소 | 취소 | 유지 |
| `--hard` | 취소 | 취소 | 취소 |

> ⚠️ `git reset`은 **로컬에서만** 사용하세요. 이미 push된 커밋을 reset하면 팀원의 히스토리와 충돌합니다.

---

## 3. git revert — 공개 커밋 안전하게 되돌리기

push된 커밋을 되돌려야 할 때 `reset` 대신 `revert`를 사용합니다.  
`revert`는 커밋을 삭제하는 게 아니라 **"되돌리는 새 커밋"을 추가**합니다.

```bash
# 특정 커밋을 되돌리는 새 커밋 생성
git revert abc1234        # 커밋 해시 지정
git revert HEAD           # 가장 최근 커밋 되돌리기

# 여러 커밋을 한 번에 되돌리기
git revert HEAD~3..HEAD   # 최근 3개 커밋 순서대로 revert

# 커밋하지 않고 변경사항만 적용 (나중에 직접 커밋)
git revert --no-commit HEAD
```

### reset vs revert

| | reset | revert |
|--|-------|--------|
| 동작 | 커밋 삭제 | 새 "되돌리기 커밋" 추가 |
| 히스토리 | 변경됨 | 보존됨 |
| 안전성 | 로컬 전용 | push된 커밋에도 안전 |
| 팀 작업 | 위험 | 권장 |

---

## 4. git cherry-pick — 특정 커밋만 가져오기

다른 브랜치의 특정 커밋만 현재 브랜치에 적용합니다.

```bash
# 다른 브랜치의 특정 커밋 해시 가져오기
git cherry-pick abc1234

# 여러 커밋 가져오기
git cherry-pick abc1234 def5678

# 범위로 가져오기 (abc1234 제외, def5678 포함)
git cherry-pick abc1234..def5678

# 충돌 발생 시: 해결 후
git add .
git cherry-pick --continue

# 중단하려면
git cherry-pick --abort
```

### 언제 사용?

```bash
# 시나리오: feature 브랜치에서 만든 버그 수정 커밋을 main에도 적용
git log feature/login --oneline
# fix9999 fix: 이메일 검증 버그 수정  ← 이것만 main에 적용하고 싶음
# wip1111 WIP: 로그인 UI 작업 중

git switch main
git cherry-pick fix9999   # 해당 커밋만 main에 적용
```

---

## 5. git tag — 버전 표시

특정 커밋에 버전 이름을 붙입니다.

```bash
# 경량 태그 (단순 포인터)
git tag v1.0.0

# 주석 태그 (권장 — 작성자, 날짜, 메시지 포함)
git tag -a v1.0.0 -m "첫 번째 정식 릴리즈"

# 특정 커밋에 태그 달기
git tag -a v0.9.0 abc1234 -m "베타 릴리즈"

# 태그 목록 확인
git tag
git tag -l "v1.*"   # 패턴 필터링

# 태그 상세 정보
git show v1.0.0

# 태그를 원격에 push (push는 태그를 자동으로 올리지 않음)
git push origin v1.0.0
git push origin --tags    # 모든 태그 push

# 태그 삭제
git tag -d v1.0.0          # 로컬
git push origin :v1.0.0    # 원격
```

---

## 6. git reflog — 위험한 상황 복구

`git reflog`는 HEAD의 이동 이력을 모두 기록합니다.  
`reset --hard`로 삭제한 커밋도 reflog를 통해 복구할 수 있습니다!

```bash
# HEAD가 이동한 모든 이력 확인
git reflog
# abc1234 HEAD@{0}: reset: moving to HEAD~3   ← 잘못된 reset!
# def5678 HEAD@{1}: commit: feat: 중요한 기능 추가
# ...

# reflog에서 복구하고 싶은 시점의 해시 또는 HEAD@{N}으로 이동
git reset --hard HEAD@{1}       # 방금 전 상태로 복구
git reset --hard def5678        # 해시로 복구
```

> **git reflog는 로컬에만 있습니다.** 저장소를 삭제하거나 `gc`가 실행되면 사라질 수 있습니다.

---

## 핵심 정리

| 명령어 | 사용 시점 |
|--------|----------|
| `git stash` | 커밋 전 임시 저장 (브랜치 이동 전) |
| `git reset --soft` | 커밋 메시지 수정, 커밋 합치기 |
| `git reset --mixed` | 실수로 스테이징한 파일 되돌리기 |
| `git reset --hard` | 완전히 버리고 싶은 변경사항 |
| `git revert` | 공개된(push된) 커밋 안전하게 되돌리기 |
| `git cherry-pick` | 특정 커밋만 다른 브랜치에 적용 |
| `git tag` | 릴리즈 버전 표시 |
| `git reflog` | 실수로 reset한 커밋 복구 |
