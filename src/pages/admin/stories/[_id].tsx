import { FormProvider, useWatch } from 'react-hook-form';
import { Box, Divider, Grid, Stack } from '@mui/material';
import { Newspaper } from '@mui/icons-material';
import { AdminLayout } from '@/components/layouts';
import {
  BilingualText,
  ImageUpload,
  LoadError,
  SaveButton,
  useEntityForm,
} from '@/components/admin/EntityForm';
import TextEditor from '@/components/ui/TextEditor';
import { IStory } from '@/interfaces';
import { useT } from '@/i18n/useT';

const StoryAdminPage = () => {
  const { t } = useT();
  const { form, onSubmit, notice, record, loadError } = useEntityForm<IStory>('stories', 'story', {
    title: '',
    resume: '',
    content: '',
    imageUrl: '',
    en: { title: '', resume: '', content: '' },
  });
  const imageUrl = useWatch({ control: form.control, name: 'imageUrl' });
  // Remount the editors once the stored story arrives so they show its content.
  const editorKey = record?._id ?? 'new';

  return (
    <AdminLayout
      title={t.admin.story}
      icon={<Newspaper />}
      subTitle={record?.title ? t.admin.editing(record.title) : t.admin.creating}>
      <LoadError message={loadError} />
      <FormProvider {...form}>
        <form onSubmit={onSubmit} noValidate>
          <Grid container spacing={3} mt={0}>
            <Grid item xs={12} md={7}>
              <Stack spacing={2}>
                <BilingualText name="title" label={t.admin.form.title} minLength={2} multiline rows={2} />
                <BilingualText name="resume" label={t.admin.form.summary} minLength={2} multiline rows={3} />
                <ImageUpload name="imageUrl" />
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Box
                component="img"
                src={imageUrl || '/hero/image-not-available.jpg'}
                alt=""
                sx={{ width: '100%', aspectRatio: '16 / 10', objectFit: 'cover', borderRadius: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextEditor
                key={`es-${editorKey}`}
                label={`${t.admin.form.content} · ${t.admin.form.spanish}`}
                value={record?.content ?? ''}
                onChange={(html) => form.setValue('content', html, { shouldDirty: true })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextEditor
                key={`en-${editorKey}`}
                label={`${t.admin.form.content} · ${t.admin.form.english}`}
                value={record?.en?.content ?? ''}
                onChange={(html) => form.setValue('en.content', html, { shouldDirty: true })}
              />
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

export default StoryAdminPage;
