import { IResearcher } from '@/interfaces';
import useSWR, { SWRConfiguration } from 'swr';

export const useResearchers = (url: string, config: SWRConfiguration = {}) => {
  const { data, error } = useSWR<IResearcher[]>(`/api${url}`, config);
  return {
    researchers: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
