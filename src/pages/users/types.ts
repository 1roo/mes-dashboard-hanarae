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

export type NewUserForm = {
  employeeId: string;
  name: string;
  department: "" | User["department"];
  position: "" | User["position"];
  username: string;
  password: string;
  role: "" | User["role"];
};
