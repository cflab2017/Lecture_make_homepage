# 강의 04 — 클래스

## 1. 클래스 선언과 constructor

```ts
class Person {
  name: string;
  age: number;

  constructor(name: string, age: number) {
    this.name = name;
    this.age = age;
  }

  greet(): string {
    return `안녕하세요, 저는 ${this.name}입니다.`;
  }
}

const person = new Person('홍길동', 30);
console.log(person.greet());
```

### 매개변수 프로퍼티 (축약 표현)

```ts
class Person {
  // constructor 매개변수에 접근 제어자를 붙이면 자동으로 프로퍼티 선언 + 할당
  constructor(
    public name: string,
    private age: number,
  ) {}
}
```

---

## 2. 접근 제어자

| 제어자 | 접근 범위 |
|--------|-----------|
| `public` | 어디서나 접근 가능 (기본값) |
| `private` | 클래스 내부에서만 접근 가능 |
| `protected` | 클래스 내부 + 자식 클래스에서 접근 가능 |
| `readonly` | 읽기만 가능 (초기화 후 변경 불가) |

```ts
class BankAccount {
  private balance: number;     // 외부에서 직접 접근 불가
  readonly accountId: string;  // 변경 불가

  constructor(initialBalance: number) {
    this.balance = initialBalance;
    this.accountId = `ACC-${Date.now()}`;
  }

  // getter — private 필드를 안전하게 읽기
  getBalance(): number {
    return this.balance;
  }

  deposit(amount: number): void {
    if (amount <= 0) throw new Error('금액은 양수여야 합니다.');
    this.balance += amount;
  }
}
```

---

## 3. 상속 (extends)

```ts
class Animal {
  constructor(public name: string) {}

  speak(): string {
    return `${this.name}이(가) 소리를 냅니다.`;
  }
}

class Dog extends Animal {
  constructor(name: string, public breed: string) {
    super(name); // 반드시 부모 constructor 호출
  }

  // 부모 메서드 오버라이드
  speak(): string {
    return `${this.name}이(가) 멍멍 짖습니다!`;
  }

  fetch(): string {
    return `${this.name}이(가) 공을 가져옵니다.`;
  }
}
```

---

## 4. 추상 클래스 (abstract)

직접 인스턴스를 만들 수 없고, 반드시 상속해서 추상 메서드를 구현해야 합니다.

```ts
abstract class Shape {
  abstract area(): number;       // 자식 클래스가 반드시 구현
  abstract perimeter(): number;  // 자식 클래스가 반드시 구현

  describe(): string {
    return `넓이: ${this.area()}, 둘레: ${this.perimeter()}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }

  perimeter(): number {
    return 2 * Math.PI * this.radius;
  }
}

// const shape = new Shape(); // 오류: 추상 클래스는 인스턴스화 불가
const circle = new Circle(5);
console.log(circle.describe());
```

---

## 5. 인터페이스 구현 (implements)

```ts
interface Flyable {
  fly(): string;
  maxAltitude: number;
}

interface Swimmable {
  swim(): string;
}

// 여러 인터페이스 동시 구현 가능
class Duck implements Flyable, Swimmable {
  maxAltitude = 100;

  fly(): string {
    return '오리가 납니다!';
  }

  swim(): string {
    return '오리가 헤엄칩니다!';
  }
}
```

---

## 학습 포인트 정리

| 개념 | 설명 |
|------|------|
| `class` | 객체 설계도 |
| `constructor` | 객체 초기화 메서드 |
| `public/private/protected` | 접근 제어자 |
| `readonly` | 변경 불가 프로퍼티 |
| `extends` | 클래스 상속 |
| `super()` | 부모 constructor 호출 |
| `abstract` | 직접 인스턴스화 불가한 추상 클래스/메서드 |
| `implements` | 인터페이스 구현 |
