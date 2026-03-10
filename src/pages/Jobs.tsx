import Layout from "@/components/Layout";
import { useJobs } from "@/hooks/useJobs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, Loader2 } from "lucide-react";

export default function Jobs() {
  const { data: jobs, isLoading } = useJobs();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Briefcase className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">الوظائف</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : jobs && jobs.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {jobs.map((job, i) => (
              <Card
                key={job.id}
                className="border-border bg-card hover:border-primary/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <CardHeader>
                  <CardTitle className="font-heading text-xl text-primary">{job.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground whitespace-pre-wrap">{job.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground py-20">لا توجد وظائف حالياً</p>
        )}
      </div>
    </Layout>
  );
}
