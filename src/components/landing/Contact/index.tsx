import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, TextField } from '@mui/material';
import { Mail, Phone, Place, Send } from '@mui/icons-material';
import { infelcomApi } from '@/infelcomApis';
import { CONTACT } from '@/utils/site';
import { SectionHeading } from '@/components/ui/SectionHeading';
import styles from './Contact.module.css';

interface FormData {
  name: string;
  lastName: string;
  phone: string;
  fromEmail: string;
  institution: string;
  message: string;
}

const required = {
  required: 'Este campo es requerido',
  minLength: { value: 2, message: 'Mínimo 2 caracteres' },
};

export const Contact = () => {
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>();

  const sendEmail = async (form: FormData) => {
    setStatus(null);
    try {
      await infelcomApi({ url: '/contact/contact', method: 'POST', data: form });
      reset();
      setStatus('success');
    } catch (error) {
      console.error(error);
      setStatus('error');
    }
  };

  const field = (name: keyof FormData, rules: object = required) => ({
    ...register(name, rules),
    error: !!errors[name],
    helperText: errors[name]?.message,
    fullWidth: true,
  });

  return (
    <section id="contact" className="section" aria-labelledby="contact-title">
      <div className={`container ${styles.grid}`}>
        <div className={styles.info}>
          <SectionHeading
            id="contact-title"
            eyebrow="Contacto"
            title="Contáctanos"
            dark
            align="left"
          />
          <p>
            ¿Te gustaría colaborar con nuestro semillero de investigación? Únete a nuestro equipo,
            desarrolla proyectos innovadores y comparte conocimientos.
          </p>
          {CONTACT.gruplacUrl && (
            <p>
              Si deseas conocer más sobre nuestro trabajo, te invitamos a visitar nuestro{' '}
              <a href={CONTACT.gruplacUrl} target="_blank" rel="noopener noreferrer">
                GrupLAC
              </a>
              .
            </p>
          )}
          <ul className={styles.channels}>
            <li>
              <Place aria-hidden />
              <span>{CONTACT.address}</span>
            </li>
            <li>
              <Mail aria-hidden />
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
            </li>
            <li>
              <Phone aria-hidden />
              <a href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}>{CONTACT.phone}</a>
            </li>
          </ul>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(sendEmail)} noValidate>
          <div className={styles.row}>
            <TextField label="Nombre(s)" autoComplete="given-name" {...field('name')} />
            <TextField label="Apellido(s)" autoComplete="family-name" {...field('lastName')} />
          </div>
          <div className={styles.row}>
            <TextField
              label="Teléfono"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...field('phone', {
                ...required,
                pattern: { value: /^[+\d\s()-]{7,}$/, message: 'Teléfono no válido' },
              })}
            />
            <TextField
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              {...field('fromEmail', {
                ...required,
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: 'Correo no válido' },
              })}
            />
          </div>
          <TextField
            label="Institución o escuela"
            autoComplete="organization"
            {...field('institution')}
          />
          <TextField label="Escribe aquí tu mensaje" multiline minRows={4} {...field('message')} />
          <div role="status" aria-live="polite">
            {status === 'success' && (
              <Alert severity="success">Se ha enviado tu solicitud de contacto.</Alert>
            )}
            {status === 'error' && (
              <Alert severity="error">
                No pudimos enviar tu mensaje. Inténtalo de nuevo o escríbenos a {CONTACT.email}.
              </Alert>
            )}
          </div>
          <Button
            type="submit"
            size="large"
            endIcon={<Send />}
            disabled={isSubmitting}
            className={styles.submit}>
            {isSubmitting ? 'Enviando…' : 'Enviar'}
          </Button>
        </form>
      </div>
    </section>
  );
};
