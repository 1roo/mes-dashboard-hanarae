import { useState, useEffect } from "react";
import { instance } from "../../../shared/axios/axios";
import type { User } from "../../../shared/types";
export const useEnterPerform = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const stored = sessionStorage.getItem("auth_user");
        if (!stored) {
          setLoading(false);
          return;
        }

        const authUser = JSON.parse(stored);
        const employeeId = authUser.employeeId;

        const res = await instance.get<User[]>(
          `/users?employeeId=${employeeId}`,
        );

        if (res.data.length > 0) {
          setUser(res.data[0]);
        }
      } catch (error) {
        console.error("Failed to fetch user", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  return { user, loading };
};
