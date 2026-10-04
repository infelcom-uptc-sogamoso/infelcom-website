import { useEffect } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import useSWR from 'swr';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Tooltip,
  Typography,
} from '@mui/material';
import { AddOutlined, CategoryOutlined, Tune } from '@mui/icons-material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { enUS, esES } from '@mui/x-data-grid/locales';
import { IGroup, IProject, IResearcher, IStory } from '@/interfaces';
import { AdminLayout } from '@/components/layouts';
import { useNotice } from '@/components/admin/useNotice';
import { apiErrorMessage, infelcomApi } from '@/infelcomApis';
import { useT } from '@/i18n/useT';
import { formatDate } from '@/utils';

type Entity = 'researchers' | 'groups' | 'projects' | 'stories';

const swrOptions = { revalidateOnFocus: false, revalidateOnReconnect: false };

const AdminPage = () => {
  const { t, locale } = useT();
  const { notify, notice } = useNotice();
  const router = useRouter();
  const researchers = useSWR<IResearcher[]>('/api/admin/researchers', swrOptions);
  const projects = useSWR<IProject[]>('/api/admin/projects', swrOptions);
  const stories = useSWR<IStory[]>('/api/admin/stories', swrOptions);
  const groups = useSWR<IGroup[]>('/api/admin/groups', swrOptions);
  const lists = { researchers, groups, projects, stories };
  const localeText = (locale === 'es' ? esES : enUS).components.MuiDataGrid.defaultProps.localeText;

  // Edit pages redirect here with ?saved=1 after a successful save.
  useEffect(() => {
    if (router.query.saved !== '1') return;
    notify({ severity: 'success', text: t.admin.saved });
    router.replace('/admin', undefined, { shallow: true });
  }, [router, notify, t]);

  const remove = async (entity: Entity, id: string) => {
    if (!window.confirm(t.admin.confirmDelete)) return;
    try {
      await infelcomApi.delete(`/admin/${entity}`, { params: { id } });
      await lists[entity].mutate();
      notify({ severity: 'success', text: t.admin.deleted });
    } catch (error) {
      notify({ severity: 'error', text: apiErrorMessage(error, t) });
    }
  };

  const actions = (entity: Entity): GridColDef => ({
    field: 'actions',
    headerName: t.admin.columns.actions,
    width: 120,
    sortable: false,
    filterable: false,
    renderCell: ({ row }: GridRenderCellParams) => (
      <div className="actions-container">
        <Tooltip title={t.common.edit}>
          <IconButton
            component={NextLink}
            href={`/admin/${entity}/${row._id}`}
            aria-label={t.common.edit}
            color="warning">
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={t.common.delete}>
          <IconButton
            aria-label={t.common.delete}
            color="error"
            onClick={() => remove(entity, row._id)}>
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </div>
    ),
  });

  const date = (field: string, headerName: string): GridColDef => ({
    field,
    headerName,
    minWidth: 160,
    flex: 1,
    renderCell: ({ row }: GridRenderCellParams) => formatDate(row[field]),
  });

  const sections: { entity: Entity; title: string; newLabel: string; columns: GridColDef[] }[] = [
    {
      entity: 'researchers',
      title: t.admin.researchers,
      newLabel: t.admin.newResearcher,
      columns: [
        { field: 'name', headerName: t.admin.columns.name, minWidth: 160, flex: 1 },
        { field: 'lastName', headerName: t.admin.columns.lastName, minWidth: 160, flex: 1 },
        { field: 'email', headerName: t.admin.columns.email, minWidth: 220, flex: 1 },
        { field: 'type', headerName: t.admin.columns.description, minWidth: 220, flex: 1 },
        actions('researchers'),
      ],
    },
    {
      entity: 'groups',
      title: t.admin.groups,
      newLabel: t.admin.newGroup,
      columns: [
        { field: 'code', headerName: t.admin.columns.code, minWidth: 120 },
        { field: 'name', headerName: t.admin.form.groupName, minWidth: 260, flex: 2 },
        {
          field: 'isActive',
          headerName: t.admin.columns.status,
          minWidth: 120,
          renderCell: ({ row }: GridRenderCellParams) =>
            row.isActive ? t.groups.active : t.groups.inactive,
        },
        actions('groups'),
      ],
    },
    {
      entity: 'projects',
      title: t.admin.projects,
      newLabel: t.admin.newProject,
      columns: [
        { field: 'title', headerName: t.admin.columns.title, minWidth: 260, flex: 2 },
        { field: 'description', headerName: t.admin.columns.description, minWidth: 260, flex: 2 },
        { field: 'group', headerName: t.admin.columns.group, minWidth: 160, flex: 1 },
        actions('projects'),
      ],
    },
    {
      entity: 'stories',
      title: t.admin.stories,
      newLabel: t.admin.newStory,
      columns: [
        { field: 'title', headerName: t.admin.columns.title, minWidth: 260, flex: 2 },
        date('createdAt', t.admin.columns.published),
        date('updatedAt', t.admin.columns.updated),
        actions('stories'),
      ],
    },
  ];

  return (
    <AdminLayout title={t.admin.title} subTitle={t.admin.subtitle} icon={<CategoryOutlined />}>
      <Card sx={{ mt: 2, mb: 4 }}>
        <CardContent>
          <Typography
            variant="h3"
            component="h2"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tune /> {t.nav.siteContent}
          </Typography>
          <Typography sx={{ color: 'text.secondary', mt: 1 }}>{t.admin.contentCard}</Typography>
        </CardContent>
        <CardActions sx={{ px: 2, pb: 2 }}>
          <Button component={NextLink} href="/admin/content" startIcon={<Tune />}>
            {t.admin.editContent}
          </Button>
        </CardActions>
      </Card>

      {sections.map(({ entity, title, newLabel, columns }) => {
        const { data, error, isLoading } = lists[entity];
        return (
          <Box
            key={entity}
            id={entity}
            component="section"
            sx={{ mb: 5, scrollMarginTop: 'calc(var(--header-h) + 16px)' }}>
            <Box
              display="flex"
              flexWrap="wrap"
              gap={1}
              justifyContent="space-between"
              alignItems="center"
              mb={2}>
              <Typography variant="subtitle2" component="h2">
                {title} {data && `(${data.length})`}
              </Typography>
              <Button
                startIcon={<AddOutlined />}
                component={NextLink}
                href={`/admin/${entity}/new`}>
                {newLabel}
              </Button>
            </Box>
            {error ? (
              <Alert severity="error">
                {error.status === 401 ? t.admin.unauthorized : t.admin.loadError}
              </Alert>
            ) : (
              <Box sx={{ height: 631, width: '100%' }}>
                <DataGrid
                  getRowId={(row) => row._id}
                  rows={data ?? []}
                  loading={isLoading}
                  columns={columns}
                  localeText={localeText}
                  pageSizeOptions={[10]}
                  initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
                />
              </Box>
            )}
          </Box>
        );
      })}

      {notice}
    </AdminLayout>
  );
};

export default AdminPage;
