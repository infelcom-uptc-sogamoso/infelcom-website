import React, { FC } from 'react';
import { Grid, Skeleton } from '@mui/material';

interface Props {
  quantity: number;
  width: any;
  height: any;
}

export const CardSkeleton: FC<Props> = ({ quantity, width, height }) => {
  return (
    <>
      {[...Array(quantity)].map((_, index) => (
        <Grid
          item
          key={index}
          xs={12}
          sm={4}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}>
          <Skeleton variant="rectangular" width={width} height={height} />
        </Grid>
      ))}
    </>
  );
};
