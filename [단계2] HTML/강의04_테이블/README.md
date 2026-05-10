# 강의 04 - 테이블

> 데이터를 행과 열로 구조화하여 표로 표현하는 방법을 배웁니다.

---

## 1. 테이블이란?

HTML 테이블은 **행(row)과 열(column)로 이루어진 격자 구조**에 데이터를 정렬하여 표시합니다.  
엑셀 표를 HTML로 표현한다고 생각하면 됩니다.

> **주의**: 테이블은 **데이터 표현**을 위해 사용합니다.  
> 과거에는 테이블로 웹 페이지 레이아웃을 잡기도 했지만,  
> 현재는 CSS Flexbox/Grid를 사용하는 것이 올바른 방법입니다.

---

## 2. 기본 테이블 구조

```html
<table>
  <thead>          <!-- 테이블 머리글 영역 -->
    <tr>           <!-- 행 (table row) -->
      <th>이름</th>    <!-- 머리글 셀 (table header) -->
      <th>나이</th>
      <th>직업</th>
    </tr>
  </thead>
  <tbody>          <!-- 테이블 본문 영역 -->
    <tr>
      <td>홍길동</td>  <!-- 데이터 셀 (table data) -->
      <td>25</td>
      <td>학생</td>
    </tr>
    <tr>
      <td>김철수</td>
      <td>30</td>
      <td>개발자</td>
    </tr>
  </tbody>
  <tfoot>          <!-- 테이블 바닥글 영역 -->
    <tr>
      <td colspan="3">총 2명</td>   <!-- colspan: 여러 열을 병합 -->
    </tr>
  </tfoot>
</table>
```

---

## 3. 테이블 태그 상세 설명

### table

테이블 전체를 감싸는 최상위 태그입니다.

```html
<table border="1">  <!-- border 속성은 HTML5에서 권장하지 않음. CSS를 사용하세요 -->
```

### thead, tbody, tfoot

테이블을 세 영역으로 구분합니다:

| 태그 | 역할 | 특징 |
|------|------|------|
| `<thead>` | 머리글 행 | 주로 열 제목이 들어감 |
| `<tbody>` | 본문 데이터 행 | 실제 데이터가 들어감, 생략 가능하지만 권장 |
| `<tfoot>` | 바닥글 행 | 합계, 요약 등이 들어감 |

```html
<table>
  <thead>
    <tr>
      <th>항목</th>
      <th>금액</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>식비</td>
      <td>300,000원</td>
    </tr>
    <tr>
      <td>교통비</td>
      <td>50,000원</td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td>합계</td>
      <td>350,000원</td>
    </tr>
  </tfoot>
</table>
```

### tr - 행 (Table Row)

테이블의 한 행을 나타냅니다. `<thead>`, `<tbody>`, `<tfoot>` 안에서 사용합니다.

### th - 머리글 셀 (Table Header)

```html
<th scope="col">이름</th>    <!-- 열 제목 -->
<th scope="row">1행</th>     <!-- 행 제목 -->
```

- 기본적으로 **굵게(bold)** 표시되고 **가운데 정렬**됩니다.
- `scope` 속성으로 어느 방향의 제목인지 명시합니다 (접근성에 중요)

### td - 데이터 셀 (Table Data)

```html
<td>홍길동</td>
<td>25</td>
<td>서울</td>
```

---

## 4. 셀 병합

### colspan - 열 병합

**가로 방향**으로 여러 칸을 합칩니다.

```html
<table border="1">
  <tr>
    <th>월</th>
    <th>화</th>
    <th>수</th>
  </tr>
  <tr>
    <td>수학</td>
    <td colspan="2">영어 (2시간)</td>   <!-- 2개의 열을 병합 -->
  </tr>
</table>
```

결과:
```
┌────┬────┬────┐
│ 월 │ 화 │ 수 │
├────┼─────────┤
│수학│  영어(2)│
└────┴─────────┘
```

### rowspan - 행 병합

**세로 방향**으로 여러 칸을 합칩니다.

```html
<table border="1">
  <tr>
    <th>이름</th>
    <th>과목</th>
    <th>점수</th>
  </tr>
  <tr>
    <td rowspan="2">홍길동</td>   <!-- 2개의 행을 병합 -->
    <td>수학</td>
    <td>90</td>
  </tr>
  <tr>
    <!-- rowspan으로 병합된 셀이 이 위치를 차지하므로 td 생략 -->
    <td>영어</td>
    <td>85</td>
  </tr>
</table>
```

결과:
```
┌────────┬─────┬────┐
│  이름  │과목 │점수│
├────────┼─────┼────┤
│        │수학 │ 90 │
│홍길동  ├─────┼────┤
│        │영어 │ 85 │
└────────┴─────┴────┘
```

### colspan과 rowspan 함께 사용

```html
<table border="1">
  <tr>
    <th>구분</th>
    <th colspan="2">1학기</th>   <!-- 2열 병합 -->
    <th colspan="2">2학기</th>   <!-- 2열 병합 -->
  </tr>
  <tr>
    <th>이름</th>
    <th>중간</th>
    <th>기말</th>
    <th>중간</th>
    <th>기말</th>
  </tr>
  <tr>
    <td rowspan="2">서울반</td>  <!-- 2행 병합 -->
    <td>홍길동 90</td>
    <td>홍길동 85</td>
    <td>홍길동 88</td>
    <td>홍길동 92</td>
  </tr>
  <tr>
    <!-- rowspan으로 병합된 셀 자리 -->
    <td>김영희 95</td>
    <td>김영희 91</td>
    <td>김영희 93</td>
    <td>김영희 97</td>
  </tr>
</table>
```

---

## 5. scope 속성 (접근성)

스크린리더가 테이블을 올바르게 읽도록 `<th>` 태그에 `scope`를 지정합니다.

```html
<table>
  <thead>
    <tr>
      <th scope="col">이름</th>     <!-- 이 th는 열(col)의 제목 -->
      <th scope="col">수학</th>
      <th scope="col">영어</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th scope="row">1반</th>      <!-- 이 th는 행(row)의 제목 -->
      <td>90</td>
      <td>85</td>
    </tr>
    <tr>
      <th scope="row">2반</th>
      <td>88</td>
      <td>92</td>
    </tr>
  </tbody>
</table>
```

---

## 6. caption - 테이블 제목

```html
<table>
  <caption>2026년 1분기 판매 실적</caption>
  <!-- caption: 테이블의 제목. 테이블 바로 안에, 첫 번째로 작성 -->
  <thead>
    ...
  </thead>
</table>
```

---

## 정리

| 태그/속성 | 설명 |
|-----------|------|
| `<table>` | 테이블 전체 컨테이너 |
| `<caption>` | 테이블 제목 |
| `<thead>` | 테이블 머리글 영역 |
| `<tbody>` | 테이블 본문 영역 |
| `<tfoot>` | 테이블 바닥글 영역 |
| `<tr>` | 행 (Table Row) |
| `<th>` | 머리글 셀 (굵게, 가운데 정렬) |
| `<td>` | 데이터 셀 |
| `colspan="n"` | n개의 열 병합 (가로) |
| `rowspan="n"` | n개의 행 병합 (세로) |
| `scope="col"` | 이 th가 열의 제목임을 명시 |
| `scope="row"` | 이 th가 행의 제목임을 명시 |

---

## 다음 단계

- [예제 파일 보기](./예제/schedule.html) - 주간 수업 시간표 예제
- [과제 확인하기](./과제/과제.md) - 월간 지출 내역표 만들기
- [다음 강의: 폼](../강의05_폼/README.md)
