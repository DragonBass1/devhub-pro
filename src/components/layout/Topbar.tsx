import { Search, Sun, Moon, LogOut, ChevronDown } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DotIndicator } from "@/components/StatusBadge";
import { useState } from "react";
import { GlobalSearch } from "@/components/GlobalSearch";

export function Topbar() {
  const { user, logout } = useAuth();
  const { selectedProject, setSelectedProject, projects } = useProject();
  const { theme, setTheme } = useTheme();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background/80 backdrop-blur-sm px-4">
        <SidebarTrigger className="shrink-0" />

        <Select value={selectedProject?.id || ""} onValueChange={(v) => setSelectedProject(projects.find(p => p.id === v) || null)}>
          <SelectTrigger className="w-[220px] h-9 text-sm">
            <SelectValue placeholder="Selecionar projeto">
              {selectedProject && (
                <span className="flex items-center gap-2">
                  <DotIndicator status={selectedProject.statusBuild} />
                  {selectedProject.nome}
                </span>
              )}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {projects.map(p => (
              <SelectItem key={p.id} value={p.id}>
                <span className="flex items-center gap-2">
                  <DotIndicator status={p.statusBuild} />
                  {p.nome}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar projetos, PRs, incidentes... (⌘K)"
            className="pl-9 h-9 bg-muted/50 border-0 focus-visible:ring-1"
            onFocus={() => setSearchOpen(true)}
            readOnly
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {user && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-9 gap-2 px-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-primary text-xs font-bold">
                    {user.nome.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-medium leading-none">{user.nome}</p>
                    <p className="text-[10px] text-muted-foreground">{user.role}</p>
                  </div>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="text-xs text-muted-foreground" disabled>{user.email}</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" /> Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </header>
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}
