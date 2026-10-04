import { ChangeEvent, useRef } from 'react';
import { get, useFieldArray, useFormContext } from 'react-hook-form';
import { Box, Button, Grid, IconButton, Paper, Stack, TextField, Tooltip, Typography } from '@mui/material';
import { Add, ArrowDownward, ArrowUpward, DeleteOutline, UploadOutlined } from '@mui/icons-material';
import { blankItem, fieldKind, isL, isValidField, MAX_IMAGE, type FieldKind } from '@/content/siteContent';
import { useT } from '@/i18n/useT';

/**
 * Form fields generated from the shape of `defaultContent` (src/content/siteContent.ts):
 * `{ es, en }` → two side-by-side inputs, string → one input (image fields get a preview and an
 * upload button), array → repeatable items, object → a group of fields.
 */

const lastKey = (path: string) =>
  path.split('.').filter((p) => !/^\d+$/.test(p)).pop() ?? '';

const MAX_UPLOAD_KB = Math.floor((MAX_IMAGE * 3) / 4 / 1024); // base64 adds a third

const useLabel = () => {
  const { t } = useT();
  return (key: string) => t.admin.fields[key] ?? key;
};

const Field = ({ path, kind, label, required }: { path: string; kind: FieldKind; label: string; required: boolean }) => {
  const { t } = useT();
  const { register, setValue, setError, watch, formState } = useFormContext();
  const fileRef = useRef<HTMLInputElement>(null);
  const error = get(formState.errors, path);
  const invalid: Partial<Record<FieldKind, string>> = {
    email: t.validation.email,
    phone: t.validation.phone,
    url: t.validation.url,
    image: t.validation.image,
    media: t.validation.media,
  };

  const onFile = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const file = target.files?.[0];
    target.value = '';
    if (!file) return;
    if (file.size > MAX_UPLOAD_KB * 1024) {
      setError(path, { message: t.validation.imageTooLarge(MAX_UPLOAD_KB) });
      return;
    }
    const reader = new FileReader();
    reader.onload = () =>
      setValue(path, reader.result as string, { shouldDirty: true, shouldValidate: true });
    reader.readAsDataURL(file);
  };

  const input = (
    <TextField
      label={label}
      fullWidth
      size="small"
      multiline={kind === 'longtext'}
      minRows={kind === 'longtext' ? 3 : undefined}
      type={kind === 'email' ? 'email' : kind === 'phone' ? 'tel' : 'text'}
      InputLabelProps={{ shrink: true }}
      {...register(path, {
        validate: (value: string = '') => {
          const v = value.trim();
          if (required && !v) return t.validation.required;
          return isValidField(kind, v) || invalid[kind] || t.validation.required;
        },
      })}
      error={!!error}
      helperText={error?.message ?? (kind === 'image' ? t.admin.content.imageHelp : undefined)}
    />
  );

  if (kind !== 'image') return input;

  const src: string = watch(path) || '';
  return (
    <Box display="flex" gap={1.5} alignItems="flex-start">
      <Box
        sx={{
          flexShrink: 0,
          width: 56,
          height: 56,
          borderRadius: 2,
          border: 1,
          borderColor: 'divider',
          bgcolor: 'action.hover',
          overflow: 'hidden',
        }}>
        {src && isValidField('image', src) && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        )}
      </Box>
      <Box flex={1} minWidth={0}>
        {input}
      </Box>
      <Tooltip title={t.admin.form.uploadImage}>
        <IconButton aria-label={`${t.admin.form.uploadImage}: ${label}`} onClick={() => fileRef.current?.click()}>
          <UploadOutlined />
        </IconButton>
      </Tooltip>
      <input ref={fileRef} type="file" hidden accept="image/png, image/jpeg, image/gif, image/webp, image/svg+xml" onChange={onFile} />
    </Box>
  );
};

const ArrayFields = ({ path, template }: { path: string; template: unknown }) => {
  const { t } = useT();
  const { control } = useFormContext();
  const { fields, append, remove, move } = useFieldArray({ control, name: path });

  return (
    <Stack spacing={1.5}>
      {fields.map((field, i) => (
        <Paper key={field.id} variant="outlined" sx={{ p: { xs: 1.5, sm: 2 } }}>
          <Box display="flex" alignItems="center" mb={1.5}>
            <Typography variant="subtitle2" component="h4" sx={{ fontSize: '0.95rem', mr: 'auto' }}>
              {t.admin.content.item(i + 1)}
            </Typography>
            <IconButton size="small" aria-label={t.admin.content.moveUp} disabled={i === 0} onClick={() => move(i, i - 1)}>
              <ArrowUpward fontSize="small" />
            </IconButton>
            <IconButton size="small" aria-label={t.admin.content.moveDown} disabled={i === fields.length - 1} onClick={() => move(i, i + 1)}>
              <ArrowDownward fontSize="small" />
            </IconButton>
            <Tooltip title={t.admin.content.remove}>
              <IconButton size="small" color="error" aria-label={`${t.admin.content.remove} ${i + 1}`} onClick={() => remove(i)}>
                <DeleteOutline fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <ContentFields path={`${path}.${i}`} template={template} />
        </Paper>
      ))}
      <Button
        variant="outlined"
        startIcon={<Add />}
        sx={{ alignSelf: 'flex-start' }}
        onClick={() => append(blankItem(template) as object)}>
        {t.admin.content.add}
      </Button>
    </Stack>
  );
};

export const ContentFields = ({ path, template }: { path: string; template: unknown }) => {
  const label = useLabel();
  const key = lastKey(path);

  if (Array.isArray(template)) return <ArrayFields path={path} template={template[0]} />;

  if (isL(template)) {
    return (
      <Grid container spacing={1.5}>
        {(['es', 'en'] as const).map((lang) => (
          <Grid item xs={12} md={6} key={lang}>
            <Field
              path={`${path}.${lang}`}
              kind={fieldKind(key)}
              label={`${label(key)} · ${lang.toUpperCase()}`}
              required={!!template[lang]}
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  if (typeof template === 'string') {
    return <Field path={path} kind={fieldKind(key)} label={label(key)} required={!!template} />;
  }

  const entries = Object.entries(template as Record<string, unknown>);
  return (
    <Stack spacing={2}>
      {entries.map(([k, child]) => {
        const childPath = path ? `${path}.${k}` : k;
        // Lists and nested groups get their own heading; plain fields carry their label.
        if (typeof child === 'string' || isL(child)) {
          return <ContentFields key={k} path={childPath} template={child} />;
        }
        return (
          <Box key={k} component="fieldset" sx={{ border: 0, p: 0, m: 0, minWidth: 0 }}>
            <Typography component="legend" variant="subtitle2" sx={{ mb: 1, fontSize: '1rem' }}>
              {label(k)}
            </Typography>
            <ContentFields path={childPath} template={child} />
          </Box>
        );
      })}
    </Stack>
  );
};
