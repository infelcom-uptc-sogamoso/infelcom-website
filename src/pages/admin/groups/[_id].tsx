import NextLink from 'next/link';
import useSWR from 'swr';
import { Controller, FormProvider, useFormContext, useWatch } from 'react-hook-form';
import {
  Alert,
  Autocomplete,
  Box,
  Button,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material';
import { AddOutlined, OpenInNew, Science } from '@mui/icons-material';
import { AdminLayout } from '@/components/layouts';
import {
  BilingualText,
  FormText,
  ImageUpload,
  LoadError,
  SaveButton,
  useEntityForm,
} from '@/components/admin/EntityForm';
import { IGroup, IProject, IResearcher } from '@/interfaces';
import { useT } from '@/i18n/useT';
import { slugify } from '@/utils';

/** Form values: the group plus the ids of its projects (saved by /api/admin/groups). */
type GroupForm = IGroup & { projects: string[] };
type Option = { id: string; label: string };

const swrOptions = { revalidateOnFocus: false };

/** Autocomplete over records, storing only their ids (one, or a list with `multiple`). */
const RefSelect = ({
  name,
  label,
  helperText,
  options,
  multiple = false,
  loading,
}: {
  name: string;
  label: string;
  helperText: string;
  options: Option[];
  multiple?: boolean;
  loading: boolean;
}) => {
  const { control } = useFormContext();
  const byId = (id: string) => options.find((o) => o.id === id);
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Autocomplete<Option, boolean>
          multiple={multiple}
          loading={loading}
          options={options}
          filterSelectedOptions
          isOptionEqualToValue={(a, b) => a.id === b.id}
          value={
            multiple
              ? ((field.value ?? []) as string[]).map(byId).filter((o): o is Option => !!o)
              : (byId(field.value) ?? null)
          }
          onChange={(_, value) =>
            field.onChange(Array.isArray(value) ? value.map((o) => o.id) : (value?.id ?? null))
          }
          renderInput={(params) => (
            <TextField
              {...params}
              label={label}
              helperText={helperText}
              InputLabelProps={{ shrink: true }}
            />
          )}
        />
      )}
    />
  );
};

const GroupAdminPage = () => {
  const { t } = useT();
  const { form, onSubmit, notice, record, loadError } = useEntityForm<GroupForm>(
    'groups',
    'admin/groups',
    {
      code: '',
      slug: '',
      name: '',
      description: '',
      objectives: '',
      lines: '',
      info: '',
      logo: '',
      isActive: true,
      director: null,
      members: [],
      projects: [],
      en: { name: '', description: '', objectives: '', lines: '', info: '' },
    },
  );
  const researchers = useSWR<IResearcher[]>('/api/admin/researchers', swrOptions);
  const projects = useSWR<IProject[]>('/api/admin/projects', swrOptions);
  const [name, slug, logo] = useWatch({ control: form.control, name: ['name', 'slug', 'logo'] });
  const publicPath = `/groups/${slugify(slug || name || '') || '…'}`;

  const people: Option[] = (researchers.data ?? []).map((r) => ({
    id: r._id!,
    label: `${r.name} ${r.lastName}${r.type ? ` · ${r.type}` : ''}`,
  }));
  // Projects of another group show its code: selecting one moves it into this group.
  const projectOptions: Option[] = (projects.data ?? []).map((p) => ({
    id: p._id!,
    label: p.group && p.group !== record?.code ? `${p.title} (${p.group})` : p.title,
  }));

  return (
    <AdminLayout
      title={t.admin.group}
      icon={<Science />}
      subTitle={
        record?.name ? t.admin.editing(`${record.code} · ${record.name}`) : t.admin.creating
      }>
      <LoadError message={loadError} />
      <FormProvider {...form}>
        <form onSubmit={onSubmit} noValidate>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12} md={8}>
              <Stack spacing={2}>
                <FormText
                  name="code"
                  label={t.admin.form.code}
                  required
                  readOnly={!!record?._id}
                  helperText={t.admin.form.codeHelp}
                />
                <BilingualText name="name" label={t.admin.form.groupName} minLength={2} />
                <FormText
                  name="slug"
                  label={t.admin.form.slug}
                  helperText={t.admin.form.slugHelp(publicPath)}
                />
                <BilingualText
                  name="description"
                  label={t.admin.fields.description}
                  multiline
                  rows={3}
                  required={false}
                />
                <BilingualText
                  name="objectives"
                  label={t.admin.form.objectives}
                  multiline
                  rows={3}
                  required={false}
                />
                <BilingualText
                  name="lines"
                  label={t.admin.form.lines}
                  multiline
                  rows={3}
                  helperText={t.admin.form.linesHelp}
                  required={false}
                />
                <BilingualText
                  name="info"
                  label={t.admin.form.info}
                  multiline
                  rows={2}
                  required={false}
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={4}>
              <Stack spacing={2}>
                <Controller
                  name="isActive"
                  control={form.control}
                  render={({ field }) => (
                    <FormControlLabel
                      label={t.admin.form.active}
                      control={
                        <Switch
                          checked={!!field.value}
                          onChange={(e) => field.onChange(e.target.checked)}
                        />
                      }
                    />
                  )}
                />
                <Paper
                  variant="outlined"
                  sx={{ p: 2, display: 'grid', gap: 1.5, justifyItems: 'center' }}>
                  <Typography variant="subtitle2" component="h2" sx={{ justifySelf: 'start' }}>
                    {t.admin.form.logo}
                  </Typography>
                  {logo && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={logo}
                      alt=""
                      width={140}
                      height={140}
                      style={{ objectFit: 'contain' }}
                    />
                  )}
                  <Box width="100%">
                    <ImageUpload name="logo" />
                  </Box>
                </Paper>
                {record?.slug && (
                  <Button
                    component={NextLink}
                    href={`/groups/${record.slug}`}
                    target="_blank"
                    variant="outlined"
                    endIcon={<OpenInNew />}>
                    {t.admin.form.viewPublic}
                  </Button>
                )}
              </Stack>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <RefSelect
                  name="director"
                  label={t.admin.form.director}
                  helperText={t.admin.form.peopleHelp}
                  options={people}
                  loading={researchers.isLoading}
                />
                <RefSelect
                  name="members"
                  label={t.admin.form.members}
                  helperText={t.admin.form.peopleHelp}
                  options={people}
                  loading={researchers.isLoading}
                  multiple
                />
              </Stack>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={2}>
                <RefSelect
                  name="projects"
                  label={t.admin.form.groupProjects}
                  helperText={t.admin.form.groupProjectsHelp}
                  options={projectOptions}
                  loading={projects.isLoading}
                  multiple
                />
                {record?._id ? (
                  <Button
                    component={NextLink}
                    href={`/admin/projects/new?group=${encodeURIComponent(record.code)}`}
                    variant="outlined"
                    startIcon={<AddOutlined />}
                    sx={{ alignSelf: 'flex-start' }}>
                    {t.admin.form.createProject}
                  </Button>
                ) : (
                  <Alert severity="info">{t.admin.form.saveFirst}</Alert>
                )}
              </Stack>
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

export default GroupAdminPage;
