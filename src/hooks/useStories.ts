import { IStory } from '@/interfaces';
import useSWR, { SWRConfiguration } from 'swr';

export const useStories = (url: string, config: SWRConfiguration = {}) => {
  const { data, error } = useSWR<IStory[]>(`/api${url}`, config);
  return {
    stories: data || [],
    isLoading: !error && !data,
    isError: error,
  };
};
