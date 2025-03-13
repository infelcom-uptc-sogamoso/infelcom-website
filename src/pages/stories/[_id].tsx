import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { LandingLayout } from '@/components/layouts';
import { IStory } from '@/interfaces';
import { infelcomApi } from '@/infelcomApis';
import { formatDate } from '@/utils';
import { Box, CardMedia, Typography } from '@mui/material';
import { CardSkeleton } from '@/components/skeletons/CardSkeleton';

const StoryPage = () => {
  const [story, setStory] = useState<IStory>();
  const [newContent, setNewContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { _id } = router.query;

  useEffect(() => {
    if (_id && _id !== 'new') {
      fetchStoryById(_id)
    }
  }, [_id])

  const fetchStoryById = async (_id: any) => {
    try {
      await infelcomApi({
        url: `/story/?_id=${_id}`,
        method: 'GET',
      }).then((res) => {
        setIsLoading(false);
        setStory(res.data)
      });
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (story?.content) setNewContent(story.content);
  }, [story]);

  return (
    <LandingLayout title={story?.title || ''} pageDescription={story?.resume || ''}>
      <Box
        sx={{
          p: 5,
          pb: 0,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
        {isLoading
          ? <CardSkeleton quantity={1} width={320} height={660} />
          : (
            <Box
              sx={{
                gap: '24px',
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '900px',
              }}>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                }}>
                <Typography variant="h1">{story?.title}</Typography>
                <Box>
                  <Typography variant="body2" textAlign={'end'} fontWeight={'600'}>
                    {formatDate(story?.createdAt || '')}
                  </Typography>
                </Box>
              </Box>
              <Typography color={'GrayText'}>{story?.resume}</Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                }}>
                <CardMedia
                  component={'img'}
                  alt="story-img"
                  image={story?.imageUrl}
                  sx={{
                    maxWidth: '800px',
                    objectFit: 'cover',
                  }}
                />
              </Box>
              <p style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: newContent }}></p>
            </Box>
          )}
      </Box>
    </LandingLayout>
  );
};

export default StoryPage;
