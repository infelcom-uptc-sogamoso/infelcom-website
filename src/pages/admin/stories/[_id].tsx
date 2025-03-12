import { FC, ChangeEvent, useRef, useState, useContext, useEffect } from 'react';

import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { AdminLayout } from '@/components/layouts';
import { dbStories } from '@/database';
import { IStory } from '@/interfaces';
import Story from '@/models/story';
import { Box, Button, Divider, Grid } from '@mui/material';
import TextField from '@mui/material/TextField';
import { Newspaper, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import TextEditor from '@/components/ui/TextEditor';
import { infelcomApi } from '@/infelcomApis';
import { useForm, useWatch } from 'react-hook-form';
import { StoryContext, UiContext } from '@/contexts';
import { sleep } from '@/utils/sleep';

interface Props {
  story: IStory;
}

interface FormData {
  _id?: string;
  code: string;
  title: string;
  resume: string;
  content: string;
  imageUrl: string;
}

const StoryAdminPage: FC<Props> = ({ story }) => {
  const { toogleSnackbar } = useContext(UiContext);
  const { story: storyById, clearData } = useContext(StoryContext);
  const [charCount, setCharCount] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!story && storyById) {
      Object.keys(storyById).forEach((key) => {
        setValue(key as keyof FormData, storyById[key as keyof FormData]);
      });
    }
    // eslint-disable-next-line
  }, [story, storyById]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
    watch,
  } = useForm<FormData>({
    defaultValues: story,
  });

  const results = useWatch({
    control,
  });

  const onFilesSelected = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files[0]);
    reader.onload = () => {
      setValue('imageUrl', reader.result as string, {
        shouldValidate: true,
      });
    };
    reader.onerror = (error) => {
      console.error(error);
    };
  };

  const onSubmit = async (form: FormData) => {
    setIsSaving(true);
    try {
      await infelcomApi({
        url: '/admin/stories',
        method: form.code ? 'PUT' : 'POST',
        data: form,
      }).then((res) => {
        toogleSnackbar(res.data.message);
        clearData();
        sleep(5000);
        setIsSaving(false);
        router.push('/admin');
      });
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title={'Noticias'}
      icon={<Newspaper />}
      subTitle={story?.title ? `Editando a ${story?.title}` : ''}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Titulo"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 1 }}
              {...register('title', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.title}
              helperText={errors.title?.message}
            />
            <TextField
              label="Resumen"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              sx={{ mb: 1 }}
              {...register('resume', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.resume}
              helperText={errors.resume?.message}
            />
            {!story?.code && (
              <>
                <Button
                  color="secondary"
                  fullWidth
                  startIcon={<UploadOutlined />}
                  sx={{ position: 'relative', bottom: 0 }}
                  onClick={() => fileInputRef.current?.click()}>
                  Cargar imagen
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/png, image/gif, image/jpeg"
                  style={{ display: 'none' }}
                  onChange={onFilesSelected}
                />
              </>
            )}
          </Grid>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'column'} alignItems={'center'}>
            <Box>
              <Image
                width={450}
                height={250}
                src={results.imageUrl || '/hero/image-not-available.jpg'}
                alt="story-image"
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12}>
            <TextEditor setCharCount={setCharCount} setValue={setValue} watch={watch} />
            <div className={`counter ${charCount === 1500 ? 'error' : ''}`}>
              {charCount} / {1500}
            </div>
          </Grid>
          <Grid item xs={12}>
            <Divider />
          </Grid>
          <Grid item xs={12}>
            <Box
              display={'flex'}
              flexDirection={'column'}
              justifyContent="center"
              alignItems={'center'}
              width={'100%'}
              sx={{ mt: 1 }}>
              <Button
                color="primary"
                startIcon={<SaveOutlined />}
                sx={{ width: { xs: '100%', sm: '50%' }, height: '100%' }}
                type="submit"
                disabled={isSaving}>
                {story?.code ? 'Actualizar' : 'Guardar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { _id = '' } = query;

  let story: IStory | null;

  if (_id === 'new') {
    const tempStory = JSON.parse(JSON.stringify(new Story()));
    delete tempStory.code;
    tempStory.imageUrl = '';
    story = tempStory;
  } else {
    story = null;
  }

  /* if (!story) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  } */
  return {
    props: {
      story,
    },
  };
};

export default StoryAdminPage;
