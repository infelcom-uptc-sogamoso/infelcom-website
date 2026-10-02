import { FC } from 'react';
import NextLink from 'next/link';
import { IStory } from '@/interfaces';
import { formatDate } from '@/utils';
import styles from './Stories.module.css';

interface Props {
  story: IStory;
  compact?: boolean;
}

export const StoriesCard: FC<Props> = ({ story, compact }) => {
  const { _id, title, resume, imageUrl, createdAt } = story;
  const [creationDate] = formatDate(createdAt).split(' ');

  return (
    <article className={styles.card}>
      {/* Story images are external URLs set from the admin panel, so a plain lazy <img> */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageUrl || '/hero/image-not-available.jpg'}
        alt=""
        loading="lazy"
        className={styles.image}
      />
      <div className={styles.body}>
        <time dateTime={createdAt} className={styles.date}>
          {creationDate}
        </time>
        <h3 className={styles.title}>
          <NextLink href={`/stories/${_id}`} className={styles.link}>
            {title}
          </NextLink>
        </h3>
        {!compact && <p className={styles.resume}>{resume}</p>}
      </div>
    </article>
  );
};
