import { FC, ChangeEvent, useRef, useState, useContext, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { AdminLayout } from '@/components/layouts';
import { dbProjects } from '@/database';
import Project from '@/models/project';
import {
  Box,
  Button,
  capitalize,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
} from '@mui/material';
import TextField from '@mui/material/TextField';
import { Assignment, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { infelcomApi } from '@/infelcomApis';
import { useForm, useWatch } from 'react-hook-form';
import { IProject } from '@/interfaces';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { ProjectContext, UiContext } from '@/contexts';
import { sleep } from '@/utils/sleep';

interface Props {
  project: IProject;
}

interface FormData {
  _id?: string;
  code: string;
  title: string;
  description: string;
  image: string;
  url: string;
  category: string;
  group: string;
}

const ProjectAdminPage: FC<Props> = ({ project }) => {
  const { toogleSnackbar } = useContext(UiContext);
  const { project: projectById, clearData } = useContext(ProjectContext);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!project && projectById) {
      Object.keys(projectById).forEach((key) => {
        setValue(key as keyof FormData, projectById[key as keyof FormData]);
      });
    }
    // eslint-disable-next-line
  }, [project, projectById]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: project,
  });

  const results = useWatch({
    control,
  });

  const validCategories = [
    { label: 'Pregrado', value: 'undergraduate' },
    { label: 'Master', value: 'master' },
    { label: 'Doctorado', value: 'doctoral' },
  ];

  const validGroups = ['SEMTEL', 'SCIECOM', 'SEMVR'];

  const onFilesSelected = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (!target.files || target.files.length === 0) {
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(target.files[0]);
    reader.onload = () => {
      setValue('image', reader.result as string, {
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
        url: '/admin/projects',
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
      title={'Proyectos'}
      icon={<Assignment />}
      subTitle={project?.title ? `Editando a ${project?.title}` : ''}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Titulo"
              variant="outlined"
              fullWidth
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
              rows={4}
              sx={{ mb: 1 }}
              {...register('description', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.description}
              helperText={errors.description?.message}
            />
            <TextField
              label="URL Demo"
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              {...register('url', {
                required: false,
              })}
              error={!!errors.url}
              helperText={errors.url?.message}
            />
            <FormGroup>
              <FormControl sx={{ mt: 1, mb: 1 }}>
                <FormLabel>Grupo de investigacion</FormLabel>
                <RadioGroup
                  row
                  value={getValues('group')}
                  onChange={({ target }) =>
                    setValue('group', target.value, { shouldValidate: true })
                  }>
                  {validGroups.map((option) => (
                    <FormControlLabel
                      key={option}
                      value={option}
                      control={<Radio color="secondary" />}
                      label={capitalize(option)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </FormGroup>
            <FormGroup>
              <FormControl sx={{ mt: 1, mb: 1 }}>
                <FormLabel>Categoria</FormLabel>
                <RadioGroup
                  row
                  value={getValues('category')}
                  onChange={({ target }) =>
                    setValue('category', target.value, { shouldValidate: true })
                  }>
                  {validCategories.map((option) => (
                    <FormControlLabel
                      key={option.label}
                      value={option.value}
                      control={<Radio color="secondary" />}
                      label={capitalize(option.label)}
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </FormGroup>
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
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}>
            <ProjectCard project={results} />
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
                {project?.code ? 'Actualizar' : 'Guardar'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </AdminLayout>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { code = '' } = query;

  let project: IProject | null;

  if (code === 'new') {
    const tempProject = JSON.parse(JSON.stringify(new Project()));
    delete tempProject.code;
    tempProject.image = '';
    project = tempProject;
  } else {
    project = null;
  }

  /* if (!project) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  } */
  return {
    props: {
      project,
    },
  };
};

export default ProjectAdminPage;
