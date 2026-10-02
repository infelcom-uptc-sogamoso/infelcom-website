import { ReactNode, useContext } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import {
  Article,
  Assignment,
  Close,
  Dashboard,
  Groups,
  Home,
  LoginOutlined,
  LogoutOutlined,
  Mail,
} from '@mui/icons-material';
import { AuthContext, UiContext } from '@/contexts';
import { NAV_LINKS } from '@/utils/site';

const icons: Record<string, ReactNode> = {
  '/': <Home />,
  '/researchers': <Groups />,
  '/projects': <Assignment />,
  '/stories': <Article />,
  '/#contact': <Mail />,
};

export const SideMenu = () => {
  const { isMenuOpen, toogleSideMenu } = useContext(UiContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const { asPath, pathname } = useRouter();

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      onClose={toogleSideMenu}
      PaperProps={{ sx: { width: { xs: '86vw', sm: 320 }, maxWidth: 360 } }}>
      <Box
        id="side-menu"
        component="nav"
        aria-label="Menú"
        display="flex"
        flexDirection="column"
        height="100%">
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton
            onClick={toogleSideMenu}
            aria-label="Cerrar menú"
            sx={{ width: 44, height: 44 }}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map(({ href, label }) => (
            <ListItemButton
              key={href}
              component={NextLink}
              href={href}
              onClick={toogleSideMenu}
              selected={pathname === href}
              sx={{ minHeight: 52 }}>
              <ListItemIcon>{icons[href]}</ListItemIcon>
              <ListItemText primary={label} />
            </ListItemButton>
          ))}
          {user?.role === 'admin' && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListSubheader>Admin Panel</ListSubheader>
              <ListItemButton
                component={NextLink}
                href="/admin"
                onClick={toogleSideMenu}
                sx={{ minHeight: 52 }}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary={'Módulo de Administración'} />
              </ListItemButton>
            </>
          )}
        </List>
        <Box mt="auto">
          <Divider />
          {isLoggedIn ? (
            <ListItemButton onClick={logout} sx={{ minHeight: 56 }}>
              <ListItemIcon>
                <LogoutOutlined />
              </ListItemIcon>
              <ListItemText primary={'Salir'} />
            </ListItemButton>
          ) : (
            <ListItemButton
              component={NextLink}
              href={`/auth/login?p=${asPath}`}
              onClick={toogleSideMenu}
              sx={{ minHeight: 56 }}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={'Ingresar'} />
            </ListItemButton>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
