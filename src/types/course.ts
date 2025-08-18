export interface iCreatedCourseResponse {
  isSuccess: boolean;
  message: string;
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

export interface iCreatedCoursePayload {
  title: string;
  description: string;
  course_img: string;
  cover_img: string;
  preview_course: string;
  isPublished: boolean;
  price: number;
}

// list all courses

export interface iListedCourses {
  isSuccess: boolean;
  message: string;
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
  chapters: Chapter[];
  enrollments: Enrollment[];
  lesson: Lesson[];
  users: Users;
}

export interface Chapter {
  id: string;
  userId: number;
  courseId: number;
  chapterTitle: string;
  created_at: Date;
  updated_at: Date;
}

export interface Enrollment {
  id: string;
  userId: number;
  courseId: number;
  paymentId: string;
  is_enrolled: boolean;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
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

// update Course

export interface iUpdatedCourseResponse {
  isSuccess: boolean;
  message: string;
  updatingCourse: {
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
  };
}

export interface iUpdatedCoursePayload {
  id: number;
  title: string;
  description: string;
  isPublished: boolean;
  preview_course: string;
  course_img?: string | File;
  cover_img?: string | File;
  price: number;
}

// delete
export interface iDeletedCourseResponse {
  isSuccess: boolean;
  message: string;
  deletingCourse: {
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
  };
}

// getOneCourse
export interface iGetOneCourseResponse {
  isSuccess: boolean;
  message: string;
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
  enrollments: Enrollment[];
  lesson: Lesson[];
  users: Users;
}

export interface Chapter {
  id: string;
  userId: number;
  courseId: number;
  chapterTitle: string;
  created_at: Date;
  updated_at: Date;
}

export interface Enrollment {
  id: string;
  userId: number;
  courseId: number;
  is_enrolled: boolean;
  progress: number;
  status: string;
  created_at: Date;
  updated_at: Date;
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
