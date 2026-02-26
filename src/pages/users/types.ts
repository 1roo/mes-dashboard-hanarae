import type { User } from "../../shared/types";

export type NewUserForm = {
  employeeId: string;
  name: string;
  department: "" | User["department"];
  position: "" | User["position"];
  username: string;
  password: string;
  role: "" | User["role"];
};
