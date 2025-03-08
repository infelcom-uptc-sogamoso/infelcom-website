import React, { FC } from 'react';
import { Skeleton } from '@mui/material';

interface Props {
  quantity: number;
  width: any;
  height: any;
}

export const ListSkeleton: FC<Props> = ({ quantity, width, height }) => {
  return (
    <>
      {[...Array(quantity)].map((_, index) => (
        <Skeleton key={index} variant="rectangular" width={width} height={height} />
      ))}
    </>
  );
};
