import { useProject } from "@/contexts/ProjectContext";
import { repos, branches, pullRequests } from "@/data/mockData";
import { users } from "@/data/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { StatusBadge } from "@/components/StatusBadge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GitBranch, GitPullRequest, Lock, ExternalLink, CheckCircle2, XCircle } from "lucide-react";
import { format } from "date-fns";

export default function Repositories() {
  const { selectedProject } = useProject();
  const projRepos = repos.filter(r => r.projectId === selectedProject?.id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Repositórios</h1>
        <Button size="sm"><GitBranch className="mr-1 h-4 w-4" />Criar Repositório</Button>
      </div>

      {projRepos.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-muted-foreground">Nenhum repositório encontrado para este projeto.</CardContent></Card>
      ) : (
        projRepos.map(repo => {
          const repoBranches = branches.filter(b => b.repoId === repo.id);
          const repoPRs = pullRequests.filter(pr => pr.repoId === repo.id);
          return (
            <Card key={repo.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base flex items-center gap-2">
                    <GitBranch className="h-4 w-4" />
                    {repo.nome}
                    <Badge variant="outline" className="text-xs">{repo.provider}</Badge>
                    <Badge variant="outline" className="text-xs">{repo.estrategiaBranch}</Badge>
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <a href={repo.url} target="_blank" rel="noreferrer"><ExternalLink className="h-4 w-4" /></a>
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Proteção: {repo.protecaoBranch.minApprovals} aprovação(ões) · CI: {repo.protecaoBranch.requireCI ? "✓" : "✗"} · SAST: {repo.protecaoBranch.requireSAST ? "✓" : "✗"}
                </p>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="branches">
                  <TabsList><TabsTrigger value="branches">Branches ({repoBranches.length})</TabsTrigger><TabsTrigger value="prs">Pull Requests ({repoPRs.length})</TabsTrigger></TabsList>
                  <TabsContent value="branches">
                    <Table>
                      <TableHeader><TableRow><TableHead>Branch</TableHead><TableHead>Protegida</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {repoBranches.map(b => (
                          <TableRow key={b.id}>
                            <TableCell className="font-mono text-sm">{b.nome}</TableCell>
                            <TableCell>{b.protegida ? <Lock className="h-4 w-4 text-warning" /> : <span className="text-muted-foreground text-xs">—</span>}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                  <TabsContent value="prs">
                    <Table>
                      <TableHeader><TableRow><TableHead>Título</TableHead><TableHead>Autor</TableHead><TableHead>Status</TableHead><TableHead>CI</TableHead><TableHead>SAST</TableHead><TableHead>Data</TableHead><TableHead></TableHead></TableRow></TableHeader>
                      <TableBody>
                        {repoPRs.map(pr => {
                          const autor = users.find(u => u.id === pr.autorId);
                          const canMerge = pr.checksCI && (pr.checksSAST || !repos.find(r => r.id === pr.repoId)?.protecaoBranch.requireSAST);
                          return (
                            <TableRow key={pr.id}>
                              <TableCell className="font-medium max-w-[250px] truncate"><GitPullRequest className="inline h-4 w-4 mr-1" />{pr.titulo}</TableCell>
                              <TableCell className="text-sm">{autor?.nome}</TableCell>
                              <TableCell><StatusBadge value={pr.status} type="pipeline" /></TableCell>
                              <TableCell>{pr.checksCI ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}</TableCell>
                              <TableCell>{pr.checksSAST ? <CheckCircle2 className="h-4 w-4 text-success" /> : <XCircle className="h-4 w-4 text-destructive" />}</TableCell>
                              <TableCell className="text-xs text-muted-foreground">{format(new Date(pr.createdAt), "dd/MM HH:mm")}</TableCell>
                              <TableCell>
                                {pr.status === "Aberto" && (
                                  <Button size="sm" variant="outline" disabled={!canMerge}>
                                    {canMerge ? "Merge" : "Checks pendentes"}
                                  </Button>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
