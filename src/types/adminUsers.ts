export interface iListedMembersResponseAsAdmin {
  isSuccess: boolean;
  message: string;
  users: User[];
}

export interface User {
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
  enrollements: Enrollement[];
  courses: Course[];
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

export interface Enrollement {
  id: string;
  userId: number;
  courseId: number;
  is_enrolled: boolean;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
}
