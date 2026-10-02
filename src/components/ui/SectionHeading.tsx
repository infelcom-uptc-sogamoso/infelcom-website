import { FC, ReactNode } from 'react';
import { Typography } from '@mui/material';

interface Props {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  as?: 'h1' | 'h2';
  id?: string;
  dark?: boolean;
  align?: 'center' | 'left';
}

export const SectionHeading: FC<Props> = ({
  eyebrow,
  title,
  description,
  as = 'h2',
  id,
  dark,
  align = 'center',
}) => (
  <header
    style={{
      textAlign: align,
      maxWidth: 760,
      margin: align === 'center' ? '0 auto 40px' : '0 0 16px',
    }}>
    {eyebrow && (
      <Typography
        component="p"
        variant="overline"
        sx={{
          color: dark ? 'primary.light' : 'primary.main',
          fontWeight: 600,
          letterSpacing: '.16em',
        }}>
        {eyebrow}
      </Typography>
    )}
    <Typography id={id} component={as} variant={as} sx={{ color: dark ? '#fff' : 'text.primary' }}>
      {title}
    </Typography>
    {description && (
      <Typography sx={{ mt: 1.5, color: dark ? 'grey.400' : 'text.secondary' }}>
        {description}
      </Typography>
    )}
  </header>
);
