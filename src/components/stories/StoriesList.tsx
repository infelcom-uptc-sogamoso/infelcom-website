import { FC } from 'react';
import { IStory } from '@/interfaces';
import { StoriesCard } from './StoriesCard';
import { Box, Button } from '@mui/material';
import { AddOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { CardSkeleton } from '../skeletons/CardSkeleton';

interface Props {
  stories: IStory[];
  isLoading: boolean;
}

export const StoriesList: FC<Props> = ({ stories, isLoading }) => {
  const route = useRouter();

  return (
    <Box
      padding={'30px'}
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: 'flex-start',
        justifyContent: 'space-evenly',
      }}>
      {stories.length > 4 && route.pathname === '/' && (
        <Box display="flex" justifyContent="flex-end">
          <Button
            startIcon={<AddOutlined />}
            color="primary"
            href="/stories"
            sx={{ width: 'fit-content' }}>
            Ver mas
          </Button>
        </Box>
      )}
      {isLoading && <CardSkeleton quantity={3} width={300} height={415} />}
      {stories.map((story) => (
        <StoriesCard key={story.code} story={story} />
      ))}
    </Box>
  );
};
