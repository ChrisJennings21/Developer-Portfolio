export interface Experience {
  date: string;
  title: string;
  company: string;
  description: string;
}

export const experiences: Experience[] = [
  {
    date: 'June 2023 — Present',
    title: 'Software Developer',
    company: 'Xerox',
    description: 'Developing and maintaining an enterprise SPA with Vue.js frontend and .NET backend. Leading projects for customers and designing new features. Utilizing Azure DevOps and CI/CD pipelines for deployment. Also maintaining legacy codebases in VB and .NET Framework 3.5.',
  },
  {
    date: 'May 2019 — April 2022',
    title: 'Full Stack Software Developer',
    company: 'IRLCA, Dublin',
    description: 'Spent 70% on Angular frontend development with TypeScript, HTML, and SCSS. Built C# backend with ASP.NET and MSSQL. Implemented OAuth 2.0 IAM with OKTA, electronic signature systems with secure key management, and designed AWS deployment architecture (EC2, VPC, Backup). Achieved highest probation review score and contributed to a project deployed at a major pharmaceutical company.',
  },
  {
    date: '2017 — 2021',
    title: 'BSc Computer Applications',
    company: 'Dublin City University',
    description: 'Graduated with 2:1 honours. Coursework included Operating Systems, Computer Architecture, Concurrent Programming, Software Engineering, Relational Database Design, Data Communication & Cryptography, AI & Machine Learning, and Cloud Computing with AWS.',
  },
];
