import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Button, Skeleton, Typography } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { LandingLayout } from '@/components/layouts';
import { IStory } from '@/interfaces';
import { infelcomApi } from '@/infelcomApis';
import { formatDate } from '@/utils';

const StoryPage = () => {
  const [story, setStory] = useState<IStory>();
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { _id } = router.query;

  useEffect(() => {
    if (!_id || _id === 'new') return;
    infelcomApi({ url: `/story/?_id=${_id}`, method: 'GET' })
      .then((res) => setStory(res.data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [_id]);

  return (
    <LandingLayout
      title={story?.title || 'Noticia'}
      pageDescription={story?.resume || 'Noticias de INFELCOM'}
      imageFullUrl={story?.imageUrl}>
      <article className="section container" style={{ maxWidth: 860 }}>
        <Button
          component={NextLink}
          href="/stories"
          variant="text"
          startIcon={<ArrowBack />}
          sx={{ mb: 3 }}>
          Volver a noticias
        </Button>
        {isLoading ? (
          <>
            <Skeleton variant="text" height={64} />
            <Skeleton variant="rounded" height={360} sx={{ mt: 2, borderRadius: 4 }} />
          </>
        ) : !story ? (
          <Typography>No encontramos esta noticia.</Typography>
        ) : (
          <>
            <Typography variant="h1">{story.title}</Typography>
            <Typography
              component="time"
              dateTime={story.createdAt}
              sx={{ display: 'block', mt: 1, color: 'primary.main', fontWeight: 600 }}>
              {formatDate(story.createdAt)}
            </Typography>
            {story.resume && (
              <Typography sx={{ mt: 2, color: 'text.secondary', fontSize: '1.1rem' }}>
                {story.resume}
              </Typography>
            )}
            {story.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={story.imageUrl}
                alt={story.title}
                style={{ width: '100%', height: 'auto', margin: '24px 0', borderRadius: 16 }}
              />
            )}
            <div className="prose" dangerouslySetInnerHTML={{ __html: story.content }} />
          </>
        )}
      </article>
    </LandingLayout>
  );
};

export default StoryPage;
