import { Box, Grid, Link, Typography } from '@mui/material';
import RocketLaunchIcon from '@mui/icons-material/RocketLaunch';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import styles from './WhyUs.module.css';
import Image from 'next/image';
import NextLink from 'next/link';

export const WhyUs = () => {
  return (
    <>
      <Box
        display={'flex'}
        flexDirection={'column'}
        justifyContent="center"
        alignItems={'center'}
        p={'20px 30px'}>
        <Typography variant="h1" align="center">
          ¿POR QUÉ NUESTRO GRUPO DE INVESTIGACIÓN?
        </Typography>
      </Box>
      <Box className={styles['groups-container']}>
        <div className={styles['item-container']}>
          <Image alt="Projects" src={'/icons/projects.gif'} width={80} height={80} />
          <Typography variant="h5" mt={2} textAlign={'center'}>
            Proyectos
          </Typography>
          <Typography variant="h3" mt={2} className={styles['item-label']}>
            + 100
          </Typography>
        </div>
        <div className={styles['item-container']}>
          <NextLink href={'/researchers'} passHref legacyBehavior>
            <Link>
              <Image alt="Projects" src={'/icons/researches.gif'} width={80} height={80} />
              <Typography variant="h5" mt={2} textAlign={'center'}>
                Investigadores
              </Typography>
              <Typography variant="h3" mt={2} className={styles['item-label']}>
                + 10
              </Typography>
            </Link>
          </NextLink>
        </div>
        <div className={styles['item-container']}>
          <Image alt="Projects" src={'/icons/research.gif'} width={80} height={80} />
          <Typography variant="h5" mt={2} textAlign={'center'}>
            Líneas de investigación
          </Typography>
          <Typography variant="h3" mt={2} className={styles['item-label']}>
            3
          </Typography>
        </div>
      </Box>
    </>
  );
};
