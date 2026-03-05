import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { usersApi, type CreateUserPayload } from "../api/users.api";
import { usersKeys } from "../api/users.key";

export const useCreateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserPayload) => usersApi.create(payload),
    onSuccess: () => {
      toast.success("저장되었습니다.");
      qc.invalidateQueries({ queryKey: usersKeys.list() });
    },
    onError: () => {
      toast.error("저장에 실패했습니다.");
    },
  });
};
