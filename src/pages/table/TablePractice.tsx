import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shared/ui/Table";

interface User {
  id: number;
  name: string;
  email: string;
}

const initialData: User[] = [
  { id: 1, name: "김철수", email: "chulsoo@example.com" },
  { id: 2, name: "이영희", email: "younghee@example.com" },
  { id: 3, name: "박지성", email: "jisung@example.com" },
];

const TablePractice = () => {
  // --- 공통 스타일 변수 ---
  // input과 일반 텍스트의 높이를 일치시키기 위해 h-8 정도로 고정
  const inputStyles =
    "w-full border rounded px-2 py-1 h-8 outline-none focus:ring-2 focus:ring-blue-500 bg-white";
  const cellHeight = "h-12"; // 셀의 높이를 충분히 고정하여 input 전환 시 밀림 방지

  // --- 상태 관리 ---
  const [inlineData, setInlineData] = useState<User[]>(initialData);
  const [editingCell, setEditingCell] = useState<{
    id: number;
    field: keyof User;
  } | null>(null);

  const [rowData, setRowData] = useState<User[]>(initialData);
  const [editRowId, setEditRowId] = useState<number | null>(null);
  const [tempRowData, setTempRowData] = useState<User | null>(null);

  const [globalData, setGlobalData] = useState<User[]>(initialData);
  const [isGlobalEdit, setIsGlobalEdit] = useState(false);
  const [tempGlobalData, setTempGlobalData] = useState<User[]>(initialData);

  // --- 로직 핸들러 ---
  const handleGlobalInputChange = (
    id: number,
    field: keyof User,
    value: string,
  ) => {
    setTempGlobalData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  };

  const saveGlobalEdit = () => {
    setGlobalData([...tempGlobalData]);
    setIsGlobalEdit(false);
  };

  return (
    <div className="space-y-16 max-w-5xl mx-auto">
      {/* --- 방식 1: 셀 클릭 수정 --- */}
      <section>
        <h2 className="text-xl font-bold mb-4">
          1. 셀 클릭 수정 (열 너비 고정)
        </h2>
        <div className="border rounded-lg overflow-hidden">
          {/* table-fixed: 내용에 상관없이 고정된 너비를 유지하게 함 */}
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3">이름</TableHead>
                <TableHead className="w-2/3">이메일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inlineData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell
                    className={`${cellHeight} cursor-pointer hover:bg-slate-50`}
                    onClick={() =>
                      setEditingCell({ id: user.id, field: "name" })
                    }
                  >
                    {editingCell?.id === user.id &&
                    editingCell?.field === "name" ? (
                      <input
                        autoFocus
                        className={inputStyles}
                        defaultValue={user.name}
                        onBlur={(e) => {
                          setInlineData((prev) =>
                            prev.map((u) =>
                              u.id === user.id
                                ? { ...u, name: e.target.value }
                                : u,
                            ),
                          );
                          setEditingCell(null);
                        }}
                      />
                    ) : (
                      <div className="px-2">{user.name}</div>
                    )}
                  </TableCell>
                  <TableCell
                    className={`${cellHeight} cursor-pointer hover:bg-slate-50`}
                    onClick={() =>
                      setEditingCell({ id: user.id, field: "email" })
                    }
                  >
                    {editingCell?.id === user.id &&
                    editingCell?.field === "email" ? (
                      <input
                        autoFocus
                        className={inputStyles}
                        defaultValue={user.email}
                        onBlur={(e) => {
                          setInlineData((prev) =>
                            prev.map((u) =>
                              u.id === user.id
                                ? { ...u, email: e.target.value }
                                : u,
                            ),
                          );
                          setEditingCell(null);
                        }}
                      />
                    ) : (
                      <div className="px-2 truncate">{user.email}</div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* --- 방식 2: 행 수정 --- */}
      <section>
        <h2 className="text-xl font-bold mb-4">2. 행 단위 수정 (Row)</h2>
        <div className="border rounded-lg overflow-hidden">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30%]">이름</TableHead>
                <TableHead className="w-[45%]">이메일</TableHead>
                <TableHead className="w-[25%] text-center">관리</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rowData.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className={cellHeight}>
                    {editRowId === user.id ? (
                      <input
                        className={inputStyles}
                        value={tempRowData?.name}
                        onChange={(e) =>
                          setTempRowData({
                            ...tempRowData!,
                            name: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="px-2">{user.name}</div>
                    )}
                  </TableCell>
                  <TableCell className={cellHeight}>
                    {editRowId === user.id ? (
                      <input
                        className={inputStyles}
                        value={tempRowData?.email}
                        onChange={(e) =>
                          setTempRowData({
                            ...tempRowData!,
                            email: e.target.value,
                          })
                        }
                      />
                    ) : (
                      <div className="px-2 truncate">{user.email}</div>
                    )}
                  </TableCell>
                  <TableCell className={`${cellHeight} text-center`}>
                    {editRowId === user.id ? (
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setRowData(
                              rowData.map((u) =>
                                u.id === user.id ? tempRowData! : u,
                              ),
                            );
                            setEditRowId(null);
                          }}
                          className="text-blue-600 font-bold hover:underline"
                        >
                          저장
                        </button>
                        <button
                          onClick={() => {
                            setEditRowId(null); // 수정 모드 종료 (tempRowData는 자동 폐기)
                            setTempRowData(null);
                          }}
                          className="text-red-500 hover:underline"
                        >
                          취소
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditRowId(user.id);
                          setTempRowData(user);
                        }}
                        className="text-gray-500 hover:text-black transition-colors"
                      >
                        수정
                      </button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* --- 방식 3: 표 전체 수정 (Global) --- */}
      <section className="bg-slate-50 rounded-xl ">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-slate-800">
            3. 표 전체 수정 (Global Edit)
          </h2>
          <div className="space-x-2">
            {isGlobalEdit ? (
              <>
                <button
                  onClick={saveGlobalEdit}
                  className="bg-green-600 text-white px-4 py-2 rounded-md font-medium shadow-sm hover:bg-green-700"
                >
                  전체 저장
                </button>
                <button
                  onClick={() => setIsGlobalEdit(false)}
                  className="bg-white border px-4 py-2 rounded-md font-medium hover:bg-gray-50"
                >
                  취소
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setTempGlobalData([...globalData]);
                  setIsGlobalEdit(true);
                }}
                className="bg-slate-800 text-white px-4 py-2 rounded-md font-medium hover:bg-slate-700"
              >
                표 전체 수정 모드
              </button>
            )}
          </div>
        </div>

        <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead className="w-16 px-4">ID</TableHead>
                <TableHead className="w-1/3">이름</TableHead>
                <TableHead>이메일</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(isGlobalEdit ? tempGlobalData : globalData).map((user) => (
                <TableRow key={user.id}>
                  <TableCell
                    className={`${cellHeight} px-4 font-mono text-slate-400 text-sm`}
                  >
                    {user.id}
                  </TableCell>
                  <TableCell className={cellHeight}>
                    {isGlobalEdit ? (
                      <input
                        className={`${inputStyles} border-blue-200 focus:border-blue-500`}
                        value={user.name}
                        onChange={(e) =>
                          handleGlobalInputChange(
                            user.id,
                            "name",
                            e.target.value,
                          )
                        }
                      />
                    ) : (
                      <div className="px-2 text-slate-700">{user.name}</div>
                    )}
                  </TableCell>
                  <TableCell className={cellHeight}>
                    {isGlobalEdit ? (
                      <input
                        className={`${inputStyles} border-blue-200 focus:border-blue-500`}
                        value={user.email}
                        onChange={(e) =>
                          handleGlobalInputChange(
                            user.id,
                            "email",
                            e.target.value,
                          )
                        }
                      />
                    ) : (
                      <div className="px-2 text-slate-700 truncate">
                        {user.email}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
};

export default TablePractice;
