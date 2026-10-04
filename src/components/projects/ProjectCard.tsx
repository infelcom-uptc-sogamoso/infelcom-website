import { FC } from 'react';
import NextLink from 'next/link';
import {
  Accordion,
  AccordionActions,
  AccordionDetails,
  AccordionSummary,
  Button,
  Typography,
} from '@mui/material';
import { ExpandMore, OpenInNew } from '@mui/icons-material';
import { useT } from '@/i18n/useT';
import { inLocale } from '@/i18n/locale';

interface Props {
  project: any;
}

export const ProjectCard: FC<Props> = ({ project }) => {
  const { t, locale } = useT();
  const { _id, code = 'preview', image, url = '' } = project;
  const title = inLocale(project, 'title', locale) || t.admin.form.title;
  const description = inLocale(project, 'description', locale) || t.admin.form.summary;

  return (
    <Accordion
      disableGutters
      sx={{
        width: '100%',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: '16px !important',
        '&::before': { display: 'none' },
        '&.Mui-expanded': { borderColor: 'primary.light', boxShadow: 'var(--shadow)' },
      }}>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls={`project-${code}-content`}
        id={`project-${code}-header`}
        sx={{ minHeight: 56, px: { xs: 2, sm: 3 } }}>
        <Typography component="span" variant="subtitle1" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: { xs: 2, sm: 3 } }}>
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={title}
            loading="lazy"
            style={{
              display: 'block',
              width: '100%',
              maxWidth: 600,
              height: 'auto',
              margin: '0 auto 16px',
              borderRadius: 12,
            }}
          />
        )}
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.7 }}>
          {description}
        </Typography>
      </AccordionDetails>
      {(url || _id) && (
        <AccordionActions sx={{ px: { xs: 2, sm: 3 }, pb: 2, flexWrap: 'wrap', gap: 1 }}>
          {_id && (
            <Button component={NextLink} href={`/projects/${_id}`} variant="outlined">
              {t.projects.details}
            </Button>
          )}
          {url && (
            <Button href={url} target="_blank" rel="noopener noreferrer" endIcon={<OpenInNew />}>
              {t.projects.view}
            </Button>
          )}
        </AccordionActions>
      )}
    </Accordion>
  );
};
