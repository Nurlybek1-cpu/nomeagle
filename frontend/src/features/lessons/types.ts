/**
 * NomEagle Lesson Roadmap (Country Course) — Data model
 * Country -> Modules (sections) -> Lessons (cards)
 */

export type LessonType =
  | "video"
  | "article"
  | "scenario"
  | "flashcards"
  | "quiz"
  | "summary"
  | "matching"
  | "fill_blank";

export type LessonStatus = "locked" | "available" | "completed";

export interface Lesson {
  id: string;
  index: number;
  moduleId: string;
  type: LessonType;
  title: string;
  shortLabel: string;
  status: LessonStatus;
  starsEarned?: 0 | 1 | 2 | 3 | 4 | 5;
  xpReward: number;
  estimatedMinutes?: number;
}

export interface Module {
  id: string;
  title: string;
  rangeLabel: string;
  lessonIds: string[];
}

export interface CountryCourse {
  countryCode: string;
  countryName: string;
  totalLessons: number;
  progressPct: number;
  starsTotal: number;
  pointsTotal: number;
  modules: Module[];
  lessons: Record<string, Lesson>;
}
