import type {
  User, Project, Repo, Branch, PullRequest, PipelineRun, Deployment, Environment,
  Vulnerability, Alert, BacklogItem, Doc, ApiService, ObservabilityMetric, LogEntry, AccessRequest
} from "@/types";

export const users: User[] = [
  { id: "u1", nome: "Ana Silva", email: "ana@xrsmart.io", role: "Admin", squads: ["Squad Pagamentos", "Squad Portal"] },
  { id: "u2", nome: "Carlos Mendes", email: "carlos@xrsmart.io", role: "Tech Lead", squads: ["Squad Pagamentos"] },
  { id: "u3", nome: "Beatriz Costa", email: "beatriz@xrsmart.io", role: "Security Officer", squads: ["Squad Segurança"] },
  { id: "u4", nome: "Diego Oliveira", email: "diego@xrsmart.io", role: "Developer", squads: ["Squad Portal", "Squad Financeiro"] },
];

export const projects: Project[] = [
  { id: "p1", nome: "Checkout API", descricao: "API de checkout para e-commerce", criticidade: "Alta", prioridade: "P1", tipo: "API", statusBuild: "verde", coberturaTestes: 82, incidentesAtivos: 1, squads: ["Squad Pagamentos"], membros: ["u1", "u2", "u4"] },
  { id: "p2", nome: "Portal Frontend", descricao: "Portal do cliente em React", criticidade: "Média", prioridade: "P2", tipo: "Frontend", statusBuild: "amarelo", coberturaTestes: 68, incidentesAtivos: 0, squads: ["Squad Portal"], membros: ["u1", "u4"] },
  { id: "p3", nome: "Billing Batch", descricao: "Processamento batch de cobrança", criticidade: "Alta", prioridade: "P2", tipo: "Batch", statusBuild: "vermelho", coberturaTestes: 55, incidentesAtivos: 2, squads: ["Squad Financeiro"], membros: ["u1", "u2", "u3", "u4"] },
];

export const repos: Repo[] = [
  { id: "r1", projectId: "p1", provider: "GitHub", nome: "checkout-api", url: "https://github.com/xrsmart/checkout-api", estrategiaBranch: "GitFlow", protecaoBranch: { minApprovals: 2, requireCI: true, requireSAST: true } },
  { id: "r2", projectId: "p2", provider: "GitLab", nome: "portal-frontend", url: "https://gitlab.com/xrsmart/portal-frontend", estrategiaBranch: "Trunk", protecaoBranch: { minApprovals: 1, requireCI: true, requireSAST: false } },
  { id: "r3", projectId: "p3", provider: "GitHub", nome: "billing-batch", url: "https://github.com/xrsmart/billing-batch", estrategiaBranch: "GitFlow", protecaoBranch: { minApprovals: 2, requireCI: true, requireSAST: true } },
];

export const branches: Branch[] = [
  { id: "b1", repoId: "r1", nome: "main", protegida: true },
  { id: "b2", repoId: "r1", nome: "develop", protegida: true },
  { id: "b3", repoId: "r1", nome: "feature/checkout-v2", protegida: false },
  { id: "b4", repoId: "r2", nome: "main", protegida: true },
  { id: "b5", repoId: "r2", nome: "feature/new-dashboard", protegida: false },
  { id: "b6", repoId: "r3", nome: "main", protegida: true },
  { id: "b7", repoId: "r3", nome: "develop", protegida: true },
  { id: "b8", repoId: "r3", nome: "hotfix/billing-fix", protegida: false },
];

export const pullRequests: PullRequest[] = [
  { id: "pr1", repoId: "r1", titulo: "feat: implementar pagamento PIX", autorId: "u4", reviewers: ["u2"], status: "Aberto", checksCI: true, checksSAST: true, createdAt: "2026-03-02T14:00:00Z" },
  { id: "pr2", repoId: "r1", titulo: "fix: timeout no gateway de pagamento", autorId: "u2", reviewers: ["u4"], status: "Merged", checksCI: true, checksSAST: true, createdAt: "2026-03-01T09:00:00Z" },
  { id: "pr3", repoId: "r2", titulo: "feat: novo dashboard de métricas", autorId: "u4", reviewers: ["u1"], status: "Aberto", checksCI: true, checksSAST: false, createdAt: "2026-03-02T16:00:00Z" },
  { id: "pr4", repoId: "r3", titulo: "fix: correção no cálculo de juros", autorId: "u2", reviewers: ["u3"], status: "Aberto", checksCI: false, checksSAST: false, createdAt: "2026-03-03T08:00:00Z" },
];

