import { useEffect, useState } from "react";
import { instance } from "../../shared/axios/axios";

type HourlyProduction = {
  id: string;
  hour: string;
  planned: number;
  actual: number;
};

const DashBoardPage = () => {
  const [data, setData] = useState<HourlyProduction[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await instance.get("/hourlyProduction");
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  return (
    <div className="w-2/3 mx-auto">
      <div>
        <section>
          <div className="flex justify-between items-center mt-3">
            <div className="py-5 px-7 bg-blue-500 text-white cursor-pointer">
              생산계획
            </div>
            <div className="py-5 px-7 bg-blue-500 text-white cursor-pointer">
              실생산
            </div>
            <div className="py-5 px-7 bg-green-500 text-white cursor-pointer">
              달성률
            </div>
            <div className="py-5 px-7 bg-red-500 text-white cursor-pointer">
              불량률
            </div>
          </div>
          <div className="flex flex-col justify-between h-40 border bg-gray-200 border-gray-300 mt-5">
            <span>시간별 생산 추이</span>
            <div className="flex items-end justify-between pb-0">
              {data.map((item) => (
                <div key={item.id} className="flex flex-col items-center">
                  <div
                    className="w-7 bg-blue-500 border border-blue-600"
                    style={{ height: `${item.actual}px` }}
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashBoardPage;
