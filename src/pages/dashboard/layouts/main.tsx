"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { DateRange } from "react-day-picker";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import {
  Users,
  CalendarDays,
  TrendingUp,
  LineChart,
  LogIn,
  PieChart as PieIcon,
  ArrowUpRight,
} from "lucide-react";

// Components
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../../components/ui/card";
import { Calendar } from "../../../components/ui/calendar";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../../components/ui/avatar";
import { Progress } from "../../../components/ui/progress";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "../../../components/ui/drawer";

// Store
import type { AppDispatch, RootState } from "../../../store/store";
import { listEnrollementsFn } from "../../../store/slices/enrollments/listEnrollements";
import { listUsersFn } from "../../../store/slices/auth/user/getAllUsers";
import { listCoursesFn } from "../../../store/slices/courses/listCourse";
import { listLessonsFn } from "../../../store/slices/lessons/listLessons";
import { listChaptersFn } from "../../../store/slices/chapters/listChapters";

// Data
const COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const userGrowthData = [
  { name: "Mar", users: 700 },
  { name: "Apr", users: 1500 },
  { name: "May", users: 1000 },
  { name: "Jun", users: 1700 },
  { name: "Jul", users: 2100 },
  { name: "Aug", users: 2500 },
];

const salesData = [
  { name: "Mar", sales: 300 },
  { name: "Apr", sales: 500 },
  { name: "May", sales: 750 },
  { name: "Jun", sales: 1100 },
  { name: "Jul", sales: 1350 },
  { name: "Aug", sales: 1800 },
];

const revenueData = [
  { name: "Courses", value: 65 },
  { name: "Subscriptions", value: 25 },
  { name: "Consulting", value: 10 },
];

