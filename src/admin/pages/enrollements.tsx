import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";
import { listEnrollementsFn } from "../../store/slices/enrollments/listEnrollements";

import {
  BookOpenCheck,
  CheckCircle,
  Loader2,
  XCircle,
  Mail,
  BadgeDollarSign,
  CalendarClock,
} from "lucide-react";

import EditEnrolls from "../components/enrolls/EditEnrolls";
import DeleteEnrolls from "../components/enrolls/deleteEnrolls";
import LessonsSkeleton from "../../components/ui/LessonsSkeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";

// ---------------- Types ----------------
type StatusType = "ALL" | "COMPLETED" | "IN_PROGRESS" | "FAILED";
type SortKey =
  | "id"
  | "full_name"
  | "email"
  | "phone"
  | "course"
  | "price"
  | "progress"
  | "status"
  | "created_at";

// ---------------- Filter Options ----------------
const statusOptions: { label: string; value: StatusType }[] = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "IN_PROGRESS" },
  { label: "Failed", value: "FAILED" },
];

// ---------------- Main Component ----------------
const Enrollments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector(
    (state: RootState) => state.listEnrollementsSlice
  );
  const enrollments = data?.enrollemnets || [];

  // Local State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusType>("ALL");
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Fetch Enrollments
  useEffect(() => {
    dispatch(listEnrollementsFn());
  }, [dispatch]);

  // Handle Sorting
  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // Filter + Search + Sort
  const filteredEnrollments = useMemo(() => {
    let list = enrollments.filter((enr) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : enr.status === statusFilter;

      const matchesSearch =
        enr.users!.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enr.users!.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enr.course!.title.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });

    list.sort((a, b) => {
      const valA =
        sortKey === "full_name"
          ? a.users!.full_name
          : sortKey === "email"
          ? a.users!.email
          : sortKey === "phone"
          ? a.users!.phone_number
          : sortKey === "course"
          ? a.course!.title
          : (a as any)[sortKey];

      const valB =
        sortKey === "full_name"
          ? b.users!.full_name
          : sortKey === "email"
          ? b.users!.email
          : sortKey === "phone"
          ? b.users!.phone_number
          : sortKey === "course"
          ? b.course!.title
          : (b as any)[sortKey];

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return list;
  }, [enrollments, searchTerm, statusFilter, sortKey, sortOrder]);

  // Stats
  const stats = {
    total: enrollments.length,
    completed: enrollments.filter((e) => e.status === "COMPLETED").length,
    pending: enrollments.filter((e) => e.status === "IN_PROGRESS").length,
    failed: enrollments.filter((e) => e.status === "FAILED").length,
  };

  const infoCards = [
    {
      title: "Total Enrollments",
      value: stats.total,
      icon: <BookOpenCheck />,
      color: "blue",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: <CheckCircle />,
      color: "green",
    },
    {
      title: "Pending",
      value: stats.pending,
      icon: <Loader2 className="w-6 h-6 animate-spin" />,
      color: "yellow",
    },
    { title: "Failed", value: stats.failed, icon: <XCircle />, color: "red" },
  ];

  // Loading State
  if (loading) return <LessonsSkeleton />;

  return (
    <div className="p-6 dark:bg-[#091025] min-h-screen text-gray-900 dark:text-white">
      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {infoCards.map((card, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-transform hover:scale-[1.02]"
          >
            <div
              className={`p-3 rounded-full bg-${card.color}-200 dark:bg-${card.color}-800`}
            >
              {React.cloneElement(card.icon, {
                className: `text-2xl text-${card.color}-700 dark:text-${card.color}-200`,
              })}
            </div>
            <div>
              <div className="text-3xl font-bold">{card.value}</div>
              <div className="text-sm font-medium uppercase text-gray-600 dark:text-gray-400">
                {card.title}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or course"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                statusFilter === opt.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              {[
                { key: "id", label: "#" },
                { key: "full_name", label: "Full Name" },
                { key: "email", label: "Email" },
                { key: "phone", label: "Phone" },
                { key: "course", label: "Course Title" },
                { key: "courseId", label: "Course ID" },
                { key: "price", label: "Price" },
                { key: "progress", label: "Progress" },
                { key: "is_enrolled", label: "Enrolled" },
                { key: "status", label: "Status" },
                { key: "created_at", label: "Created" },
                { key: "actions", label: "Actions" },
              ].map((col) => (
                <TableHead
                  key={col.key}
                  className="cursor-pointer select-none"
                  onClick={() =>
                    col.key !== "actions" && handleSort(col.key as SortKey)
                  }
                >
                  {col.label}
                  {sortKey === col.key && (sortOrder === "asc" ? " ▲" : " ▼")}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {filteredEnrollments.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No enrollments found.
                </TableCell>
              </TableRow>
            ) : (
              filteredEnrollments.map((enr) => (
                <TableRow
                  key={enr.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <TableCell>{enr.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <img
                        src={enr.users!.profilePhoto}
                        alt={enr.users!.full_name}
                        className="w-10 h-10 rounded-full object-cover shadow"
                      />
                      <span className="truncate">{enr.users!.full_name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="truncate max-w-[220px] text-blue-700 dark:text-blue-400">
                    <div className="flex gap-2 items-center">
                      <Mail className="w-4 h-4" />
                      <span className="truncate">{enr.users!.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{enr.users!.phone_number}</TableCell>
                  <TableCell>{enr.course!.title}</TableCell>
                  <TableCell>{enr.course!.id}</TableCell>
                  <TableCell className="text-green-600 dark:text-green-400">
                    <BadgeDollarSign className="w-4 h-4 inline" /> $
                    {enr.course!.price}
                  </TableCell>
                  <TableCell>{enr.progress}%</TableCell>
                  <TableCell>{String(enr.is_enrolled).toUpperCase()}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        enr.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                          : enr.status === "IN_PROGRESS"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                      }`}
                    >
                      {enr.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarClock className="w-4 h-4" />
                      {new Date(enr.created_at).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <EditEnrolls enrollement={enr} />
                      <DeleteEnrolls enrollement={enr} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default Enrollments;
