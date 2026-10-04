import { FC, ReactNode } from 'react';
import Head from 'next/head';
import { Navbar } from '../ui/Navbar';
import { SideMenu } from '../ui/SideMenu';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
  subTitle: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const AdminLayout: FC<Props> = ({ children, title, subTitle, icon }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="robots" content="noindex" />
    </Head>
    <Navbar />
    <SideMenu />
    <main className="container" style={{ paddingBlock: 'clamp(24px, 4vw, 40px)' }}>
      <Box display="flex" flexDirection="column">
        <Typography
          variant="h1"
          component="h1"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            fontSize: 'clamp(1.6rem, 1.2rem + 2vw, 2.4rem)',
          }}>
          {icon} {title}
        </Typography>
        <Typography variant="subtitle1" component="p" sx={{ mb: 1, color: 'text.secondary' }}>
          {subTitle}
        </Typography>
      </Box>
      <Box className="fadeIn">{children}</Box>
    </main>
  </>
);
