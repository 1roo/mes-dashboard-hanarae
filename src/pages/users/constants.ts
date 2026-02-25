import { type NewUserForm, type User } from "./types";

export const departments: User["department"][] = ["생산팀", "품질팀", "설비팀"];
export const positions: User["position"][] = ["사원", "주임", "대리"];

export const initialForm: NewUserForm = {
  employeeId: "",
  name: "",
  department: "",
  position: "",
  username: "",
  password: "",
  role: "",
};
