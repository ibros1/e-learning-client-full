// update

export interface iUpdatedUserPayload {
  id: number;
  email: string;
  username: string;
  fullName: string;
  phone_number: string;
  password: string;
  profilePhoto?: File;
  coverPhoto?: File;
}

export interface iUpdatedUserResponse {
  isSuccess: boolean;
  messsage: string;
  user: {
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
  };
}

// getMe
export interface iGetWhoAMi {
  isSuccess: boolean;
  user: User;
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
  role: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  enrollements: Enrollement[];
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
  chapters: Chapter[];
}

export interface Chapter {
  id: string;
  userId: number;
  courseId: number;
  chapterTitle: string;
  created_at: Date;
  updated_at: Date;
  lesson: Lesson[];
}

export interface Lesson {
  id: string;
  userId: number;
  courseId: number;
  chapterId: string;
  title: string;
  content: string;
  video_url: string;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
}
