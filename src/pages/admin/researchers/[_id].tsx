import { useRouter } from 'next/router';
import { ChangeEvent, useContext, useEffect, useRef, useState } from 'react';
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
import { ResearcherCard } from '@/components/researches/ResearcherCard';
import { UiContext } from '@/contexts';
import { sleep } from '@/utils/sleep';

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

const ResearcherAdminPage = () => {
  const { toogleSnackbar } = useContext(UiContext);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [researcher, setResearcher] = useState<IResearcher>();
  const [isSaving, setIsSaving] = useState(false);
  const [checked, setChecked] = useState(false);
  const router = useRouter();
  const { _id } = router.query;

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
    if (_id && _id !== 'new') {
      fetchResearcherById(_id)
    }
  }, [_id])

  const fetchResearcherById = async (_id: any) => {
    try {
      await infelcomApi({
        url: `/researcher/?_id=${_id}`,
        method: 'GET',
      }).then((res) => setResearcher(res.data));
    } catch (error) {
      console.error(error);
    }
  }

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

  useEffect(() => {
    if (researcher) {
      Object.keys(researcher).forEach((key) => {
        setValue(key as keyof FormData, researcher[key as keyof FormData]);
      });
    }
    // eslint-disable-next-line
  }, [researcher])

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
      }).then((res) => {
        toogleSnackbar(res.data.message);
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
      title={'Investigador'}
      subTitle={researcher?.name ? `Editando a ${researcher?.name} ${researcher?.lastName}` : ''}
      icon={<Groups />}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} mt={1}>
          <Grid item xs={12} sm={6}>
            <TextField
              label={getValues('name')?.length > 0 ? '' : 'Nombre(s)'}
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
              label={getValues('lastName')?.length > 0 ? '' : 'Apellido(s)'}
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
            <FormLabel></FormLabel>
            <TextField
              label={getValues('type')?.length > 0 ? '' : 'Descripción'}
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
              label={getValues('email')?.length > 0 ? '' : 'Correo electrónico'}
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
              label={getValues('cvlacUrl')?.length > 0 ? '' : 'CvLAC'}
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
                <FormLabel>Categoría</FormLabel>
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

export default ResearcherAdminPage;
