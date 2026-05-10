# PR 템플릿 예시

이 파일을 `.github/pull_request_template.md`로 저장하면  
GitHub에서 PR을 생성할 때 자동으로 본문에 채워집니다.

---

## 실무에서 쓰는 PR 템플릿 (권장)

```markdown
## Summary
<!-- 이 PR이 무엇을 하는지 간략히 설명 (1~3줄) -->
-

## Changes
<!-- 주요 변경사항을 항목으로 나열 -->
- 
- 
- 

## Type of Change
<!-- 해당하는 항목에 x를 넣으세요: [x] -->
- [ ] ✨ feat: 새로운 기능
- [ ] 🐛 fix: 버그 수정
- [ ] ♻️ refactor: 코드 개선 (기능 변화 없음)
- [ ] 📝 docs: 문서 수정
- [ ] 🎨 style: 포맷/스타일 변경 (기능 무관)
- [ ] ✅ test: 테스트 추가/수정
- [ ] 🔧 chore: 빌드/설정 변경

## Test
<!-- 어떻게 테스트했는지 체크리스트 -->
- [ ] 로컬에서 `npm run build` 성공
- [ ] 변경된 기능 수동 테스트 완료
- [ ] 기존 기능 정상 동작 확인 (회귀 테스트)
- [ ] 모바일/반응형 확인

## Screenshots
<!-- UI 변경이 있을 경우 변경 전/후 스크린샷 첨부 -->
| Before | After |
|--------|-------|
| (이전 스크린샷) | (이후 스크린샷) |

## Related Issue
<!-- 관련 이슈가 있으면 링크 -->
Closes #

## Notes for Reviewers
<!-- 리뷰어가 특별히 봐주면 좋은 부분 -->
-
```

---

## 작성 예시 (실제 PR 본문)

```markdown
## Summary
사용자 프로필 페이지에 아바타 업로드 기능을 추가했습니다.

## Changes
- `AvatarUpload.jsx` 컴포넌트 신규 추가
- 파일 크기 5MB 제한 및 이미지 타입 검증 로직 구현
- 업로드 성공 시 헤더의 아바타 이미지 즉시 갱신 (Zustand store 연동)
- 업로드 실패 시 에러 토스트 메시지 표시

## Type of Change
- [x] ✨ feat: 새로운 기능

## Test
- [x] 로컬에서 `npm run build` 성공
- [x] 5MB 이하 이미지 업로드 → 성공 확인
- [x] 5MB 초과 파일 → 에러 메시지 확인
- [x] jpg, png, webp → 정상 / exe, pdf → 거부 확인
- [x] 업로드 후 헤더 아바타 즉시 변경 확인
- [x] 모바일(375px)에서 버튼 클릭 확인

## Screenshots
| Before | After |
|--------|-------|
| 기본 회색 아바타 | 업로드한 이미지로 교체됨 |

## Related Issue
Closes #87

## Notes for Reviewers
- `useAvatarUpload.js` 커스텀 훅에서 파일 검증 로직을 집중적으로 봐주세요.
- 현재 파일을 Base64로 변환 후 API에 전송하는데, 성능상 더 좋은 방법이 있으면 의견 부탁드립니다.
```

---

## 소규모 팀용 간단 템플릿

```markdown
## 변경 내용
-

## 테스트
- [ ] 로컬 테스트 완료

## 관련 이슈
#
```

---

## 팁

- **PR 크기**: 리뷰하기 좋은 PR은 변경 파일 10개 이하, 변경 줄 수 400줄 이하
- **자주 PR**: 큰 기능을 작은 PR 여러 개로 나눠 올리면 리뷰 품질이 올라감
- **Draft PR**: 아직 완성되지 않았지만 미리 피드백을 받고 싶을 때 Draft으로 열기
- **Self-review**: PR을 올리기 전에 자신이 먼저 Files Changed 탭을 확인하는 습관
