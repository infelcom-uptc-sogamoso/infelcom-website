import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';
import { AuthLayout } from '@/components/layouts';
import { Preferences } from '@/components/ui/Preferences';
import { useT } from '@/i18n/useT';
import { validations } from '@/utils';

type FormData = {
  email: string;
  password: string;
};

/** Only same-site paths are accepted as the post-login destination (no open redirect). */
const safeRedirect = (p: unknown) =>
  typeof p === 'string' && p.startsWith('/') && !p.startsWith('//') ? p : '/';

const LoginPage = () => {
  const { t } = useT();
  const router = useRouter();
  const [showError, setShowError] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>();

  const onLoginUser = async ({ email, password }: FormData) => {
    setShowError(false);
    const response = await signIn('credentials', { email, password, redirect: false });
    if (response?.error) {
      setShowError(true);
    } else {
      router.push(safeRedirect(router.query.p));
    }
  };

  return (
    <AuthLayout title={t.auth.title}>
      <Box sx={{ width: 'min(100%, 380px)', px: 2.5 }}>
        {/* The selectors are styled for the dark navbar, so give them a dark pill here */}
        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Box display="inline-flex" gap={1} p={0.5} borderRadius={3} bgcolor="#15181b">
            <Preferences />
          </Box>
        </Box>
        <form onSubmit={handleSubmit(onLoginUser)} noValidate>
          <Stack spacing={2}>
            <Typography variant="h1" component="h1" sx={{ fontSize: '2rem' }}>
              {t.auth.title}
            </Typography>
            {showError && (
              <Alert severity="error" className="fadeIn">
                {t.auth.badCredentials}
              </Alert>
            )}
            <TextField
              type="email"
              label={t.auth.email}
              autoComplete="email"
              variant="filled"
              fullWidth
              {...register('email', {
                required: t.validation.required,
                validate: (v) => validations.isValidEmail(v) || t.validation.email,
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              type="password"
              label={t.auth.password}
              autoComplete="current-password"
              variant="filled"
              fullWidth
              {...register('password', {
                required: t.validation.required,
                minLength: { value: 6, message: t.validation.minLength(6) },
              })}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <Button type="submit" size="large" fullWidth disabled={isSubmitting}>
              {t.auth.submit}
            </Button>
          </Stack>
        </form>
      </Box>
    </AuthLayout>
  );
};

export default LoginPage;
