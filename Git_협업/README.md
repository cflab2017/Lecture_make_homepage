# Git 협업 과목

## 과목 소개

혼자 쓰는 Git에서 팀 협업 Git으로 나아가는 과목입니다.  
브랜치 전략, 충돌 해결, PR(Pull Request) 리뷰, Git 심화 명령어까지 실무에서 바로 쓸 수 있는 내용을 다룹니다.

## 선수 조건

- **시작하기 모듈 강의03 완료** (Git 기초)
- `git init`, `git add`, `git commit`, `git push` 기본 명령어 사용 경험

## 강의 목록

| 강의 | 주제 | 핵심 명령어 |
|------|------|------------|
| 강의01 | 브랜치 전략 | `git branch`, `git switch`, `git merge` |
| 강의02 | 충돌 해결 | merge conflict, `git rebase` |
| 강의03 | GitHub PR 리뷰 | Pull Request, Review, squash merge |
| 강의04 | Git 심화 | `git stash`, `git reset`, `git revert`, `git cherry-pick`, `git tag` |

## 학습 환경 준비

```bash
# Git 버전 확인 (2.28 이상 권장)
git --version

# 사용자 설정 (최초 1회)
git config --global user.name "홍길동"
git config --global user.email "hong@example.com"

# 기본 브랜치명을 main으로 설정
git config --global init.defaultBranch main

# VS Code를 Git 에디터로 설정
git config --global core.editor "code --wait"
```

## 실습 원칙

- 모든 예제는 직접 명령어를 입력해가며 따라해야 합니다.
- 실수는 배움의 기회입니다. `git reflog`로 거의 모든 것을 되돌릴 수 있습니다.
- `git log --oneline --graph --all`으로 브랜치 구조를 자주 확인하세요.
