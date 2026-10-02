import { FC, ReactNode, useContext } from 'react';
import Head from 'next/head';
import { Navbar } from '../ui/Navbar';
import { SideMenu } from '../ui/SideMenu';
import { Box, Typography } from '@mui/material';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import { UiContext } from '@/contexts';

interface Props {
  title: string;
  subTitle: string;
  icon?: ReactNode;
  children: ReactNode;
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
      <Navbar />
      <SideMenu />
      <main className="container" style={{ paddingBlock: 40 }}>
        <Box display="flex" flexDirection="column">
          <Typography variant="h1" component="h1">
            {icon} {title}
          </Typography>
          <Typography variant="subtitle1" component="p" sx={{ mb: 1, color: 'text.secondary' }}>
            {subTitle}
          </Typography>
        </Box>
        <Box className="fadeIn">{children}</Box>
        <Snackbar
          open={isOpenSnackbar}
          autoHideDuration={3000}
          onClose={handleClose}
          message={message}
        />
      </main>
    </>
  );
};
