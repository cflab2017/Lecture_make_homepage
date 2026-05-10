// ===================================================
// 과제 04 정답 — 도서관 시스템 클래스
// 컴파일: tsc classes.ts
// 실행:   node classes.js
// ===================================================

// 대출 기록 인터페이스
interface LoanRecord {
  memberId: string;
  memberName: string;
  loanDate: string;    // 대출일
  dueDate: string;     // 반납 예정일 (14일 후)
  returnDate?: string; // 실제 반납일 (반납 전은 undefined)
}

// ============================================================
// 1. Book 클래스
// ============================================================
class Book {
  readonly isbn: string;        // ISBN — 한 번 설정 후 변경 불가
  title: string;
  author: string;
  private isLoaned: boolean;    // 대출 여부 — 외부에서 직접 변경 불가
  private loanRecord: LoanRecord | null; // 현재 대출 기록

  constructor(isbn: string, title: string, author: string) {
    this.isbn = isbn;
    this.title = title;
    this.author = author;
    this.isLoaned = false;   // 초기 상태: 대출 가능
    this.loanRecord = null;
  }

  // 대출 처리 — 이미 대출 중이면 오류 던짐
  checkOut(memberId: string, memberName: string): void {
    if (this.isLoaned) {
      throw new Error(`'${this.title}'은(는) 이미 대출 중입니다.`);
    }
    this.isLoaned = true; // 대출 상태로 변경

    const loanDate = new Date();
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14); // 14일 후 반납 예정

    this.loanRecord = {
      memberId,
      memberName,
      loanDate: loanDate.toLocaleDateString('ko-KR'),
      dueDate: dueDate.toLocaleDateString('ko-KR'),
    };
  }

  // 반납 처리
  returnBook(): void {
    if (!this.isLoaned) {
      throw new Error(`'${this.title}'은(는) 대출 중인 도서가 아닙니다.`);
    }
    this.isLoaned = false; // 대출 가능 상태로 복원

    if (this.loanRecord) {
      this.loanRecord.returnDate = new Date().toLocaleDateString('ko-KR');
    }
    this.loanRecord = null; // 현재 대출 기록 초기화
  }

  // 현재 대출 상태 문자열 반환
  getStatus(): string {
    return this.isLoaned ? '대출 중' : '대출 가능';
  }

  // 현재 대출 중인지 boolean 반환
  isCurrentlyLoaned(): boolean {
    return this.isLoaned;
  }

  // 도서 정보 문자열 반환
  toString(): string {
    return `[${this.isbn}] "${this.title}" by ${this.author} — ${this.getStatus()}`;
  }
}

// ============================================================
// 2. Member 클래스
// ============================================================
class Member {
  readonly memberId: string;    // 회원번호 (자동 생성, 변경 불가)
  name: string;
  private loanedBooks: Book[];  // 대출 중인 도서 목록
  private static readonly MAX_LOAN = 3; // 최대 대출 가능 권수 (정적 상수)

  constructor(name: string) {
    this.name = name;
    // 회원번호: MEM- + 현재 시간 + 랜덤 3자리
    this.memberId = `MEM-${Date.now()}-${Math.floor(Math.random() * 900 + 100)}`;
    this.loanedBooks = []; // 초기 대출 목록: 빈 배열
  }

  // 도서 대출
  borrow(book: Book): void {
    // 최대 대출 권수 초과 검사
    if (this.loanedBooks.length >= Member.MAX_LOAN) {
      throw new Error(
        `최대 ${Member.MAX_LOAN}권까지 대출 가능합니다. ` +
        `현재 ${this.loanedBooks.length}권 대출 중.`
      );
    }
    // 이미 같은 책을 빌린 경우 검사
    if (this.loanedBooks.some((b) => b.isbn === book.isbn)) {
      throw new Error(`이미 대출 중인 도서입니다: '${book.title}'`);
    }

    book.checkOut(this.memberId, this.name); // Book의 대출 처리
    this.loanedBooks.push(book);            // 내 대출 목록에 추가
  }

  // 도서 반납
  returnBook(book: Book): void {
    const index = this.loanedBooks.findIndex((b) => b.isbn === book.isbn);

    if (index === -1) {
      throw new Error(`'${book.title}'은(는) 회원 ${this.name}의 대출 목록에 없습니다.`);
    }

    book.returnBook();                   // Book의 반납 처리
    this.loanedBooks.splice(index, 1);   // 대출 목록에서 제거
  }

