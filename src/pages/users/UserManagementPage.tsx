import { useUserManagement } from "./useUserManagement";
import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";

const UserManagementPage = () => {
  const {
    users,
    isAddOpen,
    setIsAddOpen,
    form,
    onChange,
    onSave,
    isLoading,
    error,
  } = useUserManagement();

  return (
    <div className="mx-auto">
      <div className="bg-gray-950 p-3 flex justify-between items-center rounded-md mb-5">
        <span className="text-white font-bold text-2xl">계정 관리</span>
        <button
          type="button"
          onClick={() => setIsAddOpen((p) => !p)}
          className="rounded-sm bg-blue-600 hover:bg-blue-400 text-white font-bold text-xl px-4 py-2"
        >
          + 계정 추가
        </button>
      </div>

      <UserTable users={users} isLoading={isLoading} error={error} />

      {isAddOpen && (
        <AddUserForm form={form} onChange={onChange} onSave={onSave} />
      )}
    </div>
  );
};

export default UserManagementPage;
