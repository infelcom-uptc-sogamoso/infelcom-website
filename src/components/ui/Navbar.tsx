'use client';
import NextLink from 'next/link';
import { AppBar, Box, Button, IconButton, Link, Toolbar, Typography } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import { useContext } from 'react';
import { UiContext } from '@/contexts';
import { usePathname } from 'next/navigation';

export const Navbar = () => {
  const { toogleSideMenu } = useContext(UiContext);
  const pathname = usePathname();

  return (
    <AppBar style={{ position: 'sticky', top: 0, zIndex: 1000 }}>
      <Toolbar>
        <NextLink href={'/'} passHref legacyBehavior>
          <Link display={'flex'} alignItems={'center'}>
            <Typography variant="h5" fontWeight={500} sx={{ ml: 1 }} color={'primary'}>
              INFELCOM
            </Typography>
          </Link>
        </NextLink>
        <Box flex={1} />
        {!pathname.includes('/admin') && (
          <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
            <NextLink href={'/researchers'} passHref legacyBehavior>
              <Link>
                <Button sx={{ ml: 0.5 }}>Nosotros</Button>
              </Link>
            </NextLink>
            <NextLink href={'/projects'} passHref legacyBehavior>
              <Link>
                <Button sx={{ ml: 0.5 }}>Proyectos</Button>
              </Link>
            </NextLink>
          </Box>
        )}
        <IconButton onClick={toogleSideMenu}>
          <MenuOutlinedIcon color="primary" />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};
