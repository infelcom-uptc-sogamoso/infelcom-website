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

interface Props {
  researcher: any;
}

export const ResearcherCard: FC<Props> = ({ researcher }) => {
  const {
    imageUrl,
    name = 'Nombre(s)',
    lastName = 'Apellido(s)',
    type = 'Descripción',
    email = 'Correo electrónico',
    cvlacUrl = '',
  } = researcher;

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
          borderRadius: '4px',
          height: '340px',
          width: '300px',
          ':hover': {
            transition: 'all 0.5s ease-in-out',
            filter: 'grayscale(0%)',
          },
        }}>
        <CardActionArea
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyItems: 'center',
            justifyContent: 'space-around',
            height: '340px',
            padding: '10px',
            filter: { xs: '', sm: 'grayscale(100%)' },
            ':hover': {
              transition: 'all .2s ease-in-out',
              filter: 'grayscale(0%)',
            },
          }}>
          <CardMedia
            component={'img'}
            className={'fadeIn'}
            image={imageUrl || '/hero/image-not-available.jpg'}
            alt={name}
            sx={{
              width: '130px',
              height: '130px',
              borderRadius: '50%',
            }}
          />
          <CardContent
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyItems: 'center',
            }}>
            <Typography variant="subtitle1" align="center" mb={1}>
              {name} {lastName}
            </Typography>
            <Typography variant="body2" align="center" mb={1}>
              {type}
            </Typography>
            <Typography variant="subtitle1" align="center" mb={1}>
              {email}
            </Typography>
            <NextLink href={cvlacUrl} passHref legacyBehavior>
              <Link target="_blank">
                <Typography
                  variant="caption"
                  align="center"
                  mb={1}
                  sx={{
                    ':hover': {
                      transition: 'all 0.2s ease-in-out',
                      fontSize: '14px',
                    },
                  }}>
                  Ver CvLac
                </Typography>
              </Link>
            </NextLink>
          </CardContent>
        </CardActionArea>
      </Card>
    </Grid>
  );
};
