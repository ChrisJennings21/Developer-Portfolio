export interface Skill {
  name: string;
  percentage: number;
}

export interface SkillCategory {
  title: string;
  skills: Skill[];
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Frontend Development',
    skills: [
      { name: 'Angular / AngularJS', percentage: 90 },
      { name: 'Vue.js / React', percentage: 88 },
      { name: 'TypeScript / JavaScript', percentage: 92 },
      { name: 'HTML / CSS / SCSS', percentage: 95 },
    ],
  },
  {
    title: 'Backend Development',
    skills: [
      { name: 'C# / ASP.NET', percentage: 90 },
      { name: 'Node.js', percentage: 82 },
      { name: 'Python', percentage: 75 },
      { name: 'OAuth 2.0 / IAM', percentage: 85 },
    ],
  },
  {
    title: 'Database & Cloud',
    skills: [
      { name: 'MSSQL / MySQL', percentage: 88 },
      { name: 'Azure DevOps', percentage: 85 },
      { name: 'AWS (EC2, VPC)', percentage: 80 },
      { name: 'Git / CI/CD', percentage: 90 },
    ],
  },
];
