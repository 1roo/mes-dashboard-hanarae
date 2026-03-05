import { useEffect, useState } from "react";
import { instance } from "../../../../shared/axios/axios";
import type { ProductionResult } from "../type";

export const useProductionResults = () => {
  const [productionResults, setProductionResults] = useState<
    ProductionResult[]
  >([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);

      try {
        const res =
          await instance.get<ProductionResult[]>("/productionResults");
        setProductionResults(res.data ?? []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetch();
  }, []);

  return { productionResults, loading };
};
