# 강의 07 — 이벤트

## 학습 목표

- `addEventListener`로 이벤트를 등록할 수 있다.
- 다양한 이벤트 종류를 상황에 맞게 사용할 수 있다.
- `event` 객체의 `target`, `key`, `preventDefault`를 활용할 수 있다.
- 이벤트 버블링의 개념을 이해한다.
- 이벤트 위임 패턴을 구현할 수 있다.

---

## 1. addEventListener

```javascript
// 기본 문법
element.addEventListener('이벤트종류', 핸들러함수);

const btn = document.querySelector('#myBtn');

// 함수 표현식
btn.addEventListener('click', function(event) {
  console.log('클릭됨!', event);
});

// 화살표 함수
btn.addEventListener('click', (event) => {
  console.log('클릭됨!', event.target);
});

// 이벤트 제거
function handleClick() { console.log('클릭'); }
btn.addEventListener('click', handleClick);
btn.removeEventListener('click', handleClick);
```

---

## 2. 자주 쓰는 이벤트 종류

| 이벤트 | 발생 시점 | 주로 사용하는 요소 |
|--------|-----------|-----------------|
| `click` | 마우스 클릭 | 버튼, 링크, 카드 |
| `input` | 값이 변경될 때 (실시간) | input, textarea |
| `change` | 값 변경 후 포커스 이탈 | select, checkbox |
| `submit` | 폼 제출 | form |
| `keydown` | 키를 누를 때 | input, document |
| `keyup` | 키를 뗄 때 | input |
| `mouseover` | 마우스가 요소 위에 올라갈 때 | 모든 요소 |
| `mouseout` | 마우스가 요소 밖으로 나갈 때 | 모든 요소 |
| `focus` | 요소가 포커스를 받을 때 | input |
| `blur` | 요소가 포커스를 잃을 때 | input |
| `load` | 페이지/이미지 로드 완료 | window, img |
| `DOMContentLoaded` | DOM 준비 완료 | document |

---

## 3. event 객체

이벤트 핸들러는 `event` 객체를 자동으로 받습니다.

```javascript
document.addEventListener('keydown', function(event) {
  console.log(event.key);       // 눌린 키 ("Enter", "a", "ArrowUp" 등)
  console.log(event.code);      // 키 코드 ("KeyA", "Enter", "Space")
  console.log(event.ctrlKey);   // Ctrl 키 눌림 여부 (true/false)
  console.log(event.shiftKey);  // Shift 키 눌림 여부
});

document.querySelector('form').addEventListener('submit', function(event) {
  event.preventDefault(); // 폼 기본 동작(페이지 이동) 방지
  console.log('폼 제출 처리');
});

document.querySelector('a').addEventListener('click', function(event) {
  event.preventDefault(); // 링크 이동 방지
});

btn.addEventListener('click', function(event) {
  console.log(event.target);          // 실제 클릭된 요소
  console.log(event.currentTarget);   // 이벤트가 등록된 요소
  console.log(event.clientX, event.clientY); // 마우스 좌표
});
```

---

## 4. 이벤트 버블링 (Event Bubbling)

이벤트는 발생한 요소에서 시작하여 부모 요소로 전파됩니다.

```html
<div id="outer">
  <div id="inner">
    <button id="btn">클릭</button>
  </div>
</div>
```

```javascript
document.getElementById('btn').addEventListener('click', () => console.log('버튼'));
document.getElementById('inner').addEventListener('click', () => console.log('inner'));
document.getElementById('outer').addEventListener('click', () => console.log('outer'));

// 버튼 클릭 시 출력 순서:
// "버튼" → "inner" → "outer"

// 버블링 중단
document.getElementById('btn').addEventListener('click', (e) => {
  e.stopPropagation(); // 부모로 전파 중단
  console.log('버튼만 처리');
});
```

---

## 5. 이벤트 위임 (Event Delegation)

부모 요소에 이벤트를 등록하여 자식 요소들의 이벤트를 처리하는 패턴입니다.  
동적으로 추가된 요소에도 자동으로 적용됩니다.

```javascript
// 비효율적인 방법: 각 버튼마다 이벤트 등록
const buttons = document.querySelectorAll('.item-btn');
buttons.forEach(btn => {
  btn.addEventListener('click', handleClick);
});

// 효율적인 방법: 부모에 이벤트 위임
const list = document.querySelector('#list');
list.addEventListener('click', function(event) {
  // event.target으로 실제 클릭된 요소 확인
  if (event.target.classList.contains('item-btn')) {
    const itemId = event.target.dataset.id;
    console.log(`아이템 ${itemId} 클릭됨`);
  }

  if (event.target.classList.contains('delete-btn')) {
    event.target.closest('.item').remove();
  }
});
```

---

## 실습 파일

- [예제 보기](./예제/index.html)
- [과제 확인](./과제/과제.md)
- [과제 정답](./과제정답/index.html)
