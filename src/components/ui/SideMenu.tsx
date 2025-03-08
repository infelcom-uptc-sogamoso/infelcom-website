import { useContext } from 'react';
import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
} from '@mui/material';
import { useRouter } from 'next/router';
import { AuthContext, UiContext } from '@/contexts';
import { Assignment, Dashboard, Groups, LoginOutlined, LogoutOutlined } from '@mui/icons-material';

export const SideMenu = () => {
  const { isMenuOpen, toogleSideMenu } = useContext(UiContext);
  const { isLoggedIn, user, logout } = useContext(AuthContext);
  const router = useRouter();

  const navigateTo = (url: string) => {
    toogleSideMenu();
    router.push(url);
  };

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      sx={{
        backdropFilter: 'blur(4px)',
        transition: 'all 0.5s ease-out',
      }}
      onClose={toogleSideMenu}>
      <Box sx={{ width: 250, paddingTop: '8px' }}>
        <List>
          <ListItemButton
            sx={{ display: { sm: 'none' } }}
            onClick={() => navigateTo('/researchers')}>
            <ListItemIcon>
              <Groups />
            </ListItemIcon>
            <ListItemText primary={'Nosotros'} />
          </ListItemButton>
          <ListItemButton sx={{ display: { sm: 'none' } }} onClick={() => navigateTo('/projects')}>
            <ListItemIcon>
              <Assignment />
            </ListItemIcon>
            <ListItemText primary={'Proyectos'} />
          </ListItemButton>
          {user?.role === 'admin' && (
            <>
              <Divider sx={{ display: { sm: 'none' } }} />
              <ListSubheader>Admin Panel</ListSubheader>
              <ListItemButton onClick={() => navigateTo('/admin')}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary={'Módulo de Administracion'} />
              </ListItemButton>
            </>
          )}
          {isLoggedIn ? (
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                height: 56,
              }}>
              <Divider />
              <ListItemButton onClick={logout}>
                <ListItemIcon>
                  <LogoutOutlined />
                </ListItemIcon>
                <ListItemText primary={'Salir'} />
              </ListItemButton>
            </Box>
          ) : (
            <Box
              sx={{
                position: 'fixed',
                bottom: 0,
                width: '100%',
                height: 56,
              }}>
              <Divider />
              <ListItemButton onClick={() => navigateTo(`/auth/login?p=${router.asPath}`)}>
                <ListItemIcon>
                  <LoginOutlined />
                </ListItemIcon>
                <ListItemText primary={'Ingresar'} />
              </ListItemButton>
            </Box>
          )}
        </List>
      </Box>
    </Drawer>
  );
};
