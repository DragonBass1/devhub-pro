import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { projects, pullRequests, vulnerabilities, backlogItems, alerts } from "@/data/mockData";
import { useProject } from "@/contexts/ProjectContext";
import { GitBranch, Bug, AlertTriangle, ListTodo, LayoutDashboard } from "lucide-react";

export function GlobalSearch({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const navigate = useNavigate();
  const { setSelectedProject } = useProject();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) { e.preventDefault(); onOpenChange(true); }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [onOpenChange]);

  const go = (path: string, projectId?: string) => {
    if (projectId) {
      const p = projects.find(pr => pr.id === projectId);
      if (p) setSelectedProject(p);
    }
    navigate(path);
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Buscar..." />
      <CommandList>
        <CommandEmpty>Nenhum resultado encontrado.</CommandEmpty>
        <CommandGroup heading="Projetos">
          {projects.map(p => (
            <CommandItem key={p.id} onSelect={() => go("/", p.id)}>
              <LayoutDashboard className="mr-2 h-4 w-4" /> {p.nome}
              <span className="ml-auto text-xs text-muted-foreground">{p.tipo}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Pull Requests">
          {pullRequests.map(pr => (
            <CommandItem key={pr.id} onSelect={() => go("/repositorios")}>
              <GitBranch className="mr-2 h-4 w-4" /> {pr.titulo}
              <span className="ml-auto text-xs text-muted-foreground">{pr.status}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Vulnerabilidades">
          {vulnerabilities.filter(v => v.status !== "Resolvida").map(v => (
            <CommandItem key={v.id} onSelect={() => go("/seguranca", v.projectId)}>
              <Bug className="mr-2 h-4 w-4" /> {v.componente}
              <span className="ml-auto text-xs text-muted-foreground">{v.severidade}</span>
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Alertas">
          {alerts.filter(a => a.status === "Ativo").map(a => (
            <CommandItem key={a.id} onSelect={() => go("/observabilidade", a.projectId)}>
              <AlertTriangle className="mr-2 h-4 w-4" /> {a.titulo}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Backlog">
          {backlogItems.filter(b => b.status !== "Done").map(b => (
            <CommandItem key={b.id} onSelect={() => go("/backlog", b.projectId)}>
              <ListTodo className="mr-2 h-4 w-4" /> {b.chave}: {b.titulo}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
