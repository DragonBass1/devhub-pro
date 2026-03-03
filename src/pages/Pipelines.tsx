import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import { pipelineRuns, deployments } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Play, RotateCcw, CheckCircle2, ArrowRight } from "lucide-react";
import { format } from "date-fns";

export default function Pipelines() {
  const { selectedProject } = useProject();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [selectedPipeline, setSelectedPipeline] = useState<string | null>(null);

  const projPipelines = pipelineRuns.filter(p => p.projectId === selectedProject?.id);
  const projDeploys = deployments.filter(d => d.projectId === selectedProject?.id);
  const canApprovePromo = selectedProject?.criticidade === "Alta" ? hasRole("Tech Lead", "Admin") : true;

  const detail = projPipelines.find(p => p.id === selectedPipeline);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pipelines & Deploy</h1>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setRunDialogOpen(true)}><Play className="mr-1 h-4 w-4" />Executar Pipeline</Button>
        </div>
      </div>

      <Tabs defaultValue="pipelines">
        <TabsList><TabsTrigger value="pipelines">Pipelines</TabsTrigger><TabsTrigger value="deploys">Deploys</TabsTrigger></TabsList>

        <TabsContent value="pipelines" className="space-y-4">
          <Card>
            <CardContent className="pt-4">
              <Table>
                <TableHeader><TableRow><TableHead>ID</TableHead><TableHead>Gatilho</TableHead><TableHead>Status</TableHead><TableHead>Etapas</TableHead><TableHead>Duração</TableHead><TableHead>Data</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {projPipelines.map(pl => (
                    <TableRow key={pl.id} className="cursor-pointer" onClick={() => setSelectedPipeline(pl.id)}>
                      <TableCell className="font-mono text-xs">{pl.id}</TableCell>
                      <TableCell><StatusBadge value={pl.gatilho} /></TableCell>
                      <TableCell><StatusBadge value={pl.status} type="pipeline" /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {pl.etapas.map((e, i) => (
                            <span key={i} className="flex items-center gap-0.5">
                              <StatusBadge value={e.status} type="pipeline" className="text-[10px] px-1" />
                              {i < pl.etapas.length - 1 && <ArrowRight className="h-3 w-3 text-muted-foreground" />}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{pl.duration}s</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{format(new Date(pl.startedAt), "dd/MM HH:mm")}</TableCell>
                      <TableCell><Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); setSelectedPipeline(pl.id); }}>Detalhes</Button></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {detail && (
            <Card>
              <CardHeader><CardTitle className="text-sm">Detalhes — Pipeline {detail.id}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  {detail.etapas.map((e, i) => (
                    <div key={i} className="rounded-lg border p-3">
                      <p className="font-medium">{e.nome}</p>
                      <StatusBadge value={e.status} type="pipeline" />
                      <p className="text-xs text-muted-foreground mt-1">{e.duracao}s</p>
                    </div>
                  ))}
                </div>
                {detail.artifacts.length > 0 && (
                  <div><p className="text-xs text-muted-foreground mb-1">Artefatos:</p>{detail.artifacts.map(a => <span key={a} className="font-mono text-xs bg-muted px-2 py-1 rounded mr-1">{a}</span>)}</div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deploys">
          <Card>
            <CardContent className="pt-4">
              <div className="space-y-3">
                {projDeploys.map(d => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border">
                    <div className="flex items-center gap-3">
                      <StatusBadge value={d.status} type="pipeline" />
                      <span className="font-mono text-sm">{d.versao}</span>
                      <StatusBadge value={d.ambiente} />
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">{format(new Date(d.startedAt), "dd/MM HH:mm")}</span>
                      {d.ambiente === "Staging" && (
                        <Button size="sm" variant="outline" disabled={!canApprovePromo} onClick={() => toast({ title: "Promoção aprovada", description: `${d.versao} promovida para Prod` })}>
                          <CheckCircle2 className="mr-1 h-3 w-3" />{canApprovePromo ? "Promover" : "Sem permissão"}
                        </Button>
                      )}
                      {d.ambiente === "Prod" && d.status === "Sucesso" && (
                        <Button size="sm" variant="outline" onClick={() => toast({ title: "Rollback iniciado", description: `Revertendo para versão anterior` })}>
                          <RotateCcw className="mr-1 h-3 w-3" />Rollback
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={runDialogOpen} onOpenChange={setRunDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Executar Pipeline Manualmente</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Select><SelectTrigger><SelectValue placeholder="Branch" /></SelectTrigger>
              <SelectContent><SelectItem value="main">main</SelectItem><SelectItem value="develop">develop</SelectItem></SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button onClick={() => { setRunDialogOpen(false); toast({ title: "Pipeline iniciada", description: "Execução em andamento..." }); }}>Executar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
