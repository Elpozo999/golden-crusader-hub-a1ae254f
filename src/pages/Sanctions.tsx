import Layout from "@/components/Layout";
import { useSanctions } from "@/hooks/useSanctions";
import { Gavel, Loader2 } from "lucide-react";

export default function Sanctions() {
  const { data: sanctions, isLoading } = useSanctions();

  // Group by category
  const grouped = sanctions?.reduce((acc: Record<string, any[]>, s) => {
    const cat = s.category || "عام";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(s);
    return acc;
  }, {}) || {};

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Gavel className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">العقوبات</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : Object.keys(grouped).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(grouped).map(([category, items]: [string, any[]]) => (
              <div key={category} className="space-y-3">
                <h2 className="font-heading text-2xl font-bold text-primary border-b border-border pb-2">
                  {category}
                </h2>
                <div className="space-y-3">
                  {items.map((s: any, i: number) => (
                    <div
                      key={s.id}
                      className="p-4 rounded-lg bg-card border border-border hover:border-primary/40 transition-colors animate-fade-in"
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      <h3 className="font-heading text-lg font-semibold text-foreground">{s.title}</h3>
                      <p className="text-muted-foreground mt-1 whitespace-pre-wrap">{s.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">لا توجد عقوبات حالياً</p>
        )}
      </div>
    </Layout>
  );
}
