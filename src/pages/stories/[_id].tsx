import type { GetStaticPaths } from 'next';
import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Skeleton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { LandingLayout } from '@/components/layouts';
import { IStory } from '@/interfaces';
import { infelcomApi } from '@/infelcomApis';
import { formatDate } from '@/utils';
import { getContentProps } from '@/content/getContentProps';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { inLocale } from '@/i18n/locale';

const StoryPage = () => {
  const [story, setStory] = useState<IStory>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { _id } = router.query;
  const { t, locale } = useT();
  const { pages } = useContent();
  const title = story ? inLocale(story, 'title', locale) : '';
  const resume = story ? inLocale(story, 'resume', locale) : '';
  const content = story ? inLocale(story, 'content', locale) : '';

  useEffect(() => {
    if (!_id || _id === 'new') return;
    infelcomApi({ url: `/story/?_id=${_id}`, method: 'GET' })
      .then((res) => setStory(res.data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [_id]);

  return (
    <LandingLayout
      title={title || t.stories.fallbackTitle}
      pageDescription={resume || pages.stories.description}
      imageFullUrl={story?.imageUrl}>
      <article className="section container" style={{ maxWidth: 860 }}>
        <Button
          component={NextLink}
          href="/stories"
          variant="text"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}>
          {t.stories.back}
        </Button>
        {isLoading ? (
          <>
            <Skeleton variant="text" height={64} />
            <Skeleton variant="rounded" height={360} sx={{ mt: 2, borderRadius: 4 }} />
          </>
        ) : !story ? (
          <Typography>{t.stories.notFound}</Typography>
        ) : (
          <>
            <Typography variant="h1">{title}</Typography>
            <Typography
              component="time"
              dateTime={story.createdAt}
              sx={{ display: 'block', mt: 1, color: 'primary.main', fontWeight: 600 }}>
              {formatDate(story.createdAt)}
            </Typography>
            {resume && (
              <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '1.1rem' }}>
                {resume}
              </Typography>
            )}
            {story.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={story.imageUrl}
                alt={title}
                style={{ width: '100%', height: 'auto', margin: '24px 0', borderRadius: 16 }}
              />
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: content }} />
          </>
        )}
      </article>
    </LandingLayout>
  );
};

// Story data is fetched client-side; this only provides the site content (rendered on demand).
export const getStaticPaths: GetStaticPaths = async () => ({ paths: [], fallback: 'blocking' });
export const getStaticProps = getContentProps;

export default StoryPage;
