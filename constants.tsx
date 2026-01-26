
import { Contract } from './types';

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: '1',
    title: 'Retenção de Serviços Jurídicos',
    vendor: 'Latham & Watkins',
    value: 120000,
    status: 'Expirado',
    startDate: '2022-01-01',
    endDate: '2024-01-01',
    renewalDate: '2024-01-01',
    responsibleAgent: 'Sarah J.',
    ref: '#CT-2024-001',
    notificationDays: 7,
    autoRenewal: false
  },
  {
    id: '2',
    title: 'Infraestrutura de Nuvem AWS',
    vendor: 'Amazon Web Services',
    value: 45000,
    status: 'Expirando',
    startDate: '2023-01-01',
    endDate: '2025-01-01',
    renewalDate: '2024-12-15',
    responsibleAgent: 'Sarah J.',
    ref: '#CT-2024-042',
    notificationDays: 15,
    autoRenewal: true
  },
  {
    id: '3',
    title: 'Auditoria de Cibersegurança',
    vendor: 'CrowdStrike',
    value: 25000,
    status: 'Ativo',
    startDate: '2024-01-15',
    endDate: '2025-01-15',
    renewalDate: '2025-01-01',
    responsibleAgent: 'João Silva',
    ref: '#CT-2024-088',
    notificationDays: 7,
    autoRenewal: false
  },
  {
    id: '4',
    title: 'Licença de Software RH',
    vendor: 'Workday',
    value: 85000,
    status: 'Pendente',
    startDate: '2024-06-01',
    endDate: '2026-06-01',
    renewalDate: '2026-05-01',
    responsibleAgent: 'Ana Admin',
    ref: '#CT-2024-105',
    notificationDays: 30,
    autoRenewal: true
  },
  {
    id: '5',
    title: 'Serviços de Marketing',
    vendor: 'Publicis Sapient',
    value: 60000,
    status: 'Ativo',
    startDate: '2024-03-01',
    endDate: '2025-03-01',
    renewalDate: '2025-02-01',
    responsibleAgent: 'Sarah J.',
    ref: '#CT-2024-200',
    notificationDays: 7,
    autoRenewal: false
  }
];

export const AVATARS = {
  admin: "https://lh3.googleusercontent.com/aida-public/AB6AXuBYQbJkCJHwtriBWwgjK9G7NOCF1Ql2-mo0aLKorVSqCIpSTYdYlDRlIRPVGXn5K6YjSslRiiv5-TyuWMzHymbVGSMB7q31NIKbVeUFS5_3NdocgE08MYJgOMxpEmQI1PRn27c5VwPjVNcs-qP9Cx5Sk4_cfZfxul7Rh8b7AOs2fIEcHv0yHVqkeiXEPIYhTkAMq3Telka10fepBYq5y1m3AMctioULEsZdaRYWmSjZWgQ4fvpg6zg_A-IZNMNgaCKhQ7i7s9y6aYZz",
  sarah: "https://lh3.googleusercontent.com/aida-public/AB6AXuDLdj54p9IpMkATlRdUR9Kz8qcs5vQVID3epOYsa-dVtCNcmRrn7gu8E4YleBpmQiCOKKHBSCZebLA6uYtUvCranCNWta8C0ilnvHt4iHf4conv9QTqsAHB4oKu14fxtWYHPM2yTiT0R0FkV3z8uCd4y9_o0fmB2G-lMKbsVVbpFVlYdLCHWTCF50A3JuUTe4aQiRPE7ownUlwYSYbVKer2jnvy_PtU0uvK-tVyVft0jDlpmfQIykR4PieCXHGJzgz1as1SCyb9Pb-f",
  john: "https://lh3.googleusercontent.com/aida-public/AB6AXuApIhTLJs_U5jJG57hC6KiJg02vZY6GW1upgHwo3V8H7xns8Up4Usk5w4Gon5HppiBBfHAhG0TYdFKn2nDIVQnkMQFK_f97WZ5WA-U6GYjP5LNizdq5PrWfZmPome7HzouUEoUPcmQLPjBN9L2AOtMfzqfpv68_y7W5t23LLv6mQvvCR2ObGorj3g3KzHBDqM3ecDl1MU1WAx0-_yGjThSJFY_QYI9MCeoiw_UVHhZm41knuGtxki806ePNYPxjXYAzP1eVvIvTDVzj"
};
export const DEFAULT_EMAIL_TEMPLATE = `Olá,

Este é um lembrete automático para informar que o contrato **{NOME_DO_CONTRATO}** está próximo do seu vencimento.

**Detalhes do contrato:**

* Responsável: {RESPONSAVEL}
* Data de início: {DATA_INICIO}
* Data de término: {DATA_FIM}

⚠️ **Atenção:**
O contrato vence em **{DIAS_RESTANTES} dias**. Recomendamos que as providências necessárias sejam avaliadas com antecedência, seja para renovação, encerramento ou ajustes contratuais.

Caso este contrato já tenha sido renovado ou encerrado, por favor, desconsidere esta mensagem.

Este é um e-mail automático enviado pelo sistema de controle de contratos.

Atenciosamente,

Controle inteligente de contratos`;
