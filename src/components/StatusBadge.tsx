import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Variant = "success" | "warning" | "danger" | "info" | "muted" | "accent";

const variantClasses: Record<Variant, string> = {
  success: "bg-success/15 text-success border-success/30",
  warning: "bg-warning/15 text-warning border-warning/30",
  danger: "bg-destructive/15 text-destructive border-destructive/30",
  info: "bg-primary/15 text-primary border-primary/30",
  muted: "bg-muted text-muted-foreground border-border",
  accent: "bg-accent/15 text-accent border-accent/30",
};

const buildStatusMap: Record<string, Variant> = { verde: "success", amarelo: "warning", vermelho: "danger" };
const pipelineStatusMap: Record<string, Variant> = { Sucesso: "success", Falha: "danger", EmExecução: "info", Cancelado: "muted" };
const severidadeMap: Record<string, Variant> = { Crítica: "danger", Alta: "warning", Média: "info", Baixa: "muted", Crítico: "danger", Alto: "warning", Médio: "info", Baixo: "muted" };
const vulnStatusMap: Record<string, Variant> = { Aberta: "danger", EmCorreção: "warning", Resolvida: "success", AceitaExceção: "muted" };
const envStatusMap: Record<string, Variant> = { Online: "success", Degradado: "warning", Offline: "danger" };
const backlogStatusMap: Record<string, Variant> = { ToDo: "muted", Doing: "info", Done: "success" };
const accessStatusMap: Record<string, Variant> = { Pendente: "warning", Aprovado: "success", Negado: "danger" };

export function StatusBadge({ value, type, className }: { value: string; type?: string; className?: string }) {
  let variant: Variant = "muted";
  const maps: Record<string, Record<string, Variant>> = {
    build: buildStatusMap, pipeline: pipelineStatusMap, severidade: severidadeMap,
    vuln: vulnStatusMap, env: envStatusMap, backlog: backlogStatusMap, access: accessStatusMap,
  };
  if (type && maps[type]) variant = maps[type][value] || "muted";
  return <Badge variant="outline" className={cn("text-xs font-medium", variantClasses[variant], className)}>{value}</Badge>;
}

export function DotIndicator({ status }: { status: "verde" | "amarelo" | "vermelho" }) {
  const colors = { verde: "bg-success", amarelo: "bg-warning", vermelho: "bg-destructive" };
  return <span className={cn("inline-block h-2.5 w-2.5 rounded-full animate-pulse-dot", colors[status])} />;
}
