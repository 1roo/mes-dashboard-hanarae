# MES 과제 기본 세팅

## 1단계: 프로젝트 생성

```bash
npm create vite@latest mes-project -- --template react-ts
cd mes-project
npm install
```

## 2단계: 공통 인프라 설치

```bash
# 라우팅
npm i react-router-dom
```

## 3단계: tailwind css 설치

```bash
npm i -D tailwindcss @tailwindcss/vite
```

## 실행 방법

```bash
npm install
npm install -g json-server

# 프론트엔드 실행
npm run dev

# 가짜 API 서버 실행 (json-server)
npm run server(db.json 가짜 API)
```

## 구현한 화면

```bash
- [로그인]
- [계정관리/등록]
```

## 기타사항

다른 화면을 구현하던 중 구조를 변경하면서 일부 기능을 재구성하느라 예상보다 많은 화면을 구현하지 못했습니다.
