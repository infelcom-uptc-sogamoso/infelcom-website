import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';
import { ChangeEvent, FC, useContext, useEffect, useRef, useState } from 'react';
import { AdminLayout } from '@/components/layouts';
import { Groups, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { infelcomApi } from '@/infelcomApis';
import { IResearcher } from '@/interfaces';
import { useForm, useWatch } from 'react-hook-form';
import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
  Box,
  Button,
  Divider,
  capitalize,
  Switch,
} from '@mui/material';
import { dbResearchers } from '@/database';
import { Researcher } from '@/models';
import { ResearcherCard } from '@/components/researches/ResearcherCard';
import { UiContext } from '@/contexts';
import { sleep } from '@/utils/sleep';

interface Props {
  researcher: IResearcher;
}

interface FormData {
  _id?: string;
  code: string;
  name: string;
  lastName: string;
  type: string;
  email: string;
  cvlacUrl: string;
  isShowed: boolean;
  imageUrl: string;
  category: string;
  role: string;
}

const ResearcherAdminPage: FC<Props> = ({ researcher }) => {
  const { toogleSnackbar } = useContext(UiContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    getValues,
    setValue,
  } = useForm<FormData>({
    defaultValues: researcher,
  });

  const results = useWatch({
    control,
  });

  const validCategories = [
    { label: 'Pregrado', value: 'undergraduate' },
    { label: 'Master', value: 'master' },
    { label: 'Doctorado', value: 'doctoral' },
  ];
  const validRoles = [
    { label: 'Docente', value: 'professor' },
    { label: 'Estudiante', value: 'student' },
  ];

  useEffect(() => {
    setValue('isShowed', !checked, {
      shouldValidate: true,
    });
    // eslint-disable-next-line
  }, [checked]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);
    setValue('isShowed', !event.target.checked, {
      shouldValidate: true,
    });
  };

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
        url: '/admin/researchers',
        method: form.code ? 'PUT' : 'POST',
        data: form,
      }).then((res) => toogleSnackbar(res.data.message));
      sleep(5000);
      if (!form.code) {
        router.replace(`/admin/researchers/${form.code}`);
      } else {
        setIsSaving(false);
      }
    } catch (error) {
      console.error(error);
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout
      title={'Investigador'}
      subTitle={researcher?.name ? `Editando a ${researcher?.name} ${researcher?.lastName}` : ''}
      icon={<Groups />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nombre(s)"
              variant="outlined"
              fullWidth
              sx={{ mb: 1 }}
              {...register('name', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
            <TextField
              label="Apellidos(s)"
              variant="outlined"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('lastName', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.lastName}
              helperText={errors.lastName?.message}
            />
            <TextField
              label="Descripcion"
              variant="outlined"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('type', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.type}
              helperText={errors.type?.message}
            />
            <TextField
              label="Correo electronico"
              variant="outlined"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('email', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              label="CvLAC"
              variant="outlined"
              fullWidth
              multiline
              sx={{ mb: 1 }}
              {...register('cvlacUrl', {
                required: 'Este campo es requerido',
              })}
              error={!!errors.cvlacUrl}
              helperText={errors.cvlacUrl?.message}
            />
            <FormGroup>
              <FormControl sx={{ mt: 1 }}>
                <FormLabel>Rol</FormLabel>
                <RadioGroup
                  row
                  value={getValues('role')}
                  onChange={({ target }) =>
                    setValue('role', target.value, { shouldValidate: true })
                  }>
                  {validRoles.map((option) => (
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
            {!researcher?.code && (
              <Box display="flex" flexDirection="column" sx={{ mt: 1, mb: 1 }}>
                <Button
                  color="secondary"
                  fullWidth
                  startIcon={<UploadOutlined />}
                  sx={{ mb: 3 }}
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
              </Box>
            )}
          </Grid>
          <Grid item xs={12} sm={6} display={'flex'} flexDirection={'column'}>
            <Box display={'flex'} justifyContent={'flex-end'}>
              <FormGroup>
                <FormControlLabel
                  label={'Ocultar investigador'}
                  control={<Switch checked={checked} onChange={handleChange} />}
                />
              </FormGroup>
            </Box>
            <Grid display={'flex'} flexDirection={'column'} alignItems={'center'} mt={4}>
              <ResearcherCard researcher={results} />
            </Grid>
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
                {researcher?.code ? 'Actualizar' : 'Guardar'}
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

  let researcher: IResearcher | null;

  if (code === 'new') {
    const tempProduct = JSON.parse(JSON.stringify(new Researcher()));
    delete tempProduct.code;
    tempProduct.imageUrl = '';
    researcher = tempProduct;
  } else {
    researcher = await dbResearchers.getResearcherById(code.toString());
  }

  if (!researcher) {
    return {
      redirect: {
        destination: '/admin',
        permanent: false,
      },
    };
  }
  return {
    props: {
      researcher,
    },
  };
};

export default ResearcherAdminPage;
