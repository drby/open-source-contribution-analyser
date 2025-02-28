import axios, { AxiosError, AxiosInstance } from 'axios';
import { Contributor, Repository, User } from './types/types';
import config from '../../config';

class GitHubApiService {
  private api: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: 'https://api.github.com',
      headers: {
        'Accept': 'application/vnd.github.v3+json',
      },
    });

    // Initialize with token from environment if available
    const envToken = config.github.token;
    if (envToken) {
      this.setToken(envToken);
    }

    // Add request interceptor to include token if available
    this.api.interceptors.request.use((config) => {
      if (this.token) {
        config.headers = config.headers || {};
        config.headers['Authorization'] = `token ${this.token}`;
      }
      return config;
    });
  }

  /**
   * Set the GitHub Personal Access Token
   */
  public setToken(token: string): void {
    this.token = token;
  }

  /**
   * Get the current rate limit status
   */
  public async getRateLimit(): Promise<{ limit: number; remaining: number; reset: Date }> {
    try {
      const response = await this.api.get('/rate_limit');
      const { rate } = response.data;

      return {
        limit: rate.limit,
        remaining: rate.remaining,
        reset: new Date(rate.reset * 1000),
      };
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get repository information
   */
  public async getRepository(owner: string, repo: string): Promise<Repository> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get repository contributors with pagination
   * Limits to the top 30 contributors
   */
  public async getContributors(owner: string, repo: string): Promise<Contributor[]> {
    try {
      const response = await this.api.get(`/repos/${owner}/${repo}/contributors`, {
        params: {
          per_page: 30,
        },
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Get detailed user information
   */
  public async getUserDetails(username: string): Promise<User> {
    try {
      const response = await this.api.get(`/users/${username}`);
      return {
        name: response.data.name,
        company: response.data.company,
        location: response.data.location,
      };
    } catch (error) {
      console.warn(`Error fetching details for user ${username}:`, error);
      return { name: null, company: null, location: null };
    }
  }

  /**
   * Get full contributor details
   */
  public async getContributorsWithDetails(owner: string, repo: string): Promise<Contributor[]> {
    try {
      const contributors = await this.getContributors(owner, repo);

      const contributorsWithDetails = await Promise.all(
        contributors.map(async (contributor) => {
          try {
            const userDetails = await this.getUserDetails(contributor.login);

            return {
              ...contributor,
              name: userDetails.name,
              company: userDetails.company,
              location: userDetails.location
            } as Contributor;
          } catch (error) {
            // If we can't get details for a specific user, still return the basic contributor info
            return contributor;
          }
        })
      );

      return contributorsWithDetails;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Make a direct GET request to the GitHub API
   */
  public async get(path: string, config?: any) {
    return this.api.get(path, config);
  }

  /**
   * Handle errors
   */
  private handleError(error: any): void {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 403 &&
          axiosError.response?.headers['x-ratelimit-remaining'] === '0') {
        throw new Error('GitHub API rate limit exceeded. Please try again later.');
      } else if (axiosError.response?.status === 404) {
        throw new Error('Repository not found. Please check the owner and repository name.');
      } else if (axiosError.response?.status === 401) {
        throw new Error('Invalid GitHub token. Please check your access token.');
      } else {
        throw new Error(`GitHub API error: ${axiosError.message}`);
      }
    } else {
      throw new Error(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

export const githubApi = new GitHubApiService();
