import { LandingLayout } from '@/components/layouts';
import { StoriesList } from '@/components/stories/StoriesList';
import { useStories } from '@/hooks';
import { Box, Typography } from '@mui/material';

const Stories = () => {
  const { stories, isLoading } = useStories('/stories');

  return (
    <LandingLayout title="Noticias" pageDescription="Últimas noticias">
      <Box sx={{ mt: 5, mb: 5, pt: 5 }}>
        <Typography variant="h1" align="center" color={'info'}>
          Últimas Noticias
        </Typography>
        <StoriesList stories={stories} isLoading={isLoading} />
      </Box>
    </LandingLayout>
  );
};

export default Stories;
