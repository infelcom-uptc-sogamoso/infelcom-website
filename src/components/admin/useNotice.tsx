import { useState } from 'react';
import { Alert, Box, Snackbar } from '@mui/material';

type Notice = { severity: 'success' | 'error'; text: string };

/** Success/error toast for admin pages: `notify({ severity, text })` + render `notice`. */
export const useNotice = () => {
  const [current, setCurrent] = useState<Notice | null>(null);
  const close = () => setCurrent(null);
  const notice = (
    <Snackbar
      open={!!current}
      autoHideDuration={current?.severity === 'error' ? 8000 : 4000}
      onClose={(_, reason) => reason !== 'clickaway' && close()}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      sx={{ top: 'calc(var(--header-h) + 8px) !important' }}>
      <Box>
        {current && (
          <Alert severity={current.severity} variant="filled" onClose={close}>
            {current.text}
          </Alert>
        )}
      </Box>
    </Snackbar>
  );
  return { notify: setCurrent, notice };
};