export const pipelineRuns: PipelineRun[] = [
  { id: "pl1", projectId: "p1", gatilho: "Merge", status: "Sucesso", etapas: [{ nome: "Build", status: "Sucesso", duracao: 45 }, { nome: "Test", status: "Sucesso", duracao: 120 }, { nome: "SAST", status: "Sucesso", duracao: 30 }, { nome: "Deploy", status: "Sucesso", duracao: 60 }], startedAt: "2026-03-02T10:00:00Z", duration: 255, artifacts: ["checkout-api-1.4.2.jar"] },
  { id: "pl2", projectId: "p1", gatilho: "Commit", status: "Sucesso", etapas: [{ nome: "Build", status: "Sucesso", duracao: 42 }, { nome: "Test", status: "Sucesso", duracao: 115 }, { nome: "SAST", status: "Sucesso", duracao: 28 }], startedAt: "2026-03-01T15:00:00Z", duration: 185, artifacts: [] },
  { id: "pl3", projectId: "p1", gatilho: "Manual", status: "Falha", etapas: [{ nome: "Build", status: "Sucesso", duracao: 40 }, { nome: "Test", status: "Falha", duracao: 90 }], startedAt: "2026-02-28T12:00:00Z", duration: 130, artifacts: [] },
  { id: "pl4", projectId: "p2", gatilho: "Commit", status: "EmExecução", etapas: [{ nome: "Build", status: "Sucesso", duracao: 30 }, { nome: "Test", status: "EmExecução", duracao: 0 }, { nome: "Lint", status: "Cancelado", duracao: 0 }], startedAt: "2026-03-03T07:00:00Z", duration: 30, artifacts: [] },
  { id: "pl5", projectId: "p2", gatilho: "Merge", status: "Sucesso", etapas: [{ nome: "Build", status: "Sucesso", duracao: 25 }, { nome: "Test", status: "Sucesso", duracao: 60 }, { nome: "Lint", status: "Sucesso", duracao: 10 }], startedAt: "2026-03-01T11:00:00Z", duration: 95, artifacts: ["portal-frontend-2.1.0.zip"] },
  { id: "pl6", projectId: "p3", gatilho: "Commit", status: "Falha", etapas: [{ nome: "Build", status: "Falha", duracao: 15 }], startedAt: "2026-03-03T06:00:00Z", duration: 15, artifacts: [] },
  { id: "pl7", projectId: "p3", gatilho: "Manual", status: "Sucesso", etapas: [{ nome: "Build", status: "Sucesso", duracao: 50 }, { nome: "Test", status: "Sucesso", duracao: 200 }, { nome: "SAST", status: "Sucesso", duracao: 45 }, { nome: "Deploy", status: "Sucesso", duracao: 30 }], startedAt: "2026-02-27T09:00:00Z", duration: 325, artifacts: ["billing-batch-3.0.1.jar"] },
];

export const deployments: Deployment[] = [
  { id: "d1", projectId: "p1", ambiente: "Prod", versao: "1.4.2", status: "Sucesso", aprovadoPor: "u2", startedAt: "2026-03-02T11:00:00Z", endedAt: "2026-03-02T11:05:00Z" },
  { id: "d2", projectId: "p1", ambiente: "Staging", versao: "1.4.3-rc.1", status: "Sucesso", startedAt: "2026-03-02T09:00:00Z", endedAt: "2026-03-02T09:03:00Z" },
  { id: "d3", projectId: "p1", ambiente: "Dev", versao: "1.5.0-dev", status: "Sucesso", startedAt: "2026-03-03T07:00:00Z", endedAt: "2026-03-03T07:02:00Z" },
  { id: "d4", projectId: "p2", ambiente: "QA", versao: "2.1.0", status: "Sucesso", startedAt: "2026-03-01T12:00:00Z", endedAt: "2026-03-01T12:04:00Z" },
  { id: "d5", projectId: "p2", ambiente: "Dev", versao: "2.2.0-dev", status: "EmAndamento", startedAt: "2026-03-03T07:30:00Z" },
  { id: "d6", projectId: "p3", ambiente: "Prod", versao: "3.0.0", status: "Falha", aprovadoPor: "u2", startedAt: "2026-03-02T20:00:00Z", endedAt: "2026-03-02T20:10:00Z" },
  { id: "d7", projectId: "p3", ambiente: "Prod", versao: "2.9.5", status: "Rollback", aprovadoPor: "u1", startedAt: "2026-03-02T20:15:00Z", endedAt: "2026-03-02T20:18:00Z" },
];

