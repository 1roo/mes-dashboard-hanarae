import { instance } from "../../../shared/axios/axios";
import type { User } from "../../../shared/types";

export type CreateUserPayload = {
  employeeId: string;
  name: string;
  department: User["department"];
  position: User["position"];
  username: string;
  password: string;
  role: User["role"];
  status: User["status"];
  createdAt: string;
};

export const usersApi = {
  list: async (): Promise<User[]> => {
    const res = await instance.get<User[]>("/users");
    return res.data;
  },

  create: async (payload: CreateUserPayload): Promise<User> => {
    const res = await instance.post<User>("/users", payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  update: async (id: User["id"], payload: User): Promise<User> => {
    const res = await instance.put<User>(`/users/${id}`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return res.data;
  },

  remove: async (id: User["id"]): Promise<void> => {
    await instance.delete(`/users/${id}`);
  },
};
