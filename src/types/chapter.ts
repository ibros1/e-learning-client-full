export interface iCreatedChapterPayload {
  userId: number;
  courseId: number;
  chapterTitle: string;
}

export interface iCreatedChapterResponse {
  isSuccess: boolean;
  message: string;
  createdChapter: CreatedChapter;
}

export interface CreatedChapter {
  id: string;
  userId: number;
  courseId: number;
  chapterTitle: string;
  created_at: Date;
  updated_at: Date;
  courses: Courses;
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

// list shapters
export interface iListedChapters {
  isSuccess: boolean;
  message: string;
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
  courses: Courses;
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

// update
export interface iUpdatedChapterResponse {
  isSuccess: boolean;
  message: string;
  updatedChapter: UpdatedChapter;
}

export interface UpdatedChapter {
  id: string;
  userId: number;
  courseId: number;
  chapterTitle: string;
  created_at: Date;
  updated_at: Date;
  lesson: Lesson[];
  courses: Courses;
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

export interface iUpdatedChapterPayload {
  chapterId: string;
  courseId: number;
  chapterTitle: string;
}

// delete
export interface iDeletedChapterResponse {
  isSuccess: boolean;
  message: string;
  deletedChapter: DeletedChapter;
  deleteLessons: DeleteLessons;
}

export interface DeleteLessons {
  count: number;
}

export interface DeletedChapter {
  id: string;
  userId: number;
  courseId: number;
  chapterTitle: string;
  created_at: Date;
  updated_at: Date;
}