export const environments: Environment[] = [
  { id: "e1", projectId: "p1", nome: "Dev", tipo: "Compartilhado", statusDisponibilidade: "Online", cpu: 25, mem: 40, storage: 30, custoEstimado: 150 },
  { id: "e2", projectId: "p1", nome: "QA", tipo: "Compartilhado", statusDisponibilidade: "Online", cpu: 15, mem: 30, storage: 25, custoEstimado: 120 },
  { id: "e3", projectId: "p1", nome: "Staging", tipo: "Restrito", statusDisponibilidade: "Online", cpu: 35, mem: 50, storage: 40, custoEstimado: 300 },
  { id: "e4", projectId: "p1", nome: "Prod", tipo: "Restrito", statusDisponibilidade: "Online", cpu: 60, mem: 72, storage: 55, custoEstimado: 1200 },
  { id: "e5", projectId: "p2", nome: "Dev", tipo: "Compartilhado", statusDisponibilidade: "Online", cpu: 10, mem: 20, storage: 15, custoEstimado: 80 },
  { id: "e6", projectId: "p2", nome: "QA", tipo: "Compartilhado", statusDisponibilidade: "Degradado", cpu: 45, mem: 60, storage: 35, custoEstimado: 100 },
  { id: "e7", projectId: "p2", nome: "Staging", tipo: "Restrito", statusDisponibilidade: "Online", cpu: 20, mem: 35, storage: 20, custoEstimado: 200 },
  { id: "e8", projectId: "p2", nome: "Prod", tipo: "Restrito", statusDisponibilidade: "Online", cpu: 40, mem: 55, storage: 45, custoEstimado: 800 },
  { id: "e9", projectId: "p3", nome: "Dev", tipo: "Compartilhado", statusDisponibilidade: "Online", cpu: 30, mem: 45, storage: 50, custoEstimado: 200 },
  { id: "e10", projectId: "p3", nome: "Prod", tipo: "Restrito", statusDisponibilidade: "Offline", cpu: 90, mem: 88, storage: 70, custoEstimado: 1500 },
  { id: "e11", projectId: "p1", nome: "Efêmero", tipo: "Efêmero", statusDisponibilidade: "Online", cpu: 5, mem: 10, storage: 5, custoEstimado: 20, expiresAt: "2026-03-05T00:00:00Z" },
];

export const vulnerabilities: Vulnerability[] = [
  { id: "v1", projectId: "p1", origem: "Dependência", severidade: "Alta", componente: "log4j-core:2.14.1", cve: "CVE-2021-44228", status: "EmCorreção", detectedAt: "2026-02-20T10:00:00Z" },
  { id: "v2", projectId: "p1", origem: "SAST", severidade: "Média", componente: "PaymentController.java", status: "Aberta", detectedAt: "2026-03-01T14:00:00Z" },
  { id: "v3", projectId: "p2", origem: "DAST", severidade: "Baixa", componente: "/api/user/profile", status: "Resolvida", detectedAt: "2026-02-15T09:00:00Z" },
  { id: "v4", projectId: "p3", origem: "Dependência", severidade: "Crítica", componente: "spring-boot:2.5.0", cve: "CVE-2022-22965", status: "Aberta", detectedAt: "2026-03-02T08:00:00Z" },
  { id: "v5", projectId: "p3", origem: "SAST", severidade: "Alta", componente: "BillingService.java", status: "Aberta", detectedAt: "2026-03-01T11:00:00Z" },
  { id: "v6", projectId: "p3", origem: "DAST", severidade: "Média", componente: "/api/billing/process", status: "AceitaExceção", detectedAt: "2026-02-10T15:00:00Z" },
];

