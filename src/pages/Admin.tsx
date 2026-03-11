import { useState } from "react";
import Layout from "@/components/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSettings, useUpdateSetting } from "@/hooks/useSettings";
import { useRules, useAddRule, useUpdateRule, useDeleteRule } from "@/hooks/useRules";
import { useJobs, useAddJob, useUpdateJob, useDeleteJob } from "@/hooks/useJobs";
import { useSanctions, useAddSanction, useUpdateSanction, useDeleteSanction } from "@/hooks/useSanctions";
import { Lock, Trash2, Plus, Save, Link2, Loader2, Home } from "lucide-react";
import { toast } from "sonner";

const ADMIN_CODE = "106";

export default function Admin() {
  const [code, setCode] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  if (!authenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
          <Lock className="h-16 w-16 text-primary" />
          <h1 className="font-heading text-3xl font-bold text-primary">لوحة المطورين</h1>
          <p className="text-muted-foreground">أدخل كود الوصول للمتابعة</p>
          <div className="flex gap-3 w-64">
            <Input
              type="password"
              placeholder="كود الوصول"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  if (code === ADMIN_CODE) setAuthenticated(true);
                  else toast.error("كود خاطئ!");
                }
              }}
              className="text-center text-lg"
            />
            <Button
              onClick={() => {
                if (code === ADMIN_CODE) setAuthenticated(true);
                else toast.error("كود خاطئ!");
              }}
              className="bg-primary text-primary-foreground"
            >
              دخول
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="font-heading text-3xl font-bold text-primary">لوحة المطورين</h1>

        <Tabs defaultValue="homepage" dir="rtl">
          <TabsList className="grid w-full grid-cols-5 bg-secondary">
            <TabsTrigger value="homepage">الصفحة الرئيسية</TabsTrigger>
            <TabsTrigger value="settings">الروابط</TabsTrigger>
            <TabsTrigger value="rules">القوانين</TabsTrigger>
            <TabsTrigger value="jobs">الوظائف</TabsTrigger>
            <TabsTrigger value="sanctions">العقوبات</TabsTrigger>
          </TabsList>

          <TabsContent value="homepage">
            <HomepagePanel />
          </TabsContent>
          <TabsContent value="settings">
            <SettingsPanel />
          </TabsContent>
          <TabsContent value="rules">
            <RulesPanel />
          </TabsContent>
          <TabsContent value="jobs">
            <JobsPanel />
          </TabsContent>
          <TabsContent value="sanctions">
            <SanctionsPanel />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

function SettingsPanel() {
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const [discord, setDiscord] = useState("");
  const [download, setDownload] = useState("");
  const [support, setSupport] = useState("");
  const [initialized, setInitialized] = useState(false);

  if (settings && !initialized) {
    setDiscord(settings.discord_link || "");
    setDownload(settings.download_link || "");
    setSupport(settings.support_link || "");
    setInitialized(true);
  }

  if (isLoading) return <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto mt-8" />;

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="font-heading text-primary flex items-center gap-2">
          <Link2 className="h-5 w-5" /> الروابط
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">رابط الديسكورد</label>
          <Input value={discord} onChange={(e) => setDiscord(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">رابط تحميل اللعبة</label>
          <Input value={download} onChange={(e) => setDownload(e.target.value)} dir="ltr" />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">رابط الدعم الفني (ديسكورد)</label>
          <Input value={support} onChange={(e) => setSupport(e.target.value)} dir="ltr" />
        </div>
        <Button
          onClick={async () => {
            await updateSetting.mutateAsync({ key: "discord_link", value: discord });
            await updateSetting.mutateAsync({ key: "download_link", value: download });
            await updateSetting.mutateAsync({ key: "support_link", value: support });
            toast.success("تم حفظ الإعدادات");
          }}
          disabled={updateSetting.isPending}
          className="bg-primary text-primary-foreground"
        >
          <Save className="h-4 w-4 ml-2" /> حفظ
        </Button>
      </CardContent>
    </Card>
  );
}

function RulesPanel() {
  const { data: rules, isLoading } = useRules();
  const addRule = useAddRule();
  const updateRule = useUpdateRule();
  const deleteRule = useDeleteRule();
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");

  if (isLoading) return <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      {/* Add new */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-primary text-lg">إضافة قانون جديد</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="عنوان القانون" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Textarea placeholder="تفاصيل القانون" value={newContent} onChange={(e) => setNewContent(e.target.value)} />
          <Button
            onClick={async () => {
              if (!newTitle.trim()) return toast.error("أدخل عنوان القانون");
              await addRule.mutateAsync({ title: newTitle, content: newContent, sort_order: (rules?.length || 0) + 1 });
              setNewTitle("");
              setNewContent("");
              toast.success("تم إضافة القانون");
            }}
            disabled={addRule.isPending}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 ml-2" /> إضافة
          </Button>
        </CardContent>
      </Card>

      {/* Existing */}
      {rules?.map((rule) => (
        <EditableItem
          key={rule.id}
          id={rule.id}
          title={rule.title}
          content={rule.content}
          onSave={(title, content) => updateRule.mutateAsync({ id: rule.id, title, content })}
          onDelete={() => deleteRule.mutateAsync(rule.id)}
        />
      ))}
    </div>
  );
}

function JobsPanel() {
  const { data: jobs, isLoading } = useJobs();
  const addJob = useAddJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");

  if (isLoading) return <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-primary text-lg">إضافة وظيفة جديدة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="عنوان الوظيفة" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Textarea placeholder="وصف الوظيفة" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Button
            onClick={async () => {
              if (!newTitle.trim()) return toast.error("أدخل عنوان الوظيفة");
              await addJob.mutateAsync({ title: newTitle, description: newDesc, sort_order: (jobs?.length || 0) + 1 });
              setNewTitle("");
              setNewDesc("");
              toast.success("تم إضافة الوظيفة");
            }}
            disabled={addJob.isPending}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 ml-2" /> إضافة
          </Button>
        </CardContent>
      </Card>

      {jobs?.map((job) => (
        <EditableItem
          key={job.id}
          id={job.id}
          title={job.title}
          content={job.description}
          onSave={(title, content) => updateJob.mutateAsync({ id: job.id, title, description: content })}
          onDelete={() => deleteJob.mutateAsync(job.id)}
        />
      ))}
    </div>
  );
}

