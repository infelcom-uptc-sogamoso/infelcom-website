import { MouseEvent, ReactNode, useState, useSyncExternalStore } from 'react';
import { useRouter } from 'next/router';
import { ListItemIcon, Menu, MenuItem } from '@mui/material';
import { Check, DarkMode, LightMode, SettingsBrightness } from '@mui/icons-material';
import { useColorScheme } from '@mui/material/styles';
import { useT } from '@/i18n/useT';
import { LOCALE_COOKIE, type Locale } from '@/i18n/locale';
import styles from './Navbar.module.css';

type Mode = 'system' | 'light' | 'dark';
const noop = () => () => {};
const MODE_ICONS: Record<Mode, ReactNode> = {
  system: <SettingsBrightness fontSize="small" />,
  light: <LightMode fontSize="small" />,
  dark: <DarkMode fontSize="small" />,
};

/** A navbar button that opens a menu of mutually exclusive options. */
const PrefMenu = <T extends string>(props: {
  label: string;
  button: ReactNode;
  value: T | undefined;
  options: { value: T; label: string; icon?: ReactNode }[];
  onSelect: (value: T) => void;
}) => {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  return (
    <>
      <button
        type="button"
        className={styles.prefBtn}
        aria-label={props.label}
        aria-haspopup="menu"
        aria-expanded={!!anchor}
        title={props.label}
        onClick={(e: MouseEvent<HTMLElement>) => setAnchor(e.currentTarget)}>
        {props.button}
      </button>
      <Menu anchorEl={anchor} open={!!anchor} onClose={() => setAnchor(null)}>
        {props.options.map((o) => (
          <MenuItem
            key={o.value}
            selected={o.value === props.value}
            onClick={() => {
              setAnchor(null);
              props.onSelect(o.value);
            }}>
            {o.icon && <ListItemIcon>{o.icon}</ListItemIcon>}
            {o.label}
            {o.value === props.value && <Check fontSize="small" sx={{ ml: 'auto', pl: 2 }} />}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

/** Language (ES/EN) and theme (System/Light/Dark) selectors; both choices persist. */
export const Preferences = () => {
  const { t, locale } = useT();
  const router = useRouter();
  const { mode: storedMode, setMode } = useColorScheme();
  // The saved mode lives in localStorage: show "system" until hydrated to match the server HTML.
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const mode = ((hydrated && storedMode) || 'system') as Mode;

  const changeLocale = (next: Locale) => {
    // The cookie makes the choice win over the browser language on future visits (src/proxy.ts).
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale: next });
  };

  return (
    <>
      <PrefMenu<Locale>
        label={t.prefs.language}
        button={<span className={styles.prefCode}>{locale.toUpperCase()}</span>}
        value={locale}
        options={(['es', 'en'] as const).map((value) => ({ value, label: t.prefs.languages[value] }))}
        onSelect={changeLocale}
      />
      <PrefMenu<Mode>
        label={t.prefs.theme}
        button={MODE_ICONS[mode]}
        value={mode}
        options={(['system', 'light', 'dark'] as const).map((value) => ({
          value,
          label: t.prefs[value],
          icon: MODE_ICONS[value],
        }))}
        onSelect={setMode}
      />
    </>
  );
};
