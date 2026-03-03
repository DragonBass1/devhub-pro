import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { environments } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Server, DollarSign, Cpu, HardDrive } from "lucide-react";
import { format } from "date-fns";

export default function Environments() {
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const projEnvs = environments.filter(e => e.projectId === selectedProject?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ambientes</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="mr-1 h-4 w-4" />Ambiente Efêmero</Button>
      </div>

      {projEnvs.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum ambiente configurado.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projEnvs.map(env => (
            <Card key={env.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Server className="h-4 w-4" />
                    {env.nome}
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <StatusBadge value={env.tipo} />
                    <StatusBadge value={env.statusDisponibilidade} type="env" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs"><span className="flex items-center gap-1"><Cpu className="h-3 w-3" />CPU</span><span>{env.cpu}%</span></div>
                  <Progress value={env.cpu} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs"><span>Memória</span><span>{env.mem}%</span></div>
                  <Progress value={env.mem} className="h-1.5" />
                  <div className="flex items-center justify-between text-xs"><span><HardDrive className="inline h-3 w-3 mr-1" />Storage</span><span>{env.storage}%</span></div>
                  <Progress value={env.storage} className="h-1.5" />
                </div>
                <div className="flex items-center justify-between pt-2 border-t">
                  <span className="text-xs flex items-center gap-1"><DollarSign className="h-3 w-3" />R$ {env.custoEstimado}/mês</span>
                  {env.tipo === "Efêmero" && (
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-muted-foreground">Expira: {env.expiresAt ? format(new Date(env.expiresAt), "dd/MM") : "—"}</span>
                      <Button size="sm" variant="ghost" className="h-7 text-destructive" onClick={() => toast({ title: "Ambiente destruído" })}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                  {env.tipo === "Restrito" && env.nome === "Prod" && (
                    <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => toast({ title: "Solicitação enviada", description: "Acesso a Prod requer aprovação." })}>
                      Solicitar Acesso
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Ambiente Efêmero</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Nome</Label><Input placeholder="feature-xyz" />
            <Label>TTL (horas)</Label><Input type="number" defaultValue={24} />
            <Label>Branch / PR</Label><Input placeholder="feature/checkout-v2" />
          </div>
          <DialogFooter><Button onClick={() => { setCreateOpen(false); toast({ title: "Ambiente efêmero criado!" }); }}>Criar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
