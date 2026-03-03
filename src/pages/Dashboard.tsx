import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { projects, pipelineRuns, deployments, backlogItems, vulnerabilities, alerts } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, DotIndicator } from "@/components/StatusBadge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, KeyRound, Rocket, Bug, ShieldAlert, TrendingUp, BarChart3 } from "lucide-react";
import { format } from "date-fns";

export default function Dashboard() {
  const { user, hasRole } = useAuth();
  const { selectedProject, setSelectedProject } = useProject();
  const { toast } = useToast();
  const [wizardOpen, setWizardOpen] = useState(false);
  const [accessOpen, setAccessOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);

  const userProjects = projects.filter(p => p.membros.includes(user?.id || ""));

  const projPipelines = pipelineRuns.filter(p => p.projectId === selectedProject?.id).slice(0, 5);
  const projDeploys = deployments.filter(d => d.projectId === selectedProject?.id).slice(0, 5);
  const projBacklog = backlogItems.filter(b => b.projectId === selectedProject?.id && b.status !== "Done");
  const projVulns = vulnerabilities.filter(v => v.projectId === selectedProject?.id && v.status !== "Resolvida");
  const projAlerts = alerts.filter(a => a.projectId === selectedProject?.id && a.status === "Ativo");

  const last10 = pipelineRuns.filter(p => p.projectId === selectedProject?.id);
  const successRate = last10.length ? Math.round((last10.filter(p => p.status === "Sucesso").length / last10.length) * 100) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Meus Projetos</h1>
          <p className="text-sm text-muted-foreground">Olá, {user?.nome}. Você tem {userProjects.length} projeto(s).</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setWizardOpen(true)} size="sm"><Plus className="mr-1 h-4 w-4" />Novo Projeto</Button>
          <Button variant="outline" onClick={() => setAccessOpen(true)} size="sm"><KeyRound className="mr-1 h-4 w-4" />Solicitar Acesso</Button>
        </div>
      </div>

      {/* Project Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userProjects.map(p => (
          <Card
            key={p.id}
            className={`cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${selectedProject?.id === p.id ? "ring-2 ring-primary" : ""}`}
            onClick={() => setSelectedProject(p)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <DotIndicator status={p.statusBuild} />
                  {p.nome}
                </CardTitle>
                <StatusBadge value={p.criticidade} type="severidade" />
              </div>
              <p className="text-xs text-muted-foreground">{p.descricao}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                <StatusBadge value={p.tipo} />
                <StatusBadge value={p.prioridade} type="severidade" />
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-bold">{p.coberturaTestes}%</p>
                  <p className="text-[10px] text-muted-foreground">Cobertura</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{p.incidentesAtivos}</p>
                  <p className="text-[10px] text-muted-foreground">Incidentes</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{p.statusBuild === "verde" ? "✓" : p.statusBuild === "amarelo" ? "⚠" : "✗"}</p>
                  <p className="text-[10px] text-muted-foreground">Build</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Selected Project Details */}
      {selectedProject && (
        <>
          <div className="grid gap-4 md:grid-cols-4">
            <Card><CardContent className="pt-6 text-center"><TrendingUp className="mx-auto h-5 w-5 text-success mb-1" /><p className="text-2xl font-bold">{successRate}%</p><p className="text-xs text-muted-foreground">Taxa de Sucesso Build</p></CardContent></Card>
            <Card><CardContent className="pt-6 text-center"><BarChart3 className="mx-auto h-5 w-5 text-primary mb-1" /><p className="text-2xl font-bold">{selectedProject.coberturaTestes}%</p><p className="text-xs text-muted-foreground">Cobertura de Testes</p></CardContent></Card>
            <Card><CardContent className="pt-6 text-center"><Bug className="mx-auto h-5 w-5 text-destructive mb-1" /><p className="text-2xl font-bold">{selectedProject.incidentesAtivos}</p><p className="text-xs text-muted-foreground">Incidentes Ativos</p></CardContent></Card>
            <Card><CardContent className="pt-6 text-center"><ShieldAlert className="mx-auto h-5 w-5 text-warning mb-1" /><p className="text-2xl font-bold">{projVulns.length}</p><p className="text-xs text-muted-foreground">Vulnerabilidades</p></CardContent></Card>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {/* Recent Pipelines */}
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Rocket className="h-4 w-4" />Últimas Pipelines</CardTitle></CardHeader>
              <CardContent>
                {projPipelines.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma execução registrada.</p> : (
                  <div className="space-y-2">
                    {projPipelines.map(pl => (
                      <div key={pl.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <StatusBadge value={pl.status} type="pipeline" />
                          <span className="text-xs text-muted-foreground">{pl.gatilho}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(pl.startedAt), "dd/MM HH:mm")} · {pl.duration}s
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Deploys */}
            <Card>
              <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Rocket className="h-4 w-4" />Últimos Deploys</CardTitle></CardHeader>
              <CardContent>
                {projDeploys.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum deploy registrado.</p> : (
                  <div className="space-y-2">
                    {projDeploys.map(d => (
                      <div key={d.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <StatusBadge value={d.status} type="pipeline" />
                          <span className="font-mono text-xs">{d.versao}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <StatusBadge value={d.ambiente} />
                          <span className="text-xs text-muted-foreground">{format(new Date(d.startedAt), "dd/MM HH:mm")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Open Backlog */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Issues Abertas ({projBacklog.length})</CardTitle></CardHeader>
              <CardContent>
                {projBacklog.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma issue aberta.</p> : (
                  <div className="space-y-2">
                    {projBacklog.map(b => (
                      <div key={b.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs text-primary">{b.chave}</span>
                          <span className="truncate max-w-[200px]">{b.titulo}</span>
                        </div>
                        <StatusBadge value={b.status} type="backlog" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Alerts */}
            <Card>
              <CardHeader><CardTitle className="text-sm">Alertas Ativos ({projAlerts.length})</CardTitle></CardHeader>
              <CardContent>
                {projAlerts.length === 0 ? <p className="text-sm text-muted-foreground">Nenhum alerta ativo. 🎉</p> : (
                  <div className="space-y-2">
                    {projAlerts.map(a => (
                      <div key={a.id} className="flex items-center justify-between text-sm p-2 rounded-md bg-muted/50">
                        <span className="truncate max-w-[250px]">{a.titulo}</span>
                        <StatusBadge value={a.severidade} type="severidade" />
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Create Project Wizard */}
      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>Criar Novo Projeto — Passo {wizardStep + 1}/4</DialogTitle></DialogHeader>
          {wizardStep === 0 && (
            <div className="space-y-3">
              <Label>Tipo de Aplicação</Label>
              <Select><SelectTrigger><SelectValue placeholder="Selecionar tipo" /></SelectTrigger>
                <SelectContent>{["API", "Microsserviço", "Frontend", "Batch", "Outro"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {wizardStep === 1 && (
            <div className="space-y-3">
              <Label>Template Corporativo</Label>
              <Select><SelectTrigger><SelectValue placeholder="Selecionar template" /></SelectTrigger>
                <SelectContent>{["Spring Boot Starter", "React SPA", "Node.js Express", "Python FastAPI", "Go Microservice"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {wizardStep === 2 && (
            <div className="space-y-3">
              <Label>Nome do Projeto</Label>
              <Input placeholder="meu-projeto" />
              <Label>Descrição</Label>
              <Textarea placeholder="Descreva o projeto..." />
              <Label>Criticidade</Label>
              <Select><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
                <SelectContent>{["Baixa", "Média", "Alta"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          )}
          {wizardStep === 3 && (
            <div className="space-y-3 text-sm">
              <p className="text-muted-foreground">Ao confirmar, serão criados automaticamente:</p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Repositório com template selecionado</li>
                <li>Pipeline CI/CD padrão</li>
                <li>Ambientes Dev, QA, Staging e Prod</li>
                <li>Quality Gates configurados</li>
              </ul>
            </div>
          )}
          <DialogFooter className="gap-2">
            {wizardStep > 0 && <Button variant="outline" onClick={() => setWizardStep(s => s - 1)}>Voltar</Button>}
            {wizardStep < 3 ? (
              <Button onClick={() => setWizardStep(s => s + 1)}>Próximo</Button>
            ) : (
              <Button onClick={() => { setWizardOpen(false); setWizardStep(0); toast({ title: "Projeto criado!", description: "Repositório, pipeline e ambientes configurados." }); }}>Confirmar</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Request Access */}
      <Dialog open={accessOpen} onOpenChange={setAccessOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Solicitar Acesso a Projeto</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Projeto</Label>
            <Select><SelectTrigger><SelectValue placeholder="Buscar projeto..." /></SelectTrigger>
              <SelectContent>{projects.map(p => <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>)}</SelectContent>
            </Select>
            <Label>Justificativa</Label>
            <Textarea placeholder="Descreva o motivo do acesso..." />
          </div>
          <DialogFooter>
            <Button onClick={() => { setAccessOpen(false); toast({ title: "Solicitação enviada", description: "Aguardando aprovação." }); }}>Enviar Solicitação</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
