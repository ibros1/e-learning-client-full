import { type AppDispatch, type RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "../../components/ui/dialog";

import defaultCover from "../../../assets/coverPhoto.png";

import { useEffect, useState } from "react";
import { useParams } from "react-router";

import { getOneUserFn } from "../../store/slices/auth/user/getOneUser";
import MyProfileSkeleton from "../../components/ui/myProfileSkeleton";

const GetOneMemberPage = () => {
  const { userId } = useParams();
  console.log(userId);
  const userState = useSelector((state: RootState) => state.getOneUserSLice);
  const dispatch = useDispatch<AppDispatch>();
  const user = userState.data?.user;

  useEffect(() => {
    dispatch(getOneUserFn(+userId!));
  }, [dispatch, userId]);

  const [previewImage, setPreviewImage] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

  const previewImageHandler = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsImageDialogOpen(true);
  };

  const profileImageUrl = user?.profilePhoto ? `${user?.profilePhoto}` : "";

  const coverImageUrl = user?.coverPhoto ? `${user?.coverPhoto}` : defaultCover;

  if (userState.loading) {
    return <MyProfileSkeleton />;
  }

  return !user ? (
    <div className="">No user found!</div>
  ) : (
    <div className="pb-32">
      <div className="bg-white my-4 dark:bg-[#0F172A] rounded-md overflow-hidden shadow-sm mx-auto w-[98%] border dark:border-gray-700">
        <div className="relative w-full h-80">
          <img
            src={coverImageUrl}
            alt="Cover"
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => previewImageHandler(coverImageUrl)}
          />
          <div className="absolute left-1/2 transform -translate-x-1/2 bottom-[-60px]">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white dark:bg-gray-800">
              <img
                src={profileImageUrl}
                alt="Avatar"
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => previewImageHandler(profileImageUrl)}
              />
            </div>
            <span className="absolute bottom-[105px] right-[20px] w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
        </div>

        <div className="pt-12 pb-6 text-center">
          <span className="px-4 py-1 relative rounded-full font-bold text-sm bg-blue-600 text-white">
            {user.role}
          </span>
          <h1 className="text-xl font-bold mt-2 text-gray-900 dark:text-white">
            {user.full_name}
          </h1>
          <p className="-mt-1 text-gray-600 ">@{user.username}</p>
          <div className="flex text-gray-400 pt-2 justify-center items-center gap-1">
            <span>
              Joined{" "}
              {new Date(user.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
              })}
            </span>
            <span className="text-green-500 ml-2">• Active now</span>
          </div>

          <div className="flex justify-left gap-8 mt-4 p-4">
            <div className="flex gap-2 items-center">
              <p className="font-bold text-gray-900 dark:text-white">16</p>
              <p className="text-gray-500 text-sm">Following</p>
            </div>
            <div className="flex gap-2 items-center">
              <p className="font-bold text-gray-900 dark:text-white">90+</p>
              <p className="text-gray-500 text-sm">Followers</p>
            </div>
          </div>

          <div className="flex justify-center gap-10 border-t border-gray-200 dark:border-gray-700 mt-8 pt-4">
            <button className="text-sm font-semibold text-black dark:text-white border-b-2 border-black dark:border-white pb-1">
              Courses
            </button>
            <button className="text-sm font-semibold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
              Photos
            </button>
            <button className="text-sm font-semibold text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
              Videos
            </button>
          </div>
        </div>
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <DialogContent className="border-lg">
            <img
              src={previewImage}
              alt="preview"
              className="w-full max-h-[80vh] border-lg shadow-lg"
            />
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 shadow-sm px-4 py-8 border rounded-md  mx-4">
        <Detail label="First Name" value={user.full_name.split(" ")[0]} />
        <Detail label="Last Name" value={user.full_name.split(" ")[1]} />
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
  );
};
// Small reusable detail component
export const Detail = ({ label, value }: { label: string; value?: string }) => (
  <p className="text-lg">
    <span className="font-medium text-gray-900 dark:text-white">{label}:</span>{" "}
    <span className="ml-2">{value || "-"}</span>
  </p>
);
export default GetOneMemberPage;
