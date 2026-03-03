import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { StatusBadge } from "@/components/StatusBadge";
import { useToast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Play, CheckCircle2, XCircle } from "lucide-react";

const coverageData: Record<string, { modulo: string; cobertura: number }[]> = {
  p1: [{ modulo: "PaymentService", cobertura: 90 }, { modulo: "CheckoutController", cobertura: 85 }, { modulo: "OrderService", cobertura: 78 }, { modulo: "NotificationService", cobertura: 72 }],
  p2: [{ modulo: "Dashboard", cobertura: 75 }, { modulo: "UserProfile", cobertura: 70 }, { modulo: "Navigation", cobertura: 60 }, { modulo: "Settings", cobertura: 55 }],
  p3: [{ modulo: "BillingService", cobertura: 60 }, { modulo: "InvoiceProcessor", cobertura: 55 }, { modulo: "TaxCalculator", cobertura: 50 }, { modulo: "ReportGenerator", cobertura: 45 }],
};

const qualityGates = [
  { nome: "Cobertura mínima", limite: 70, campo: "coberturaTestes" },
  { nome: "Vulnerabilidades críticas", limite: 0, campo: "vulnCriticas" },
  { nome: "Bugs bloqueantes", limite: 0, campo: "bugsBloqueantes" },
  { nome: "Code smells", limite: 50, campo: "codeSmells" },
];

export default function TestingQuality() {
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const modules = coverageData[selectedProject?.id || "p1"] || [];
  const cobertura = selectedProject?.coberturaTestes || 0;

  const gates = qualityGates.map(g => ({
    ...g,
    valor: g.campo === "coberturaTestes" ? cobertura : g.campo === "vulnCriticas" ? (selectedProject?.id === "p3" ? 1 : 0) : g.campo === "bugsBloqueantes" ? 0 : 12,
    atingido: g.campo === "coberturaTestes" ? cobertura >= g.limite : g.campo === "vulnCriticas" ? (selectedProject?.id !== "p3") : true,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testes & Qualidade</h1>
        <Button size="sm" onClick={() => toast({ title: "Testes iniciados", description: "Execução em andamento..." })}><Play className="mr-1 h-4 w-4" />Executar Testes</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle className="text-sm">Cobertura por Módulo</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={modules}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="modulo" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                <Bar dataKey="cobertura" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {modules.map(m => (
                <div key={m.modulo} className="flex items-center gap-3 text-sm">
                  <span className="w-40 truncate">{m.modulo}</span>
                  <Progress value={m.cobertura} className="flex-1 h-2" />
                  <span className="text-xs w-10 text-right">{m.cobertura}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm">Quality Gates</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {gates.map((g, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    {g.atingido ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}
                    <span className="text-sm">{g.nome}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-mono">{g.valor}</span>
                    <span className="text-xs text-muted-foreground">/ limite: {g.limite}</span>
                    <StatusBadge value={g.atingido ? "Passou" : "Bloqueado"} type={g.atingido ? "pipeline" : "vuln"} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Histórico de Regressão (versão atual vs anterior)</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-center text-sm">
            <div className="p-3 rounded-lg border"><p className="text-lg font-bold text-success">+3%</p><p className="text-xs text-muted-foreground">Cobertura</p></div>
            <div className="p-3 rounded-lg border"><p className="text-lg font-bold text-destructive">+2</p><p className="text-xs text-muted-foreground">Falhas novas</p></div>
            <div className="p-3 rounded-lg border"><p className="text-lg font-bold text-success">-5</p><p className="text-xs text-muted-foreground">Code smells</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
