import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rules")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data as any[];
    },
  });
}

export function useAddRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (rule: { title: string; content: string; sort_order: number }) => {
      const { error } = await supabase.from("rules").insert(rule);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rules"] }),
  });
}

export function useUpdateRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...rest }: { id: string; title: string; content: string }) => {
      const { error } = await supabase.from("rules").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rules"] }),
  });
}

export function useDeleteRule() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("rules").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["rules"] }),
  });
}
