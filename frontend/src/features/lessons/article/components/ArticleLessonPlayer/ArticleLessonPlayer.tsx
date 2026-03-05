import React, { useState, useEffect, useCallback } from 'react';
import styles from './ArticleLessonPlayer.module.css';
import { ArticleLesson } from '../../types';
import { ArticlePageCard } from '../ArticlePageCard';
import { ArticleToolsRail } from '../ArticleToolsRail';
import { SlideNavButton } from '../../../../../components/navigation/SlideNavButton';

export interface ArticleLessonPlayerProps {
    lesson: ArticleLesson;
    initialPage?: number;
    onComplete?: () => void;
    onPageChange?: (nextIndex: number) => void;
}

export const ArticleLessonPlayer: React.FC<ArticleLessonPlayerProps> = ({
    lesson,
    initialPage = 0,
    onComplete,
    onPageChange,
}) => {
    const [currentPageIndex, setCurrentPageIndex] = useState(initialPage);
    const totalPages = lesson.pages.length;
    const isFirstPage = currentPageIndex === 0;
    const isLastPage = currentPageIndex === totalPages - 1;

    const handleNext = useCallback(() => {
        if (isLastPage) {
            onComplete?.();
        } else {
            const nextIndex = currentPageIndex + 1;
            setCurrentPageIndex(nextIndex);
            onPageChange?.(nextIndex);
        }
    }, [currentPageIndex, isLastPage, onComplete, onPageChange]);

    const handlePrev = useCallback(() => {
        if (!isFirstPage) {
            const prevIndex = currentPageIndex - 1;
            setCurrentPageIndex(prevIndex);
            onPageChange?.(prevIndex);
        }
    }, [currentPageIndex, isFirstPage, onPageChange]);

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input
            const target = e.target as HTMLElement;
            const isInput =
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable;

            if (isInput) return;

            if (e.key === 'ArrowRight') {
                handleNext();
            } else if (e.key === 'ArrowLeft') {
                handlePrev();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleNext, handlePrev]);

    if (!lesson.pages || lesson.pages.length === 0) {
        return <div className={styles.empty}>Lesson has no pages.</div>;
    }

    return (
        <div className={styles.playerContainer}>
            <div className={styles.navPrev}>
                <SlideNavButton
                    direction="prev"
                    label="previous page"
                    disabled={isFirstPage}
                    onClick={handlePrev}
                />
            </div>

            <div className={styles.contentArea}>
                <div className={styles.sliderWrapper}>
                    <div
                        className={styles.sliderTrack}
                        style={{
                            width: `${lesson.pages.length * 100}%`,
                            transform: `translateX(-${(100 / lesson.pages.length) * currentPageIndex}%)`,
                            ['--slide-count']: lesson.pages.length,
                        }}
                    >
                        {lesson.pages.map((page, index) => (
                            <div key={page.id} className={styles.slide}>
                                <ArticlePageCard
                                    title={lesson.title}
                                    imageUrl={page.imageUrl}
                                    paragraphs={page.paragraphs}
                                    showTitle={index === 0}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.toolsRail}>
                <ArticleToolsRail
                    pageIndex={currentPageIndex}
                    totalPages={totalPages}
                />
            </div>

            <div className={styles.navNext}>
                <SlideNavButton
                    direction="next"
                    label={isLastPage ? 'finish' : 'next page'}
                    onClick={handleNext}
                    isFinish={isLastPage}
                />
            </div>
        </div>
    );
};