function SanctionsPanel() {
  const { data: sanctions, isLoading } = useSanctions();
  const addSanction = useAddSanction();
  const updateSanction = useUpdateSanction();
  const deleteSanction = useDeleteSanction();
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState("");

  if (isLoading) return <Loader2 className="h-6 w-6 text-primary animate-spin mx-auto mt-8" />;

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="font-heading text-primary text-lg">إضافة عقوبة جديدة</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="قسم العقوبة (مثال: عام)" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
          <Input placeholder="عنوان العقوبة" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
          <Textarea placeholder="وصف العقوبة" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} />
          <Button
            onClick={async () => {
              if (!newTitle.trim()) return toast.error("أدخل عنوان العقوبة");
              await addSanction.mutateAsync({
                title: newTitle,
                description: newDesc,
                category: newCategory || "عام",
                sort_order: (sanctions?.length || 0) + 1,
              });
              setNewTitle("");
              setNewDesc("");
              setNewCategory("");
              toast.success("تم إضافة العقوبة");
            }}
            disabled={addSanction.isPending}
            className="bg-primary text-primary-foreground"
          >
            <Plus className="h-4 w-4 ml-2" /> إضافة
          </Button>
        </CardContent>
      </Card>

      {sanctions?.map((s) => (
        <EditableItemWithCategory
          key={s.id}
          id={s.id}
          title={s.title}
          content={s.description}
          category={s.category}
          onSave={(title, content, category) =>
            updateSanction.mutateAsync({ id: s.id, title, description: content, category })
          }
          onDelete={() => deleteSanction.mutateAsync(s.id)}
        />
      ))}
    </div>
  );
}

function EditableItem({
  id,
  title: initTitle,
  content: initContent,
  onSave,
  onDelete,
}: {
  id: string;
  title: string;
  content: string;
  onSave: (title: string, content: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initTitle);
  const [content, setContent] = useState(initContent);

  if (!editing) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-heading font-semibold text-foreground">{initTitle}</h3>
            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-wrap">{initContent}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>تعديل</Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await onDelete();
                toast.success("تم الحذف");
              }}
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
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={async () => {
              await onSave(title, content);
              setEditing(false);
              toast.success("تم التحديث");
            }}
            className="bg-primary text-primary-foreground"
          >
            <Save className="h-4 w-4 ml-1" /> حفظ
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setEditing(false); setTitle(initTitle); setContent(initContent); }}>
            إلغاء
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function EditableItemWithCategory({
  id,
  title: initTitle,
  content: initContent,
  category: initCategory,
  onSave,
  onDelete,
}: {
  id: string;
  title: string;
  content: string;
  category: string;
  onSave: (title: string, content: string, category: string) => Promise<void>;
  onDelete: () => Promise<void>;
}) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(initTitle);
  const [content, setContent] = useState(initContent);
  const [category, setCategory] = useState(initCategory);

  if (!editing) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="pt-4 flex items-start justify-between gap-4">
          <div className="flex-1">
            <span className="text-xs text-primary font-semibold">{initCategory}</span>
            <h3 className="font-heading font-semibold text-foreground">{initTitle}</h3>
            <p className="text-muted-foreground text-sm mt-1 whitespace-pre-wrap">{initContent}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>تعديل</Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={async () => {
                await onDelete();
                toast.success("تم الحذف");
              }}
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
        <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="القسم" />
        <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        <Textarea value={content} onChange={(e) => setContent(e.target.value)} />
        <div className="flex gap-2">
          <Button
            size="sm"
            onClick={async () => {
              await onSave(title, content, category);
              setEditing(false);
              toast.success("تم التحديث");
            }}
            className="bg-primary text-primary-foreground"
          >
            <Save className="h-4 w-4 ml-1" /> حفظ
          </Button>
          <Button size="sm" variant="outline" onClick={() => { setEditing(false); setTitle(initTitle); setContent(initContent); setCategory(initCategory); }}>
            إلغاء
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
