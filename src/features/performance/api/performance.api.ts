import { instance } from "../../../shared/axios/axios";
import type { Performance, User } from "../types";

export const performanceApi = {
  list: async (): Promise<Performance[]> => {
    const res = await instance.get<Performance[]>("/productionResults");
    return res.data;
  },

  create: async (payload: Performance): Promise<Performance> => {
    const res = await instance.post<Performance>("/productionResults", payload);
    return res.data;
  },

  users: async (): Promise<User[]> => {
    const res = await instance.get<User[]>("/users");
    return res.data;
  },
};