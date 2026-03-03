export type UserRole = 'Developer' | 'Tech Lead' | 'Security Officer' | 'Admin';
export type Criticidade = 'Baixa' | 'Média' | 'Alta';
export type Prioridade = 'P1' | 'P2' | 'P3' | 'P4';
export type ProjectType = 'API' | 'Microsserviço' | 'Frontend' | 'Batch' | 'Outro';
export type BuildStatus = 'verde' | 'amarelo' | 'vermelho';
export type PipelineStatus = 'Sucesso' | 'Falha' | 'EmExecução' | 'Cancelado';
export type AmbienteNome = 'Dev' | 'QA' | 'Staging' | 'Prod' | 'Efêmero';
export type AmbienteTipo = 'Compartilhado' | 'Restrito' | 'Efêmero';
export type VulnOrigem = 'SAST' | 'DAST' | 'Dependência';
export type Severidade = 'Crítica' | 'Alta' | 'Média' | 'Baixa';
export type VulnStatus = 'Aberta' | 'EmCorreção' | 'Resolvida' | 'AceitaExceção';
export type BacklogTipo = 'Story' | 'Bug' | 'Task';
export type BacklogStatus = 'ToDo' | 'Doing' | 'Done';
export type DocCategoria = 'PadrãoArquitetural' | 'Guideline' | 'Política' | 'Playbook' | 'Template';
export type AlertSeveridade = 'Crítico' | 'Alto' | 'Médio' | 'Baixo';
export type AlertStatus = 'Ativo' | 'Silenciado' | 'Resolvido';
export type AccessRequestStatus = 'Pendente' | 'Aprovado' | 'Negado';

export interface User {
  id: string; nome: string; email: string; role: UserRole; squads: string[]; avatar?: string;
}
export interface Project {
  id: string; nome: string; descricao: string; criticidade: Criticidade; prioridade: Prioridade;
  tipo: ProjectType; statusBuild: BuildStatus; coberturaTestes: number; incidentesAtivos: number;
  squads: string[]; membros: string[];
}
export interface Repo {
  id: string; projectId: string; provider: 'GitHub' | 'GitLab'; nome: string; url: string;
  estrategiaBranch: 'GitFlow' | 'Trunk'; protecaoBranch: { minApprovals: number; requireCI: boolean; requireSAST: boolean };
}
export interface Branch { id: string; repoId: string; nome: string; protegida: boolean; }
export interface PullRequest {
  id: string; repoId: string; titulo: string; autorId: string; reviewers: string[];
  status: 'Aberto' | 'Merged' | 'Fechado'; checksCI: boolean; checksSAST: boolean; createdAt: string;
}
export interface PipelineRun {
  id: string; projectId: string; gatilho: 'Commit' | 'Merge' | 'Manual';
  status: PipelineStatus; etapas: { nome: string; status: PipelineStatus; duracao: number }[];
  startedAt: string; duration: number; artifacts: string[];
}
export interface Deployment {
  id: string; projectId: string; ambiente: AmbienteNome; versao: string;
  status: 'Sucesso' | 'Falha' | 'EmAndamento' | 'Rollback'; aprovadoPor?: string;
  startedAt: string; endedAt?: string;
}
export interface Environment {
  id: string; projectId: string; nome: AmbienteNome; tipo: AmbienteTipo;
  statusDisponibilidade: 'Online' | 'Degradado' | 'Offline'; cpu: number; mem: number; storage: number;
  custoEstimado: number; iacRepoRef?: string; expiresAt?: string;
}
export interface Vulnerability {
  id: string; projectId: string; origem: VulnOrigem; severidade: Severidade;
  componente: string; cve?: string; status: VulnStatus; detectedAt: string;
}
export interface Alert {
  id: string; projectId: string; severidade: AlertSeveridade; titulo: string;
  status: AlertStatus; createdAt: string;
}
export interface BacklogItem {
  id: string; projectId: string; chave: string; titulo: string; tipo: BacklogTipo;
  status: BacklogStatus; assigneeId?: string; estimativaPts?: number; sprint?: string; updatedAt: string;
}
export interface Doc {
  id: string; projectId?: string; categoria: DocCategoria; titulo: string;
  conteudo: string; versao: string; updatedAt: string;
}
export interface ApiService {
  id: string; projectId: string; nome: string; baseUrl: string; versoes: string[];
  sla: { latenciaMedia: number; taxaErro: number; volume: number };
}
export interface ObservabilityMetric {
  id: string; projectId: string; ambiente: AmbienteNome; latenciaMs: number;
  throughputRps: number; cpu: number; mem: number; timestamp: string;
}
export interface LogEntry {
  id: string; projectId: string; ambiente: AmbienteNome; level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  mensagem: string; traceId?: string; timestamp: string;
}
export interface AccessRequest {
  id: string; userId: string; projectId: string; tipo: 'Projeto' | 'Ambiente' | 'ExceçãoSegurança';
  alvo: string; justificativa: string; status: AccessRequestStatus; aprovadorId?: string; createdAt: string;
}
