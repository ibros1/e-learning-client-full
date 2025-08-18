import { configureStore } from "@reduxjs/toolkit";
import { loginSlice } from "./slices/auth/login";
import { registerSlice } from "./slices/auth/register";
import { updateUserSlice } from "./slices/auth/user/updateUser";
import { createCourseSlice } from "./slices/courses/createCourse";
import { listCoursesSlice } from "./slices/courses/listCourse";
import { updateCourseSlice } from "./slices/courses/updateCourse";
import { deleteCoursesSlice } from "./slices/courses/deleteCourse";
import { listLessonSlice } from "./slices/lessons/listLessons";
import { createLessonSlice } from "./slices/lessons/createLesson";
import { listChaptersSlice } from "./slices/chapters/listChapters";
import { createChapterSlice } from "./slices/chapters/createChapter";
import { updateChapterSlice } from "./slices/chapters/updateChapter";
import { deleteChapterSlice } from "./slices/chapters/deleteChapter";
import { updateLessonSlice } from "./slices/lessons/updateLesson";
import { deleteLessonSlice } from "./slices/lessons/deleteLesson";
import { getOneCourseSlice } from "./slices/courses/getOneCourse";
import { cartReducer } from "./slices/cart/cart";
import { createEnrollementSlice } from "./slices/enrollments/createEnrollment";

import { updateEnrollementSlice } from "./slices/enrollments/updateEnrollement";
import { deleteEnrollementSlice } from "./slices/enrollments/deleteEnrollement";
import { listEnrollementsSlice } from "./slices/enrollments/listEnrollements";

import { listUsersSlice } from "./slices/auth/user/getAllUsers";
import { getOneUserSLice } from "./slices/auth/user/getOneUser";
import { listUsers_Admins_Slice } from "./slices/auth/user/getAllUsersAsAdmin";
import { updateRoleSlice } from "./slices/auth/user/updateRole";
import { deleteUserSlice } from "./slices/auth/user/deleteUser";
import { WhoAmiSlice } from "./slices/auth/user/getMe";
import { createPaymentSlice } from "./slices/payments/createPayment";
import { listPaymentsSlice } from "./slices/payments/listPayments";
import { updatePaymentSlice } from "./slices/payments/updatePayment";
import { createLessonProgressSlice } from "./lessonProggress/makeProgress";
import { getLessonProgressSlice } from "./lessonProggress/getLessonProggress";
import { getCompletedLessonsSlice } from "./lessonProggress/getCompletedProggress";

export const store = configureStore({
  reducer: {
    // user
    loginSlice: loginSlice.reducer,
    WhoAmiSlice: WhoAmiSlice.reducer,
    registerSlice: registerSlice.reducer,
    updateUserSlice: updateUserSlice.reducer,
    listUsersSlice: listUsersSlice.reducer,
    listUsers_Admins_Slice: listUsers_Admins_Slice.reducer,
    getOneUserSLice: getOneUserSLice.reducer,
    updateRoleSlice: updateRoleSlice.reducer,
    deleteUserSlice: deleteUserSlice.reducer,

    // carts
    cart: cartReducer,

    // course
    createCourseSlice: createCourseSlice.reducer,
    listCoursesSlice: listCoursesSlice.reducer,
    updateCourseSlice: updateCourseSlice.reducer,
    deleteCoursesSlice: deleteCoursesSlice.reducer,
    getOneCourseSlice: getOneCourseSlice.reducer,

    // lesson
    listLessonSlice: listLessonSlice.reducer,
    createLessonSlice: createLessonSlice.reducer,
    updateLessonSlice: updateLessonSlice.reducer,
    deleteLessonSlice: deleteLessonSlice.reducer,

    // lesson progress
    createLessonProgressSlice: createLessonProgressSlice.reducer,
    getLessonProgressSlice: getLessonProgressSlice.reducer,
    getCompletedLessonsSlice: getCompletedLessonsSlice.reducer,

    // chapter
    listChaptersSlice: listChaptersSlice.reducer,
    createChapterSlice: createChapterSlice.reducer,
    updateChapterSlice: updateChapterSlice.reducer,
    deleteChapterSlice: deleteChapterSlice.reducer,

    // enrllement
    createEnrollementSlice: createEnrollementSlice.reducer,
    listEnrollementsSlice: listEnrollementsSlice.reducer,
    updateEnrollementSlice: updateEnrollementSlice.reducer,
    deleteEnrollementSlice: deleteEnrollementSlice.reducer,

    // payments
    createPaymentSlice: createPaymentSlice.reducer,
    listPaymentsSlice: listPaymentsSlice.reducer,
    updatePaymentSlice: updatePaymentSlice.reducer,
  },

  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
