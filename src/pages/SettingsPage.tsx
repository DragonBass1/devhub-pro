import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Settings, Key, Bell, Plug, Plus, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [sshOpen, setSshOpen] = useState(false);
  const [sshKeys, setSshKeys] = useState([
    { id: "1", nome: "MacBook Pro", fingerprint: "SHA256:abc123...xyz789" },
  ]);

  const [notifs, setNotifs] = useState({
    pipelineFalhou: true,
    alertaCritico: true,
    vulnCritica: true,
    aprovacaoPendente: false,
  });

  const integrations = [
    { nome: "GitHub", conectado: true },
    { nome: "GitLab", conectado: false },
    { nome: "Jira", conectado: true },
    { nome: "Slack", conectado: false },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2"><Settings className="h-6 w-6" />Configurações</h1>

      <Tabs defaultValue="perfil">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="ssh">Chaves SSH</TabsTrigger>
          <TabsTrigger value="notificacoes">Notificações</TabsTrigger>
          <TabsTrigger value="integracoes">Integrações</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil">
          <Card>
            <CardHeader><CardTitle className="text-sm">Informações do Perfil</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2"><Label>Nome</Label><Input defaultValue={user?.nome} /></div>
                <div className="space-y-2"><Label>Email</Label><Input defaultValue={user?.email} disabled /></div>
              </div>
              <div className="space-y-2">
                <Label>Role</Label>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{user?.role}</Badge>
                  {!hasRole("Admin") && <span className="text-xs text-muted-foreground">Somente Admin pode alterar roles.</span>}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Squads</Label>
                <div className="flex gap-2">{user?.squads.map(s => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}</div>
              </div>
              <Button onClick={() => toast({ title: "Perfil atualizado!" })}>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ssh">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-sm">Chaves SSH</CardTitle>
              <Button size="sm" onClick={() => setSshOpen(true)}><Plus className="mr-1 h-4 w-4" />Adicionar</Button>
            </CardHeader>
            <CardContent>
              {sshKeys.length === 0 ? <p className="text-sm text-muted-foreground">Nenhuma chave SSH.</p> : (
                <div className="space-y-2">
                  {sshKeys.map(k => (
                    <div key={k.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-2"><Key className="h-4 w-4" /><span className="text-sm font-medium">{k.nome}</span><span className="font-mono text-xs text-muted-foreground">{k.fingerprint}</span></div>
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => { setSshKeys(sshKeys.filter(x => x.id !== k.id)); toast({ title: "Chave removida" }); }}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notificacoes">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Bell className="h-4 w-4" />Preferências de Notificação</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { key: "pipelineFalhou" as const, label: "Pipeline falhou" },
                { key: "alertaCritico" as const, label: "Novo alerta crítico" },
                { key: "vulnCritica" as const, label: "Vulnerabilidade crítica detectada" },
                { key: "aprovacaoPendente" as const, label: "Aprovação pendente" },
              ].map(n => (
                <div key={n.key} className="flex items-center justify-between">
                  <Label>{n.label}</Label>
                  <Switch checked={notifs[n.key]} onCheckedChange={(v) => setNotifs({ ...notifs, [n.key]: v })} />
                </div>
              ))}
              <Button onClick={() => toast({ title: "Preferências salvas!" })}>Salvar</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integracoes">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Plug className="h-4 w-4" />Integrações Pessoais</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {integrations.map(i => (
                <div key={i.nome} className="flex items-center justify-between p-3 rounded-lg border">
                  <span className="text-sm font-medium">{i.nome}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={`text-xs ${i.conectado ? "text-success border-success/30" : "text-muted-foreground"}`}>
                      {i.conectado ? "Conectado" : "Desconectado"}
                    </Badge>
                    <Switch defaultChecked={i.conectado} onCheckedChange={() => toast({ title: i.conectado ? `${i.nome} desconectado` : `${i.nome} conectado` })} />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={sshOpen} onOpenChange={setSshOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Adicionar Chave SSH</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Nome</Label><Input placeholder="Ex: MacBook Pro" />
            <Label>Chave Pública</Label><Textarea placeholder="ssh-rsa AAAA..." rows={4} />
          </div>
          <DialogFooter><Button onClick={() => { setSshOpen(false); setSshKeys([...sshKeys, { id: Date.now().toString(), nome: "Nova Chave", fingerprint: "SHA256:new..." }]); toast({ title: "Chave adicionada!" }); }}>Adicionar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
