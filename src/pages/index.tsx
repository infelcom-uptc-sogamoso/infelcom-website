import { NextPage } from 'next';
import { AboutCard } from '@/components/landing/About/AboutCard';
import { Contact, Hero, WhatWeDo, WhyUs } from '@/components/landing';
import { LandingLayout } from '@/components/layouts';
import { StoriesList } from '@/components/stories/StoriesList';
import { useStories } from '@/hooks';
import { Box, Grid, Typography } from '@mui/material';
import { Settings, Slideshow } from '@mui/icons-material';
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { title } from 'process';

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
  {
    title: 'SICTE',
    description: 'Semillero de Ciberseguridad',
    image: '/semilleros/sicte.png',
  },
];

const HomePage: NextPage = () => {
  const { stories, isLoading } = useStories('/stories', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true, 
    autoplaySpeed: 3000, 
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

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
          
          <Box sx={{ width: '100%', maxWidth: '1200px' }}>
            <Slider {...sliderSettings}>
              {groupsData.map((group) => (
                <div key={group.title} style={{ padding: '0 10px' }}>
                  <AboutCard group={group} />
                </div>
              ))}
            </Slider>
          </Box>
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