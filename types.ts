
export type ContractStatus = 'Ativo' | 'Expirando' | 'Expirado' | 'Pendente' | 'Draft' | 'Vencido';

export interface Stakeholder {
  id: string;
  name: string;
  role: string;
  avatar: string;
  email: string;
}

export interface Contract {
  id: string;
  title: string;
  vendor: string;
  value: number;
  status: ContractStatus;
  startDate: string;
  endDate: string;
  renewalDate: string;
  responsibleAgent: string;
  ref: string;
  customerEmail?: string;
  customerPhone?: string;
  description?: string;
  notificationDays: number;
  attachmentUrl?: string;
  autoRenewal: boolean;
  customMessage?: string;
}

export interface ContractHistory {
  id: string;
  contract_id: string;
  user_id: string;
  action: 'created' | 'updated' | 'deleted' | 'renewed';
  changes: any;
  created_at: string;
  user_name?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'warning' | 'info' | 'error' | 'success';
  date: Date;
  read: boolean;
  contractId?: string;
}

export type Page = 'login' | 'dashboard' | 'list' | 'create' | 'details' | 'edit' | 'settings';

export interface AppState {
  currentPage: Page;
  selectedContractId: string | null;
  contracts: Contract[];
  user: {
    name: string;
    role: string;
    avatar: string;
    email?: string;
  } | null;
}
