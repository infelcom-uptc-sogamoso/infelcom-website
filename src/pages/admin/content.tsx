import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import useSWR from 'swr';
import axios from 'axios';
import { FormProvider, useForm, type FieldValues } from 'react-hook-form';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from '@mui/material';
import { ExpandMore, OpenInNew, SaveOutlined, Tune } from '@mui/icons-material';
import { AdminLayout } from '@/components/layouts';
import { useNotice } from '@/components/admin/useNotice';
import { ContentFields } from '@/components/admin/ContentFields';
import { defaultContent } from '@/content/siteContent';
import type { StoredContent } from '@/database/dbContent';
import { apiErrorMessage, infelcomApi } from '@/infelcomApis';
import { useT } from '@/i18n/useT';


const SECTIONS = Object.keys(defaultContent) as (keyof typeof defaultContent)[];

const AdminContentPage = () => {
  const { t, locale } = useT();
  const { notify, notice } = useNotice();
  const { data, error, isLoading, mutate } = useSWR<StoredContent>('/api/admin/content', {
    revalidateOnFocus: false,
  });
  const form = useForm<FieldValues>({ defaultValues: defaultContent, mode: 'onBlur' });
  const {
    reset,
    handleSubmit,
    setError,
    formState: { isDirty, isSubmitting },
  } = form;

  // Load (and re-load after saving) the stored content as the form's clean baseline.
  useEffect(() => {
    if (data) reset(data.content);
  }, [data, reset]);

  // Sections are collapsible; open the ones holding errors so the admin can see them.
  const [expanded, setExpanded] = useState<string[]>([]);
  const reveal = (paths: string[]) =>
    setExpanded((prev) => Array.from(new Set([...prev, ...paths.map((p) => p.split('.')[0])])));

  const onSubmit = async (content: FieldValues) => {
    try {
      const { data: saved } = await infelcomApi.put<StoredContent>('/admin/content', { content });
      await mutate(saved, { revalidate: false });
      notify({ severity: 'success', text: t.admin.saved });
    } catch (err) {
      const paths: string[] = (axios.isAxiosError(err) && err.response?.data?.errors) || [];
      paths.forEach((path) => setError(path, { message: t.admin.invalidData }));
      reveal(paths);
      notify({ severity: 'error', text: apiErrorMessage(err, t) });
    }
  };

  const onInvalid = (errors: FieldValues) => {
    reveal(Object.keys(errors));
    notify({ severity: 'error', text: t.admin.invalidData });
  };

  const status = isDirty
    ? t.admin.content.unsaved
    : data?.updatedAt
      ? t.admin.content.lastSaved(
          new Date(data.updatedAt).toLocaleString(locale === 'es' ? 'es-CO' : 'en-US'),
        )
      : '';

  return (
    <AdminLayout title={t.admin.content.title} subTitle={t.admin.content.subtitle} icon={<Tune />}>
      <Typography sx={{ color: 'text.secondary', mb: 2, maxWidth: 760 }}>
        {t.admin.content.intro}
      </Typography>

      {error ? (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" variant="text" onClick={() => mutate()}>
              {t.common.retry}
            </Button>
          }>
          {(error as { status?: number }).status === 401 ? t.admin.unauthorized : t.admin.loadError}
        </Alert>
      ) : isLoading || !data ? (
        <Stack spacing={1.5} aria-busy>
          {SECTIONS.map((s) => (
            <Skeleton key={s} variant="rounded" height={56} />
          ))}
        </Stack>
      ) : (
        <FormProvider {...form}>
          <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
            {!data.updatedAt && (
              <Alert severity="info" sx={{ mb: 2 }}>
                {t.admin.content.defaults}
              </Alert>
            )}
            {SECTIONS.map((section) => (
              <Accordion
                key={section}
                disableGutters
                expanded={expanded.includes(section)}
                onChange={(_, open) =>
                  setExpanded((prev) => (open ? [...prev, section] : prev.filter((s) => s !== section)))
                }>
                <AccordionSummary expandIcon={<ExpandMore />} sx={{ minHeight: 56 }}>
                  <Typography variant="subtitle1" component="h2">
                    {t.admin.fields[section]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: { xs: 1.5, sm: 2 } }}>
                  <ContentFields path={section} template={defaultContent[section]} />
                </AccordionDetails>
              </Accordion>
            ))}

            <Paper
              elevation={6}
              sx={{
                position: 'sticky',
                bottom: 12,
                zIndex: 2,
                mt: 3,
                p: 1.5,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: 1.5,
              }}>
              <Button
                type="submit"
                startIcon={<SaveOutlined />}
                disabled={isSubmitting || !isDirty}
                sx={{ flex: { xs: '1 1 100%', sm: '0 0 auto' } }}>
                {isSubmitting ? t.common.saving : t.common.save}
              </Button>
              <Typography variant="body2" role="status" sx={{ color: 'text.secondary', mr: 'auto' }}>
                {status}
              </Typography>
              <Button
                component={NextLink}
                href="/"
                target="_blank"
                variant="text"
                endIcon={<OpenInNew />}>
                {t.admin.content.viewSite}
              </Button>
            </Paper>
          </form>
        </FormProvider>
      )}

      {notice}
    </AdminLayout>
  );
};

export default AdminContentPage;
