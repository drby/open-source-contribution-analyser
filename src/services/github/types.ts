export interface Repository {
    name: string;
    description: string;
    language: string;
    license: {
      name: string;
    } | null;
    stargazers_count: number;
    subscribers_count: number;
  }

  export interface User {
    name: string | null;
    company: string | null;
    location: string | null;
  }

  export interface Contributor {
    login: string;
    id: number;
    avatar_url: string;
    contributions: number;
    name?: string | null;
    company?: string | null;
    location?: string | null;
  }
