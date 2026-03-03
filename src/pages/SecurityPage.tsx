import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { useAuth } from "@/contexts/AuthContext";
import { vulnerabilities } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Play, FileWarning } from "lucide-react";

export default function SecurityPage() {
  const { selectedProject } = useProject();
  const { hasRole } = useAuth();
  const { toast } = useToast();
  const [exceptionOpen, setExceptionOpen] = useState(false);
  const [selectedVuln, setSelectedVuln] = useState<string | null>(null);

  const projVulns = vulnerabilities.filter(v => v.projectId === selectedProject?.id);
  const canApproveException = hasRole("Security Officer", "Admin");

  const byOrigin = (origin: string) => projVulns.filter(v => v.origem === origin);
  const stats = {
    total: projVulns.length,
    criticas: projVulns.filter(v => v.severidade === "Crítica").length,
    abertas: projVulns.filter(v => v.status === "Aberta").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Shield className="h-6 w-6" />Segurança</h1>
        <Button size="sm" onClick={() => toast({ title: "DAST iniciado", description: "Scan em andamento..." })}><Play className="mr-1 h-4 w-4" />Executar DAST</Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{stats.total}</p><p className="text-xs text-muted-foreground">Total</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-destructive">{stats.criticas}</p><p className="text-xs text-muted-foreground">Críticas</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold text-warning">{stats.abertas}</p><p className="text-xs text-muted-foreground">Abertas</p></CardContent></Card>
      </div>

      <Tabs defaultValue="todas">
        <TabsList>
          <TabsTrigger value="todas">Todas ({projVulns.length})</TabsTrigger>
          <TabsTrigger value="dep">Dependência ({byOrigin("Dependência").length})</TabsTrigger>
          <TabsTrigger value="sast">SAST ({byOrigin("SAST").length})</TabsTrigger>
          <TabsTrigger value="dast">DAST ({byOrigin("DAST").length})</TabsTrigger>
        </TabsList>
        {["todas", "dep", "sast", "dast"].map(tab => (
          <TabsContent key={tab} value={tab}>
            <Card>
              <CardContent className="pt-4">
                <Table>
                  <TableHeader><TableRow><TableHead>Componente</TableHead><TableHead>Origem</TableHead><TableHead>Severidade</TableHead><TableHead>CVE</TableHead><TableHead>Status</TableHead><TableHead></TableHead></TableRow></TableHeader>
                  <TableBody>
                    {(tab === "todas" ? projVulns : byOrigin(tab === "dep" ? "Dependência" : tab.toUpperCase())).map(v => (
                      <TableRow key={v.id}>
                        <TableCell className="font-mono text-sm max-w-[200px] truncate">{v.componente}</TableCell>
                        <TableCell><StatusBadge value={v.origem} /></TableCell>
                        <TableCell><StatusBadge value={v.severidade} type="severidade" /></TableCell>
                        <TableCell className="font-mono text-xs">{v.cve || "—"}</TableCell>
                        <TableCell><StatusBadge value={v.status} type="vuln" /></TableCell>
                        <TableCell>
                          {v.status === "Aberta" && (
                            <Button size="sm" variant="outline" className="text-xs" onClick={() => { setSelectedVuln(v.id); setExceptionOpen(true); }}>
                              <FileWarning className="mr-1 h-3 w-3" />Exceção
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {projVulns.length === 0 && <p className="text-center text-muted-foreground py-8">Nenhuma vulnerabilidade encontrada. 🎉</p>}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={exceptionOpen} onOpenChange={setExceptionOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Solicitar Exceção de Segurança</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Justificativa</Label><Textarea placeholder="Explique por que a exceção é necessária..." />
            <Label>Prazo para correção</Label><Input type="date" />
            {!canApproveException && <p className="text-xs text-muted-foreground">⚠ Aprovação pelo Security Officer ou Admin necessária.</p>}
          </div>
          <DialogFooter><Button onClick={() => { setExceptionOpen(false); toast({ title: "Exceção solicitada", description: "Aguardando aprovação." }); }}>Solicitar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
