import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../api/users.api";
import { usersKeys } from "../api/users.key";

export const useUsersList = () => {
  const q = useQuery({
    queryKey: usersKeys.list(),
    queryFn: usersApi.list,
  });

  return {
    users: q.data ?? [],
    loading: q.isLoading,
    error: q.error,
    refetch: q.refetch,
  };
};
