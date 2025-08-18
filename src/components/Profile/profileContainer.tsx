import { type AppDispatch, type RootState } from "../../store/store";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";

import defaultCover from "../../../assets/coverPhoto.png";

import { Label } from "@radix-ui/react-dropdown-menu";
import { useEffect, useState, type FormEvent } from "react";
import {
  resetUpdateUserFn,
  updateUserFn,
} from "../../store/slices/auth/user/updateUser";
import toast from "react-hot-toast";

import { updateWhoAmiRedu } from "../../store/slices/auth/user/getMe";
import Spinner from "../spinner";

const MyProfileContainer = () => {
  const userState = useSelector((state: RootState) => state.WhoAmiSlice);
  const dispatch = useDispatch<AppDispatch>();
  const user = userState.data?.user;
  const [previewImage, setPreviewImage] = useState("");
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);
  const [fullName, setFullname] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const previewImageHandler = (imageUrl: string) => {
    setPreviewImage(imageUrl);
    setIsImageDialogOpen(true);
  };
  const updateState = useSelector((state: RootState) => state.updateUserSlice);
  // useEffect(() => {
  //   dispatch(w)
  // },[])

  const userId = Number(user?.id);
  useEffect(() => {
    if (updateState.data.isSuccess) {
      toast.success("Successfully Updated");
      location.reload();
      updateWhoAmiRedu(updateState.data);

      dispatch(resetUpdateUserFn());
    }
  }, [updateState.data.isSuccess, dispatch, updateState.data]);

  useEffect(() => {
    const user = userState.data?.user;
    if (user) {
      setFullname(user.full_name);
      setUsername(user.username);
      setEmail(user.email);
      setPhoneNumber(user.phone_number);
    }
  }, [userState]);

  const updateUserHandler = (event: FormEvent) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("id", userId.toString());
    formData.append("email", email);
    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("password", password);
    formData.append("phone_number", phoneNumber);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    if (coverPhoto) {
      formData.append("coverPhoto", coverPhoto);
    }
    if (!password) {
      toast.error("You have to enter a current or new password!!");
      return;
    }

    dispatch(updateUserFn(formData));
    // dispatch(
    //   updateUserFn({
    //     id: userId!,
    //     email,
    //     username: userName,
    //     fullName,
    //     password,
    //     phone_number: phoneNumber,
    //     ...(profilePhoto && { profilePhoto }),
    //     ...(coverPhoto && { coverPhoto }),
    //   })
    // );
  };

  if (!userState.data.isSuccess || !user) {
    return (
      <p className="text-red-600 text-center font-bold text-2xl">
        Please login first.
      </p>
    );
  }

  const profileImageUrl = user.profilePhoto ? `${user.profilePhoto}` : "";

  const coverImageUrl = user.coverPhoto ? `${user.coverPhoto}` : defaultCover;

  return (
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

        <div className="my-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gray-900 hover:bg-gray-800 dark:border-2 border-white">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[98vw] md:max-w-[650px] lg:max-w-[800px] h-[80%] overflow-auto scrollbar-hide rounded-2xl xl:max-w-[900px]  bg-white dark:bg-[#18181b] transition-colors duration-300">
              <form onSubmit={updateUserHandler}>
                <DialogHeader>
                  <DialogTitle>Edit Profile</DialogTitle>
                  <DialogDescription>
                    Update your profile details here.
                  </DialogDescription>
                </DialogHeader>

                {/* Profile Preview */}
                <div className="flex flex-col items-center gap-2 mb-4">
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-16 h-16 rounded-full border object-cover shadow"
                  />
                  <span className="font-medium dark:text-white">
                    {fullName || user?.full_name}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    @{username || user?.username}
                  </span>
                </div>

                <div className="grid gap-4 py-2">
                  <div className="grid gap-2">
                    <Label>Full Name</Label>
                    <Input
                      id="name"
                      defaultValue={user.full_name}
                      onChange={(e) => setFullname(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Username</Label>
                    <Input
                      id="Username"
                      defaultValue={user.username}
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input
                      id="email"
                      defaultValue={user.email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter new or current password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Phone Number</Label>
                    <Input
                      id="phone"
                      defaultValue={user.phone_number}
                      type="tel"
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Change Profile Photo</Label>
                    <Input
                      id="profilePhoto"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          setProfilePhoto(file); // ✅ Directly store File object
                        }
                      }}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Change Cover Photo</Label>
                    <Input
                      id="coverPhoto"
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        const file = event.currentTarget.files?.[0];
                        if (file) {
                          setCoverPhoto(file); // ✅ Directly store File object
                        }
                      }}
                    />
                  </div>
                </div>

                <DialogFooter className="flex flex-col lg:flex gap-2">
                  <Button
                    disabled={updateState.loading}
                    type="submit"
                    className="disabled:bg-gray-500 disabled:cursor-auto disabled:hover:bg-gray-500 bg-gray-800 hover:bg-gray-700 text-white"
                  >
                    {updateState.loading ? <Spinner /> : "Save Changes"}
                  </Button>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
  );
};

export default MyProfileContainer;
