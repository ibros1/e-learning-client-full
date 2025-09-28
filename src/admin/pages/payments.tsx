"use client";

import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  flexRender,
  type ColumnDef,
} from "@tanstack/react-table";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  DollarSign,
  TrendingUp,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Input } from "../../components/ui/input";
import { listPaymentsFn } from "../../store/slices/payments/listPayments";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../store/store";

import clsx from "clsx";
import type { Payment } from "../../types/payment";
import { motion } from "framer-motion";
import { PaymentsSkeleton } from "../../components/ui/paymentsSkeleton";
import { Avatar } from "../../components/ui/avatar";

export const Payments = () => {
  const dispatch = useDispatch<AppDispatch>();
  const paymentsState = useSelector(
    (state: RootState) => state.listPaymentsSlice
  );

  const payments = useMemo(() => {
    return (
      paymentsState.data?.payments
        ?.slice()
        .sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        ) ?? []
    );
  }, [paymentsState.data]);

  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    dispatch(listPaymentsFn());
  }, [dispatch]);

  // Static data for cards
  const statsData = [
    {
      title: "Total Revenue",
      value: "$42,567",
      change: "+12.5%",
      isPositive: true,
      icon: <DollarSign className="w-6 h-6" />,
      color: "bg-blue-100 dark:bg-blue-900/50",
      textColor: "text-blue-600 dark:text-blue-300",
    },
    {
      title: "This Week",
      value: "$8,342",
      change: "+3.2%",
      isPositive: true,
      icon: <TrendingUp className="w-6 h-6" />,
      color: "bg-green-100 dark:bg-green-900/50",
      textColor: "text-green-600 dark:text-green-300",
    },
    {
      title: "Last Month",
      value: "$32,890",
      change: "-1.7%",
      isPositive: false,
      icon: <Calendar className="w-6 h-6 " />,
      color: "bg-amber-100 dark:bg-amber-900/50",
      textColor: "text-amber-600 dark:text-amber-300",
    },
    {
      title: "Payment Methods",
      methods: [
        { name: "Zaad", amount: "$18,450", percentage: "58%" },
        { name: "eDahab", amount: "$12,340", percentage: "32%" },
        { name: "Others", amount: "$4,890", percentage: "10%" },
      ],
      icon: <CreditCard className="w-6 h-6" />,
      color: "bg-purple-100 dark:bg-purple-900/50",
      textColor: "text-purple-600 dark:text-purple-300",
    },
  ];

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "id",
      header: "ID",
      cell: (info) => <span>{info.getValue() as string}</span>,
    },
    {
      id: "user",
      header: "User",
      cell: ({ row }) => {
        const user = row.original.user;
        return (
          <div className="flex items-center gap-3">
            <Avatar>
              <img
                src={`${user.profilePhoto ?? ""}`}
                alt={user.full_name}
                className="w-10 h-10 rounded-full object-cover border
              border-gray-300"
              />
            </Avatar>
            <div>
              <p className="font-medium">{user.full_name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "user.role",
      header: "Role",
      cell: (info) => {
        const role = info.getValue() as string;
        return (
          <span
            className={clsx(
              "text-xs font-semibold px-2 py-1 rounded",
              role === "ADMIN"
                ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                : "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
            )}
          >
            {role}
          </span>
        );
      },
    },
    {
      accessorKey: "phone_Number",
      header: "Phone Number",
    },
    {
      accessorKey: "course.title",
      header: "Course",
      cell: (info) => (
        <span className="line-clamp-1 max-w-xs">
          {info.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "amount",
      header: "Amount",
      cell: (info) => `$${info.getValue()}`,
    },
    {
      accessorKey: "currency",
      header: "Currency",
    },
    {
      accessorKey: "payment_method",
      header: "Method",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const status = info.getValue() as string;
        return (
          <span
            className={clsx(
              "text-xs font-semibold px-2 py-1 rounded",
              status === "PAID"
                ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
            )}
          >
            {status}
          </span>
        );
      },
    },
    {
      accessorKey: "transaction_date",
      header: "Date",
      cell: (info) =>
        new Date(info.getValue() as string).toLocaleDateString("en-US", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }),
    },
    {
      accessorKey: "isEnrolled",
      header: "Enroll Status",
      cell: (info) => {
        const isEnrolled = info.getValue() as boolean;
        return (
          <span
            className={clsx(
              "text-xs font-semibold px-2 py-1 rounded",
              isEnrolled === true
                ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300"
                : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
            )}
          >
            {isEnrolled ? "Enrolled" : "Not_Enrolled"}
          </span>
        );
      },
    },
  ];

  const table = useReactTable({
    data: payments,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  if (paymentsState.loading) {
    return <PaymentsSkeleton />;
  }

  return (
    <div className="p-6 dark:bg-[#091025] min-h-screen w-full">
      {/* Stats Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsData.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={clsx(
              "rounded-xl shadow-lg p-6 dark:bg-[#0f172a] overflow-hidden",
              stat.color
            )}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  {stat.title}
                </h3>

                {stat.value ? (
                  <div className="flex items-end gap-2">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    {stat.change && (
                      <span
                        className={clsx(
                          "flex items-center text-sm font-medium",
                          stat.isPositive
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        )}
                      >
                        {stat.isPositive ? (
                          <ArrowUpRight className="w-4 h-4 mr-1" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 mr-1" />
                        )}
                        {stat.change}
                      </span>
                    )}
                  </div>
                ) : null}
              </div>

              <div
                className={clsx("p-3 rounded-lg", stat.color, stat.textColor)}
              >
                {stat.icon}
              </div>
            </div>

            {stat.methods && (
              <div className="mt-4 space-y-3">
                {stat.methods.map((method, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {method.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {method.amount}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                        {method.percentage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-6">
        <Input
          placeholder="Search payments..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full max-w-lg px-4 py-2 rounded-md border dark:border-gray-700 dark:bg-[#0f172a] dark:text-white shadow-sm"
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-[#0f172a]">
        <table className="min-w-full text-sm text-left text-gray-800 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-800 sticky top-0 z-10">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={clsx(
                      "px-4 py-3 font-semibold whitespace-nowrap border-b border-gray-200 dark:border-gray-700",
                      header.column.getCanSort() && "cursor-pointer select-none"
                    )}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                  >
                    <div className="flex items-center gap-1">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() &&
                        ({
                          asc: <ChevronUp className="h-4 w-4" />,
                          desc: <ChevronDown className="h-4 w-4" />,
                        }[header.column.getIsSorted() as string] ??
                          null)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.map((row, idx) => (
              <tr
                key={row.id}
                className={clsx(
                  "border-b dark:border-gray-700 transition-colors",
                  idx % 2 === 0
                    ? "bg-white dark:bg-[#0f172a]"
                    : "bg-gray-50 dark:bg-[#132033]",
                  "hover:bg-gray-100 dark:hover:bg-[#1a2b45]"
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-4 py-3">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {table.getRowModel().rows.length === 0 && (
          <div className="text-center py-6 text-gray-500 dark:text-gray-400">
            No payments found.
          </div>
        )}
      </div>
    </div>
  );
};
