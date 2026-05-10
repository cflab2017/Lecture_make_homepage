# 웹 보안 과목

## 과목 소개

웹 개발자가 **반드시 알아야 할 보안 취약점과 방어법**을 학습합니다.  
**OWASP Top 10** 기준으로 가장 흔하고 위험한 취약점을 다룹니다.

**선수 조건:** JavaScript + Node.js 기초

---

## 강의 목록

| 강의 | 주제 | OWASP 분류 |
|------|------|-----------|
| 강의01 | XSS 방어 | A03: Injection |
| 강의02 | CSRF & 인증 | A01: Broken Access Control |
| 강의03 | SQL 인젝션 | A03: Injection |
| 강의04 | HTTPS & 환경변수 | A02: Cryptographic Failures |

---

## 학습 목표

- XSS, CSRF, SQL 인젝션의 원리를 설명할 수 있다
- 각 공격의 방어 방법을 실제 코드에 적용할 수 있다
- 보안 HTTP 헤더를 설정할 수 있다
- 환경변수로 시크릿을 안전하게 관리할 수 있다

---

## 보안 개발의 기본 원칙

```
1. 입력은 절대 신뢰하지 않는다 (Never Trust User Input)
2. 출력 시 반드시 이스케이프 처리한다
3. 준비된 구문(Prepared Statement)을 사용한다
4. 최소 권한 원칙 (Principle of Least Privilege)
5. 시크릿은 코드에 절대 하드코딩하지 않는다
```

---

## OWASP Top 10 (2021)

| 순위 | 항목 |
|------|------|
| A01 | Broken Access Control (접근 제어 실패) |
| A02 | Cryptographic Failures (암호화 실패) |
| A03 | Injection (인젝션) |
| A04 | Insecure Design (불안전한 설계) |
| A05 | Security Misconfiguration (보안 설정 오류) |
| A06 | Vulnerable Components (취약한 구성 요소) |
| A07 | Authentication Failures (인증 실패) |
| A08 | Software Integrity Failures (무결성 실패) |
| A09 | Logging Failures (로깅 실패) |
| A10 | SSRF (서버 사이드 요청 위조) |

---

## 참고 자료

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [MDN Web Security](https://developer.mozilla.org/ko/docs/Web/Security)
- [NodeSecurity](https://nodejs.org/en/docs/guides/security/)