  // 현재 대출 목록 반환 (복사본 반환 — 원본 보호)
  getLoanedBooks(): Book[] {
    return [...this.loanedBooks]; // 스프레드로 복사
  }

  // 회원 정보 출력
  getInfo(): string {
    return `[${this.memberId}] ${this.name} (대출: ${this.loanedBooks.length}/${Member.MAX_LOAN}권)`;
  }
}

// ============================================================
// 3. Library 클래스
// ============================================================
class Library {
  readonly libraryName: string;
  private books: Book[];
  private members: Member[];

  constructor(libraryName: string) {
    this.libraryName = libraryName;
    this.books = [];
    this.members = [];
  }

  // 도서 추가
  addBook(book: Book): void {
    // 이미 같은 ISBN이 있으면 거부
    if (this.books.some((b) => b.isbn === book.isbn)) {
      throw new Error(`이미 등록된 도서입니다. ISBN: ${book.isbn}`);
    }
    this.books.push(book);
    console.log(`도서 등록: ${book.toString()}`);
  }

  // 회원 등록
  registerMember(member: Member): void {
    this.members.push(member);
    console.log(`회원 등록: ${member.getInfo()}`);
  }

  // ISBN으로 도서 찾기 (private)
  private findBook(isbn: string): Book {
    const book = this.books.find((b) => b.isbn === isbn);
    if (!book) throw new Error(`도서를 찾을 수 없습니다. ISBN: ${isbn}`);
    return book;
  }

  // 회원 ID로 회원 찾기 (private)
  private findMember(memberId: string): Member {
    const member = this.members.find((m) => m.memberId === memberId);
    if (!member) throw new Error(`회원을 찾을 수 없습니다. ID: ${memberId}`);
    return member;
  }

  // 대출 처리
  loanBook(memberId: string, isbn: string): void {
    const member = this.findMember(memberId);
    const book = this.findBook(isbn);
    member.borrow(book); // 회원 객체에게 대출 위임
    console.log(`대출 완료: ${member.name} → '${book.title}'`);
  }

  // 반납 처리
  returnBook(memberId: string, isbn: string): void {
    const member = this.findMember(memberId);
    const book = this.findBook(isbn);
    member.returnBook(book); // 회원 객체에게 반납 위임
    console.log(`반납 완료: ${member.name} ← '${book.title}'`);
  }

  // 도서 검색 (제목 또는 저자명 포함 검색)
  searchBook(keyword: string): Book[] {
    const lower = keyword.toLowerCase();
    return this.books.filter(
      (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower)
    );
  }

  // 전체 도서 현황 출력
  printStatus(): void {
    console.log(`\n=== ${this.libraryName} 도서 현황 ===`);
    console.log(`총 도서: ${this.books.length}권 | 회원: ${this.members.length}명`);
    this.books.forEach((b) => console.log(`  ${b.toString()}`));
  }
}

// ============================================================
// 테스트 시나리오
// ============================================================
console.log('=== 도서관 시스템 시작 ===\n');

const library = new Library('서울 중앙 도서관');

// 도서 등록
library.addBook(new Book('978-01', 'TypeScript 완전 정복', '김타입'));
library.addBook(new Book('978-02', 'Node.js 서버 개발', '이노드'));
library.addBook(new Book('978-03', 'React 실전 프로젝트', '박리액트'));
library.addBook(new Book('978-04', '클린 코드', '로버트 마틴'));

// 회원 등록
const member1 = new Member('홍길동');
const member2 = new Member('김철수');
library.registerMember(member1);
library.registerMember(member2);

library.printStatus();

// 대출 시나리오
console.log('\n=== 대출 시나리오 ===');
library.loanBook(member1.memberId, '978-01');
library.loanBook(member1.memberId, '978-02');
library.loanBook(member2.memberId, '978-03');

// 중복 대출 시도
try {
  library.loanBook(member2.memberId, '978-03'); // 이미 대출 중
} catch (e) {
  console.log('오류:', (e as Error).message);
}

library.printStatus();

// 검색
console.log('\n=== "TypeScript" 검색 결과 ===');
const results = library.searchBook('TypeScript');
results.forEach((b) => console.log(b.toString()));

// 반납
console.log('\n=== 반납 시나리오 ===');
library.returnBook(member1.memberId, '978-01');

library.printStatus();
