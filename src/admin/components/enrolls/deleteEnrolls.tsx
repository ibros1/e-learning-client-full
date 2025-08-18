import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../components/ui/alert-dialog";
import { Button } from "../../../components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../store/store";
import {
  deleteEnrollementFn,
  resetDeleteEnrollementState,
} from "../../../store/slices/enrollments/deleteEnrollement";
import type { Enrollement } from "../../../types/enrollement";
import toast from "react-hot-toast";
import { listEnrollementsFn } from "../../../store/slices/enrollments/listEnrollements";

type enrollementProps = {
  enrollement: Enrollement;
};

const DeleteEnrolls = ({ enrollement }: enrollementProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isDeletedDailogOpen, setIsDeletedDailogOpen] = useState(false);
  const deleteCourseHandler = (enrollId: string) => {
    dispatch(deleteEnrollementFn(enrollId));
  };
  const deleteEnrollState = useSelector(
    (state: RootState) => state.deleteEnrollementSlice
  );
  useEffect(() => {
    if (deleteEnrollState.error) {
      toast.error(deleteEnrollState.error);
      return;
    }
    if (deleteEnrollState.data.isSuccess) {
      toast.dismiss();
      toast.success("Successfully deleted!");
      dispatch(resetDeleteEnrollementState());
      dispatch(listEnrollementsFn());
    }
  }, [deleteEnrollState.error, deleteEnrollState.data.isSuccess, dispatch]);
  return (
    <div>
      <Button
        className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1"
        onClick={() => setIsDeletedDailogOpen(true)}
      >
        Delete
      </Button>
      <AlertDialog
        open={isDeletedDailogOpen}
        onOpenChange={setIsDeletedDailogOpen}
      >
        <AlertDialogContent className="rounded-2xl p-6 shadow-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
              Are you absolutely sure to delete this course?
            </AlertDialogTitle>
            <AlertDialogDescription className="mt-2 text-gray-600 dark:text-gray-400">
              This action cannot be undone. This will permanently delete the
              course and remove it from the server.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-6 flex justify-end gap-4">
            <AlertDialogCancel className="px-6 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteCourseHandler(enrollement.id)}
              className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DeleteEnrolls;