export const alerts: Alert[] = [
  { id: "a1", projectId: "p1", severidade: "Alto", titulo: "Latência acima de 500ms no /checkout", status: "Ativo", createdAt: "2026-03-03T06:30:00Z" },
  { id: "a2", projectId: "p3", severidade: "Crítico", titulo: "Falha no processamento batch — 15% de erro", status: "Ativo", createdAt: "2026-03-02T22:00:00Z" },
  { id: "a3", projectId: "p3", severidade: "Alto", titulo: "CPU acima de 90% em Prod", status: "Ativo", createdAt: "2026-03-02T21:00:00Z" },
  { id: "a4", projectId: "p2", severidade: "Médio", titulo: "Taxa de erro 5xx acima de 1%", status: "Silenciado", createdAt: "2026-03-01T18:00:00Z" },
  { id: "a5", projectId: "p1", severidade: "Baixo", titulo: "Certificado SSL expira em 30 dias", status: "Resolvido", createdAt: "2026-02-25T10:00:00Z" },
];

export const backlogItems: BacklogItem[] = [
  { id: "bi1", projectId: "p1", chave: "CHK-101", titulo: "Implementar pagamento via PIX", tipo: "Story", status: "Doing", assigneeId: "u4", estimativaPts: 8, sprint: "Sprint 14", updatedAt: "2026-03-02T10:00:00Z" },
  { id: "bi2", projectId: "p1", chave: "CHK-102", titulo: "Corrigir timeout no gateway", tipo: "Bug", status: "Done", assigneeId: "u2", estimativaPts: 3, sprint: "Sprint 14", updatedAt: "2026-03-01T16:00:00Z" },
  { id: "bi3", projectId: "p1", chave: "CHK-103", titulo: "Adicionar retry automático", tipo: "Task", status: "ToDo", estimativaPts: 5, sprint: "Sprint 15", updatedAt: "2026-03-03T08:00:00Z" },
  { id: "bi4", projectId: "p2", chave: "PTL-201", titulo: "Novo dashboard de métricas", tipo: "Story", status: "Doing", assigneeId: "u4", estimativaPts: 13, sprint: "Sprint 8", updatedAt: "2026-03-02T14:00:00Z" },
  { id: "bi5", projectId: "p2", chave: "PTL-202", titulo: "Corrigir layout mobile", tipo: "Bug", status: "ToDo", estimativaPts: 3, sprint: "Sprint 8", updatedAt: "2026-03-01T09:00:00Z" },
  { id: "bi6", projectId: "p3", chave: "BIL-301", titulo: "Refatorar módulo de cálculo", tipo: "Task", status: "Doing", assigneeId: "u2", estimativaPts: 13, sprint: "Sprint 22", updatedAt: "2026-03-02T11:00:00Z" },
  { id: "bi7", projectId: "p3", chave: "BIL-302", titulo: "Implementar notificação de falha", tipo: "Story", status: "ToDo", estimativaPts: 5, sprint: "Sprint 22", updatedAt: "2026-03-03T07:00:00Z" },
  { id: "bi8", projectId: "p3", chave: "BIL-303", titulo: "Corrigir cálculo de juros compostos", tipo: "Bug", status: "ToDo", estimativaPts: 8, sprint: "Sprint 22", updatedAt: "2026-03-03T08:00:00Z" },
];

export const docs: Doc[] = [
  { id: "doc1", categoria: "PadrãoArquitetural", titulo: "Arquitetura de Microsserviços", conteudo: "# Padrão de Microsserviços\n\nEste documento descreve o padrão arquitetural adotado para microsserviços na XRSmart...", versao: "2.1", updatedAt: "2026-02-15T10:00:00Z" },
  { id: "doc2", categoria: "Guideline", titulo: "Guia de Code Review", conteudo: "# Code Review Guidelines\n\n## Regras\n- Mínimo 2 aprovações\n- CI verde obrigatório...", versao: "1.3", updatedAt: "2026-01-20T14:00:00Z" },
  { id: "doc3", projectId: "p1", categoria: "Playbook", titulo: "Playbook de Incidentes — Checkout", conteudo: "# Playbook de Incidentes\n\n## Severidade 1\n1. Acionar time de plantão...", versao: "1.0", updatedAt: "2026-03-01T09:00:00Z" },
  { id: "doc4", categoria: "Política", titulo: "Política de Segurança", conteudo: "# Política de Segurança\n\nToda vulnerabilidade crítica deve ser corrigida em até 48h...", versao: "3.0", updatedAt: "2026-02-01T11:00:00Z" },
  { id: "doc5", categoria: "Template", titulo: "Template de ADR", conteudo: "# ADR-NNN: [Título]\n\n## Status\nProposto\n\n## Contexto\n...\n\n## Decisão\n...", versao: "1.0", updatedAt: "2026-01-10T08:00:00Z" },
];

