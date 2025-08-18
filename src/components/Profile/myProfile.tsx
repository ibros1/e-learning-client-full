import MyProfileContainer from "./profileContainer";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import { Button } from "../ui/button";

const MyProfile = () => {
  const userState = useSelector((state: RootState) => state.WhoAmiSlice);

  const user = userState.data?.user;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600 text-xl font-semibold">
        Please login first
      </div>
    );
  }

  const fullNameParts = user.full_name.split(" ");
  const firstName = fullNameParts[0] || "";
  const lastName = fullNameParts[1] || "";

  return (
    <div className="pb-32">
      <MyProfileContainer />

      <div className="bg-white dark:bg-[#0f172a] rounded-2xl shadow-md px-8 py-10 mt-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Account Information
          </h2>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-md">
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          <Detail label="First Name" value={firstName} />
          <Detail label="Last Name" value={lastName} />
          <Detail label="Username" value={`@${user.username}`} />
          <Detail label="Sex" value={user.sex!} />
          <Detail label="Role" value={user.role} />
          <Detail label="Phone Number" value={user.phone_number} />
          <Detail
            label="Joined At"
            value={new Date(user.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              year: "numeric",
              month: "short",
            })}
          />
        </div>
      </div>
    </div>
  );
};

// Small reusable detail component
export const Detail = ({ label, value }: { label: string; value?: string }) => (
  <p className="text-lg">
    <span className="font-medium text-gray-900 dark:text-white">{label}:</span>{" "}
    <span className="ml-2">{value || "-"}</span>
  </p>
);

export default MyProfile;
