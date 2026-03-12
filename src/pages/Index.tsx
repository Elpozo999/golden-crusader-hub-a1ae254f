import { useSettings } from "@/hooks/useSettings";
import { useHomepageButtons } from "@/hooks/useHomepageButtons";
import { useServerFeatures } from "@/hooks/useServerFeatures";
import { ExternalLink, Download, Gamepad2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";

const Index = () => {
  const { data: settings, isLoading } = useSettings();
  const { data: buttons } = useHomepageButtons();
  const { data: features } = useServerFeatures();

  const logoUrl = settings?.logo_url;

  return (
    <Layout>
      <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-8">
        {/* Logo / Title */}
        <div className="space-y-4 opacity-0 animate-fade-in">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt="Logo"
              className="w-24 h-24 object-contain mx-auto mb-4 animate-float rounded-full animate-glow-pulse"
            />
          ) : (
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary mb-4 animate-glow-pulse animate-float">
              <Gamepad2 className="h-12 w-12 text-primary" />
            </div>
          )}
          <h1 className="font-heading text-5xl md:text-7xl font-black text-primary drop-shadow-lg">
            {settings?.site_name || "Gnsader"}
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-lg mx-auto">
            {settings?.site_description || "مرحباً بك في سيرفر Gnsader — أفضل تجربة SA-MP"}
          </p>
        </div>

        {/* Default Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-fade-in stagger-2">
          <Button
            size="lg"
            className="text-lg px-8 py-6 font-heading font-bold gap-3 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/30 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/40"
            onClick={() => {
              if (settings?.discord_link) window.open(settings.discord_link, "_blank");
            }}
            disabled={isLoading}
          >
            <ExternalLink className="h-5 w-5" />
            {settings?.discord_button_text || "دخول الديسكورد"}
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="text-lg px-8 py-6 font-heading font-bold gap-3 border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
            onClick={() => {
              if (settings?.download_link) window.open(settings.download_link, "_blank");
            }}
            disabled={isLoading}
          >
            <Download className="h-5 w-5" />
            {settings?.download_button_text || "تحميل اللعبة"}
          </Button>
        </div>

        {/* Custom Buttons */}
        {buttons && buttons.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 opacity-0 animate-fade-in stagger-3">
            {buttons.map((btn) => (
              <Button
                key={btn.id}
                size="lg"
                variant="outline"
                className="text-base px-6 py-5 font-heading font-bold gap-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-105"
                onClick={() => {
                  if (btn.url) window.open(btn.url, "_blank");
                }}
              >
                <ExternalLink className="h-4 w-4" />
                {btn.label}
              </Button>
            ))}
          </div>
        )}

        {/* Decorative line */}
        <div className="w-48 h-1 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full opacity-0 animate-line-expand stagger-3" />

        {/* Server Features */}
        {features && features.length > 0 && (
          <div className="w-full max-w-3xl space-y-6 opacity-0 animate-fade-in stagger-4">
            <h2 className="font-heading text-2xl font-bold text-primary">مزايا السيرفر</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => (
                <Card
                  key={f.id}
                  className="bg-card border-border hover:border-primary transition-all duration-300 hover:scale-[1.03] hover:shadow-lg hover:shadow-primary/10 opacity-0 animate-fade-in-scale"
                  style={{ animationDelay: `${0.5 + i * 0.1}s` }}
                >
                  <CardContent className="pt-6 text-right space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-primary shrink-0" />
                      <h3 className="font-heading font-semibold text-foreground">{f.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm whitespace-pre-wrap">{f.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Index;
