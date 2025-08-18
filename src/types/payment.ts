export interface iCreatedPaymentResponse {
  isSuccess: boolean;
  message: string;
  payment: Payment;
}

export interface Payment {
  id: string;
  userId: number;
  courseId: number;
  enrollementId: string;
  amount: number;
  phone_Number: string;
  currency: string;
  status: string;
  payment_method: string;
  isEnrolled: boolean;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
  user: User;
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

export interface User {
  full_name: string;
  email: string;
  profilePhoto: string;
  role: string;
}
export interface iCreatedPaymentPayload {
  userId: number;
  courseId: number;
  enrollementId?: string;
  isEnrolled: boolean;
  phoneNumber: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
}

// list payments
export interface iListedPayments {
  isSuccess: boolean;
  message: string;
  payments: Payment[];
}

export interface Payment {
  id: string;
  userId: number;
  courseId: number;
  enrollementId: string;
  phone_Number: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  isEnrolled: boolean;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
  user: User;
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

export interface User {
  full_name: string;
  email: string;
  profilePhoto: string;
  role: string;
}

// updatePayment
export interface iUpdatedPaymentResponse {
  isSuccess: boolean;
  message: string;
  updatedPayment: UpdatedPayment;
}

export interface UpdatedPayment {
  id: string;
  userId: number;
  courseId: number;
  enrollementId: string;
  phone_Number: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  isEnrolled: boolean;
  transaction_date: Date;
  created_at: Date;
  updated_at: Date;
  user: User;
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

export interface User {
  full_name: string;
  email: string;
  profilePhoto: string;
  role: string;
}

export interface iUpdatedPaymentPayload {
  id: string;
  status: string;
  isEnrolled: boolean;
}
