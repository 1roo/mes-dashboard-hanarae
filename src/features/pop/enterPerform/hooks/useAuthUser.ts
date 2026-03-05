import { useEffect, useState } from "react";
import { instance } from "../../../../shared/axios/axios";
import type { User } from "../../../../shared/types";

export const useAuthUser = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = sessionStorage.getItem("auth_user");
        if (!stored) return;

        const authUser = JSON.parse(stored);
        const employeeId = String(authUser.employeeId ?? "").trim();

        const res = await instance.get<User[]>("/users", {
          params: { employeeId },
        });

        setUser(res.data?.[0] ?? null);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
