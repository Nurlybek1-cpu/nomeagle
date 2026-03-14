import React, { useMemo } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CourseHeader,
  ModuleSection,
  LessonGrid,
  LessonCard,
  CourseNavigator,
  moduleElementId,
} from "../../../features/lessons/components";
import {
  computeLessonStatuses,
  computeCourseSummary,
  lessonStatusMap,
} from "../../../features/lessons/engine";
import type { UserCourseProgress } from "../../../features/lessons/engine";
import { JP_COURSE_MOCK } from "../../../features/lessons/mock";
import type { CountryCourse } from "../../../features/lessons/types";
import styles from "./LearningPathPage.module.css";

/* ---------- Inline SVG ---------- */

const ArrowLeftIcon: React.FC = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2.5}
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

/* ---------- Mock course resolver ---------- */

const COURSES_BY_CODE: Record<string, CountryCourse> = {
  jp: JP_COURSE_MOCK,
};

/**
 * Mock user progress for the Japan course.
 * Lessons 1-11 completed (matching the mock course statuses).
 */
const MOCK_USER_PROGRESS: UserCourseProgress = {
  completedLessonIds: [
    "jp-l1",
    "jp-l2",
    "jp-l3",
    "jp-l4",
    "jp-l5",
    "jp-l6",
    "jp-l7",
    "jp-l8",
    "jp-l9",
    "jp-l10",
    "jp-l11",
  ],
  starsByLessonId: {
    "jp-l1": 3,
    "jp-l2": 4,
    "jp-l3": 5,
    "jp-l4": 2,
    "jp-l5": 4,
    "jp-l6": 3,
    "jp-l7": 4,
    "jp-l8": 5,
    "jp-l9": 4,
    "jp-l10": 3,
    "jp-l11": 5,
  },
  lastOpenedLessonId: "jp-l12",
};

/* ---------- Component ---------- */

export const LearningPathPage: React.FC = () => {
  const { countryCode } = useParams<{ countryCode: string }>();
  const navigate = useNavigate();

  const course = COURSES_BY_CODE[countryCode ?? ""] ?? JP_COURSE_MOCK;

  /* ---- Engine computations ---- */

  const statusList = useMemo(
    () => computeLessonStatuses(course, MOCK_USER_PROGRESS),
    [course]
  );

  const statusById = useMemo(
    () => lessonStatusMap(statusList),
    [statusList]
  );

  const summary = useMemo(
    () => computeCourseSummary(course, MOCK_USER_PROGRESS),
    [course]
  );

  /* ---- Per-module completed counts ---- */

  const moduleCompletedCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const mod of course.modules) {
      counts[mod.id] = mod.lessonIds.filter(
        (lid) => statusById[lid]?.status === "completed"
      ).length;
    }
    return counts;
  }, [course.modules, statusById]);

  /* ---- Handlers ---- */

  const handleLessonClick = (lessonId: string) => {
    const lesson = course.lessons[lessonId];
    if (lesson?.type === "article" || lesson?.type === "flashcards" || lesson?.type === "quiz" || lesson?.type === "scenario") {
      navigate(`/app/lesson/${lessonId}`);
    } else {
      console.log(`Navigation for ${lesson?.type} not implemented yet.`);
    }
  };

  /* ---- Navigator module list ---- */

  const navigatorModules = useMemo(
    () => course.modules.map((m) => ({ id: m.id, title: m.title })),
    [course.modules]
  );

  return (
    <div className={styles.page}>
      {/* ---- Go Back: fixed top-left only ---- */}
      <Link to="/app/dashboard" className={styles.backLink}>
        <ArrowLeftIcon />
        Go Back
      </Link>

      <div className={styles.container}>
        {/* ---- Course header ---- */}
        <CourseHeader
          countryCode={course.countryCode}
          countryName={course.countryName}
          completedCount={summary.completedCount}
          totalCount={summary.totalCount}
          progressPct={summary.progressPct}
          starsTotal={summary.starsTotal}
          pointsTotal={summary.pointsTotal}
        />

        {/* ---- Module sections ---- */}
        {course.modules.map((mod, moduleIndex) => (
          <div
            key={mod.id}
            id={moduleElementId(moduleIndex)}
            className={styles.moduleWrap}
          >
            <ModuleSection
              title={mod.title}
              rangeLabel={mod.rangeLabel}
              completedCount={moduleCompletedCounts[mod.id]}
              totalCount={mod.lessonIds.length}
            >
              <LessonGrid>
                {mod.lessonIds.map((lid) => {
                  const lesson = course.lessons[lid];
                  const state = statusById[lid];
                  if (!lesson || !state) return null;

                  return (
                    <LessonCard
                      key={lid}
                      id={lid}
                      index={lesson.index}
                      type={lesson.type}
                      shortLabel={lesson.shortLabel}
                      status={state.status}
                      isCurrent={state.isCurrent}
                      starsEarned={state.starsEarned}
                      xpReward={lesson.xpReward}
                      onClick={handleLessonClick}
                    />
                  );
                })}
              </LessonGrid>
            </ModuleSection>
          </div>
        ))}
      </div>

      {/* ---- Floating navigator ---- */}
      <CourseNavigator modules={navigatorModules} />
    </div>
  );
};
