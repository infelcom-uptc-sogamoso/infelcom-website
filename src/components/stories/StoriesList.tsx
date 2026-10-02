import { FC } from 'react';
import NextLink from 'next/link';
import { Button } from '@mui/material';
import { ArrowForward } from '@mui/icons-material';
import { IStory } from '@/interfaces';
import { StoriesCard } from './StoriesCard';
import { CardSkeleton } from '../skeletons/CardSkeleton';
import styles from './Stories.module.css';

interface Props {
  stories: IStory[];
  isLoading: boolean;
  /** Home preview: shows the latest `limit` stories without summaries plus a link to all. */
  limit?: number;
}

export const StoriesList: FC<Props> = ({ stories, isLoading, limit }) => {
  const visible = limit ? stories.slice(0, limit) : stories;

  return (
    <>
      <div className={styles.grid} aria-busy={isLoading}>
        {isLoading && <CardSkeleton quantity={3} height={360} />}
        {visible.map((story) => (
          <StoriesCard key={story.code} story={story} compact={!!limit} />
        ))}
      </div>
      {!isLoading && stories.length === 0 && (
        <p className={styles.empty}>Aún no hay noticias publicadas.</p>
      )}
      {limit && stories.length > limit && (
        <div className={styles.more}>
          <Button
            component={NextLink}
            href="/stories"
            variant="outlined"
            endIcon={<ArrowForward />}>
            Ver todas las noticias
          </Button>
        </div>
      )}
    </>
  );
};
