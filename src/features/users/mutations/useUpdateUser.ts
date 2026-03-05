import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { User } from "../../../shared/types";
import { usersApi } from "../api/users.api";
import { usersKeys } from "../api/users.key";

export const useUpdateUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (next: User) => usersApi.update(next.id, next),
    onSuccess: () => {
      toast.success("수정되었습니다.");
      qc.invalidateQueries({ queryKey: usersKeys.list() });
    },
    onError: () => {
      toast.error("수정에 실패했습니다.");
    },
  });
};
