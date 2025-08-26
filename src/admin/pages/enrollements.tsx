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

type StatusType = "ALL" | "COMPLETED" | "IN_PROGRESS" | "FAILED";

const statusOptions: { label: string; value: StatusType }[] = [
  { label: "All", value: "ALL" },
  { label: "Completed", value: "COMPLETED" },
  { label: "Pending", value: "IN_PROGRESS" },
  { label: "Failed", value: "FAILED" },
];

const Enrollments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector(
    (state: RootState) => state.listEnrollementsSlice
  );
  const enrollments = data?.enrollemnets || [];

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusType>("ALL");

  useEffect(() => {
    dispatch(listEnrollementsFn());
  }, [dispatch]);

  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enr) => {
      const matchesStatus =
        statusFilter === "ALL" ? true : enr.status === statusFilter;

      const matchesSearch =
        enr.users!.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enr.users!.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        enr.course!.title.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesStatus && matchesSearch;
    });
  }, [enrollments, searchTerm, statusFilter]);

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
      icon: <Loader2 className=" w-6 h-6 animate-spin " />,
      color: "yellow",
    },
    {
      title: "Failed",
      value: stats.failed,
      icon: <XCircle />,
      color: "red",
    },
  ];

  const enrollementsList = useSelector(
    (state: RootState) => state.listEnrollementsSlice
  );

  if (enrollementsList.loading) {
    return <LessonsSkeleton />;
  }

  return (
    <div className="p-6 dark:bg-[#091025] min-h-screen text-gray-900 dark:text-white">
      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {infoCards.map((card, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-sm rounded-2xl p-6 flex items-center gap-4 hover:shadow-lg transition-transform hover:scale-[1.02]"
          >
            <div
              className={`p-3 rounded-full bg-${card.color}-200 dark:bg-${card.color}-800`}
            >
              {React.cloneElement(card.icon, {
                className: `text-2xl text-${card.color}-700 dark:text-${
                  card.color
                }-200 ${card.color === "yellow" ? "animate-spin" : ""}`,
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

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by name, email, or course"
          className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white w-full sm:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition ${
                statusFilter === option.value
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase font-semibold text-muted-foreground">
            <tr>
              <th className="px-4 py-3 whitespace-nowrap">#</th>
              <th className="px-6 py-3 text-left">Full Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Course Title</th>
              <th className="px-4 py-3">Course ID</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Progress</th>
              <th className="px-4 py-3">Enrolled</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            {filteredEnrollments.length === 0 ? (
              <tr>
                <td
                  colSpan={12}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No enrollments found.
                </td>
              </tr>
            ) : (
              filteredEnrollments.map((enr) => (
                <tr
                  key={enr.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {enr.id}
                  </td>
                  <td className="px-6 py-2 flex items-center gap-2 whitespace-nowrap">
                    <img
                      src={`${enr.users!.profilePhoto}`}
                      alt={enr.users!.full_name}
                      className="w-10 h-10 rounded-full object-cover shadow"
                    />
                    <span>{enr.users!.full_name}</span>
                  </td>
                  <td className="px-4 py-2 max-w-[180px] truncate text-blue-700 dark:text-blue-400">
                    <div className="flex gap-2 items-center">
                      <Mail className="w-4 h-4" />
                      <span>{enr.users!.email}</span>
                    </div>
                  </td>
                  <td className="px-4 py-2">{enr.users!.phone_number}</td>
                  <td className="px-4 py-2 max-w-[200px] truncate">
                    {enr.course!.title}
                  </td>
                  <td className="px-4 py-2">{enr.course!.id}</td>
                  <td className="px-4 py-2 text-green-600 dark:text-green-400">
                    <BadgeDollarSign className="w-4 h-4 inline" /> $
                    {enr.course!.price}
                  </td>
                  <td className="px-4 py-2">{enr.progress}%</td>
                  <td className="px-4 py-2">
                    {String(enr.is_enrolled).toUpperCase()}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        enr.status === "COMPLETED"
                          ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-300"
                          : enr.status === "IN_PROGRESS"
                          ? "bg-yellow-100    text-yellow-700 dark:bg-yellow-800 dark:text-yellow-300"
                          : "bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-300"
                      }`}
                    >
                      {enr.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarClock className="w-4 h-4" />
                      {new Date(enr.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex gap-2">
                      <EditEnrolls enrollement={enr} />
                      <DeleteEnrolls enrollement={enr} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Enrollments;