const statsData = [
  {
    title: "Total Revenue",
    value: "$42,567",
    change: "+12.5%",
    isPositive: true,
  },
  { title: "Active Users", value: "1,842", change: "+5.2%", isPositive: true },
  { title: "Completion Rate", value: "78%", change: "+3.1%", isPositive: true },
  { title: "Avg. Session", value: "24m", change: "-1.2%", isPositive: false },
];

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    dispatch(listEnrollementsFn());
    dispatch(listUsersFn());
    dispatch(listCoursesFn());
    dispatch(listLessonsFn());
    dispatch(listChaptersFn());
  }, [dispatch]);

  // Store selectors
  const users = useSelector(
    (state: RootState) => state.listUsersSlice.data?.users || []
  );

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-[#091025] dark:to-[#0a142e] min-h-screen w-screen xl:w-full">
      <div className="flex-1 p-4 md:p-6 w-screen xl:w-full">
        {/* Header */}
        <div className="hidden lg:flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Dashboard Overview
          </h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              Last Week
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800">
              Last Month
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 dark:border-gray-700"
            >
              Custom
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <Card
              key={index}
              className="rounded-xl border bg-white dark:bg-[#111827] dark:border-gray-800 shadow-sm transition-all hover:shadow-md"
            >
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-medium">
                      {stat.title}
                    </p>
                    <p className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
                      {stat.value}
                    </p>
                  </div>
                  <Badge
                    variant={stat.isPositive ? "outline" : "destructive"}
                    className="flex items-center gap-1 text-xs bg-opacity-20 dark:bg-opacity-20"
                  >
                    {stat.isPositive ? (
                      <ArrowUpRight
                        size={12}
                        className="text-green-500 dark:text-green-400"
                      />
                    ) : (
                      <ArrowUpRight
                        size={12}
                        className="rotate-180 text-red-500 dark:text-red-400"
                      />
                    )}
                    <span
                      className={
                        stat.isPositive
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }
                    >
                      {stat.change}
                    </span>
                  </Badge>
                </div>
                <Progress
                  value={stat.isPositive ? 75 : 30}
                  className="mt-3 h-1.5 bg-gray-200 dark:bg-gray-800"
                />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          {/* User Growth Chart */}
          <Card className="rounded-xl border bg-white dark:bg-[#111827] dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100">
                  <TrendingUp className="text-green-500 w-4 h-4" /> User Growth
                </CardTitle>
                <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                  Last 6 months
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={userGrowthData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="userGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    stroke="#94a3b8"
                    fontSize={12}
                    tick={{ fill: "#64748b" }}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={12}
                    tick={{ fill: "#64748b" }}
                  />
                  <CartesianGrid
                    strokeDasharray="3 3"
                    strokeOpacity={0.2}
                    stroke="#e2e8f0"
                  />
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      color: "white",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: 12,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    stroke="#6366f1"
                    fill="url(#userGradient)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Revenue Chart */}
          <Card className="rounded-xl border bg-white dark:bg-[#111827] dark:border-gray-800 shadow-sm">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100">
                <PieIcon className="text-purple-500 w-4 h-4" /> Revenue Sources
              </CardTitle>
            </CardHeader>
            <CardContent className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={revenueData}
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent! * 100).toFixed(0)}%`
                    }
                    labelLine={false}
                  >
                    {revenueData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: "#1e293b",
                      color: "white",
                      borderRadius: "8px",
                      border: "none",
                      fontSize: 12,
                    }}
                  />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      fontSize: "12px",
                      paddingTop: "10px",
                      color: "#64748b",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Top Selling Courses */}
        <Card className="rounded-xl border bg-white dark:bg-[#111827] dark:border-gray-800 shadow-sm mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100">
                <LineChart className="text-blue-500 w-4 h-4" /> Top Selling
                Courses
              </CardTitle>
              <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
                Top course sales in last 6 months
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={20}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  tick={{ fill: "#64748b" }}
                />
                <CartesianGrid
                  strokeDasharray="3 3"
                  strokeOpacity={0.2}
                  stroke="#e2e8f0"
                />
                <Tooltip
                  contentStyle={{
                    background: "#1e293b",
                    color: "white",
                    borderRadius: "8px",
                    border: "none",
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="sales" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Calendar & Recent Users */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          {/* Recent Users Card */}
          <div className="lg:col-span-2">
            <Card className="rounded-xl border bg-white dark:bg-[#111827] dark:border-gray-800 shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100">
                  <Users className="text-blue-500 w-4 h-4" /> Recent Users
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                {users.length === 0 ? (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                    No recent users found.
                  </p>
                ) : (
                  users.slice(0, 5).map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded-md transition"
                    >
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`${user.profilePhoto}`} />
                        <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                          {user.full_name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="overflow-hidden flex-1 min-w-0">
                        <p className="font-medium text-gray-800 dark:text-gray-100 truncate text-sm">
                          {user.full_name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <Badge
                        variant={
                          user.role === "ADMIN" ? "default" : "secondary"
                        }
                        className="ml-auto text-xs"
                      >
                        {user.role}
                      </Badge>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>

          {/* Calendar Card */}
          <div>
            <Card className="rounded-xl border bg-white dark:bg-[#111827] dark:border-gray-800 shadow-sm h-full">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base font-semibold text-gray-800 dark:text-gray-100">
                  <CalendarDays className="text-cyan-500 w-4 h-4" /> Calendar
                </CardTitle>
              </CardHeader>
              <CardContent className="dark:bg-[#111827]">
                <Drawer open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                  <div className="hidden lg:block">
                    <Calendar
                      mode="single"
                      selected={dateRange?.from}
                      onSelect={(date) => setDateRange({ from: date })}
                      className="rounded-md border border-gray-200 dark:border-gray-800"
                    />
                  </div>
                  <div className="lg:hidden">
                    <DrawerTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full border-gray-300 dark:border-gray-700"
                      >
                        View Calendar
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent className="h-[70vh] bg-white dark:bg-[#111827]">
                      <div className="p-4">
                        <Calendar
                          mode="single"
                          selected={dateRange?.from}
                          onSelect={(date) => {
                            setDateRange({ from: date });
                            setIsCalendarOpen(false);
                          }}
                          className="rounded-md border border-gray-200 dark:border-gray-800"
                        />
                      </div>
                    </DrawerContent>
                  </div>
                </Drawer>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recent Logins Table */}
        <Card className="rounded-xl border bg-white dark:bg-[#111827] dark:border-gray-800 shadow-sm">
          <CardHeader>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <LogIn className="w-4 h-4 text-blue-500" />
                <CardTitle className="text-base font-semibold text-gray-800 dark:text-gray-100">
                  Recent Logins
                </CardTitle>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 dark:text-gray-300"
              >
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-800">
                    <th className="py-2 px-3 text-left text-xs text-gray-500 dark:text-gray-400">
                      User
                    </th>
                    <th className="py-2 px-3 text-left text-xs text-gray-500 dark:text-gray-400 hidden sm:table-cell">
                      Email
                    </th>
                    <th className="py-2 px-3 text-left text-xs text-gray-500 dark:text-gray-400">
                      Role
                    </th>
                    <th className="py-2 px-3 text-left text-xs text-gray-500 dark:text-gray-400 hidden md:table-cell">
                      Login Time
                    </th>
                    <th className="py-2 px-3 text-left text-xs text-gray-500 dark:text-gray-400">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map((log, idx) => (
                    <tr
                      key={idx}
                      className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="w-6 h-6">
                            <AvatarImage src={`${log.profilePhoto}`} />
                            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                              {log.full_name[0]}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs line-clamp-1 max-w-[80px] text-gray-800 dark:text-gray-100">
                            {log.full_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 text-xs hidden sm:table-cell text-gray-600 dark:text-gray-300">
                        <span className="truncate max-w-[120px] inline-block">
                          {log.email}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={
                            log.role === "ADMIN" ? "default" : "secondary"
                          }
                          className="text-xs"
                        >
                          {log.role}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-xs hidden md:table-cell text-gray-600 dark:text-gray-300">
                        {new Date(log.updated_at).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className="text-xs text-green-600 dark:text-green-400 border-green-300 dark:border-green-700"
                        >
                          Active
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
