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
  Tune,
} from '@mui/icons-material';
import { AuthContext, UiContext } from '@/contexts';
import { useT } from '@/i18n/useT';
import { NAV_LINKS } from '@/utils/site';
import { isAdminRole } from '@/utils/roles';

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
  const { t } = useT();

  return (
    <Drawer
      open={isMenuOpen}
      anchor="right"
      onClose={toogleSideMenu}
      PaperProps={{ sx: { width: { xs: '86vw', sm: 320 }, maxWidth: 360 } }}>
      <Box
        id="side-menu"
        component="nav"
        aria-label={t.nav.menu}
        display="flex"
        flexDirection="column"
        height="100%">
        <Box display="flex" justifyContent="flex-end" p={1}>
          <IconButton
            onClick={toogleSideMenu}
            aria-label={t.nav.closeMenu}
            sx={{ width: 44, height: 44 }}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {NAV_LINKS.map(({ href, key }) => (
            <ListItemButton
              key={href}
              component={NextLink}
              href={href}
              onClick={toogleSideMenu}
              selected={pathname === href}
              sx={{ minHeight: 52 }}>
              <ListItemIcon>{icons[href]}</ListItemIcon>
              <ListItemText primary={t.nav[key]} />
            </ListItemButton>
          ))}
          {isAdminRole(user?.role) && (
            <>
              <Divider sx={{ my: 1 }} />
              <ListSubheader>{t.nav.adminPanel}</ListSubheader>
              <ListItemButton
                component={NextLink}
                href="/admin"
                onClick={toogleSideMenu}
                sx={{ minHeight: 52 }}>
                <ListItemIcon>
                  <Dashboard />
                </ListItemIcon>
                <ListItemText primary={t.nav.adminHome} />
              </ListItemButton>
              <ListItemButton
                component={NextLink}
                href="/admin/content"
                onClick={toogleSideMenu}
                sx={{ minHeight: 52 }}>
                <ListItemIcon>
                  <Tune />
                </ListItemIcon>
                <ListItemText primary={t.nav.siteContent} />
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
              <ListItemText primary={t.nav.logout} />
            </ListItemButton>
          ) : (
            <ListItemButton
              component={NextLink}
              href={`/auth/login?p=${encodeURIComponent(asPath)}`}
              onClick={toogleSideMenu}
              sx={{ minHeight: 56 }}>
              <ListItemIcon>
                <LoginOutlined />
              </ListItemIcon>
              <ListItemText primary={t.nav.login} />
            </ListItemButton>
          )}
        </Box>
      </Box>
    </Drawer>
  );
};
