import { FC, useContext } from 'react';
import Head from 'next/head';
import { Navbar, SideMenu } from '../ui';
import { Box, Typography } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { UiContext } from '@/contexts';

interface Props {
  title: string;
  subTitle: string;
  icon?: JSX.Element;
  children: JSX.Element | JSX.Element[];
}

export const AdminLayout: FC<Props> = ({ children, title, subTitle, icon }) => {
  const { isOpenSnackbar, message, toogleSnackbar } = useContext(UiContext);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
    if (reason === 'clickaway') {
      return;
    }
    toogleSnackbar('');
  };
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <nav>
        <Navbar />
      </nav>
      <SideMenu />
      <main style={{ margin: '60px' }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="h2" sx={{ mb: 1 }}>
            {subTitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
        <Snackbar
          open={isOpenSnackbar}
          autoHideDuration={5000}
          onClose={handleClose}
          message={message}
        />
      </main>
    </>
  );
};
