import { FC } from 'react';
import { Skeleton } from '@mui/material';

interface Props {
  quantity: number;
  height: number;
  width?: number | string;
}

export const CardSkeleton: FC<Props> = ({ quantity, height, width = '100%' }) => (
  <>
    {[...Array(quantity)].map((_, index) => (
      <Skeleton
        key={index}
        variant="rounded"
        width={width}
        height={height}
        sx={{ borderRadius: 4 }}
      />
    ))}
  </>
);
