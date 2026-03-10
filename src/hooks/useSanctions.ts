import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useSanctions() {
  return useQuery({
    queryKey: ["sanctions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sanctions")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useAddSanction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (s: { title: string; description: string; category: string; sort_order: number }) => {
      const { error } = await supabase.from("sanctions").insert(s);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sanctions"] }),
  });
}

export function useUpdateSanction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...rest }: { id: string; title: string; description: string; category: string }) => {
      const { error } = await supabase.from("sanctions").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sanctions"] }),
  });
}

export function useDeleteSanction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("sanctions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sanctions"] }),
  });
}
