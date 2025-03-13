import { FC } from 'react';
import NextLink from 'next/link';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  CardMedia,
  Grid,
  Link,
  Typography,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

interface Props {
  project: any;
}

export const ProjectCard: FC<Props> = ({ project }) => {
  const {
    title = 'Titulo del proyecto',
    description = 'Descripción del proyecto',
    image,
    url = '',
  } = project;

  return (
    <Grid item sx={{ width: { xs: '100%', sm: '70%' } }}>
      <Accordion sx={{ width: '100%' }}>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1-content"
          id="panel1-header">
          <Typography variant="body1" sx={{ color: '#5D6363' }}>
            {title}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box display={'flex'} justifyContent={'center'}>
            <CardMedia
              component="img"
              image={image}
              alt={title}
              sx={{ maxWidth: '600px', marginBottom: '16px' }}
            />
          </Box>
          <Typography
            variant="caption"
            sx={{
              color: '#5D6363',
              textAlign: 'justify',
            }}>
            {description}
          </Typography>
        </AccordionDetails>
        {url && (
          <AccordionActions>
            <NextLink href={url} passHref legacyBehavior>
              <Link target="_blank">
                <Button>Ver proyecto</Button>
              </Link>
            </NextLink>
          </AccordionActions>
        )}
      </Accordion>
    </Grid>
  );
};
