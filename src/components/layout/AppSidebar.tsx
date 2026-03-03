import {
  LayoutDashboard, GitBranch, Rocket, Server, TestTube2, Shield, Activity,
  Plug, ListTodo, FileText, Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel,
  SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarHeader, useSidebar,
} from "@/components/ui/sidebar";

const navItems = [
  { title: "Meus Projetos", url: "/", icon: LayoutDashboard },
  { title: "Repositórios", url: "/repositorios", icon: GitBranch },
  { title: "Pipelines & Deploy", url: "/pipelines", icon: Rocket },
  { title: "Ambientes", url: "/ambientes", icon: Server },
  { title: "Testes & Qualidade", url: "/testes", icon: TestTube2 },
  { title: "Segurança", url: "/seguranca", icon: Shield },
  { title: "Observabilidade", url: "/observabilidade", icon: Activity },
  { title: "APIs & Integrações", url: "/apis", icon: Plug },
  { title: "Backlog & Demandas", url: "/backlog", icon: ListTodo },
  { title: "Documentação", url: "/documentacao", icon: FileText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      <SidebarHeader className="p-4">
        {!collapsed ? (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">XR</div>
            <div>
              <p className="text-sm font-semibold text-sidebar-foreground">XRSmart</p>
              <p className="text-[10px] text-muted-foreground">DevSecOps Platform</p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold text-sm">XR</div>
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={location.pathname === item.url}>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="flex items-center gap-3 text-sidebar-foreground hover:bg-sidebar-accent"
                      activeClassName="bg-sidebar-accent text-primary font-medium"
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
