// create proggress
export interface iCreatedProgressResponse {
  isSuccess: boolean;
  message: string;
  progress: Progress;
}

export interface Progress {
  id: number;
  userId: number;
  lessonId: string;
  courseId: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface iCreatedProgressPayload {
  userId: number;
  lessonId: string;
  courseId: number;
  isCompleted: boolean;
}

// getOneUserLessonProggress
export interface iGetUserLessonProgress {
  isSuccess: boolean;
  message: string;
  progress: Progress;
}

export interface Progress {
  id: number;
  userId: number;
  lessonId: string;
  courseId: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// get completed User Lessons
export interface iListedMyCompletedLessons {
  isSuccess: boolean;
  message: string;
  completed: Completed[];
}

export interface Completed {
  id: number;
  userId: number;
  lessonId: string;
  courseId: number;
  isCompleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  lesson: Lesson;
}

export interface Lesson {
  courses: Courses;
}

export interface Courses {
  title: string;
  course_img: string;
  price: number;
}
