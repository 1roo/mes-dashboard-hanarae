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

# HTTP 클라이언트
npm i axios

# 폼 관리
npm i react-hook-form


```

## 3단계: tailwind css + Shadcn/ui 설치

```bash
npm i -D tailwindcss @tailwindcss/vite

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

## 구현한 화면

```bash
- [로그인]
- [계정관리/등록]
- [작업지시목록]
- [실적등록]
- [POP]
- [대시보드]
```

## 폴더 구조

```
mes-dashboard-hanarae/
├── public/
├── src/
│   ├── auth/                                # 인증/인가(로그인 상태, 라우트 보호, 권한 체크)
│   │   ├── AdminRoute.tsx                   # 관리자 전용 라우트 가드
│   │   ├── AuthContext.ts                   # 인증 컨텍스트 타입/생성
│   │   ├── AuthProvider.tsx                 # 인증 상태 제공(로그인/로그아웃, 저장 로직)
│   │   ├── ProtectedRoute.tsx               # 로그인 사용자만 접근 가능한 라우트 가드
│   │   └── useAuth.ts                       # 인증 컨텍스트 사용 훅
│   │
│   ├── layout/                              # 공통 레이아웃(헤더/사이드바/본문 틀)
│   │   ├── Header.tsx                       # 상단 헤더(UI, 사용자 정보, 로그아웃 등)
│   │   ├── PrivateLayout.tsx                # 로그인 이후 레이아웃(헤더+사이드바+Outlet)
│   │   └── SideBar.tsx                      # 좌측 내비게이션 메뉴
│   │
│   ├── pages/
│   │   ├── dashboard/
│   │   │   ├── constants.ts                 # 대시보드에서 쓰는 상수/포맷/옵션
│   │   │   ├── DashBoardChart.tsx           # 대시보드 차트 영역
│   │   │   ├── DashBoardPage.tsx            # 대시보드 메인 페이지
│   │   │   ├── DashBoardTable.tsx           # 대시보드 테이블 영역
│   │   │   ├── SummaryCard.tsx              # KPI 요약 카드
│   │   │   ├── type.ts                      # 대시보드 도메인 타입
│   │   │   └── useDashBoard.ts              # 대시보드 데이터 fetch/상태 관리 훅
│   │   │
│   │   ├── login/
│   │   │   ├── LoginForm.tsx                # 로그인 폼 UI
│   │   │   ├── LoginPage.tsx                # 로그인 페이지(폼 + 라우팅 처리)
│   │   │   ├── loginStorage.ts              # 로그인 유지(로컬/세션 저장) 유틸
│   │   │   └── useLogin.ts                  # 로그인 요청/검증/상태 관리 훅
│   │   │
│   │   ├── performance/
│   │   │   ├── constants.ts                 # 실적 페이지 상수/포맷
│   │   │   ├── excelUpload.ts               # 엑셀 업로드 파싱/업로드 로직
│   │   │   ├── Modal.tsx                    # 실적 등록/편집 모달 UI
│   │   │   ├── PerformancePage.tsx          # 실적 목록 페이지
│   │   │   ├── PerformanceTable.tsx         # 실적 목록 테이블 컴포넌트
│   │   │   ├── type.ts                      # 실적 데이터 타입
│   │   │   ├── useExcel.ts                  # 엑셀 처리 훅(읽기/검증/변환 등)
│   │   │   └── usePerformance.ts            # 실적 목록 fetch/상태 훅
│   │   │
│   │   ├── pop/                             # POP(현장) 화면 묶음(라인 현황/실적 입력)
│   │   │   ├── enterPerform/
│   │   │   │   ├── EnterPerformPage.tsx     # 실적 입력 메인 페이지(좌/우 패널 레이아웃)
│   │   │   │   ├── History.tsx              # 내가 입력한 히스토리 리스트
│   │   │   │   ├── PerformForm.tsx          # 실적 입력 폼(제출/검증)
│   │   │   │   ├── type.ts                  # 입력/히스토리 타입
│   │   │   │   └── useEnterPerform.ts       # 실적 입력 관련 fetch/상태 훅
│   │   │   │
│   │   │   ├── line/
│   │   │   │   ├── EquipmentPanel.tsx       # 설비 상태/알림 패널
│   │   │   │   ├── HourlyProduction.tsx     # 시간대별 생산 현황(차트/표)
│   │   │   │   ├── LinePage.tsx             # 라인 현황 메인 페이지(3컬럼 구성)
│   │   │   │   ├── SummaryCard.tsx          # 라인 KPI 요약 카드
│   │   │   │   ├── type.ts                  # 라인/작업지시/설비 타입
│   │   │   │   ├── useLine.ts               # 라인 현황 데이터 fetch/가공 훅
│   │   │   │   ├── WorkOrderCard.tsx        # 작업지시 카드(1개 아이템 UI)
│   │   │   │   └── WorkOrderPanel.tsx       # 작업지시 목록 패널
│   │   │   │
│   │   │   └── PopPage.tsx                  # POP 진입/탭 전환(현황판/실적입력) 컨테이너
│   │   │
│   │   ├── users/
│   │   │   ├── AddUserForm.tsx              # 사용자 추가/수정 폼
│   │   │   ├── confirmModal.tsx             # 확인 모달(삭제/변경 확인 등)
│   │   │   ├── constants.ts                 # 사용자/권한 옵션 상수
│   │   │   ├── types.ts                     # 사용자 타입
│   │   │   ├── UserManagementPage.tsx       # 계정 관리 페이지
│   │   │   ├── UserTable.tsx                # 사용자 목록 테이블
│   │   │   └── useUserManagement.ts         # 사용자 CRUD/fetch 훅
│   │   │
│   │   ├── workOrders/
│   │   │   ├── AddWorkOrderForm.tsx         # 작업지시 추가/수정 폼
│   │   │   ├── constants.ts                 # 작업지시 관련 상수/옵션
│   │   │   ├── types.ts                     # 작업지시 타입
│   │   │   ├── useExcel.ts                  # 작업지시 엑셀 import 훅
│   │   │   ├── useWorkOrderManagement.ts    # 작업지시 CRUD/fetch 훅
│   │   │   ├── WorkOrdersPage.tsx           # 작업지시 관리 페이지
│   │   │   └── WorkOrdersTable.tsx          # 작업지시 목록 테이블
│   │
│   ├── routes/
│   │   └── router.tsx                       # 라우터 정의(페이지 매핑, 보호 라우트 연결)
│   │
│   ├── shared/                              # 전역 공용(인프라/유틸/공통 UI)
│   │   ├── axios/
│   │   │   └── axios.ts                     # axios 인스턴스(베이스URL, 인터셉터 등)
│   │   ├── lib/
│   │   │   └── utils.ts                     # 공용 유틸(cn 등)
│   │   ├── types/
│   │   │   └── index.ts                     # 전역 공용 타입 모음
│   │   └── ui/
│   │       ├── DonutChart.tsx               # 공용 도넛 차트 컴포넌트
│   │       ├── GroupedBarChart.tsx          # 공용 그룹 바 차트
│   │       ├── Spinner.tsx                  # 로딩 스피너
│   │       ├── Table.tsx                    # 공용 테이블 UI 래퍼
│   │       └── TrendLineChart.tsx           # 공용 라인/트렌드 차트
│   │
│   ├── main.tsx                             # 앱 엔트리(ReactDOM 렌더, Provider 연결)
│   └── index.css                            # 전역 스타일(Tailwind base 포함)
│
├── components.json                          # shadcn/ui 설정(컴포넌트 경로/스타일 등)
├── .env                                     # 환경변수(API URL 등)
├── tsconfig.json                            # TS 설정
├── vite.config.ts                           # Vite 빌드/플러그인 설정
└── package.json                             # 의존성/스크립트
```

## 실행 방법

```bash
npm install
npm install -g json-server

# 프론트엔드 개발 서버 실행
npm run dev

# 가짜 API 서버 실행 (json-server)
npm run server(db.json 가짜 API)
```
