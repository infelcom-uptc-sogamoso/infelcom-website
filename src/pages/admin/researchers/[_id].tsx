import { Controller, FormProvider, useWatch } from 'react-hook-form';
import { Box, Divider, FormControlLabel, Grid, Stack, Switch } from '@mui/material';
import { Groups } from '@mui/icons-material';
import { AdminLayout } from '@/components/layouts';
import {
  BilingualText,
  FormText,
  ImageUpload,
  LoadError,
  RadioField,
  SaveButton,
  useEntityForm,
} from '@/components/admin/EntityForm';
import { ResearcherCard } from '@/components/researches/ResearcherCard';
import { IResearcher } from '@/interfaces';
import { useT } from '@/i18n/useT';

const CATEGORIES = ['undergraduate', 'master', 'doctoral'] as const;
const ROLES = ['professor', 'student'] as const;

const ResearcherAdminPage = () => {
  const { t } = useT();
  const { form, onSubmit, notice, record, loadError } = useEntityForm<IResearcher>(
    'researchers',
    'researcher',
    { name: '', lastName: '', type: '', email: '', cvlacUrl: '', imageUrl: '', isShowed: true, en: { type: '' } },
  );
  const preview = useWatch({ control: form.control });

  return (
    <AdminLayout
      title={t.admin.researcher}
      subTitle={record?.name ? t.admin.editing(`${record.name} ${record.lastName}`) : t.admin.creating}
      icon={<Groups />}>
      <LoadError message={loadError} />
      <FormProvider {...form}>
        <form onSubmit={onSubmit} noValidate>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <FormText name="name" label={t.admin.form.name} required minLength={2} />
                <FormText name="lastName" label={t.admin.form.lastName} required />
                <BilingualText name="type" label={t.admin.form.description} />
                <FormText name="email" label={t.admin.form.email} type="email" required />
                <FormText name="cvlacUrl" label={t.admin.form.cvlac} type="url" required />
                <RadioField
                  name="role"
                  label={t.admin.form.role}
                  options={ROLES.map((r) => ({ value: r, label: t.admin.form.roles[r] }))}
                />
                <RadioField
                  name="category"
                  label={t.admin.form.category}
                  options={CATEGORIES.map((c) => ({ value: c, label: t.admin.form.categories[c] }))}
                />
                <ImageUpload name="imageUrl" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box display="flex" justifyContent="flex-end" mb={2}>
                <Controller
                  name="isShowed"
                  control={form.control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={t.admin.form.hide}
                      control={
                        <Switch checked={!field.value} onChange={(e) => field.onChange(!e.target.checked)} />
                      }
                    />
                  )}
                />
              </Box>
              <ResearcherCard researcher={preview} />
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
            <Grid item xs={12}>
              <SaveButton isUpdate={!!record?._id} />
            </Grid>
          </Grid>
        </form>
      </FormProvider>
      {notice}
    </AdminLayout>
  );
};

export default ResearcherAdminPage;
