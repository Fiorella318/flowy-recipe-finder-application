import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Recipe } from '../backend';

export function useGetSampleRecipes() {
  const { actor, isFetching } = useActor();

  return useQuery<Recipe[]>({
    queryKey: ['sampleRecipes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getSampleRecipes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useRegisterForUpdates() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, email }: { name: string; email: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerForUpdates(name, email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['registrations'] });
    },
  });
}
