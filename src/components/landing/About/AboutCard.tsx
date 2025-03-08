import { FC } from 'react';
import NextLink from 'next/link';
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { IGroup } from '@/interfaces';

interface Props {
  group: IGroup;
}

export const AboutCard: FC<Props> = ({ group }) => {
  const { title, description, image } = group;

  return (
    <Grid
      item
      xs={12}
      sm={4}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
      <Card
        sx={{
          width: '300px',
          height: '430px',
          color: '#B3B2AE',
          elevation: 5,
          backgroundColor: 'transparent',
          borderRadius: '4px',
          ':hover': {
            transition: 'all 0.5s ease-in-out',
            backgroundColor: '#5D6363',
          },
        }}>
        <NextLink href={''} passHref legacyBehavior>
          <Link>
            <CardActionArea>
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" color={'primary'}>
                  {title}
                </Typography>
                <Typography variant="body1" color={'primary'}>
                  {description}
                </Typography>
              </CardContent>
              <CardMedia
                component={'img'}
                alt="semillero"
                image={image}
                sx={{ padding: '10px', objectFit: 'cover' }}
              />
            </CardActionArea>
          </Link>
        </NextLink>
      </Card>
    </Grid>
  );
};
