import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Loader2,
  Trash2,
  Pencil,
  Users,
  UserCheck,
  GraduationCap,
  BookUser,
  Shield,
} from "lucide-react";
import type { AppDispatch, RootState } from "../../store/store";
import { listUsersFn_admins } from "../../store/slices/auth/user/getAllUsersAsAdmin";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useNavigate } from "react-router";
import { Label } from "../../components/ui/label";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../components/ui/alert-dialog";
import {
  resetUpdateUserFn,
  updateUserFn,
} from "../../store/slices/auth/user/updateUser";
import {
  resetUpdatedRoleState,
  updateRoleFn,
} from "../../store/slices/auth/user/updateRole";
import toast from "react-hot-toast";
import {
  deleteUserFn,
  resetDeleteUserState,
} from "../../store/slices/auth/user/deleteUser";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { updateUserInLogin } from "../../store/slices/auth/login";
import Spinner from "../../components/spinner";

const UsersAdmins = () => {
  const dispatch = useDispatch<AppDispatch>();
  const userState = useSelector(
    (state: RootState) => state.listUsers_Admins_Slice
  );

  const users =
    userState.data?.users
      ?.slice()
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ) || [];
  const navigate = useNavigate();
  const [isEditUserDailogOpen, setIsEditDialogUserOpen] = useState(false);

  const updateState = useSelector((state: RootState) => state.updateUserSlice);
  const updateRoleState = useSelector(
    (state: RootState) => state.updateRoleSlice
  );

  const [fullName, setFullname] = useState("");
  const [userName, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);
  const [role, setRole] = useState("");

  const [selectedUser, setSelectedUser] = useState<{
    id: number;
    full_name: string;
    username: string;
    email: string;
    phone_number: string;
    role: string;
    profilePhoto: string;
    updated_at: string;
  } | null>(null);
  const user = selectedUser;

  // Calculate summary statistics
  const totalUsers = users.length;
  const activeUsers = users.filter((user) => user.is_active).length;
  const totalStudents = users.filter((user) => user.role === "STUDENT").length;
  const totalInstructors = users.filter(
    (user) => user.role === "INSTRUCTOR"
  ).length;
  const totalAdmins = users.filter((user) => user.role === "ADMIN").length;

  useEffect(() => {
    if (selectedUser) {
      setFullname(selectedUser.full_name);
      setUsername(selectedUser.username);
      setEmail(selectedUser.email);
      setPhoneNumber(selectedUser.phone_number);
      setRole(selectedUser.role?.toUpperCase() || "STUDENT");
    }
  }, [selectedUser]);

  useEffect(() => {
    dispatch(listUsersFn_admins());
  }, [dispatch]);

  const updateUserHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!fullName || !userName || !email) {
      toast.error("Full name, username, and email are required.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("id", user.id.toString());
      formData.append("email", email);
      formData.append("fullName", fullName);
      formData.append("username", userName);
      formData.append("phone_number", phoneNumber);
      formData.append("password", password);
      if (profilePhoto) formData.append("profilePhoto", profilePhoto);
      if (coverPhoto) formData.append("coverPhoto", coverPhoto);

      const updateUserAction = await dispatch(updateUserFn(formData));
      const updatedUser = updateUserAction.payload;

      if (updateUserFn.fulfilled.match(updateUserAction)) {
        const updateRoleAction = await dispatch(
          updateRoleFn({
            email: email,
            role: role,
          })
        );

        if (updateRoleFn.fulfilled.match(updateRoleAction)) {
          toast.dismiss();
          toast.success("User updated successfully!");
          const loggedInUserId = updateState?.data?.user?.id;
          if (updatedUser.id === loggedInUserId) {
            dispatch(updateUserInLogin(updatedUser));
          }
          setIsEditDialogUserOpen(false);
          dispatch(listUsersFn_admins());
          dispatch(resetUpdateUserFn());
          dispatch(resetUpdatedRoleState());
        } else {
          toast.error("Failed to update user role.");
        }
      } else if (updateRoleState.loading) {
        toast.dismiss();
        toast.loading("updating....");
        return;
      } else {
        toast.dismiss();
        toast.error("Failed to update user details.");
        return;
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong.");
    }
  };

  const [isDeletedDailogOpen, setIsDeletedDailogOpen] = useState(false);
  const deleteHandler = (userId: number) => {
    dispatch(deleteUserFn(userId));
  };
  const deleteState = useSelector((state: RootState) => state.deleteUserSlice);

  useEffect(() => {
    if (deleteState.error) {
      toast.error(deleteState.error);
      return;
    }
    if (deleteState.data.isSuccess) {
      toast.success("User deleted successfully!");
      dispatch(listUsersFn_admins());
      dispatch(resetDeleteUserState());
    }
  }, [deleteState, dispatch]);

  return (
    <div className="p-6 dark:bg-[#091025] min-h-screen transition-colors duration-300">
      <h2 className="text-3xl font-bold mb-6 tracking-tight dark:text-white">
        User Management
      </h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {/* Total Users Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 p-3 rounded-full mr-4">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalUsers}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Total Users
              </div>
            </div>
          </div>
        </div>

        {/* Active Users Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 p-3 rounded-full mr-4">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {activeUsers}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Active Users
              </div>
            </div>
          </div>
        </div>

        {/* Students Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300 p-3 rounded-full mr-4">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalStudents}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Students
              </div>
            </div>
          </div>
        </div>

        {/* Instructors Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300 p-3 rounded-full mr-4">
              <BookUser className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalInstructors}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Instructors
              </div>
            </div>
          </div>
        </div>

        {/* Admins Card */}
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 p-3 rounded-full mr-4">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalAdmins}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Administrators
              </div>
            </div>
          </div>
        </div>
      </div>

      {userState.loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <Loader2 className="animate-spin h-8 w-8 text-muted-foreground dark:text-gray-400" />
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-muted-foreground dark:text-gray-400">
          No users found.
        </div>
      ) : (
        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700 text-sm">
            <thead className="bg-gray-100 dark:bg-gray-800 text-xs uppercase font-semibold text-muted-foreground">
              <tr>
                <th className="px-4 py-3">#</th>
                <th className="px-6 py-3 text-left">User</th>
                <th className="px-4 py-3">Username</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Enrollments</th>
                <th className="px-4 py-3">Courses Created</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {users.length === 0 ? (
                <tr>
                  <td
                    colSpan={14}
                    className="text-center py-6 text-gray-500 dark:text-gray-400"
                  >
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => {
                  return (
                    <tr
                      key={user.id}
                      className="hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                    >
                      <td className="px-4 py-3 text-muted-foreground text-center">
                        {user.id}
                      </td>
                      <td className="px-6 py-2 flex items-center gap-2 whitespace-nowrap">
                        <img
                          src={
                            user.profilePhoto
                              ? `${user.profilePhoto}`
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  user.full_name
                                )}`
                          }
                          alt="Profile"
                          className="w-10 h-10 rounded-full object-cover border shadow-sm"
                        />
                        <span
                          onClick={() =>
                            navigate(`/dashboard/students/${user.id}`)
                          }
                          className="cursor-pointer font-medium dark:text-blue-400 hover:underline truncate max-w-[200px]"
                          title={user.full_name}
                        >
                          {user.full_name}
                        </span>
                      </td>
                      <td className="px-4 py-2 truncate">@{user.username}</td>
                      <td className="px-4 py-2 text-center">
                        {user.phone_number || "-"}
                      </td>
                      <td className="px-6 py-2 max-w-full truncate text-blue-700 dark:text-blue-400">
                        <div className="flex gap-2 ">
                          <span>
                            {user.email.length > 30
                              ? user.email.slice(0, 30) + "...."
                              : user.email}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.role === "ADMIN"
                              ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                              : user.role === "INSTRUCTOR"
                              ? "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.enrollements?.length ?? 0}
                      </td>
                      <td className="px-4 py-2 text-center">
                        {user.courses?.length ?? 0}
                      </td>

                      <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                        {new Date(user.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 text-center">
                        {new Date(user.updated_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "2-digit",
                        })}
                      </td>
                      <td className="px-4 py-2 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            user.is_active
                              ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                              : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                          }`}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-center">
                        <div className="flex justify-center gap-2">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-blue-100 dark:hover:bg-blue-900 text-blue-600 dark:text-blue-400"
                            onClick={() => {
                              setIsEditDialogUserOpen(true);
                              // Reset file states
                              setProfilePhoto(null);
                              setCoverPhoto(null);
                              setSelectedUser({
                                ...user,
                                updated_at:
                                  typeof user.updated_at === "string"
                                    ? user.updated_at
                                    : user.updated_at?.toISOString?.() ?? "",
                              });
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="hover:bg-red-100 dark:hover:bg-red-900 text-red-600 dark:text-red-400"
                            onClick={() => {
                              setIsDeletedDailogOpen(true);
                              setSelectedUser({
                                ...user,
                                updated_at:
                                  typeof user.updated_at === "string"
                                    ? user.updated_at
                                    : user.updated_at?.toISOString?.() ?? "",
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
      <Dialog
        open={isEditUserDailogOpen}
        onOpenChange={setIsEditDialogUserOpen}
      >
        <DialogContent className="sm:max-w-[98vw] md:max-w-[650px] lg:max-w-[800px] max-h-[90vh] overflow-auto rounded-2xl xl:max-w-[900px] bg-white dark:bg-neutral-900 shadow-xl border border-gray-200 dark:border-neutral-800 transition-colors duration-300">
          <form onSubmit={updateUserHandler}>
            <DialogHeader>
              <DialogTitle className="text-2xl font-extrabold dark:text-white tracking-tight">
                Edit User Profile
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
                Update user details below
              </DialogDescription>
            </DialogHeader>

            {/* Profile Preview */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <div className="relative">
                <img
                  src={
                    profilePhoto
                      ? URL.createObjectURL(profilePhoto)
                      : user?.profilePhoto
                      ? `${user?.profilePhoto}`
                      : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          user?.full_name || ""
                        )}&background=fff&color=222`
                  }
                  alt="Profile"
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-white object-cover shadow-lg transition-transform duration-300 hover:scale-105"
                />
                <span className="absolute bottom-0 right-0 bg-white text-gray-800 rounded-full p-1 text-xs shadow-md">
                  ✎
                </span>
              </div>
              <span className="font-semibold text-lg dark:text-white">
                {fullName || user?.full_name}
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-neutral-800 px-2 py-1 rounded-full">
                @{userName || user?.username}
              </span>
            </div>

            <div className="grid gap-5 py-2">
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={fullName}
                  onChange={(e) => setFullname(e.target.value)}
                  className="dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Username
                </Label>
                <Input
                  id="Username"
                  value={userName}
                  onChange={(e) => setUsername(e.target.value)}
                  className="dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                  required
                  type="email"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Change password (optional)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Role
                </Label>
                <select
                  name="role"
                  id="role"
                  className="py-2 px-2 border rounded-md dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                  value={role || user?.role?.toUpperCase() || ""}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="STUDENT">STUDENT</option>
                  <option value="INSTRUCTOR">INSTRUCTOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  type="tel"
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Change Profile Photo
                </Label>
                <Input
                  id="profilePhoto"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      setProfilePhoto(file);
                    }
                  }}
                  className="dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                />
              </div>
              <div className="grid gap-2">
                <Label className="text-gray-800 dark:text-white font-medium">
                  Change Cover Photo
                </Label>
                <Input
                  id="coverPhoto"
                  type="file"
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.currentTarget.files?.[0];
                    if (file) {
                      setCoverPhoto(file);
                    }
                  }}
                  className="dark:bg-neutral-800 dark:text-white bg-white text-gray-800 border-gray-200 focus:border-gray-400"
                />
              </div>
            </div>

            {/* Extra Features */}
            <div className="flex flex-col gap-2 mt-6">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Last updated:{" "}
                  {user?.updated_at
                    ? new Date(user.updated_at).toLocaleString()
                    : "N/A"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user
                        ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300"
                    }`}
                  >
                    {user ? "Active" : "Inactive"}
                  </span>
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-3 mt-6">
              <Button
                disabled={updateState.loading || updateRoleState.loading}
                type="submit"
                className="disabled:bg-gray-500 disabled:cursor-auto disabled:hover:bg-gray-500 bg-slate-900 hover:bg-slate-800 text-white font-semibold shadow-lg w-full lg:w-auto rounded-xl py-2 px-6 transition-all duration-200 flex items-center justify-center gap-2"
              >
                {updateState.loading || updateRoleState.loading ? (
                  <Spinner className="w-4 h-4" />
                ) : (
                  <>
                    <Pencil className="w-4 h-4" />
                    Update User
                  </>
                )}
              </Button>
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="w-full lg:w-auto rounded-xl py-2 px-6 border-gray-200 dark:border-white"
                >
                  Cancel
                </Button>
              </DialogClose>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isDeletedDailogOpen}
        onOpenChange={setIsDeletedDailogOpen}
      >
        <AlertDialogContent className="rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Delete User Confirmation
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              Are you sure you want to permanently delete{" "}
              <span className="font-semibold">{selectedUser?.full_name}</span>?
              This action cannot be undone and will remove all user data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-4">
            <AlertDialogCancel className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedUser && selectedUser.id) {
                  deleteHandler(selectedUser.id);
                } else {
                  toast.error("No user selected for deletion.");
                }
              }}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleteState.loading ? <Spinner /> : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersAdmins;
