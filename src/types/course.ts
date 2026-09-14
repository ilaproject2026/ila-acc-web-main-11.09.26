export interface CourseChapter {
  id: string;
  chapterNumber: number;
  title: string;
  summary: string;
  content: string;
  subTopics?: Array<{ id: string; topicNumber: string; title: string }>;
  isCompleted?: boolean;
}

export interface SharedCourse {
  id: string;
  course_id: string;
  course_name?: string;
  title: string;
  subtitle?: string;
  category?: string;
  sub_category?: string;
  delivery_path?: string;
  batch?: string;
  slot?: string;
  batch_slot?: string;
  overview?: string;
  total_chapters: number;
  chapters: CourseChapter[];
  tags?: string[];
  is_favorite?: boolean;
  studied_by?: string;
  target_audience?: string;
  admin_course_data?: any;
  slide_ai_course_data?: any;
  intelli_coach_course_data?: any;
  raw_course_data?: any;
  created_at: string;
  updated_at: string;
}
