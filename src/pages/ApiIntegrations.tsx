import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { apiServices } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plug, Key, Play, ExternalLink } from "lucide-react";

export default function ApiIntegrations() {
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const [tokenDialog, setTokenDialog] = useState(false);
  const [sandboxDialog, setSandboxDialog] = useState(false);
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);

  const services = apiServices.filter(s => s.projectId === selectedProject?.id);

  const endpoints = [
    { method: "GET", path: "/api/v2/checkout", desc: "Listar checkouts" },
    { method: "POST", path: "/api/v2/checkout", desc: "Criar checkout" },
    { method: "GET", path: "/api/v2/checkout/:id", desc: "Detalhes do checkout" },
    { method: "DELETE", path: "/api/v2/checkout/:id", desc: "Cancelar checkout" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><Plug className="h-6 w-6" />APIs & Integrações</h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setTokenDialog(true)}><Key className="mr-1 h-4 w-4" />Gerar Token</Button>
          <Button size="sm" onClick={() => setSandboxDialog(true)}><Play className="mr-1 h-4 w-4" />Sandbox</Button>
        </div>
      </div>

      {services.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum serviço de API registrado para este projeto.</CardContent></Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {services.map(s => (
            <Card key={s.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm">{s.nome}</CardTitle>
                  <div className="flex gap-1">{s.versoes.map(v => <Badge key={v} variant="outline" className="text-xs">{v}</Badge>)}</div>
                </div>
                <p className="text-xs text-muted-foreground font-mono">{s.baseUrl}</p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3 text-center text-sm">
                  <div className="p-2 rounded-lg bg-muted/50"><p className="font-bold">{s.sla.latenciaMedia}ms</p><p className="text-[10px] text-muted-foreground">Latência</p></div>
                  <div className="p-2 rounded-lg bg-muted/50"><p className="font-bold">{s.sla.taxaErro}%</p><p className="text-[10px] text-muted-foreground">Erro</p></div>
                  <div className="p-2 rounded-lg bg-muted/50"><p className="font-bold">{(s.sla.volume / 1000).toFixed(0)}k</p><p className="text-[10px] text-muted-foreground">Req/dia</p></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {services.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-sm">Endpoints — OpenAPI</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader><TableRow><TableHead>Método</TableHead><TableHead>Path</TableHead><TableHead>Descrição</TableHead></TableRow></TableHeader>
              <TableBody>
                {endpoints.map((ep, i) => (
                  <TableRow key={i}>
                    <TableCell><Badge variant="outline" className={`text-xs font-mono ${ep.method === "GET" ? "text-success border-success/30" : ep.method === "POST" ? "text-primary border-primary/30" : ep.method === "DELETE" ? "text-destructive border-destructive/30" : ""}`}>{ep.method}</Badge></TableCell>
                    <TableCell className="font-mono text-sm">{ep.path}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{ep.desc}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      <Dialog open={tokenDialog} onOpenChange={(o) => { setTokenDialog(o); if (!o) setGeneratedToken(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Gerar Token OAuth</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Escopos</Label>
            <Select><SelectTrigger><SelectValue placeholder="Selecionar escopos" /></SelectTrigger>
              <SelectContent><SelectItem value="read">read</SelectItem><SelectItem value="write">read:write</SelectItem><SelectItem value="admin">admin</SelectItem></SelectContent>
            </Select>
            {generatedToken && (
              <div className="p-3 rounded-lg bg-muted font-mono text-xs break-all">{generatedToken}
                <p className="text-warning text-[10px] mt-2">⚠ Copie agora — não será exibido novamente.</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setGeneratedToken(`xrs_${Date.now()}_${Math.random().toString(36).slice(2, 18)}`)}>Gerar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sandboxDialog} onOpenChange={setSandboxDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>API Sandbox</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-2">
              <Select defaultValue="GET"><SelectTrigger className="w-24"><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="GET">GET</SelectItem><SelectItem value="POST">POST</SelectItem><SelectItem value="PUT">PUT</SelectItem><SelectItem value="DELETE">DELETE</SelectItem></SelectContent>
              </Select>
              <Input defaultValue="/api/v2/checkout" className="flex-1 font-mono text-sm" />
              <Button onClick={() => toast({ title: "Resposta", description: '{"status":"ok","data":[...]}' })}>Enviar</Button>
            </div>
            <div className="p-3 rounded-lg bg-muted font-mono text-xs min-h-[100px]">
              <span className="text-muted-foreground">// Resposta aparecerá aqui</span>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
