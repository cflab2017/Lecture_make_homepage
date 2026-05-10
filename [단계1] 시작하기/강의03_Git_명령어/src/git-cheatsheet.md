# Git 명령어 치트시트

강의3에서 다룬 명령어를 한 장에 모았습니다. 출력해서 책상에 붙여두세요.

---

## 초기 설정 (한 번만)

```bash
git config --global user.name "이름"
git config --global user.email "이메일"
git config --global --list           # 설정 확인
```

## 저장소 가져오기

```bash
git clone <URL>                      # GitHub 저장소를 내 컴퓨터로 복사
```

## 핵심 4명령 (매일 사용)

```bash
git status                           # 현재 변경 상태 확인
git add <파일>                        # 특정 파일을 커밋 대상으로
git add .                            # 모든 변경 파일을 커밋 대상으로
git commit -m "메시지"                # 세이브 포인트 만들기
git push                             # GitHub에 올리기
```

## 가져오기 / 동기화

```bash
git pull                             # GitHub의 최신 변경사항 가져오기
git fetch                            # 가져오기만 (병합 X)
```

## 이력 보기

```bash
git log                              # 커밋 목록 (자세히)
git log --oneline                    # 커밋 목록 (한 줄씩)
git log --oneline --graph            # 그래프 형태로
git diff                             # 변경 내용 (add 전)
git diff --staged                    # 변경 내용 (add 후)
git show <커밋ID>                     # 특정 커밋 자세히 보기
```

## 되돌리기

```bash
git restore <파일>                    # 파일의 변경을 버림
git restore --staged <파일>           # add 취소 (변경은 유지)
git commit --amend -m "새 메시지"      # 마지막 커밋 메시지 수정 (push 전에만)
```

## 파일 상태 흐름

```
[작업 디렉토리]    git add    [스테이징 영역]    git commit    [로컬 저장소]    git push    [GitHub]
   파일 수정      ────────>     커밋 대기      ──────────>    커밋 완료    ────────>    원격 반영
                                                                           git pull
                                                                          <────────
```

---

## 자주 만나는 메시지 해석

| 메시지 | 뜻 | 대처 |
|---|---|---|
| `nothing to commit, working tree clean` | 변경된 게 없음 | 정상 |
| `Untracked files` | Git이 모르는 새 파일 | `git add`로 추가 |
| `Changes not staged for commit` | 수정됐지만 add 안 함 | `git add` |
| `Changes to be committed` | add 된 상태 | `git commit` |
| `! [rejected] ... (fetch first)` | 원격에 새 변경 있음 | `git pull` 후 `git push` |
| `CONFLICT (content): ...` | 머지 충돌 | 파일 직접 편집 후 `git add` → `git commit` |

---

## 마법의 한 줄 (막힐 때)

```bash
git status
```

**뭐든 막히면 일단 이거부터.** Git이 친절하게 다음에 뭘 할지 알려줍니다.
