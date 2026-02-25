import AddWorkOrderForm from "./AddWorkOrderForm";
import WorkOrderTable from "./WorkOrderTable";
import { statusOptions } from "./constants";
import type { Status } from "./types";
import { useWorkOrderManagement } from "./useWorkOrderManagement";

const WorkOrdersPage = () => {
  const wm = useWorkOrderManagement();
  const isAdmin = localStorage.getItem("role") === "ADMIN";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-10 gap-2">
        <input
          type="text"
          placeholder="제품명 검색..."
          value={wm.keyword}
          onChange={(e) => wm.setKeyword(e.target.value)}
          className="col-span-6 border bg-gray-100 border-gray-300 p-2 rounded-sm"
        />

        <select
          value={wm.status}
          onChange={(e) => wm.setStatus(e.target.value as "" | Status)}
          className="col-span-2 border bg-gray-100 border-gray-300 p-2 rounded-sm"
        >
          {statusOptions.map((o) => (
            <option key={o.label} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>

        {isAdmin && (
          <button
            type="button"
            onClick={wm.onClickAdd}
            className="col-span-2 p-2 bg-blue-500 text-white font-semibold rounded-sm hover:bg-blue-600"
          >
            + 행추가
          </button>
        )}
      </div>

      <WorkOrderTable
        loading={wm.loading}
        rows={wm.pagedRows}
        showEmpty={!wm.loading && wm.filteredRows.length === 0}
      >
        {wm.isAdding && (
          <AddWorkOrderForm
            newForm={wm.newForm}
            onChangeNewForm={wm.onChangeNewForm}
            onSaveNew={wm.onSaveNew}
            onCancelNew={wm.onCancelNew}
          />
        )}
      </WorkOrderTable>

      <div className="flex justify-center gap-2">
        {Array.from({ length: wm.totalPages }).map((_, idx) => {
          const n = idx + 1;
          const active = n === wm.page;
          return (
            <button
              key={n}
              type="button"
              onClick={() => wm.setPage(n)}
              className={[
                "w-10 h-10 border rounded-sm font-semibold",
                active
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-700 hover:bg-gray-100",
              ].join(" ")}
            >
              {n}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default WorkOrdersPage;
