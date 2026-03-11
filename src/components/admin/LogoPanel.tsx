import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSettings, useUpdateSetting } from "@/hooks/useSettings";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";

export default function LogoPanel() {
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (isLoading) return <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto mt-8" />;

  const logoUrl = settings?.logo_url || "";

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const ext = file.name.split(".").pop();
      const path = `logo-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("logos")
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage.from("logos").getPublicUrl(path);

      await updateSetting.mutateAsync({ key: "logo_url", value: urlData.publicUrl });
      toast.success("تم تحديث اللوغو");
    } catch (err: any) {
      toast.error("خطأ في رفع الصورة: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-heading text-primary flex items-center gap-2">
          <ImageIcon className="h-5 w-5" /> لوغو الموقع
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-24 h-24 object-contain rounded-lg border border-border bg-background p-2" />
          ) : (
            <div className="w-24 h-24 rounded-lg border border-border bg-background flex items-center justify-center">
              <ImageIcon className="h-10 w-10 text-muted-foreground" />
            </div>
          )}
          <div className="space-y-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-primary text-primary-foreground"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : <Upload className="h-4 w-4 ml-2" />}
              {logoUrl ? "تغيير اللوغو" : "رفع لوغو"}
            </Button>
            <p className="text-xs text-muted-foreground">PNG, JPG أو SVG — يفضل بخلفية شفافة</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
