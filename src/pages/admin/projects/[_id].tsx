import { FormProvider, useWatch } from 'react-hook-form';
import { Divider, Grid, Stack } from '@mui/material';
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
import { IProject } from '@/interfaces';
import { useT } from '@/i18n/useT';

const GROUPS = ['SEMTEL', 'SCIECOM', 'SEMVR'];
const CATEGORIES = ['undergraduate', 'master', 'doctoral'] as const;

const ProjectAdminPage = () => {
  const { t } = useT();
  const { form, onSubmit, notice, record, loadError } = useEntityForm<IProject>(
    'projects',
    'project',
    { title: '', description: '', image: '', url: '', en: { title: '', description: '' } },
  );
  const preview = useWatch({ control: form.control });

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
                <BilingualText name="description" label={t.admin.form.summary} minLength={2} multiline rows={4} />
                <FormText name="url" label={t.admin.form.demoUrl} type="url" />
                <RadioField
                  name="group"
                  label={t.admin.form.group}
                  options={GROUPS.map((g) => ({ value: g, label: g }))}
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
