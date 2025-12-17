export interface Project {
  number: string;
  title: string;
  description: string;
  tech: string[];
}

export const projects: Project[] = [
  {
    number: '01',
    title: 'Enterprise SPA Platform',
    description: 'Full-stack enterprise single page application at Xerox. Leading feature design and customer projects with Vue.js frontend and .NET backend. Implemented CI/CD pipelines with Azure DevOps.',
    tech: ['Vue.js', '.NET', 'Azure DevOps', 'MSSQL'],
  },
  {
    number: '02',
    title: 'Pharmaceutical Compliance System',
    description: 'High-level industry regulation-compliant web application deployed at a major pharmaceutical company. Built with Angular frontend, ASP.NET backend, and comprehensive test coverage using Karma.',
    tech: ['Angular', 'ASP.NET', 'MSSQL', 'Karma'],
  },
  {
    number: '03',
    title: 'OAuth 2.0 Identity System',
    description: 'Implemented enterprise OAuth 2.0 identity and access management using OKTA and third-party identity services. Included electronic signature system with secure key management.',
    tech: ['OAuth 2.0', 'OKTA', 'C#', 'Cryptography'],
  },
  {
    number: '04',
    title: 'Soccer Event Detection AI',
    description: 'Developed and trained a machine learning model for event detection in soccer video. Created a web platform where videos can be uploaded and processed to generate highlight reels.',
    tech: ['Python', 'TensorFlow', 'Angular', 'Node.js'],
  },
];
