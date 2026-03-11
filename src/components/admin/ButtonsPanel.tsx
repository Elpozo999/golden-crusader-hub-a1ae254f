import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHomepageButtons, useAddHomepageButton, useUpdateHomepageButton, useDeleteHomepageButton } from "@/hooks/useHomepageButtons";
import { Trash2, Plus, Save, Loader2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ButtonsPanel() {
  const { data: buttons, isLoading } = useHomepageButtons();
  const addButton = useAddHomepageButton();
  const updateButton = useUpdateHomepageButton();
  const deleteButton = useDeleteHomepageButton();
  const [newLabel, setNewLabel] = useState("");
  const [newUrl, setNewUrl] = useState("");

  if (isLoading) return <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-primary text-lg flex items-center gap-2">
            <ExternalLink className="h-5 w-5" /> إضافة زر جديد
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="اسم الزر" value={newLabel} onChange={(e) => setNewLabel(e.target.value)} />
          <Input placeholder="رابط الزر" value={newUrl} onChange={(e) => setNewUrl(e.target.value)} dir="ltr" />
          <Button
            onClick={async () => {
              if (!newLabel.trim()) return toast.error("أدخل اسم الزر");
              await addButton.mutateAsync({ label: newLabel, url: newUrl, sort_order: (buttons?.length || 0) + 1 });
              setNewLabel("");
              setNewUrl("");
              toast.success("تم إضافة الزر");
            }}
            disabled={addButton.isPending}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 ml-2" /> إضافة
          </Button>
        </CardContent>
      </Card>

      {buttons?.map((btn) => (
        <ButtonItem
          key={btn.id}
          id={btn.id}
          label={btn.label}
          url={btn.url}
          onSave={(label, url) => updateButton.mutateAsync({ id: btn.id, label, url })}
          onDelete={() => deleteButton.mutateAsync(btn.id)}
        />
      ))}
    </div>
  );
}

function ButtonItem({
  id,
  label: initLabel,
  url: initUrl,
  onSave,
  onDelete,
}: {
  id: string;
  label: string;
  url: string;
  onSave: (label: string, url: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(initLabel);
  const [url, setUrl] = useState(initUrl);

  if (!editing) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-foreground">{initLabel}</h3>
            <p className="text-muted-foreground text-sm mt-1 dir-ltr">{initUrl || "بدون رابط"}</p>
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
        <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="اسم الزر" />
        <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="رابط الزر" dir="ltr" />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={async () => { await onSave(label, url); setEditing(false); toast.success("تم التحديث"); }}
            className="bg-primary text-primary-foreground"
          >
            <Save className="h-4 w-4 ml-1" /> حفظ
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setEditing(false); setLabel(initLabel); setUrl(initUrl); }}>
            إلغاء
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
