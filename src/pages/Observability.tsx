import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { observabilityMetrics, logEntries, alerts } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { AlertTriangle, Bell, Search } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default function Observability() {
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const [logFilter, setLogFilter] = useState("");

  const metrics = observabilityMetrics.filter(m => m.projectId === selectedProject?.id);
  const logs = logEntries.filter(l => l.projectId === selectedProject?.id);
  const projAlerts = alerts.filter(a => a.projectId === selectedProject?.id);

  const filteredLogs = logs.filter(l =>
    !logFilter || l.mensagem.toLowerCase().includes(logFilter.toLowerCase()) || l.level.includes(logFilter.toUpperCase()) || (l.traceId?.includes(logFilter))
  );

  const chartData = metrics.map(m => ({
    hora: format(new Date(m.timestamp), "HH:mm"),
    latencia: Math.round(m.latenciaMs),
    throughput: Math.round(m.throughputRps),
    cpu: Math.round(m.cpu),
    mem: Math.round(m.mem),
  }));

  const hasAnomaly = metrics.some(m => m.latenciaMs > 140);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Observabilidade</h1>
          {hasAnomaly && <Badge className="bg-warning/15 text-warning border-warning/30 animate-pulse">⚡ Anomalia detectada — AIOps</Badge>}
        </div>
      </div>

      <Tabs defaultValue="metricas">
        <TabsList><TabsTrigger value="metricas">Métricas</TabsTrigger><TabsTrigger value="logs">Logs</TabsTrigger><TabsTrigger value="alertas">Alertas ({projAlerts.filter(a => a.status === "Ativo").length})</TabsTrigger></TabsList>

        <TabsContent value="metricas" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader><CardTitle className="text-sm">Latência (ms)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="latencia" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">Throughput (rps)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="throughput" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle className="text-sm">CPU & Memória (%)</CardTitle></CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="hora" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                    <Line type="monotone" dataKey="cpu" stroke="hsl(var(--chart-4))" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="mem" stroke="hsl(var(--chart-5))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <CardTitle className="text-sm">Logs Centralizados</CardTitle>
                <div className="relative flex-1 max-w-sm">
                  <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input placeholder="Filtrar por mensagem, level, traceId..." className="pl-8 h-8" value={logFilter} onChange={e => setLogFilter(e.target.value)} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 font-mono text-xs max-h-[400px] overflow-auto scrollbar-thin">
                {filteredLogs.map(l => {
                  const levelColors: Record<string, string> = { ERROR: "text-destructive", WARN: "text-warning", INFO: "text-primary", DEBUG: "text-muted-foreground" };
                  return (
                    <div key={l.id} className="flex gap-2 p-1.5 rounded hover:bg-muted/50">
                      <span className="text-muted-foreground shrink-0">{format(new Date(l.timestamp), "HH:mm:ss")}</span>
                      <span className={`shrink-0 w-12 ${levelColors[l.level]}`}>{l.level}</span>
                      <span className="shrink-0 text-muted-foreground">[{l.ambiente}]</span>
                      <span className="flex-1">{l.mensagem}</span>
                      {l.traceId && <span className="text-accent shrink-0">{l.traceId}</span>}
                    </div>
                  );
                })}
                {filteredLogs.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum log encontrado.</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Severidade</TableHead><TableHead>Status</TableHead><TableHead>Data</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {projAlerts.map(a => (
                    <TableRow key={a.id}>
                      <TableCell className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" />{a.titulo}</TableCell>
                      <TableCell><StatusBadge value={a.severidade} type="severidade" /></TableCell>
                      <TableCell><StatusBadge value={a.status} type={a.status === "Ativo" ? "vuln" : a.status === "Resolvido" ? "pipeline" : "access"} /></TableCell>
                      <TableCell className="text-xs text-muted-foreground">{format(new Date(a.createdAt), "dd/MM HH:mm")}</TableCell>
                      <TableCell>
                        {a.status === "Ativo" && (
                          <Button size="sm" variant="outline" className="text-xs" onClick={() => toast({ title: "Incidente criado", description: `Incidente aberto a partir do alerta "${a.titulo}"` })}>
                            <Bell className="mr-1 h-3 w-3" />Criar Incidente
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {projAlerts.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhum alerta.</p>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