export const apiServices: ApiService[] = [
  { id: "api1", projectId: "p1", nome: "Checkout Service", baseUrl: "https://api.xrsmart.io/checkout", versoes: ["v1", "v2"], sla: { latenciaMedia: 120, taxaErro: 0.5, volume: 15000 } },
  { id: "api2", projectId: "p1", nome: "Payment Gateway", baseUrl: "https://api.xrsmart.io/payments", versoes: ["v1"], sla: { latenciaMedia: 200, taxaErro: 1.2, volume: 8000 } },
  { id: "api3", projectId: "p3", nome: "Billing Processor", baseUrl: "https://api.xrsmart.io/billing", versoes: ["v1", "v2", "v3"], sla: { latenciaMedia: 350, taxaErro: 2.5, volume: 5000 } },
];

export const observabilityMetrics: ObservabilityMetric[] = Array.from({ length: 24 }, (_, i) => ({
  id: `om${i}`, projectId: "p1", ambiente: "Prod" as const,
  latenciaMs: 100 + Math.sin(i / 3) * 50 + Math.random() * 20,
  throughputRps: 200 + Math.cos(i / 4) * 80 + Math.random() * 30,
  cpu: 40 + Math.sin(i / 2) * 20 + Math.random() * 5,
  mem: 55 + Math.cos(i / 3) * 15 + Math.random() * 5,
  timestamp: new Date(2026, 2, 3, i).toISOString(),
}));

export const logEntries: LogEntry[] = [
  { id: "l1", projectId: "p1", ambiente: "Prod", level: "ERROR", mensagem: "Timeout ao conectar com gateway de pagamento — retries esgotados", traceId: "trace-001", timestamp: "2026-03-03T06:28:00Z" },
  { id: "l2", projectId: "p1", ambiente: "Prod", level: "WARN", mensagem: "Latência acima do threshold (520ms) no endpoint /checkout", traceId: "trace-002", timestamp: "2026-03-03T06:29:00Z" },
  { id: "l3", projectId: "p1", ambiente: "Prod", level: "INFO", mensagem: "Deploy v1.4.2 concluído com sucesso", timestamp: "2026-03-02T11:05:00Z" },
  { id: "l4", projectId: "p3", ambiente: "Prod", level: "ERROR", mensagem: "NullPointerException em BillingService.processInvoice()", traceId: "trace-003", timestamp: "2026-03-02T22:01:00Z" },
  { id: "l5", projectId: "p3", ambiente: "Prod", level: "ERROR", mensagem: "Falha ao processar lote 4521 — 342 registros com erro", traceId: "trace-004", timestamp: "2026-03-02T22:05:00Z" },
  { id: "l6", projectId: "p2", ambiente: "QA", level: "WARN", mensagem: "Memória heap acima de 80% — possível memory leak", timestamp: "2026-03-03T05:00:00Z" },
  { id: "l7", projectId: "p1", ambiente: "Dev", level: "DEBUG", mensagem: "Request recebida: POST /api/checkout {orderId: 12345}", traceId: "trace-005", timestamp: "2026-03-03T07:10:00Z" },
  { id: "l8", projectId: "p2", ambiente: "Dev", level: "INFO", mensagem: "Build frontend concluído em 25s", timestamp: "2026-03-03T07:05:00Z" },
];

export const accessRequests: AccessRequest[] = [
  { id: "ar1", userId: "u4", projectId: "p3", tipo: "Projeto", alvo: "Billing Batch", justificativa: "Preciso acessar para corrigir bug crítico no cálculo", status: "Pendente", createdAt: "2026-03-03T08:00:00Z" },
  { id: "ar2", userId: "u4", projectId: "p1", tipo: "Ambiente", alvo: "Prod", justificativa: "Necessário para debug de incidente em produção", status: "Aprovado", aprovadorId: "u2", createdAt: "2026-03-01T10:00:00Z" },
];
