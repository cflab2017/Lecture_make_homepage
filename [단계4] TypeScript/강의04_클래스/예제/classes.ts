// ===================================================
// 강의 04 예제 — Animal 상속 + BankAccount
// 컴파일: tsc classes.ts
// 실행:   node classes.js
// ===================================================

// ============================================================
// Part 1: Animal → Dog / Cat 상속 예제
// ============================================================

// 추상 기반 클래스 — 직접 인스턴스화 불가
abstract class Animal {
  // 매개변수 프로퍼티 축약 표현: public → 자동으로 프로퍼티 선언 + 할당
  constructor(
    public readonly name: string, // readonly: 이름 변경 불가
    protected age: number,        // protected: 자식 클래스에서 접근 가능
  ) {}

  // 추상 메서드: 자식 클래스에서 반드시 구현
  abstract speak(): string;

  // 공통 메서드 — 모든 동물이 공유
  getInfo(): string {
    return `이름: ${this.name}, 나이: ${this.age}살`;
  }

  // getter — protected 필드를 외부에서 읽기
  getAge(): number {
    return this.age;
  }
}

// Dog 클래스 — Animal 상속
class Dog extends Animal {
  constructor(
    name: string,
    age: number,
    public breed: string, // 견종 (Dog만의 필드)
  ) {
    super(name, age); // 부모 constructor 반드시 먼저 호출
  }

  // 추상 메서드 구현
  speak(): string {
    return `${this.name}: 멍멍! 🐕`;
  }

  // Dog만의 메서드
  fetch(): string {
    return `${this.name}이(가) 공을 물어옵니다.`;
  }

  getInfo(): string {
    // super로 부모 메서드 호출 후 추가 정보
    return `${super.getInfo()}, 견종: ${this.breed}`;
  }
}

// Cat 클래스 — Animal 상속
class Cat extends Animal {
  private indoor: boolean; // private: Cat 내부에서만 접근 가능

  constructor(name: string, age: number, indoor: boolean = true) {
    super(name, age);
    this.indoor = indoor;
  }

  speak(): string {
    return `${this.name}: 야옹~ 🐈`;
  }

  // Cat만의 메서드
  purr(): string {
    return `${this.name}이(가) 그루밍을 합니다.`;
  }

  getInfo(): string {
    const type = this.indoor ? '실내 고양이' : '실외 고양이';
    return `${super.getInfo()}, ${type}`;
  }
}

// ============================================================
// Part 2: BankAccount — private 필드로 잔액 보호
// ============================================================

// 거래 기록 타입
interface Transaction {
  type: 'deposit' | 'withdraw';
  amount: number;
  date: string;
  balance: number; // 거래 후 잔액
}

class BankAccount {
  private balance: number;               // 외부 직접 접근 불가
  private history: Transaction[] = [];   // 거래 내역
  readonly accountId: string;            // 계좌번호 (변경 불가)
  readonly ownerName: string;

  constructor(ownerName: string, initialBalance: number = 0) {
    this.ownerName = ownerName;
    this.balance = initialBalance;
    // 계좌번호: 현재 시각 + 랜덤 4자리
    this.accountId = `ACC-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`;
  }

  // getter — private balance를 외부에서 읽기 전용으로 제공
  getBalance(): number {
    return this.balance;
  }

  // 입금
  deposit(amount: number): void {
    if (amount <= 0) {
      throw new Error('입금 금액은 0보다 커야 합니다.');
    }
    this.balance += amount; // 잔액 증가
    this.addHistory('deposit', amount); // 거래 내역 기록
    console.log(`[입금] ${amount.toLocaleString()}원 → 잔액: ${this.balance.toLocaleString()}원`);
  }

  // 출금
  withdraw(amount: number): void {
    if (amount <= 0) {
      throw new Error('출금 금액은 0보다 커야 합니다.');
    }
    if (amount > this.balance) {
      throw new Error(`잔액 부족 (잔액: ${this.balance.toLocaleString()}원)`);
    }
    this.balance -= amount; // 잔액 감소
    this.addHistory('withdraw', amount); // 거래 내역 기록
    console.log(`[출금] ${amount.toLocaleString()}원 → 잔액: ${this.balance.toLocaleString()}원`);
  }

  // 거래 내역 추가 (private 메서드)
  private addHistory(type: 'deposit' | 'withdraw', amount: number): void {
    this.history.push({
      type,
      amount,
      date: new Date().toLocaleString('ko-KR'),
      balance: this.balance,
    });
  }

  // 거래 내역 출력
  printHistory(): void {
    console.log(`\n=== [${this.ownerName}] 거래 내역 ===`);
    if (this.history.length === 0) {
      console.log('거래 내역이 없습니다.');
      return;
    }
    this.history.forEach((tx, i) => {
      const mark = tx.type === 'deposit' ? '↑ 입금' : '↓ 출금';
      console.log(`${i + 1}. ${mark} ${tx.amount.toLocaleString()}원 | 잔액: ${tx.balance.toLocaleString()}원`);
    });
  }
}

// ============================================================
// 테스트
// ============================================================
console.log('=== Animal 상속 ===');

const dog = new Dog('바둑이', 3, '진돗개');
const cat = new Cat('나비', 5, true);

// 다형성: 같은 speak() 메서드, 다른 결과
const animals: Animal[] = [dog, cat];
animals.forEach((a) => {
  console.log(a.speak());
  console.log(a.getInfo());
});

console.log('\n--- Dog 전용 메서드 ---');
console.log(dog.fetch());

console.log('\n--- Cat 전용 메서드 ---');
console.log(cat.purr());

// 추상 클래스 직접 인스턴스화 시도 (컴파일 오류)
// const animal = new Animal('동물', 1); // 오류!

console.log('\n=== BankAccount ===');
const account = new BankAccount('홍길동', 100000);
console.log(`계좌번호: ${account.accountId}`);
console.log(`예금주: ${account.ownerName}`);
console.log(`잔액: ${account.getBalance().toLocaleString()}원`);

account.deposit(50000);
account.deposit(30000);
account.withdraw(20000);

try {
  account.withdraw(500000); // 잔액 부족 오류
} catch (e) {
  console.log('오류:', (e as Error).message);
}

account.printHistory();
