import { FC } from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography } from '@mui/material';
import { formatDate } from '@/utils';
import { useRouter } from 'next/router';

interface Props {
  story: any;
}

export const StoriesCard: FC<Props> = ({ story }) => {
  const { code, title, resume, imageUrl, createdAt } = story;
  const [creationDate] = formatDate(createdAt).split(' ');
  const route = useRouter();

  return (
    <Grid
      item
      xs={12}
      sm={3}
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Card>
        <CardActionArea
          href={`/stories/${code}`}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: '16px',
            borderRadius: '4px',
            maxWidth: '300px',
          }}>
          <CardMedia
            component={'img'}
            className={'fadeIn'}
            image={imageUrl || '/hero/image-not-available.jpg'}
            alt={'story-img'}
            sx={{
              maxWidth: '300px',
              height: '300px',
              borderRadius: '4px',
            }}
          />
          <CardContent>
            <Typography variant="subtitle1" align="center" mb={1}>
              {title}
            </Typography>
            {route.pathname !== '/' && (
              <Typography variant="body2" align="center" mb={1} textAlign={'justify'}>
                {resume}
              </Typography>
            )}
            <Typography variant="body2" fontWeight={700} align="center" mb={1}>
              {creationDate}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};
