import Spinner from "../../../shared/ui/Spinner";
import { useEnterPerform } from "./useEnterPerform";

const EnterPerformPage = () => {
  const { user, loading } = useEnterPerform();

  if (loading) return <Spinner />;

  return (
    <div>
      <article className="flex items-center mb-4 bg-white p-3 rounded-md shadow-sm">
        <div className="border-r border-gray-300 px-5">
          <span className="text-sm text-gray-500">담당 라인</span>
          <p className="text-lg font-bold text-blue-500">라인B</p>
        </div>
        <div className="border-r border-gray-300 px-5">
          <span className="text-sm text-gray-500">작업자</span>
          <p className="text-lg font-bold text-blue-700">{user?.name}</p>
        </div>
        <div className="border-r border-gray-300 px-5">
          <span className="text-sm text-gray-500">날짜</span>
          <p className="text-lg font-bold text-gray-500">
            {new Date().toISOString().slice(0, 10)}
          </p>
        </div>
        <div className="flex flex-col px-5">
          <span className="text-sm text-gray-500">작업지시선택</span>
          <select className="w-64 border border-gray-500 rounded-md">
            <option>WO-2026-002-기어박스 B타입</option>
          </select>
        </div>
      </article>

      <article className="flex justify-between items-center mb-4 bg-blue-300/30 border border-blue-300 p-3 rounded-md shadow-sm">
        작업지시 디테일
      </article>

      <article className="flex justify-between">
        <div className="w-1/2 bg-white p-3 rounded-md shadow-sm mr-2">
          생산 실적 입력
        </div>
        <div className="w-1/2 bg-white p-3 rounded-md shadow-sm ml-2">
          오늘 내 입력 히스토리
        </div>
      </article>
    </div>
  );
};

export default EnterPerformPage;
