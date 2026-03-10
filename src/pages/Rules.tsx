import Layout from "@/components/Layout";
import { useRules } from "@/hooks/useRules";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Scale, Loader2 } from "lucide-react";

export default function Rules() {
  const { data: rules, isLoading } = useRules();

  return (
    <Layout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center gap-3 mb-8">
          <Scale className="h-8 w-8 text-primary" />
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">القوانين</h1>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          </div>
        ) : rules && rules.length > 0 ? (
          <Accordion type="single" collapsible className="space-y-3">
            {rules.map((rule, i) => (
              <AccordionItem
                key={rule.id}
                value={rule.id}
                className="border border-border rounded-lg bg-card px-4 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <AccordionTrigger className="text-foreground font-heading text-lg hover:no-underline">
                  {rule.title}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
                  {rule.content}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        ) : (
          <p className="text-center text-muted-foreground py-20">لا توجد قوانين حالياً</p>
        )}
      </div>
    </Layout>
  );
}
