export interface CareerOption {
  id: string;
  title: string;
  iconName: 'bar-chart' | 'code' | 'bot' | 'shield' | 'cloud';
  badge: string;
  difficulty: 'Beginner Friendly' | 'Intermediate' | 'Advanced';
  description: string;
  skills: string[];
  totalModules: number;
  estimatedMonths: string;
  accentColor: 'cyan' | 'purple' | 'emerald' | 'amber' | 'rose';
}

export const CAREER_OPTIONS_DATA: CareerOption[] = [
  {
    id: 'data-analyst',
    title: 'Data Analyst',
    iconName: 'bar-chart',
    badge: 'High Demand',
    difficulty: 'Beginner Friendly',
    description: 'Transform raw business data into actionable executive insights, dashboards, and automated SQL reports.',
    skills: ['Excel Analytics', 'SQL Querying', 'Statistics', 'Python & Pandas', 'Power BI Dashboards'],
    totalModules: 5,
    estimatedMonths: '3 - 4 Months',
    accentColor: 'cyan',
  },
  {
    id: 'web-developer',
    title: 'Full-Stack Web Developer',
    iconName: 'code',
    badge: 'Popular',
    difficulty: 'Beginner Friendly',
    description: 'Build modern responsive web applications using frontend React components, backend APIs, and databases.',
    skills: ['HTML5 & CSS3', 'JavaScript ES6+', 'React.js UI', 'Node.js & Express', 'PostgreSQL / Supabase'],
    totalModules: 5,
    estimatedMonths: '4 - 5 Months',
    accentColor: 'purple',
  },
  {
    id: 'ai-ml-engineer',
    title: 'AI & Machine Learning Engineer',
    iconName: 'bot',
    badge: 'Cutting Edge',
    difficulty: 'Intermediate',
    description: 'Design intelligent machine learning models, neural networks, and AI agent automation systems.',
    skills: ['Python Foundations', 'Data Preprocessing', 'Scikit-Learn', 'Deep Learning PyTorch', 'LLMs & AI Agents'],
    totalModules: 5,
    estimatedMonths: '5 - 6 Months',
    accentColor: 'emerald',
  },
  {
    id: 'cybersecurity-specialist',
    title: 'Cybersecurity Specialist',
    iconName: 'shield',
    badge: 'Critical Role',
    difficulty: 'Intermediate',
    description: 'Protect digital infrastructure, conduct vulnerability testing, and defend networks against cyber threats.',
    skills: ['Network Fundamentals', 'Linux SysAdmin', 'Ethical Hacking', 'SOC Monitoring', 'Cryptography'],
    totalModules: 5,
    estimatedMonths: '4 - 5 Months',
    accentColor: 'amber',
  },
  {
    id: 'cloud-devops-engineer',
    title: 'Cloud & DevOps Engineer',
    iconName: 'cloud',
    badge: 'High Salary',
    difficulty: 'Advanced',
    description: 'Automate cloud infrastructure deployments, containerize applications, and maintain CI/CD pipelines.',
    skills: ['AWS Cloud Architecture', 'Docker Containerization', 'Kubernetes Clusters', 'Terraform IaC', 'CI/CD Automation'],
    totalModules: 5,
    estimatedMonths: '5 - 6 Months',
    accentColor: 'rose',
  },
];

export function normalizeCareerId(rawId?: string | null): string {
  if (!rawId) return 'data-analyst';
  const clean = rawId.toLowerCase().trim();
  if (clean === 'full-stack-developer' || clean === 'web-developer' || clean === 'full-stack' || clean === 'web-dev') {
    return 'web-developer';
  }
  return clean;
}

