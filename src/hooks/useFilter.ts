import { useState, useMemo } from "react";

// นิยามโครงสร้าง Artist ให้ชัดเจน
interface Artist {
  name: string;
  [key: string]: unknown;
}

// กำหนด Interface สำหรับข้อมูลที่สามารถนำมา Filter ได้
interface FilterableItem {
  id?: string | number;
  date?: string | number | Date | null; // เพิ่ม null
  artist?: Artist | Artist[] | null; // เพิ่ม null
  type?: string | null; // เพิ่ม null (จุดที่เกิด Error)
  title?: string | null; // เพิ่ม null
  name?: string | null; // เพิ่ม null
  [key: string]: unknown;
}

export const useFilter = <T extends FilterableItem>(initialData: T[]) => {
  const [filterArtist, setFilterArtist] = useState<string>("All");
  const [filterType, setFilterType] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const handleReset = () => {
    setFilterArtist("All");
    setFilterType("All");
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setSortOrder("desc");
  };

  const filteredItems = useMemo(() => {
    if (!initialData) return [];

    return initialData
      .filter((item) => {
        // 1. Filter Date - ใช้ datetimetz เป็นหลัก, fallback ไปใช้ date
        const dateSource =
          (item as unknown as { datetimetz?: string }).datetimetz || item.date;
        const itemDate = dateSource ? new Date(dateSource).getTime() : 0;
        const start = startDate ? new Date(startDate).getTime() : -Infinity;
        const end = endDate
          ? new Date(endDate + "T23:59:59").getTime()
          : Infinity;
        const matchDate = itemDate >= start && itemDate <= end;

        // 2. Filter Artist (Type-safe check)
        let matchArtist = filterArtist === "All";
        if (!matchArtist && item.artist) {
          if (Array.isArray(item.artist)) {
            // กรณีเป็น Array: ตรวจสอบว่ามี artist คนไหนใน list ที่ชื่อตรงกับ filter ไหม
            matchArtist = item.artist.some((a) => a.name === filterArtist);
          } else {
            // กรณีเป็น Object เดี่ยว
            matchArtist = item.artist.name === filterArtist;
          }
        }

        // 3. Filter Type
        const matchType =
          filterType === "All" ||
          item.result === filterType ||
          item.type === filterType;

        // 4. Filter Search
        const nameToSearch = (item.title || item.name || "").toLowerCase();
        const matchSearch = nameToSearch.includes(searchTerm.toLowerCase());

        return matchArtist && matchType && matchSearch && matchDate;
      })
      .sort((a, b) => {
        // ใช้ datetimetz เป็นหลัก, fallback ไปใช้ date
        const dateSourceA =
          (a as unknown as { datetimetz?: string }).datetimetz || a.date;
        const dateSourceB =
          (b as unknown as { datetimetz?: string }).datetimetz || b.date;
        const dateA = dateSourceA ? new Date(dateSourceA).getTime() : 0;
        const dateB = dateSourceB ? new Date(dateSourceB).getTime() : 0;

        if (dateA !== dateB) {
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        }

        const titleA = a.title || a.name || "";
        const titleB = b.title || b.name || "";
        return sortOrder === "desc"
          ? titleB.localeCompare(titleA)
          : titleA.localeCompare(titleB);
      });
  }, [
    initialData,
    filterArtist,
    filterType,
    searchTerm,
    startDate,
    endDate,
    sortOrder,
  ]);

  return {
    state: {
      filterArtist,
      filterType,
      searchTerm,
      startDate,
      endDate,
      sortOrder,
    },
    setters: {
      setFilterArtist,
      setFilterType,
      setSearchTerm,
      setStartDate,
      setEndDate,
      setSortOrder,
    },
    handleReset,
    filteredItems,
  };
};
