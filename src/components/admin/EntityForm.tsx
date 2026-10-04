import { ChangeEvent, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Controller,
  DefaultValues,
  FieldValues,
  get,
  useForm,
  useFormContext,
} from 'react-hook-form';
import {
  Alert,
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  TextField,
} from '@mui/material';
import { SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { apiErrorMessage, infelcomApi } from '@/infelcomApis';
import { useT } from '@/i18n/useT';
import { useNotice } from './useNotice';

/**
 * Shared pieces of the researcher / project / story edit pages (/admin/<entity>/<id|new>).
 * Load: GET /api/<detail>?_id=…  Save: PUT (existing) or POST (new) /api/admin/<entity>.
 */
export const useEntityForm = <T extends FieldValues>(
  entity: 'researchers' | 'projects' | 'stories',
  detail: 'researcher' | 'project' | 'story',
  defaults: DefaultValues<T>,
) => {
  const router = useRouter();
  const { t } = useT();
  const { notify, notice } = useNotice();
  const id = typeof router.query._id === 'string' ? router.query._id : undefined;
  const isNew = id === 'new';
  const { data, error } = useSWR<T>(id && !isNew ? `/api/${detail}?_id=${id}` : null, {
    revalidateOnFocus: false,
  });
  const form = useForm<T>({ defaultValues: defaults });
  const { reset } = form;

  useEffect(() => {
    if (data) reset({ ...defaults, ...data });
    // defaults is a literal per page; only re-run when the record arrives
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, reset]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await infelcomApi({
        url: `/admin/${entity}`,
        method: values._id ? 'PUT' : 'POST',
        data: values,
      });
      router.push('/admin?saved=1');
    } catch (err) {
      notify({ severity: 'error', text: apiErrorMessage(err, t) });
    }
  });

  const loadError = error
    ? error.status === 404
      ? t.admin.notFound
      : error.status === 401
        ? t.admin.unauthorized
        : t.admin.loadError
    : null;

  return { form, onSubmit, notice, isNew, record: data, loadError };
};

const MAX_UPLOAD_KB = 700; // the default API body limit is 1 MB and base64 adds a third

/** Reads an image file into a data: URL stored in form field `name`. */
export const ImageUpload = ({ name }: { name: string }) => {
  const { t } = useT();
  const { setValue, setError, formState } = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const error = get(formState.errors, name);

  const onFile = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];
    target.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_KB * 1024) {
      setError(name, { message: t.validation.imageTooLarge(MAX_UPLOAD_KB) });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setValue(name, reader.result, { shouldDirty: true, shouldValidate: true });
    reader.readAsDataURL(file);
  };

  return (
    <Box>
      <Button
        color="secondary"
        fullWidth
        startIcon={<UploadOutlined />}
        onClick={() => fileRef.current?.click()}>
        {t.admin.form.uploadImage}
      </Button>
      <input
        ref={fileRef}
        type="file"
        hidden
        accept="image/png, image/gif, image/jpeg, image/webp"
        onChange={onFile}
      />
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </Box>
  );
};

interface TextProps {
  name: string;
  label: string;
  required?: boolean;
  minLength?: number;
  multiline?: boolean;
  rows?: number;
  helperText?: string;
  type?: string;
}

export const FormText = ({ name, label, required, minLength, multiline, rows, helperText, type }: TextProps) => {
  const { t } = useT();
  const { register, formState } = useFormContext();
  const error = get(formState.errors, name);
  return (
    <TextField
      label={label}
      type={type}
      fullWidth
      multiline={multiline}
      minRows={rows}
      InputLabelProps={{ shrink: true }}
      {...register(name, {
        required: required ? t.validation.required : false,
        minLength: minLength ? { value: minLength, message: t.validation.minLength(minLength) } : undefined,
        validate: (v) => !required || !!String(v ?? '').trim() || t.validation.required,
      })}
      error={!!error}
      helperText={error?.message ?? helperText}
    />
  );
};

/** Spanish (required, the original field) + optional English (`en.<name>`) side by side. */
export const BilingualText = (props: TextProps) => {
  const { t } = useT();
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <FormText {...props} label={`${props.label} · ${t.admin.form.spanish}`} required />
      </Grid>
      <Grid item xs={12} md={6}>
        <FormText
          {...props}
          name={`en.${props.name}`}
          label={`${props.label} · ${t.admin.form.english}`}
          required={false}
          minLength={undefined}
          helperText={t.admin.form.englishHelp}
        />
      </Grid>
    </Grid>
  );
};

export const RadioField = ({
  name,
  label,
  options,
}: {
  name: string;
  label: string;
  options: { value: string; label: string }[];
}) => {
  const { t } = useT();
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required: t.validation.required }}
      render={({ field, fieldState }) => (
        <FormControl error={!!fieldState.error}>
          <FormLabel>{label}</FormLabel>
          <RadioGroup row {...field} value={field.value ?? ''}>
            {options.map((o) => (
              <FormControlLabel key={o.value} value={o.value} control={<Radio />} label={o.label} />
            ))}
          </RadioGroup>
          {fieldState.error && <FormHelperText>{fieldState.error.message}</FormHelperText>}
        </FormControl>
      )}
    />
  );
};

export const SaveButton = ({ isUpdate }: { isUpdate: boolean }) => {
  const { t } = useT();
  const { formState } = useFormContext();
  return (
    <Box display="flex" justifyContent="center" mt={1}>
      <Button
        type="submit"
        startIcon={<SaveOutlined />}
        sx={{ width: { xs: '100%', sm: '50%' } }}
        disabled={formState.isSubmitting}>
        {formState.isSubmitting ? t.common.saving : isUpdate ? t.common.update : t.common.save}
      </Button>
    </Box>
  );
};

export const LoadError = ({ message }: { message: string | null }) =>
  message ? (
    <Alert severity="error" sx={{ mt: 2 }}>
      {message}
    </Alert>
  ) : null;
