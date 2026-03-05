import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import type { User } from "../../../shared/types";
import { usersApi } from "../api/users.api";
import { usersKeys } from "../api/users.key";

export const useDeleteUser = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: User["id"]) => usersApi.remove(id),
    onSuccess: () => {
      toast.success("삭제되었습니다.");
      qc.invalidateQueries({ queryKey: usersKeys.list() });
    },
    onError: () => {
      toast.error("삭제에 실패했습니다.");
    },
  });
};
