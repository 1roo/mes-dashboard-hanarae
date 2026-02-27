import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { instance } from "../../shared/axios/axios";
import { PAGE_SIZE, initialNewWorkOrderForm } from "./constants";
import type { NewWorkOrderForm, Status, WorkOrder } from "./types";

const calcDueDate = (startDate: string, addDays = 3) => {
  const d = new Date(startDate);
  d.setDate(d.getDate() + addDays);
  return d.toISOString().slice(0, 10);
};

const validateNewForm = (form: NewWorkOrderForm, rows: WorkOrder[]) => {
  if (!form.id.trim()) return "작업지시번호를 입력하세요.";
  if (!form.productName.trim()) return "제품명을 입력해주세요.";

  const planned = Number(form.plannedQty);
  if (!form.plannedQty.trim() || Number.isNaN(planned) || planned <= 0) {
    return "1 이상의 숫자를 입력해주세요.";
  }

  if (!form.startDate) return "지시일을 선택해주세요";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const start = new Date(form.startDate);
  start.setHours(0, 0, 0, 0);

  if (start <= today) return "지시일은 오늘 이후로 선택해주세요.";

  const newId = form.id.trim();
  if (rows.some((r) => r.id === newId))
    return "이미 존재하는 작업지시번호입니다.";

  return null;
};

export const useWorkOrderManagement = () => {
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState<"" | Status>("");
  const [rows, setRows] = useState<WorkOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [newForm, setNewForm] = useState<NewWorkOrderForm>(
    initialNewWorkOrderForm,
  );
  const [page, setPage] = useState(1);

  const fetchWorkOrders = async () => {
    setLoading(true);
    try {
      const res = await instance.get<WorkOrder[]>("/workOrders");
      setRows(res.data);
    } catch (err) {
      toast.error("조회 실패");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkOrders();
  }, []);

  const filteredRows = useMemo(() => {
    const q = keyword.trim();
    return rows.filter(
      (r) =>
        (!q || r.productName.includes(q)) && (!status || r.status === status),
    );
  }, [rows, keyword, status]);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(filteredRows.length / PAGE_SIZE)),
    [filteredRows],
  );

  const pagedRows = useMemo(() => {
    const total = filteredRows.length;
    const end = total - (page - 1) * PAGE_SIZE;
    const start = Math.max(0, end - PAGE_SIZE);
    return filteredRows.slice(start, end);
  }, [filteredRows, page]);

  const onSaveNew = async () => {
    const msg = validateNewForm(newForm, rows);
    if (msg) {
      toast.error(msg);
      return;
    }

    const payload: WorkOrder = {
      id: newForm.id.trim(),
      productName: newForm.productName.trim(),
      plannedQty: Number(newForm.plannedQty),
      completedQty: 0,
      status: "PENDING",
      assignedLine: "",
      startDate: newForm.startDate,
      dueDate: calcDueDate(newForm.startDate, 3),
    };

    setLoading(true);
    try {
      const res = await instance.post<WorkOrder>("/workOrders", payload);
      setRows((prev) => [...prev, res.data]);
      setPage(1);
      setIsAdding(false);
      setNewForm(initialNewWorkOrderForm);
      toast.success("저장되었습니다.");
    } catch (err) {
      toast.error("저장에 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const onUploadExcel = async (data: Partial<WorkOrder>[]) => {
    setLoading(true);
    let successCount = 0;
    try {
      const promises = data.map(async (item) => {
        if (!item.id || !item.productName || !item.startDate) return null;
        if (rows.some((r) => r.id === item.id)) return null;

        const payload: WorkOrder = {
          id: String(item.id),
          productName: item.productName,
          plannedQty: Number(item.plannedQty) || 0,
          completedQty: 0,
          status: "PENDING",
          assignedLine: "",
          startDate: item.startDate,
          dueDate: calcDueDate(item.startDate),
        };
        const res = await instance.post<WorkOrder>("/workOrders", payload);
        successCount++;
        return res.data;
      });

      const results = await Promise.all(promises);
      const addedRows = results.filter((r): r is WorkOrder => r !== null);
      setRows((prev) => [...prev, ...addedRows]);
      toast.success(`${successCount}건 업로드 완료`);
    } catch (err) {
      toast.error("업로드 중 오류 발생");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return {
    keyword,
    setKeyword,
    status,
    setStatus,
    rows,
    loading,
    page,
    setPage,
    totalPages,
    pagedRows,
    filteredRows,
    isAdding,
    newForm,
    onClickAdd: () => {
      setIsAdding(true);
      setNewForm(initialNewWorkOrderForm);
    },
    onChangeNewForm:
      (key: keyof NewWorkOrderForm) =>
      (e: React.ChangeEvent<HTMLInputElement>) =>
        setNewForm((p) => ({ ...p, [key]: e.target.value })),
    onCancelNew: () => setIsAdding(false),
    onSaveNew,
    onUploadExcel,
  };
};
