export interface iCreatedEnrollmentResponse {
  isSuccess: boolean;
  message: string;
  enrollement: Enrollement;
}

export interface Enrollement {
  id: string;
  userId: number;
  courseId: number;
  is_enrolled: boolean;
  paymentId: string;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  course: Course;
  users: Users;
}

export interface Course {
  id: number;
  userId: number;
  course_img: string;
  cover_img: string;
  preview_course_url: string;
  title: string;
  description: string;
  is_published: boolean;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export interface Users {
  full_name: string;
  profilePhoto: string;
  role: string;
}

export interface iCreatedEnrollmentPayload {
  userId: number;
  courseId: number;
  status: string;
  paymentId: string;
  isEnrolled: boolean;
}

// list enrollement
export interface iListedEnrollements {
  isSuccess: boolean;
  message: string;
  enrollemnets: Enrollemnet[];
}

export interface Enrollemnet {
  id: string;
  userId: number;
  courseId: number;
  is_enrolled: boolean;
  paymentId: string;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  users: Users;
  course: Course;
}

export interface Course {
  id: number;
  userId: number;
  course_img: string;
  cover_img: string;
  preview_course_url: string;
  title: string;
  description: string;
  is_published: boolean;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export interface Users {
  full_name: string;
  email: string;
  phone_number: string;
}

// update
export interface iUpdatedEnrollment {
  isSuccess: boolean;
  message: string;
  completedEnrollement: CompletedEnrollement;
}

export interface CompletedEnrollement {
  id: string;
  userId: number;
  courseId: number;
  is_enrolled: boolean;
  paymentId: string;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}

export interface iUpdatedEnrollmentPayload {
  id: string;
  userId: number;
  courseId: number;
  status: string;
  isEnrolled: boolean;
}

// getOneEnrollement
export interface iGetOneEnrollementResponse {
  isSuccess: boolean;
  message: string;
  existEnrollement: ExistEnrollement;
}

export interface ExistEnrollement {
  id: string;
  userId: number;
  courseId: number;
  is_enrolled: boolean;
  paymentId: string;

  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
  course: Course;
  users: Users;
}

export interface Course {
  id: number;
  userId: number;
  course_img: string;
  cover_img: string;
  preview_course_url: string;
  title: string;
  description: string;
  is_published: boolean;
  price: number;
  created_at: Date;
  updated_at: Date;
}

export interface Users {
  id: number;
  username: string;
  email: string;
  full_name: string;
  profilePhoto: string;
  coverPhoto: string;
  sex: string;
  phone_number: string;
  password: string;
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// delete Enrollement
export interface ideletedEnrollementResponse {
  isSuccess: boolean;
  message: string;
  deletingEnroll: DeletingEnroll;
}

export interface DeletingEnroll {
  id: string;
  userId: number;
  courseId: number;
  is_enrolled: boolean;
  paymentId: string;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}
