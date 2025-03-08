import { NextPage } from 'next';
import { AboutCard } from '@/components/landing/About/AboutCard';
import { Contact, Hero, WhatWeDo, WhyUs } from '@/components/landing';
import { LandingLayout } from '@/components/layouts';
import { StoriesList } from '@/components/stories/StoriesList';
import { useStories } from '@/hooks';
import { Box, Grid, Typography } from '@mui/material';

const groupsData = [
  {
    title: 'SEMTEL',
    description: 'Semillero de Telecomunicaciones',
    image: '/semilleros/semtel.png',
  },
  {
    title: 'SCIECOM',
    description: 'Semillero de Ciencias computacionales',
    image: '/semilleros/sciecom.png',
  },
  {
    title: 'SEMVR',
    description: 'Semillero de Realidad Virtual',
    image: '/semilleros/semvr.png',
  },
];

const HomePage: NextPage = () => {
  const { stories, isLoading } = useStories('/stories');

  return (
    <LandingLayout title="Infelcom" pageDescription="Semillero de investigación">
      <Hero />
      <section
        id="about"
        style={{
          marginTop: '50px',
        }}>
        <WhyUs />
        <WhatWeDo />
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent="center"
          alignItems={'center'}
          mt={'40px'}
          sx={{
            background: '#222222',
            p: '50px 30px',
          }}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h1" align="center" color={'primary'}>
              NUESTROS GRUPOS DE INVESTIGACIÓN
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {groupsData.map((group) => (
              <AboutCard key={group.title} group={group} />
            ))}
          </Grid>
        </Box>
      </section>
      <section>
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          marginTop={'50px'}
          pl={'30px'}
          pr={'30px'}>
          <Box sx={{ mb: 5 }}>
            <Typography variant="h1" align="center" color={'info'}>
              Noticias
            </Typography>
          </Box>
          <StoriesList stories={stories} isLoading={isLoading} />
        </Box>
      </section>
      <section>
        <Box sx={{ mt: '50px', p: '0px 60px', display: 'flex', justifyContent: 'center' }}>
          <Contact />
        </Box>
      </section>
    </LandingLayout>
  );
};

export default HomePage;
