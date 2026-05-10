# Lighthouse 접근성 점수 측정 가이드

## 1. Lighthouse 실행 방법

### Chrome DevTools에서 실행

```
1. 측정할 웹페이지를 Chrome에서 열기
2. F12 (또는 마우스 우클릭 → 검사)로 DevTools 열기
3. 상단 탭에서 "Lighthouse" 클릭
   (탭이 보이지 않으면 >> 버튼 클릭)
4. 체크박스에서 "Accessibility" 선택
5. "Analyze page load" 버튼 클릭
6. 10~30초 후 결과 확인
```

### 점수 해석

| 점수 | 등급 | 의미 |
|------|------|------|
| 90~100 | 녹색 | 접근성 우수 |
| 50~89 | 주황 | 개선 필요 |
| 0~49 | 빨강 | 심각한 문제 |

---

## 2. 주요 검사 항목

### 이미지

| 항목 | 확인 방법 |
|------|-----------|
| 모든 `<img>`에 `alt` 속성 | Lighthouse가 자동 감지 |
| 장식용 이미지는 `alt=""` | 직접 확인 필요 |
| 복잡한 이미지는 설명 텍스트 | 직접 확인 필요 |

### 폼

| 항목 | 확인 방법 |
|------|-----------|
| 모든 입력 필드에 `<label>` 연결 | Lighthouse 자동 감지 |
| 에러 메시지가 명확함 | 직접 확인 |
| 필수 필드 표시 | 직접 확인 |

### 색상 대비

```
일반 텍스트: 최소 4.5:1 대비율
큰 텍스트(18pt 이상): 최소 3:1
비텍스트 요소: 최소 3:1
```

대비율 확인 도구:
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- Chrome DevTools → Elements → 색상 클릭

### 키보드 접근성

```
Tab 키로 페이지의 모든 인터랙티브 요소에 접근 가능한지 확인:
- 링크
- 버튼
- 폼 입력 요소
- 모달, 드롭다운 등
```

---

## 3. 결과 보고서 읽기

### Passed Audits (통과)

녹색으로 표시되며 접근성 기준을 충족한 항목입니다.

### Opportunities & Diagnostics (개선 항목)

각 항목을 클릭하면:
- 어떤 요소가 문제인지
- 왜 문제인지
- 어떻게 고쳐야 하는지

설명이 나옵니다.

---

## 4. 빠른 수정 우선순위

```
1순위: 이미지 alt 텍스트 누락
2순위: 폼 레이블 누락
3순위: 색상 대비 부족
4순위: 키보드 포커스 표시 제거
5순위: 언어 속성 누락 (<html lang="ko">)
```

---

## 5. 자동화 테스트 (CI/CD)

```bash
# Lighthouse CLI 설치
npm install -g lighthouse

# CLI로 실행
lighthouse https://example.com --only-categories=accessibility --output=json

# 점수 기준 이하면 실패로 처리 (CI 파이프라인에서 활용)
```
