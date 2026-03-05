import { useEffect, useState } from "react";
import { instance } from "../../../../shared/axios/axios";
import type { WorkOrder } from "../../../workOrders/types";

export const useWorkOrdersByOperator = (operatorName?: string) => {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!operatorName) return;

    const fetch = async () => {
      setLoading(true);

      try {
        const res = await instance.get<WorkOrder[]>("/workOrders", {
          params: { operatorName },
        });

        setWorkOrders(res.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, [operatorName]);

  return { workOrders, loading };
};
