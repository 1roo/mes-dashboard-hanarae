import type { User } from "../../../shared/types";

import UserTable from "./UserTable";
import AddUserForm from "./AddUserForm";

import { PAGE_SIZE } from "../constants";
import { useUsersList } from "../queries/useUsersList";
import { usePagination } from "../hooks/usePagination";
import { isValidNewUserForm, useUserForm } from "../hooks/useUserForm";
import { useCreateUser } from "../mutations/useCreateUser";
import { useUpdateUser } from "../mutations/useUpdateUser";
import { useDeleteUser } from "../mutations/useDeleteUser";

const UserManagementPage = () => {
  const { users, loading, error } = useUsersList();

  const {
    page,
    setPage,
    totalPages,
    pagedItems: pagedUsers,
  } = usePagination(users, PAGE_SIZE);

  const { isAddOpen, setIsAddOpen, form, onChange, reset } = useUserForm(users);

  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const onSave = async () => {
    if (!isValidNewUserForm(form)) return;

    const payload = {
      employeeId: form.employeeId.trim(),
      name: form.name.trim(),
      department: form.department,
      position: form.position,
      username: form.username.trim(),
      password: form.password,
      role: form.role,
      status: "INACTIVE" as const,
      createdAt: new Date().toISOString().slice(0, 10),
    };

    await createUser.mutateAsync(payload);

    reset();
    setIsAddOpen(false);
  };

  const onUpdate = async (next: User) => {
    await updateUser.mutateAsync(next);
  };

  const onDelete = async (user: User) => {
    const ok = window.confirm(
      `${user.name}(${user.employeeId}) 계정을 삭제할까요?`,
    );
    if (!ok) return;

    await deleteUser.mutateAsync(user.id);
  };

  const isLoading =
    loading ||
    createUser.isPending ||
    updateUser.isPending ||
    deleteUser.isPending;

  return (
    <div className="relative pb-24">
      <div className="bg-gray-200 h-16 p-3 flex justify-between items-center rounded-md mb-5">
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
        error={error ? "사용자 목록을 불러오지 못했습니다." : null}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />

      {isAddOpen && (
        <AddUserForm form={form} onChange={onChange} onSave={onSave} />
      )}

      {totalPages > 1 && (
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
      )}
    </div>
  );
};

export default UserManagementPage;
