import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LessonPage.module.css';
import { ArticleLessonPlayer, mockArticleLesson } from '../../../features/lessons/article';

const ArrowLeftIcon: React.FC = () => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        width={20}
        height={20}
    >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
    </svg>
);

export const LessonPage: React.FC = () => {
    const navigate = useNavigate();

    const handleComplete = () => {
        navigate(-1);
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <div>
                    <button onClick={handleGoBack} className={styles.backButton} type="button">
                        <ArrowLeftIcon />
                        <span>Article: {mockArticleLesson.title}</span>
                    </button>
                </div>
                <div className={styles.titleSpacer} aria-hidden="true" />
                <div className={styles.userInfo}>
                    <span className={styles.userName}>Nurlybek</span>
                    <div className={styles.userAvatar}>N</div>
                </div>
            </header>
            <main className={styles.content}>
                <ArticleLessonPlayer
                    lesson={mockArticleLesson}
                    onComplete={handleComplete}
                />
            </main>
        </div>
    );
};
