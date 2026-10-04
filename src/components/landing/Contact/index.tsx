import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Alert, Button, TextField } from '@mui/material';
import { Send } from '@mui/icons-material';
import { infelcomApi } from '@/infelcomApis';
import { useContent } from '@/content/ContentContext';
import { useT } from '@/i18n/useT';
import { ContactChannels } from '@/components/ui/ContactChannels';
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

export const Contact = () => {
  const { contact } = useContent();
  const { t } = useT();
  const required = {
    required: t.validation.required,
    minLength: { value: 2, message: t.validation.minLength(2) },
  };
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
            eyebrow={contact.eyebrow}
            title={contact.title}
            dark
            align="left"
          />
          <p>{contact.intro}</p>
          {contact.gruplacUrl && (
            <p>
              {t.contact.gruplac}{' '}
              <a href={contact.gruplacUrl} target="_blank" rel="noopener noreferrer">
                GrupLAC
              </a>
              .
            </p>
          )}
          <ul className={styles.channels}>
            <ContactChannels />
          </ul>
        </div>

        <form className={styles.form} onSubmit={handleSubmit(sendEmail)} noValidate>
          <div className={styles.row}>
            <TextField label={t.contact.name} autoComplete="given-name" {...field('name')} />
            <TextField label={t.contact.lastName} autoComplete="family-name" {...field('lastName')} />
          </div>
          <div className={styles.row}>
            <TextField
              label={t.contact.phone}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              {...field('phone', {
                ...required,
                pattern: { value: /^[+\d\s()-]{7,}$/, message: t.validation.phone },
              })}
            />
            <TextField
              label={t.contact.email}
              type="email"
              autoComplete="email"
              {...field('fromEmail', {
                ...required,
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: t.validation.email },
              })}
            />
          </div>
          <TextField
            label={t.contact.institution}
            autoComplete="organization"
            {...field('institution')}
          />
          <TextField label={t.contact.message} multiline minRows={4} {...field('message')} />
          <div role="status" aria-live="polite">
            {status === 'success' && (
              <Alert severity="success">{t.contact.success}</Alert>
            )}
            {status === 'error' && (
              <Alert severity="error">{t.contact.error(contact.email)}</Alert>
            )}
          </div>
          <Button
            type="submit"
            size="large"
            endIcon={<Send />}
            disabled={isSubmitting}
            className={styles.submit}>
            {isSubmitting ? t.contact.sending : t.contact.send}
          </Button>
        </form>
      </div>
    </section>
  );
};
