import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/Table";
import Spinner from "../../shared/ui/Spinner";
import ConfirmModal from "./confirmModal";
import type { User } from "../../shared/types";

type Props = {
  users: User[];
  isLoading: boolean;
  error: string | null;
  onUpdate?: (next: User) => Promise<void> | void;
  onDelete?: (user: User) => Promise<void> | void;
};

const UserTable = ({ users, isLoading, error, onUpdate, onDelete }: Props) => {
  const lastErrorRef = useRef<string | null>(null);

  const [editingId, setEditingId] = useState<User["id"] | null>(null);
  const [draft, setDraft] = useState<User | null>(null);
  const [saving, setSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingUser, setDeletingUser] = useState<User | null>(null);

  useEffect(() => {
    if (!error) return;
    if (lastErrorRef.current === error) return;

    lastErrorRef.current = error;
    toast.error(error);
  }, [error]);

  useEffect(() => {
    if (editingId == null) return;
    const stillExists = users.some((u) => u.id === editingId);
    if (!stillExists) {
      setEditingId(null);
      setDraft(null);
    }
  }, [users, editingId]);

  const isEditing = (id: User["id"]) => editingId === id;

  const onStartEdit = (u: User) => {
    setEditingId(u.id);
    setDraft({ ...u });
  };

  const onCancelEdit = () => {
    setEditingId(null);
    setDraft(null);
  };

  const onChangeDraft =
    <K extends keyof User>(key: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const value = e.target.value as unknown as User[K];
      setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
    };

  const onSaveEdit = async () => {
    if (!draft) return;

    const employeeIdTrimmed = String(draft.employeeId ?? "").trim();
    if (!employeeIdTrimmed) {
      toast.error("사번을 입력해주세요.");
      return;
    }

    const dupEmployeeId = users.some(
      (u) => u.employeeId === employeeIdTrimmed && u.id !== draft.id,
    );
    if (dupEmployeeId) {
      toast.error("이미 존재하는 사번입니다.");
      return;
    }

    const nameTrimmed = String(draft.name ?? "").trim();
    if (!nameTrimmed) {
      toast.error("이름을 입력해주세요.");
      return;
    }

    try {
      setSaving(true);
      await onUpdate?.({
        ...draft,
        employeeId: employeeIdTrimmed,
        name: nameTrimmed,
      });
      toast.success("수정되었습니다.");
      onCancelEdit();
    } catch {
      toast.error("수정에 실패했습니다.");
    } finally {
      setSaving(false);
    }
  };

  const roleLabel = useMemo(
    () => (role: User["role"]) => (role === "ADMIN" ? "관리자" : "일반"),
    [],
  );

  const statusLabel = useMemo(
    () => (s: User["status"]) => (s === "ACTIVE" ? "활성" : "비활성"),
    [],
  );

  if (isLoading) return <Spinner />;

  return (
    <>
      <div className="border text-center border-gray-200 rounded-md  bg-white shadow-sm">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-500 text-white ">
              <TableHead className="text-white font-bold text-center">
                사번
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                이름
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                부서
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                직급
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                권한
              </TableHead>
              <TableHead className="text-white font-bold text-center">
                상태
              </TableHead>
              <TableHead className="w-32"></TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-10 text-gray-500"
                >
                  표시할 사용자가 없습니다.
                </TableCell>
              </TableRow>
            ) : (
              users.map((u) => {
                const editing = isEditing(u.id);
                const d = editing ? draft : null;

                return (
                  <TableRow key={u.id} className="hover:bg-gray-50/50">
                    <TableCell>
                      {editing ? (
                        <input
                          value={d?.employeeId ?? ""}
                          onChange={onChangeDraft("employeeId")}
                          className="w-full border rounded-sm px-2 py-1"
                        />
                      ) : (
                        u.employeeId
                      )}
                    </TableCell>

                    <TableCell>
                      {editing ? (
                        <input
                          value={d?.name ?? ""}
                          onChange={onChangeDraft("name")}
                          className="w-full border rounded-sm px-2 py-1"
                        />
                      ) : (
                        u.name
                      )}
                    </TableCell>

                    <TableCell>
                      {editing ? (
                        <select
                          value={d?.department ?? ""}
                          onChange={onChangeDraft("department")}
                          className="w-full border rounded-sm px-2 py-1 bg-white"
                        >
                          <option value="생산팀">생산팀</option>
                          <option value="품질팀">품질팀</option>
                          <option value="설비팀">설비팀</option>
                        </select>
                      ) : (
                        u.department
                      )}
                    </TableCell>

                    <TableCell>
                      {editing ? (
                        <select
                          value={d?.position ?? ""}
                          onChange={onChangeDraft("position")}
                          className="w-full border rounded-sm px-2 py-1 bg-white"
                        >
                          <option value="사원">사원</option>
                          <option value="주임">주임</option>
                          <option value="대리">대리</option>
                        </select>
                      ) : (
                        u.position
                      )}
                    </TableCell>

                    <TableCell className="text-muted-foreground font-medium">
                      {editing ? (
                        <select
                          value={d?.role ?? ""}
                          onChange={onChangeDraft("role")}
                          className="w-full border rounded-sm px-2 py-1 bg-white text-gray-900"
                        >
                          <option value="USER">일반</option>
                          <option value="ADMIN">관리자</option>
                        </select>
                      ) : (
                        roleLabel(u.role)
                      )}
                    </TableCell>

                    <TableCell>
                      {editing ? (
                        <select
                          value={d?.status ?? ""}
                          onChange={onChangeDraft("status")}
                          className="w-full border rounded-sm px-2 py-1 bg-white"
                        >
                          <option value="ACTIVE">활성</option>
                          <option value="INACTIVE">비활성</option>
                        </select>
                      ) : (
                        <span
                          className={
                            u.status === "ACTIVE"
                              ? "text-green-600 font-bold"
                              : "text-gray-500"
                          }
                        >
                          {statusLabel(u.status)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {editing ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            disabled={saving}
                            onClick={onSaveEdit}
                            className="px-2 py-1 border bg-green-600 text-white hover:bg-green-700 rounded-sm disabled:opacity-50"
                          >
                            저장
                          </button>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={onCancelEdit}
                            className="px-2 py-1 border bg-white text-gray-700 hover:bg-gray-100 rounded-sm disabled:opacity-50"
                          >
                            취소
                          </button>
                        </div>
                      ) : (
                        <div className="flex">
                          <button
                            type="button"
                            onClick={() => onStartEdit(u)}
                            className="px-2 py-1 border bg-blue-500 text-white hover:bg-blue-700 rounded-sm mr-2"
                          >
                            수정
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setDeletingUser(u);
                              setIsDeleteOpen(true);
                            }}
                            className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-sm"
                          >
                            삭제
                          </button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <ConfirmModal
        open={isDeleteOpen && !!deletingUser}
        title="삭제 확인"
        message={
          deletingUser ? (
            <>
              <span className="font-semibold">{deletingUser.name}</span>님(사번:{" "}
              {deletingUser.employeeId})을(를) 삭제할까요?
            </>
          ) : null
        }
        confirmText="삭제"
        cancelText="취소"
        loading={saving}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeletingUser(null);
        }}
        onConfirm={async () => {
          if (!deletingUser) return;

          try {
            setSaving(true);
            await onDelete?.(deletingUser);
            toast.success("삭제되었습니다.");
            setIsDeleteOpen(false);
            setDeletingUser(null);
          } catch {
            toast.error("삭제에 실패했습니다.");
          } finally {
            setSaving(false);
          }
        }}
      />
    </>
  );
};

export default UserTable;
