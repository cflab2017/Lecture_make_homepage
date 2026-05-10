# 강의 06 — DOM 조작

## 학습 목표

- `getElementById`, `querySelector`, `querySelectorAll`로 DOM 요소를 선택할 수 있다.
- `textContent`와 `innerHTML`의 차이를 이해한다.
- `createElement`, `appendChild`, `removeChild`로 요소를 동적으로 추가/삭제할 수 있다.
- `classList`의 `add`, `remove`, `toggle`, `contains`를 활용할 수 있다.
- `dataset`으로 HTML 요소에 데이터를 저장하고 읽을 수 있다.

---

## 1. 요소 선택

```javascript
// ID로 단일 요소 선택 (가장 빠름)
const title = document.getElementById('title');

// CSS 선택자로 첫 번째 요소 선택
const btn = document.querySelector('.btn');
const input = document.querySelector('input[type="text"]');
const firstItem = document.querySelector('ul li');

// CSS 선택자로 모든 일치하는 요소 선택 (NodeList 반환)
const allButtons = document.querySelectorAll('button');
const allItems = document.querySelectorAll('.item');

// NodeList 순회
allItems.forEach(item => {
  console.log(item.textContent);
});
```

---

## 2. textContent vs innerHTML

```javascript
const div = document.querySelector('#content');

// textContent: 텍스트만 다룸 (HTML 태그 무시, 보안상 안전)
div.textContent = '안녕하세요'; // 텍스트로 출력
div.textContent = '<b>굵게</b>'; // "<b>굵게</b>" 문자열 그대로 표시

// innerHTML: HTML 태그를 해석하여 렌더링
div.innerHTML = '안녕하세요';   // 텍스트로 출력
div.innerHTML = '<b>굵게</b>'; // 굵게 표시됨

// 현재 내용 읽기
console.log(div.textContent); // 순수 텍스트
console.log(div.innerHTML);   // HTML 포함 문자열
```

> **주의**: `innerHTML`에 사용자 입력값을 직접 넣으면 **XSS 공격** 위험이 있습니다.  
> 사용자 입력은 `textContent`를 사용하거나 별도로 이스케이프 처리해야 합니다.

---

## 3. 요소 생성 및 추가/삭제

```javascript
// 요소 생성
const newDiv = document.createElement('div');
newDiv.textContent = '새로 만든 요소';
newDiv.className = 'card';

// 자식으로 추가
const container = document.querySelector('#container');
container.appendChild(newDiv);    // 맨 끝에 추가
container.prepend(newDiv);        // 맨 앞에 추가
container.insertBefore(newDiv, container.firstChild); // 특정 위치 앞에 삽입

// 요소 삭제
container.removeChild(newDiv);    // 자식 요소 삭제
newDiv.remove();                  // 요소 스스로 삭제 (모던 방식)

// 부모 요소 참조
const parent = newDiv.parentElement;
```

---

## 4. classList

```javascript
const box = document.querySelector('.box');

// 클래스 추가
box.classList.add('active');
box.classList.add('highlight', 'large'); // 여러 개 동시 추가

// 클래스 제거
box.classList.remove('active');

// 클래스 토글 (있으면 제거, 없으면 추가)
box.classList.toggle('dark-mode');

// 클래스 포함 여부 확인
if (box.classList.contains('active')) {
  console.log('active 클래스가 있습니다.');
}

// 모든 클래스 목록
console.log(box.classList); // DOMTokenList
```

---

## 5. dataset

HTML 요소에 커스텀 데이터를 저장할 수 있습니다.

```html
<!-- HTML: data-* 속성으로 데이터 저장 -->
<button data-id="42" data-user-name="홍길동" data-is-admin="true">
  클릭
</button>
```

```javascript
const btn = document.querySelector('button');

// dataset으로 읽기 (kebab-case → camelCase 자동 변환)
console.log(btn.dataset.id);       // "42" (문자열)
console.log(btn.dataset.userName); // "홍길동" (user-name → userName)
console.log(btn.dataset.isAdmin);  // "true" (문자열!)

// dataset에 쓰기
btn.dataset.count = 0;
btn.dataset.lastClicked = Date.now();
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
