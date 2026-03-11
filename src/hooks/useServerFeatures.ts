import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useServerFeatures() {
  return useQuery({
    queryKey: ["server_features"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("server_features")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddServerFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: { title: string; description: string; icon?: string; sort_order?: number }) => {
      const { error } = await supabase.from("server_features").insert(f);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["server_features"] }),
  });
}

export function useUpdateServerFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (f: { id: string; title?: string; description?: string; icon?: string }) => {
      const { id, ...rest } = f;
      const { error } = await supabase.from("server_features").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["server_features"] }),
  });
}

export function useDeleteServerFeature() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("server_features").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["server_features"] }),
  });
}
