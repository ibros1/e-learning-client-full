import { useEffect, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

import ForbiddenPage from "./ForbiddenPage";
import type { AppDispatch } from "../../../store/store"; // fix import path for your AppDispatch
import { WhoAmiFn } from "../../../store/slices/auth/user/getMe";

export default function ProtectedAdminRoute({
  children,
  allowedRoles = ["ADMIN"],
}: {
  children: JSX.Element;
  allowedRoles?: string[];
}) {
  const dispatch = useDispatch<AppDispatch>();
  const whoAmi = useSelector((state: RootState) => state.WhoAmiSlice.data);
  const loading = useSelector((state: RootState) => state.WhoAmiSlice.loading);

  useEffect(() => {
    dispatch(WhoAmiFn());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  if (allowedRoles.includes(whoAmi.user?.role || "")) {
    return children;
  } else {
    return <ForbiddenPage />;
  }
}
