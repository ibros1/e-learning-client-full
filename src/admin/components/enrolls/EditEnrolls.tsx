import { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
} from "../../../components/ui/dialog";
import { AlertDialogHeader } from "../../../components/ui/alert-dialog";
import { Label } from "../../../components/ui/label";

import type { Enrollement } from "../../../types/enrollement";
import { useDispatch, useSelector } from "react-redux";
import { type AppDispatch, type RootState } from "../../../store/store";
import {
  resetUpdateEnrollementState,
  updateEnrollementFn,
} from "../../../store/slices/enrollments/updateEnrollement";
import { Switch } from "../../../components/ui/switch";
import toast from "react-hot-toast";
import { listEnrollementsFn } from "../../../store/slices/enrollments/listEnrollements";
import { updatePaymentFn } from "../../../store/slices/payments/updatePayment";
import { listPaymentsFn } from "../../../store/slices/payments/listPayments";
import { WhoAmiFn } from "../../../store/slices/auth/user/getMe";
import { Pencil } from "lucide-react";

type EditEnrollProps = {
  enrollement: Enrollement;
};

const EditEnrolls = ({ enrollement }: EditEnrollProps) => {
  console.log(enrollement);
  const logInState = useSelector((state: RootState) => state.loginSlice);
  const dispatch = useDispatch<AppDispatch>();
  const updateEnrollState = useSelector(
    (state: RootState) => state.updateEnrollementSlice
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [status, setStatus] = useState(enrollement.status || "IN_PROGRESS");

  const [isEnrolled, setIsEnrolled] = useState(
    enrollement.is_enrolled ?? false
  );

  useEffect(() => {
    dispatch(listPaymentsFn());
  }, [dispatch]);
  // const paymentState = useSelector(
  //   (state: RootState) => state.listPaymentsSlice
  // );

  useEffect(() => {
    if (
      enrollement.status === "COMPLETED" &&
      enrollement.is_enrolled === true
    ) {
      dispatch(
        updatePaymentFn({
          id: enrollement.paymentId,
          isEnrolled: true,
          status: "PAID",
        })
      );
    }
  }, [dispatch, enrollement]);

  useEffect(() => {
    if (updateEnrollState.error) {
      toast.error(updateEnrollState.error);
      return;
    }

    if (updateEnrollState.data.isSuccess) {
      toast.dismiss();
      toast.success("Successfully Completed");
      dispatch(WhoAmiFn());
      dispatch(listEnrollementsFn());
      dispatch(resetUpdateEnrollementState());
    }
  }, [updateEnrollState.data.isSuccess, updateEnrollState.error, dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(
      updateEnrollementFn({
        id: enrollement.id,
        userId: logInState.data?.user.id ?? enrollement.userId,
        courseId: enrollement.courseId,
        status,
        isEnrolled,
      })
    );
    setIsEditDialogOpen(false);
  };

  return (
    <div>
      <Button
        variant="ghost"
        size="icon"
        className="hover:bg-blue-100 dark:hover:bg-blue-900"
        onClick={() => setIsEditDialogOpen(true)}
      >
        <Pencil className="w-4 h-4 text-blue-600 dark:text-blue-400" />
      </Button>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="sm:max-w-[425px]">
            <AlertDialogHeader>
              <DialogTitle>Edit Enrollement</DialogTitle>
              <DialogDescription>
                You can edit the selected chapter below.
              </DialogDescription>
            </AlertDialogHeader>

            <div className="flex items-center gap-3">
              <Switch
                id="isEnrolled"
                checked={isEnrolled}
                onCheckedChange={(checked) => setIsEnrolled(checked as boolean)}
              />
              <Label htmlFor="isEnrolled">Enroll Immediately</Label>
            </div>

            <div className="grid gap-3 ">
              <Label htmlFor="status">Select status</Label>
              <select
                id="status"
                value={status}
                className="border-2 p-2 rounded-md"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="IN_PROGRESS">IN_PROGRESS</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="FAILED">FAILED</option>
              </select>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Save changes</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditEnrolls;
