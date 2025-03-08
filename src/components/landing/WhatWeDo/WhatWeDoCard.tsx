import { FC } from 'react';
import Image from 'next/image';
import { IWhatWeDo } from '@/interfaces';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import styles from './WhatWeDo.module.css';

interface Props {
  whatwedo: IWhatWeDo;
}

export const WhatWeDoCard: FC<Props> = ({ whatwedo }) => {
  return (
    <Card elevation={5} className={styles['card-content']}>
      <Image alt={whatwedo.title} src={whatwedo.imageUrl} width={80} height={80} />
      <CardContent>
        <Typography variant="subtitle1" textAlign={'center'} mb={'16px'}>
          {whatwedo.title}
        </Typography>
        <Typography variant="body1" lineHeight={'1.5rem'}>
          {whatwedo.description}
        </Typography>
      </CardContent>
    </Card>
  );
};
