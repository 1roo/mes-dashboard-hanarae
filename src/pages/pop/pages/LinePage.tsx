import { DASHBOARD_ANIMATION_STYLE } from "./constants";

const LinePage = () => {
  const actualWidth = Math.min((391 / 450) * 100, 100);

  return (
    <>
      <style>{DASHBOARD_ANIMATION_STYLE}</style>
      <button className="px-4 py-1 border rounded-md mr-2">라인A</button>
      <button className="px-4 py-1 border rounded-md mr-2">라인B</button>
      <button className="px-4 py-1 border rounded-md mr-2">라인C</button>
      <button className="px-4 py-1 border rounded-md mr-2">라인D</button>
      <section className="grid grid-cols-4 gap-4 h-40">
        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">오늘 목표</span>
          <p className="text-2xl font-bold text-violet-600 mt-1">450</p>
        </article>

        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">현재 실적</span>
          <p className="text-2xl font-bold text-blue-600 mt-1">391</p>
        </article>
        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">달성률</span>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {((391 / 450) * 100).toFixed(1)}%
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-7">
            <div
              className="bg-green-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${actualWidth}%` }}
            />
          </div>
        </article>
        <article className="border border-gray-200 rounded-md p-4 bg-white shadow-sm">
          <span className="text-sm text-gray-500 font-medium">불량률</span>
          <p className="text-2xl font-bold text-red-600 mt-1">1.5%</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-7">
            <div
              className="bg-red-600 h-full rounded-full transition-all duration-1000"
              style={{ width: `${((6 / 450) * 100).toFixed(1)}%` }}
            />
          </div>
        </article>
      </section>
    </>
  );
};

export default LinePage;
