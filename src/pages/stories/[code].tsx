import { LandingLayout } from '@/components/layouts';
import { dbStories } from '@/database';
import { IStory } from '@/interfaces';
import { Story } from '@/models';
import { formatDate } from '@/utils';
import { Box, CardMedia, Typography } from '@mui/material';
import { GetServerSideProps } from 'next';
import { FC, useEffect, useState } from 'react';

interface Props {
  story: IStory;
}

const StoryPage: FC<Props> = ({ story }) => {
  const { createdAt, title, resume, content, imageUrl } = story;
  const [newContent, setNewContent] = useState('');

  useEffect(() => {
    if (content) setNewContent(content);
  }, [content]);

  return (
    <LandingLayout title={title} pageDescription={resume}>
      <Box
        sx={{
          pt: 12,
          display: 'flex',
          flexDirection: 'row',
        }}>
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
            <Typography variant="h1">{title}</Typography>
            <Box>
              <Typography variant="body2" textAlign={'end'} fontWeight={'600'}>
                {formatDate(createdAt)}
              </Typography>
            </Box>
          </Box>
          <Typography color={'GrayText'}>{resume}</Typography>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}>
            <CardMedia
              component={'img'}
              alt="story-img"
              image={imageUrl}
              sx={{
                maxWidth: '800px',
                objectFit: 'cover',
              }}
            />
          </Box>
          <p style={{ textAlign: 'justify' }} dangerouslySetInnerHTML={{ __html: newContent }}></p>
        </Box>
      </Box>
    </LandingLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { code = '' } = query;

  let story: IStory | null;

  if (code === 'new') {
    const tempStory = JSON.parse(JSON.stringify(new Story()));
    delete tempStory.code;
    tempStory.imageUrl = '';
    story = tempStory;
  } else {
    story = await dbStories.getStoryById(code.toString());
  }

  if (!story) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      story,
    },
  };
};

export default StoryPage;
