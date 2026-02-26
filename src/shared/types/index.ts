export type DbUser = {
  id: number | string;
  employeeId: string;
  name: string;
  department: string;
  position: string;
  username: string;
  password: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
  createdAt?: string;
};

export type User = {
  id: number;
  employeeId: string;
  name: string;
  department: "생산팀" | "품질팀" | "설비팀";
  position: "사원" | "주임" | "대리";
  username: string;
  password: string;
  role: "ADMIN" | "USER";
  status: "ACTIVE" | "INACTIVE";
};
