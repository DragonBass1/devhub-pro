import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { backlogItems, users } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { ListTodo, AlertTriangle } from "lucide-react";

export default function Backlog() {
  const { selectedProject } = useProject();
  const { toast } = useToast();
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const items = backlogItems.filter(b => b.projectId === selectedProject?.id);
  const filtered = statusFilter === "all" ? items : items.filter(b => b.status === statusFilter);

  const totalPts = items.reduce((s, i) => s + (i.estimativaPts || 0), 0);
  const donePts = items.filter(i => i.status === "Done").reduce((s, i) => s + (i.estimativaPts || 0), 0);
  const doingCount = items.filter(i => i.status === "Doing").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold flex items-center gap-2"><ListTodo className="h-6 w-6" />Backlog & Demandas</h1>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-32 h-9"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="ToDo">ToDo</SelectItem>
            <SelectItem value="Doing">Doing</SelectItem>
            <SelectItem value="Done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{items.length}</p><p className="text-xs text-muted-foreground">Total de Itens</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{doingCount}</p><p className="text-xs text-muted-foreground">Em Andamento</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{totalPts} pts</p><p className="text-xs text-muted-foreground">Esforço Total</p></CardContent></Card>
        <Card><CardContent className="pt-6 text-center"><p className="text-2xl font-bold">{totalPts > 0 ? Math.round((donePts / totalPts) * 100) : 0}%</p><p className="text-xs text-muted-foreground">Conclusão</p></CardContent></Card>
      </div>

      <Card>
        <CardContent className="pt-4">
          {filtered.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Nenhum item encontrado.</p>
          ) : (
            <Table>
              <TableHeader><TableRow><TableHead>Chave</TableHead><TableHead>Título</TableHead><TableHead>Tipo</TableHead><TableHead>Status</TableHead><TableHead>Responsável</TableHead><TableHead>Pontos</TableHead><TableHead>Sprint</TableHead><TableHead></TableHead></TableRow></TableHeader>
              <TableBody>
                {filtered.map(b => {
                  const assignee = users.find(u => u.id === b.assigneeId);
                  return (
                    <TableRow key={b.id}>
                      <TableCell className="font-mono text-xs text-primary">{b.chave}</TableCell>
                      <TableCell className="font-medium max-w-[250px] truncate">{b.titulo}</TableCell>
                      <TableCell><StatusBadge value={b.tipo} /></TableCell>
                      <TableCell><StatusBadge value={b.status} type="backlog" /></TableCell>
                      <TableCell className="text-sm">{assignee?.nome || "—"}</TableCell>
                      <TableCell className="text-sm">{b.estimativaPts || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{b.sprint || "—"}</TableCell>
                      <TableCell>
                        <Button size="sm" variant="ghost" className="text-xs" onClick={() => toast({ title: "Impedimento registrado", description: "Scrum Master notificado." })}>
                          <AlertTriangle className="mr-1 h-3 w-3" />Impedimento
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
