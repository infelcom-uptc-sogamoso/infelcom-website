import { Box, Typography } from '@mui/material';
import Slider from 'react-slick';
import { WhatWeDoCard } from './WhatWeDoCard';
import styles from './WhatWeDo.module.css';

const whatWeDoData = [
  {
    imageUrl: '/icons/web_design.gif',
    title: 'Diseño web',
    description:
      'El diseño web es una área enfocada a planificar, diseñar, mantener y crear interfaces digitales. Es decir, que se refiere al proceso del diseño de sitios y páginas web. ',
  },
  {
    imageUrl: '/icons/data_transfer.gif',
    title: 'Tecnicas de extracción de datos',
    description:
      'La extracción es un tipo de recuperacion de la informción cuyo objetivo es extraer automáticamente información estructurada o desestructurado.',
  },
  {
    imageUrl: '/icons/satelite.gif',
    title: 'Comunicación satelital',
    description:
      'Son tipos de comunicación que emplea como soporte un satélite, se localiza en la órbita terrestre, está diseñado para la recepción de señales de radiofrecuencia.',
  },
  {
    imageUrl: '/icons/artificial_intelligence.gif',
    title: 'Inteligencia artificial',
    description:
      'La inteligencia artificial es la serie de tecnologías que sirven para emular características o capacidades exclusivas del intelecto humano, nos llevan a reflexionar hacia dónde va el mundo.',
  },
  {
    imageUrl: '/icons/data_mining.gif',
    title: 'Mineria de datos',
    description:
      'Es un campo de la estadística y las ciencias de la computación referido al proceso que intenta descubrir patrones en grandes volúmenes de conjuntos de datos.​​ ',
  },
  {
    imageUrl: '/icons/videogames.gif',
    title: 'Desarrollo de videojuegos',
    description:
      'Es crear un videojuego para diversas plataformas (videoconsola o computadora personal). Un videojuego es un software informático creado para el entretenimiento en general.',
  },
  {
    imageUrl: '/icons/virtual_reality.gif',
    title: 'Realidad virtual',
    description:
      'Es la simulación de experiencias con entornos y objetos generados por ordenador, manipulable en tiempo real involucrando el uso de todos los sentidos.',
  },
];

export const WhatWeDo = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box padding="30px">
      <Typography variant="h1" align="center" mt={'50px'} mb={'20px'}>
        ¿QUÉ HACEMOS?
      </Typography>
      <Slider {...settings}>
        {whatWeDoData.map((it) => (
          <div key={it.title} className={styles['card-container']}>
            <WhatWeDoCard whatwedo={it} />
          </div>
        ))}
      </Slider>
    </Box>
  );
};
