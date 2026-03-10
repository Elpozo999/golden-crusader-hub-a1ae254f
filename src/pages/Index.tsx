import { useSettings } from "@/hooks/useSettings";
import { ExternalLink, Download, Gamepad2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Layout from "@/components/Layout";

const Index = () => {
  const { data: settings, isLoading } = useSettings();

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary mb-4">
            <Gamepad2 className="h-12 w-12 text-primary" />
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-primary drop-shadow-lg">
            Gnsader
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-lg mx-auto">
            مرحباً بك في سيرفر Gnsader — أفضل تجربة SA-MP
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
          <Button
            size="lg"
            className="text-lg px-8 py-6 font-heading font-bold gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30"
            onClick={() => {
              if (settings?.discord_link) window.open(settings.discord_link, "_blank");
            }}
            disabled={isLoading}
          >
            <ExternalLink className="h-5 w-5" />
            دخول الديسكورد
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 font-heading font-bold gap-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg"
            onClick={() => {
              if (settings?.download_link) window.open(settings.download_link, "_blank");
            }}
            disabled={isLoading}
          >
            <Download className="h-5 w-5" />
            تحميل اللعبة
          </Button>
        </div>

        {/* Decorative line */}
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-60" />
      </div>
    </Layout>
  );
};

export default Index;
