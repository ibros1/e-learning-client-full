export interface iListedLessonResponse {
  isSuccess: boolean;
  message: string;
  lessons: Lesson[];
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
  chapters: Chapters;
  users: Users;
  courses: Courses;
}

export interface Chapters {
  id: string;
  chapterTitle: string;
}

export interface Courses {
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
  full_name: string;
  profilePhoto: string;
}

export interface iCreatedLessonPayload {
  userId: number;
  courseId: number;
  title: string;
  chapterId: string;
  content: string;
  video_url: string;
  isCompleted: boolean;
}

export interface iCreatedLessonResponse {
  isSuccess: boolean;
  message: string;
  createdLesson: CreatedLesson;
}

export interface CreatedLesson {
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

// update
export interface iUpdatedLessonResponse {
  isSuccess: boolean;
  message: string;
  lesson: Lesson;
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
  chapters: Chapters;
  courses: Courses;
  users: Users;
}

export interface Chapters {
  id: string;
  chapterTitle: string;
}

export interface Courses {
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
  full_name: string;
  profilePhoto: string;
}

export interface iUpdatedLessonPayload {
  id: string;
  userId: number;
  courseId: number;
  chapterId: string;
  title: string;
  isCompleted?: boolean;
  content: string;
  video_url: string;
}

// delete
export interface iDeletedLesson {
  isSuccess: boolean;
  message: string;
  deletingLesson: DeletingLesson;
}

export interface DeletingLesson {
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
