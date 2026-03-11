import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useHomepageButtons() {
  return useQuery({
    queryKey: ["homepage_buttons"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("homepage_buttons")
        .select("*")
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });
}

export function useAddHomepageButton() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (btn: { label: string; url: string; variant?: string; sort_order?: number }) => {
      const { error } = await supabase.from("homepage_buttons").insert(btn);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["homepage_buttons"] }),
  });
}

export function useUpdateHomepageButton() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (btn: { id: string; label?: string; url?: string; variant?: string }) => {
      const { id, ...rest } = btn;
      const { error } = await supabase.from("homepage_buttons").update(rest).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["homepage_buttons"] }),
  });
}

export function useDeleteHomepageButton() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("homepage_buttons").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["homepage_buttons"] }),
  });
}
