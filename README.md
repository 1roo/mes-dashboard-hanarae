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

# Shadcn/ui 초기화
npx shadcn@latest init

# 기본 UI 컴포넌트 설치
npx shadcn@latest add button
npx shadcn@latest add dialog
npx shadcn@latest add input
npx shadcn@latest add label
npx shadcn@latest add select
npx shadcn@latest add checkbox
npx shadcn@latest add radio-group
npx shadcn@latest add switch
npx shadcn@latest add tabs
npx shadcn@latest add toast
npx shadcn@latest add tooltip
npx shadcn@latest add popover
npx shadcn@latest add dropdown-menu
npx shadcn@latest add sidebar
npx shadcn@latest add date-picker
npx shadcn@latest add accordion
npx shadcn@latest add sheet
npx shadcn@latest add badge
npx shadcn@latest add separator

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
- [작업지시목록]
```

## 기타사항

다른 화면을 구현하던 중 구조를 변경하면서 일부 기능을 재구성하느라 예상보다 많은 화면을 구현하지 못했습니다.
