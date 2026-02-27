import { useUserManagement } from "./useUserManagement";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";

const UserManagementPage = () => {
  const {
    pagedUsers,
    page,
    setPage,
    totalPages,
    isAddOpen,
    setIsAddOpen,
    form,
    onChange,
    onSave,
    isLoading,
    error,
    onUpdate,
    onDelete,
  } = useUserManagement();

  return (
    <div className="relative pb-24">
      <div className="bg-gray-200  h-16 p-3 flex justify-between items-center rounded-md mb-5">
        <span className="text-gray-900 font-bold text-2xl">계정 관리</span>

        <button
          type="button"
          onClick={() => setIsAddOpen((p) => !p)}
          className="rounded-sm bg-blue-600 hover:bg-blue-400 text-white font-bold text-xl px-4 py-2"
        >
          + 계정 추가
        </button>
      </div>

      <UserTable
        users={pagedUsers}
        isLoading={isLoading}
        error={error}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      {isAddOpen && (
        <AddUserForm form={form} onChange={onChange} onSave={onSave} />
      )}

      <div className="fixed bottom-5 left-64 right-0 flex justify-center">
        <div className="flex gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => {
            const n = idx + 1;
            const active = n === page;

            return (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
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
    </div>
  );
};

export default UserManagementPage;
