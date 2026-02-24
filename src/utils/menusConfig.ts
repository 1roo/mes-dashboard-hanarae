export type MenuNode = {
  title: string;
  path?: string;
  children?: MenuNode[];
};

export const MENUS: MenuNode[] = [
  {
    title: "시스템",
    children: [
      {
        title: "공통코드관리",
        children: [
          { title: "공통코드등록", path: "/system/commonCode/insert" },
        ],
      },
      {
        title: "사용자관리",
        children: [
          { title: "권한등록", path: "/system/users/roles" },
          { title: "사용자정보", path: "/userinfo" },
          { title: "접속이력조회", path: "/system/users/accessLog" },
        ],
      },
      { title: "환경설정" },
      { title: "다국어관리" },
    ],
  },
  {
    title: "기준정보",
  },
  {
    title: "영업",
  },
  {
    title: "자재/구매",
  },
  {
    title: "재고",
  },
  {
    title: "생산",
  },
  {
    title: "설비",
  },
  {
    title: "대시보드",
  },
  {
    title: "POP",
  },
];
