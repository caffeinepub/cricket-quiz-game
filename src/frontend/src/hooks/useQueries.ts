import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Result } from "../backend.d";
import { useActor } from "./useActor";

export function useGetResultByRollNumber(rollNumber: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Result | null>({
    queryKey: ["result", rollNumber],
    queryFn: async () => {
      if (!actor || !rollNumber) return null;
      return actor.getResultByRollNumber(rollNumber);
    },
    enabled: !!actor && !isFetching && !!rollNumber,
  });
}

export function useGetAllResults(searchTerm: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Result[]>({
    queryKey: ["results", searchTerm],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllResults(searchTerm || null);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddOrUpdateResult() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (result: Result) => {
      if (!actor) throw new Error("Not connected");
      await actor.addOrUpdateResult(result);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["results"] });
    },
  });
}

export function useDeleteResult() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rollNumber: string) => {
      if (!actor) throw new Error("Not connected");
      await actor.deleteResult(rollNumber);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["results"] });
    },
  });
}
