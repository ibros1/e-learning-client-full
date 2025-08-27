// components/SettingsPage.tsx
import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../store/store";
import {
  updateUserFn,
  resetUpdateUserFn,
} from "../../store/slices/auth/user/updateUser";
import { Switch } from "@radix-ui/react-switch";
import toast from "react-hot-toast";
import SettingsPageSkeleton from "../../components/ui/SettingsPageSkeleton";
import { WhoAmiFn } from "../../store/slices/auth/user/getMe";

const SettingsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(WhoAmiFn());
  }, [dispatch]);

  const logInState = useSelector((state: RootState) => state.WhoAmiSlice);
  const updateState = useSelector((state: RootState) => state.updateUserSlice);
  const user = logInState?.data?.user;

  // Form states
  const [fullName, setFullName] = useState(user?.full_name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone_number || "");
  const [location, setLocation] = useState("Hargeisa");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    setFullName(user?.full_name || "");
    setEmail(user?.email || "");
    setPhone(user?.phone_number || "");
  }, [user]);

  if (logInState.loading) return <SettingsPageSkeleton />;
  if (logInState.error) return <div>{logInState.error}</div>;

  const userId = Number(user?.id);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", userId.toString());
    formData.append("email", email);
    formData.append("username", user!.username);
    formData.append("fullName", fullName);
    formData.append("phone_number", phone);

    if (currentPassword && newPassword) {
      formData.append("password", newPassword);
    }

    try {
      await dispatch(updateUserFn(formData)).unwrap();
      toast.success("Profile updated successfully!");
      dispatch(WhoAmiFn());
      dispatch(resetUpdateUserFn());
    } catch (err: any) {
      toast.error(err || "Failed to update profile");
    }
  };

  return !user ? (
    <div>User not Found</div>
  ) : (
    <div className="min-h-screen bg-gray-100 dark:bg-[#091025] py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10">
        {/* Sidebar */}
        <aside
          className="bg-white dark:bg-[#091025] rounded-xl shadow border border-gray-200 dark:border-gray-700 p-6 flex flex-col items-center md:sticky md:top-20 md:h-fit cursor-pointer md:w-80 hover:shadow-lg transition-shadow"
          onClick={() => navigate("/my-profile")}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") navigate("/my-profile");
          }}
        >
          {/* Cover Image */}
          <div className="w-full h-28 rounded-xl overflow-hidden bg-gray-200 dark:bg-gray-700">
            {user.coverPhoto ? (
              <img
                src={user.coverPhoto}
                alt="cover"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600" />
            )}

            {/* Profile Photo */}
            <div className="z-10">
              <img
                src={user.profilePhoto}
                alt="avatar"
                className="absolute -mt-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full object-cover border-4 border-white dark:border-[#091025] shadow-md"
              />
            </div>
          </div>

          {/* User Info */}
          <div className="mt-16 text-center px-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {user.full_name}
            </h2>
            <p className="text-sm text-blue-600 mt-1">@{user.username}</p>
          </div>

          <div className="flex gap-8 mt-6 text-center text-sm text-gray-700 dark:text-gray-300 font-medium">
            <div>
              <p>20</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">Posts</p>
            </div>
            <div>
              <p>18</p>
              <p className="text-gray-400 dark:text-gray-500 text-xs">
                Friends
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Member since {new Date(user.created_at).toLocaleDateString()}
          </p>

          <button
            type="button"
            className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-full w-full font-semibold text-sm transition"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/my-profile");
            }}
          >
            Edit Profile
          </button>
        </aside>

        {/* Settings Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 max-w-4xl bg-white dark:bg-[#091025] border dark:border-gray-600 shadow-xl rounded-2xl p-8 space-y-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
            Account Settings
          </h1>

          {/* Profile */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Profile
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  label: "Full Name",
                  value: fullName,
                  setter: setFullName,
                  type: "text",
                },
                {
                  label: "Email Address",
                  value: email,
                  setter: setEmail,
                  type: "email",
                },
                {
                  label: "Phone Number",
                  value: phone,
                  setter: setPhone,
                  type: "tel",
                },
                {
                  label: "Location",
                  value: location,
                  setter: setLocation,
                  type: "text",
                },
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    placeholder={field.label}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-[#091025] dark:text-white"
                  />
                </div>
              ))}
            </div>
          </section>

          {/* Preferences */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Preferences
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "Email Notifications",
                  state: emailNotifications,
                  setter: setEmailNotifications,
                },
                { title: "Dark Mode", state: darkMode, setter: setDarkMode },
              ].map((pref, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {pref.title}
                  </h3>
                  <Switch
                    checked={pref.state}
                    onCheckedChange={pref.setter}
                    className={`${
                      pref.state
                        ? "bg-blue-600"
                        : "bg-gray-300 dark:bg-gray-600"
                    } relative inline-flex h-6 w-11 items-center rounded-full transition`}
                  >
                    <span
                      className={`${
                        pref.state ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                </div>
              ))}
            </div>
          </section>

          {/* Security */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
              Security
            </h2>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                {
                  label: "Current Password",
                  value: currentPassword,
                  setter: setCurrentPassword,
                },
                {
                  label: "New Password",
                  value: newPassword,
                  setter: setNewPassword,
                },
              ].map((pwd, idx) => (
                <div key={idx}>
                  <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {pwd.label}
                  </label>
                  <input
                    type="password"
                    value={pwd.value}
                    onChange={(e) => pwd.setter(e.target.value)}
                    placeholder={pwd.label}
                    className="w-full px-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-[#091025] dark:text-white"
                  />
                </div>
              ))}
            </div>
            <button
              type="submit"
              className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-500 transition"
            >
              {updateState.loading ? "Saving..." : "Save Changes"}
            </button>
          </section>
        </form>
      </div>
    </div>
  );
};

export default SettingsPage;
