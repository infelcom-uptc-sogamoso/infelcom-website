import { IProject } from '@/interfaces';
import useSWR, { SWRConfiguration } from 'swr';

export const useProjects = (url: string, config: SWRConfiguration = {}) => {
  const { data, error } = useSWR<IProject[]>(`/api${url}`, config);
  return {
    projects: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
