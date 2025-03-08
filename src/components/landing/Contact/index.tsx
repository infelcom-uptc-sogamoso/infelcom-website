'use client';
import { infelcomApi } from '@/infelcomApis';
import { Mail, Phone, Place } from '@mui/icons-material';
import { Box, Button, Grid, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';

interface FormData {
  name: string;
  lastName: string;
  phone: string;
  fromEmail: string;
  institution: string;
  message: string;
}

export const Contact = () => {
  const { GRUPLAC_URL } = process.env;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>();

  const sendEmail = async (form: FormData) => {
    try {
      await infelcomApi({
        url: '/contact/contact',
        method: 'POST',
        data: form,
      }).then(() => reset());
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box sx={{ width: { xs: '100%', sm: '89%' } }}>
      <Grid
        container
        sx={{
          flexDirection: { xs: 'column', sm: 'row' },
        }}>
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            gap: '12px',
            display: 'flex',
            flexDirection: 'column',
            marginBottom: { xs: '24px', sm: '0px' },
          }}>
          <Typography variant="h1">Contáctanos</Typography>
          <Typography variant="body1">
            ¿Te gustaría colaborar con nuestro semillero de investigación?
            <br />
            Únete a nuestro equipo, desarrolla proyectos innovadores y comparte conocimientos.
            <br />
            Si deseas conocer más sobre nuestro trabajo, te invitamos a visitar nuestro{' '}
            <a href={GRUPLAC_URL} target="_blank" rel="noopener noreferrer" className="link">
              GrupLAC
            </a>
          </Typography>
          <Box gap={'12px'} display={'flex'} flexDirection={'row'}>
            <Place />
            <Typography variant="body1">Calle 4 Sur No. 15-134 - Sogamoso, Boyacá</Typography>
          </Box>
          <Box gap={'12px'} display={'flex'} flexDirection={'row'}>
            <Mail />
            <Typography variant="body1">infelcom@uptc.edu.co</Typography>
          </Box>
          <Box gap={'12px'} display={'flex'} flexDirection={'row'}>
            <Phone />
            <Typography variant="body1">+57 300 000 0000</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <form onSubmit={handleSubmit(sendEmail)}>
            <Box
              sx={{
                gap: '8px',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                marginBottom: '12px',
              }}>
              <TextField
                label="Nombre(s)"
                variant="outlined"
                fullWidth
                multiline
                {...register('name', {
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="Apellido(s)"
                variant="outlined"
                fullWidth
                multiline
                {...register('lastName', {
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
              />
            </Box>
            <Box
              sx={{
                gap: '8px',
                display: 'flex',
                flexDirection: { xs: 'column', sm: 'row' },
                marginBottom: '12px',
              }}>
              <TextField
                type="number"
                label="Teléfono"
                variant="outlined"
                fullWidth
                multiline
                {...register('phone', {
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
              <TextField
                label="Correo electrónico"
                variant="outlined"
                fullWidth
                multiline
                {...register('fromEmail', {
                  required: 'Este campo es requerido',
                  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
                })}
                error={!!errors.fromEmail}
                helperText={errors.fromEmail?.message}
              />
            </Box>
            <TextField
              label="Institución o escuela"
              variant="outlined"
              fullWidth
              multiline
              sx={{ mb: '12px' }}
              {...register('institution', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.institution}
              helperText={errors.institution?.message}
            />
            <TextField
              rows={4}
              multiline
              label="Escribe aquí tu mensaje"
              variant="outlined"
              fullWidth
              sx={{ mb: '12px' }}
              {...register('message', {
                required: 'Este campo es requerido',
                minLength: { value: 2, message: 'Mínimo 2 caracteres' },
              })}
              error={!!errors.message}
              helperText={errors.message?.message}
            />
            <Button type="submit" sx={{ width: '100px' }}>
              Enviar
            </Button>
          </form>
        </Grid>
      </Grid>
    </Box>
  );
};
