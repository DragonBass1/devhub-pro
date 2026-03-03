import { useState } from "react";
import { docs } from "@/data/mockData";
import { useProject } from "@/contexts/ProjectContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { FileText, Plus, BookOpen } from "lucide-react";
import { format } from "date-fns";

const categoriaLabels: Record<string, string> = {
  "PadrãoArquitetural": "Padrão Arquitetural",
  "Guideline": "Guideline",
  "Política": "Política",
  "Playbook": "Playbook",
  "Template": "Template",
};

export default function DocumentationPage() {
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const [createOpen, setCreateOpen] = useState(false);
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  const allDocs = docs.filter(d => !d.projectId || d.projectId === selectedProject?.id);
  const categories = Object.keys(categoriaLabels);
  const viewing = docs.find(d => d.id === viewDoc);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><BookOpen className="h-6 w-6" />Documentação</h1>
        <Button size="sm" onClick={() => setCreateOpen(true)}><Plus className="mr-1 h-4 w-4" />Novo Documento</Button>
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">Todos ({allDocs.length})</TabsTrigger>
          {categories.map(c => {
            const count = allDocs.filter(d => d.categoria === c).length;
            return count > 0 ? <TabsTrigger key={c} value={c}>{categoriaLabels[c]} ({count})</TabsTrigger> : null;
          })}
        </TabsList>
        {["all", ...categories].map(tab => (
          <TabsContent key={tab} value={tab}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {(tab === "all" ? allDocs : allDocs.filter(d => d.categoria === tab)).map(doc => (
                <Card key={doc.id} className="cursor-pointer hover:ring-1 hover:ring-primary/50 transition-all" onClick={() => setViewDoc(doc.id)}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm flex items-center gap-2"><FileText className="h-4 w-4" />{doc.titulo}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">v{doc.versao}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Badge variant="outline" className="text-xs mb-2">{categoriaLabels[doc.categoria]}</Badge>
                    <p className="text-xs text-muted-foreground">Atualizado: {format(new Date(doc.updatedAt), "dd/MM/yyyy")}</p>
                    {doc.projectId && <Badge className="mt-2 text-[10px] bg-primary/10 text-primary border-primary/20" variant="outline">Projeto vinculado</Badge>}
                  </CardContent>
                </Card>
              ))}
            </div>
            {allDocs.length === 0 && <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum documento encontrado.</CardContent></Card>}
          </TabsContent>
        ))}
      </Tabs>

      {/* View Doc */}
      <Dialog open={!!viewDoc} onOpenChange={() => setViewDoc(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-auto">
          {viewing && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">{viewing.titulo}<Badge variant="outline" className="text-xs">v{viewing.versao}</Badge></DialogTitle>
              </DialogHeader>
              <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap text-sm">{viewing.conteudo}</div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Doc */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Criar Documento</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <Label>Título</Label><Input placeholder="Título do documento" />
            <Label>Categoria</Label>
            <Select><SelectTrigger><SelectValue placeholder="Selecionar" /></SelectTrigger>
              <SelectContent>{categories.map(c => <SelectItem key={c} value={c}>{categoriaLabels[c]}</SelectItem>)}</SelectContent>
            </Select>
            <Label>Conteúdo (Markdown)</Label><Textarea placeholder="# Título&#10;&#10;Conteúdo..." rows={8} />
          </div>
          <DialogFooter><Button onClick={() => { setCreateOpen(false); toast({ title: "Documento criado!" }); }}>Criar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
