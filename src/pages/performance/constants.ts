export const formatDateTime = (iso: string) => {
  if (!iso) return "";
  const date = iso.slice(5, 10);
  const time = iso.slice(11, 16);
  return `${date} ${time}`;
};

export const PAGE_SIZE = 10;
