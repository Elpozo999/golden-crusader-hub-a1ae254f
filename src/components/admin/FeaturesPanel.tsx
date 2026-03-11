import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useServerFeatures, useAddServerFeature, useUpdateServerFeature, useDeleteServerFeature } from "@/hooks/useServerFeatures";
import { Trash2, Plus, Save, Loader2, Star } from "lucide-react";
import { toast } from "sonner";

export default function FeaturesPanel() {
  const { data: features, isLoading } = useServerFeatures();
  const addFeature = useAddServerFeature();
  const updateFeature = useUpdateServerFeature();
  const deleteFeature = useDeleteServerFeature();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  if (isLoading) return <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-primary text-lg flex items-center gap-2">
            <Star className="h-5 w-5" /> إضافة ميزة جديدة
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="عنوان الميزة" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Textarea placeholder="وصف الميزة" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Button
            onClick={async () => {
              if (!newTitle.trim()) return toast.error("أدخل عنوان الميزة");
              await addFeature.mutateAsync({ title: newTitle, description: newDesc, sort_order: (features?.length || 0) + 1 });
              setNewTitle("");
              setNewDesc("");
              toast.success("تم إضافة الميزة");
            }}
            disabled={addFeature.isPending}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 ml-2" /> إضافة
          </Button>
        </CardContent>
      </Card>

      {features?.map((f) => (
        <FeatureItem
          key={f.id}
          id={f.id}
          title={f.title}
          description={f.description}
          onSave={(title, description) => updateFeature.mutateAsync({ id: f.id, title, description })}
          onDelete={() => deleteFeature.mutateAsync(f.id)}
        />
      ))}
    </div>
  );
}

function FeatureItem({
  id,
  title: initTitle,
  description: initDesc,
  onSave,
  onDelete,
}: {
  id: string;
  title: string;
  description: string;
  onSave: (title: string, description: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initTitle);
  const [desc, setDesc] = useState(initDesc);

  if (!editing) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-foreground">{initTitle}</h3>
            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-wrap">{initDesc}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>تعديل</Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => { await onDelete(); toast.success("تم الحذف"); }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-primary">
      <CardContent className="pt-4 space-y-3">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="عنوان الميزة" />
        <Textarea value={desc} onChange={(e) => setDesc(e.target.value)} placeholder="وصف الميزة" />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={async () => { await onSave(title, desc); setEditing(false); toast.success("تم التحديث"); }}
            className="bg-primary text-primary-foreground"
          >
            <Save className="h-4 w-4 ml-1" /> حفظ
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setEditing(false); setTitle(initTitle); setDesc(initDesc); }}>
            إلغاء
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
