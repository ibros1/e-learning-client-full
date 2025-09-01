import { useEffect, useState } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";

import "jspdf-autotable";

import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../store/store";
import { listEnrollementsFn } from "../../store/slices/enrollments/listEnrollements";
import MyOrderSkeleton from "../../components/ui/orderSkeleton";
import { Button } from "../../components/ui/button";
import { generateInvoicePDF } from "./pdfGenerator";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "../../components/ui/popover";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200">
          <CheckCircle className="w-4 h-4" />
          Paid
        </span>
      );
    case "IN_PROGRESS":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200">
          <RefreshCcw className="w-4 h-4 animate-spin" />
          In Progress
        </span>
      );
    case "FAILED":
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-800 dark:text-red-200">
          <XCircle className="w-4 h-4" />
          Failed
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 text-sm font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading
        </span>
      );
  }
};

const MyOrder = () => {
  const dispatch = useDispatch<AppDispatch>();
  const listEnrollementsState = useSelector(
    (state: RootState) => state.listEnrollementsSlice
  );
  const loginState = useSelector((state: RootState) => state.loginSlice);
  const userId = loginState.data?.user?.id;

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    dispatch(listEnrollementsFn());
  }, [dispatch]);

  const orders = listEnrollementsState.data?.enrollemnets || [];
  const myOrders = orders.filter((order) => order.userId === userId);

  if (!userId) {
    return (
      <div className="p-10 text-center text-lg text-gray-600 dark:text-gray-300">
        Please log in to view your orders.
      </div>
    );
  }

  if (listEnrollementsState.loading) {
    return <MyOrderSkeleton />;
  }

  return (
    <div className="p-6 md:p-10 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
          My Orders
        </h1>
        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative w-full md:w-72">
            <Search className="absolute top-2.5 left-3 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search orders..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>
      </div>

      {/* Orders List */}
      {myOrders.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 py-12">
          You haven't made any orders yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {myOrders.map((order, idx) => (
            <div
              key={idx}
              className="border rounded-xl p-5 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition"
            >
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {order.created_at
                    ? new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "2-digit",
                      })
                    : "—"}
                </div>

                <Popover
                  open={popoverOpen && selectedOrder?.id === order.id}
                  onOpenChange={setPopoverOpen}
                >
                  <PopoverTrigger asChild>
                    <MoreVertical
                      className="w-4 h-4 text-gray-500 dark:text-gray-400 cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    />
                  </PopoverTrigger>
                  <PopoverContent className="w-72">
                    <div className="space-y-2">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100">
                        Invoice Options
                      </h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Download your order invoice as a PDF.
                      </p>

                      <Button
                        size="sm"
                        className="w-full mt-2"
                        onClick={() => {
                          generateInvoicePDF({
                            ...order,
                            created_at:
                              typeof order.created_at === "string"
                                ? order.created_at
                                : order.created_at?.toISOString?.() ?? "",
                          });
                          setPopoverOpen(false);
                        }}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex items-center gap-3 mb-4">
                {order.users?.profilePhoto ? (
                  <img
                    src={`${order.users.profilePhoto}`}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600" />
                )}
                <div>
                  <div className="font-semibold text-gray-800 dark:text-gray-100">
                    {order.users?.full_name || "Unknown"}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {order.course?.title || "—"}
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  ${order.course?.price?.toFixed(2) ?? "—"}
                </div>
                {getStatusBadge(order.status)}
              </div>
            </div>
          ))}
        </div>
      )}

      {myOrders.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 mt-6 text-center">
          Showing {myOrders.length} {myOrders.length === 1 ? "order" : "orders"}
        </div>
      )}
    </div>
  );
};

export default MyOrder;
