import { useContext } from 'react';
import NextLink from 'next/link';
import { UiContext, ResearcherContext, ProjectContext, StoryContext } from '@/contexts';
import useSWR, { mutate } from 'swr';
import { Box, Button, Divider, Grid, IconButton, Link, Tooltip, Typography } from '@mui/material';
import { AddOutlined, CategoryOutlined } from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { IProject, IResearcher, IStory } from '@/interfaces';
import { AdminLayout } from '@/components/layouts';
import { infelcomApi } from '@/infelcomApis';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { formatDate } from '@/utils';
import { sleep } from '@/utils/sleep';

const ResearchersPage = () => {
  const { toogleSnackbar } = useContext(UiContext);
  const { sendData: sendDataResearcher } = useContext(ResearcherContext);
  const { sendData: sendDataProject } = useContext(ProjectContext);
  const { sendData: sendDataStory } = useContext(StoryContext);
  const { data: researchersData, error: researchersError } = useSWR<IResearcher[]>(
    '/api/admin/researchers',
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      refreshInterval: 0,
    },
  );
  const { data: storiesData, error: storiesError } = useSWR<IStory[]>('/api/admin/stories', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });
  const { data: projectsData, error: projectsError } = useSWR<IProject[]>('/api/admin/projects', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshInterval: 0,
  });

  const deleteResearcher = async (id: String) => {
    try {
      await infelcomApi({
        url: `/admin/researchers/?id=${id}`,
        method: 'DELETE',
      }).then((res) => toogleSnackbar(res.data.message));
      mutate('/api/admin/researchers');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProject = async (id: String) => {
    try {
      await infelcomApi({
        url: `/admin/projects/?id=${id}`,
        method: 'DELETE',
      }).then((res) => toogleSnackbar(res.data.message));
      mutate('/api/admin/projects');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteStory = async (id: String) => {
    try {
      await infelcomApi({
        url: `/admin/stories/?id=${id}`,
        method: 'DELETE',
      }).then((res) => toogleSnackbar(res.data.message));
      mutate('/api/admin/stories');
    } catch (error) {
      console.error(error);
    }
  };

  const editResearcher = (row: any) => {
    sendDataResearcher(row);
    sleep(5000)
    window.location.href = `/admin/researchers/${row?._id}`
  }

  const researchersColumns: GridColDef[] = [
    { field: 'name', minWidth: 250, headerName: 'Nombre(s)', resizable: false },
    { field: 'lastName', minWidth: 250, headerName: 'Apellido(s)', resizable: false },
    { field: 'email', minWidth: 350, headerName: 'Email', resizable: false },
    { field: 'type', minWidth: 350, headerName: 'Descripción', resizable: false },
    {
      field: 'actions',
      headerName: 'Acciones',
      minWidth: 150,
      sortable: false,
      align: 'left',
      resizable: false,
      filterable: false,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <div className="actions-container">
            <Tooltip title="Editar">
              <NextLink href={`/admin/researchers/${row?._id}`} passHref>
                <Link underline="always">
                  <IconButton aria-label="edit" color="warning">
                    <EditIcon />
                  </IconButton>
                </Link>
              </NextLink>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton
                aria-label="delete"
                color="error"
                onClick={() => deleteResearcher(row?._id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div >
        );
      },
    },
  ];

  const projectsColumns: GridColDef[] = [
    { field: 'title', width: 550, headerName: 'Titulo' },
    { field: 'description', width: 400, headerName: 'Descripción' },
    { field: 'group', width: 250, headerName: 'Grupo de investigacion' },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <div className="actions-container">
            <Tooltip title="Editar">
              <NextLink href={`/admin/projects/${row?._id}`} passHref>
                <Link underline="always">
                  <IconButton aria-label="edit" color="warning" onClick={() => sendDataProject(row)}>
                    <EditIcon />
                  </IconButton>
                </Link>
              </NextLink>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton aria-label="delete" color="error" onClick={() => deleteProject(row?._id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const storiesColumns: GridColDef[] = [
    { field: 'title', width: 700, headerName: 'Titulo' },
    {
      field: 'createdAt',
      width: 250,
      headerName: 'Fecha publicación',
      renderCell: ({ row }: GridRenderCellParams) => {
        return <div>{formatDate(row?.createdAt)}</div>;
      },
    },
    {
      field: 'updatedAt',
      width: 250,
      headerName: 'Fecha actualización',
      renderCell: ({ row }: GridRenderCellParams) => {
        return <div>{formatDate(row?.updatedAt)}</div>;
      },
    },
    {
      field: 'actions',
      headerName: 'Acciones',
      width: 150,
      sortable: false,
      renderCell: ({ row }: GridRenderCellParams) => {
        return (
          <div className="actions-container">
            <Tooltip title="Editar">
              <NextLink href={`/admin/stories/${row?._id}`} passHref>
                <Link underline="always">
                  <IconButton aria-label="edit" color="warning" onClick={() => sendDataStory(row)}>
                    <EditIcon />
                  </IconButton>
                </Link>
              </NextLink>
            </Tooltip>
            <Tooltip title="Eliminar">
              <IconButton aria-label="delete" color="error" onClick={() => deleteStory(row?._id)}>
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </div>
        );
      },
    },
  ];

  const researchersRows = (researchersData || []).map((researcher: IResearcher) => ({
    _id: researcher._id,
    code: researcher.code,
    imageUrl: researcher.imageUrl,
    name: researcher.name,
    lastName: researcher.lastName,
    type: researcher.type,
    email: researcher.email,
    cvlacUrl: researcher.cvlacUrl,
    isShowed: researcher.isShowed,
    category: researcher.category,
    role: researcher.role,
  }));

  const projectsRows = (projectsData || []).map((project: IProject) => ({
    _id: project._id,
    code: project.code,
    title: project.title,
    description: project.description,
    image: project.image,
    url: project.url,
    category: project.category,
    group: project.group,
  }));

  const storiesRows = (storiesData || []).map((story: IStory) => ({
    _id: story._id,
    code: story.code,
    imageUrl: story.imageUrl,
    title: story.title,
    resume: story.resume,
    content: story.content,
    createdAt: story.createdAt,
    updatedAt: story.updatedAt,
  }));

  return (
    <AdminLayout
      title={'Módulo de Administración'}
      subTitle={'Mantenimiento de contenido'}
      icon={<CategoryOutlined />}>
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2, mt: 2 }}>
        <Typography variant="subtitle2">{researchersData && `Investigadores (${researchersData?.length})`}</Typography>
        <Button startIcon={<AddOutlined />} color="primary" href="/admin/researchers/new">
          Nuevo investigador
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: '631px', width: '100%' }}>
          <DataGrid
            getRowId={(row) => row.code}
            rows={researchersRows}
            columns={researchersColumns}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mt: 4 }} />
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2, mt: 4 }}>
        <Typography variant="subtitle2">Proyectos</Typography>
        <Button startIcon={<AddOutlined />} color="primary" href="/admin/projects/new">
          Nuevo proyecto
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: '631px', width: '100%' }}>
          <DataGrid
            getRowId={(row) => row.code}
            rows={projectsRows}
            columns={projectsColumns}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
          />
        </Grid>
      </Grid>
      <Divider sx={{ mt: 4 }} />
      <Box display="flex" justifyContent="space-between" sx={{ mb: 2, mt: 4 }}>
        <Typography variant="subtitle2">Noticias</Typography>
        <Button startIcon={<AddOutlined />} color="primary" href="/admin/stories/new">
          Nueva noticia
        </Button>
      </Box>
      <Grid container className="fadeIn">
        <Grid item xs={12} sx={{ height: '631px', width: '100%' }}>
          <DataGrid
            getRowId={(row) => row.code}
            rows={storiesRows}
            columns={storiesColumns}
            pageSizeOptions={[10]}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
          />
        </Grid>
      </Grid>
    </AdminLayout>
  );
};

export default ResearchersPage;
