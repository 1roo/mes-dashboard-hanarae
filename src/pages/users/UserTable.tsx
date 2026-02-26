import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { type User } from "./types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../shared/ui/Table";
import Spinner from "../../shared/ui/Spinner";

type Props = {
  users: User[];
  isLoading: boolean;
  error: string | null;
};

const UserTable = ({ users, isLoading, error }: Props) => {
  const lastErrorRef = useRef<string | null>(null);

  useEffect(() => {
    if (!error) return;
    if (lastErrorRef.current === error) return;

    lastErrorRef.current = error;
    toast.error(error);
  }, [error]);

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-900 hover:bg-slate-900 text-white">
            <TableHead>사번</TableHead>
            <TableHead>이름</TableHead>
            <TableHead>부서</TableHead>
            <TableHead>직급</TableHead>
            <TableHead>권한</TableHead>
            <TableHead>상태</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center py-10 text-gray-500"
              >
                표시할 사용자가 없습니다.
              </TableCell>
            </TableRow>
          ) : (
            users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>{u.employeeId}</TableCell>
                <TableCell>{u.name}</TableCell>
                <TableCell>{u.department}</TableCell>
                <TableCell>{u.position}</TableCell>

                <TableCell className="text-muted-foreground font-medium">
                  {u.role === "ADMIN" ? "관리자" : "일반"}
                </TableCell>

                <TableCell>
                  <span
                    className={
                      u.status === "ACTIVE"
                        ? "text-green-600 font-semibold"
                        : "text-muted-foreground font-semibold"
                    }
                  >
                    {u.status === "ACTIVE" ? "활성" : "비활성"}
                  </span>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
