import { useEffect } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import { Controller, FormProvider, useWatch } from 'react-hook-form';
import { Divider, Grid, MenuItem, Stack, TextField } from '@mui/material';
import { Assignment } from '@mui/icons-material';
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
import { ProjectCard } from '@/components/projects/ProjectCard';
import { IGroup, IProject } from '@/interfaces';
import { useT } from '@/i18n/useT';
import { inLocale } from '@/i18n/locale';

const CATEGORIES = ['undergraduate', 'master', 'doctoral'] as const;

const ProjectAdminPage = () => {
  const { t, locale } = useT();
  const { query } = useRouter();
  const { form, onSubmit, notice, record, loadError, isNew } = useEntityForm<IProject>(
    'projects',
    'project',
    {
      title: '',
      description: '',
      image: '',
      url: '',
      group: '',
      en: { title: '', description: '' },
    },
  );
  const preview = useWatch({ control: form.control });
  const { data: groups = [] } = useSWR<IGroup[]>('/api/admin/groups', { revalidateOnFocus: false });

  // "Create a project in this group" (group edit page) links here with ?group=<code>.
  const { setValue } = form;
  useEffect(() => {
    if (isNew && typeof query.group === 'string') setValue('group', query.group);
  }, [isNew, query.group, setValue]);

  return (
    <AdminLayout
      title={t.admin.project}
      icon={<Assignment />}
      subTitle={record?.title ? t.admin.editing(record.title) : t.admin.creating}>
      <LoadError message={loadError} />
      <FormProvider {...form}>
        <form onSubmit={onSubmit} noValidate>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <BilingualText name="title" label={t.admin.form.title} minLength={2} />
                <BilingualText
                  name="description"
                  label={t.admin.form.summary}
                  minLength={2}
                  multiline
                  rows={4}
                />
                <FormText name="url" label={t.admin.form.demoUrl} type="url" />
                <Controller
                  name="group"
                  control={form.control}
                  render={({ field }) => (
                    <TextField
                      select
                      label={t.admin.form.group}
                      InputLabelProps={{ shrink: true }}
                      SelectProps={{ displayEmpty: true }}
                      {...field}
                      value={groups.length ? (field.value ?? '') : ''}>
                      <MenuItem value="">{t.admin.form.noGroup}</MenuItem>
                      {groups.map((g) => (
                        <MenuItem key={g.code} value={g.code}>
                          {g.code} · {inLocale(g, 'name', locale)}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />
                <RadioField
                  name="category"
                  label={t.admin.form.category}
                  options={CATEGORIES.map((c) => ({ value: c, label: t.admin.form.categories[c] }))}
                />
                <ImageUpload name="image" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <ProjectCard project={preview} />
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

export default ProjectAdminPage;
