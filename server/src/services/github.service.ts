import axios from 'axios';

const GITHUB_API_URL = 'https://api.github.com';

const createGithubClient = (accessToken: string) => {
  return axios.create({
    baseURL: GITHUB_API_URL,
    headers: {
      Authorization: `token ${accessToken}`,
      Accept: 'application/vnd.github.v3+json',
    },
  });
};

export const githubService = {
  getRepositories: async (accessToken: string) => {
    const client = createGithubClient(accessToken);
    const response = await client.get('/user/repos', {
      params: {
        sort: 'updated',
        per_page: 100,
      },
    });
    
    return response.data.map((repo: any) => ({
      id: repo.id,
      name: repo.name,
      full_name: repo.full_name,
      description: repo.description,
      language: repo.language,
      default_branch: repo.default_branch,
      private: repo.private,
      html_url: repo.html_url,
      updated_at: repo.updated_at,
    }));
  },

  getRepository: async (accessToken: string, owner: string, repo: string) => {
    const client = createGithubClient(accessToken);
    const response = await client.get(`/repos/${owner}/${repo}`);
    const data = response.data;
    
    return {
      name: data.name,
      description: data.description,
      owner: data.owner.login,
      default_branch: data.default_branch,
      visibility: data.visibility,
      stars: data.stargazers_count,
      forks: data.forks_count,
      open_issues: data.open_issues_count,
      language: data.language,
      size: data.size,
    };
  },

  getRepositoryTree: async (accessToken: string, owner: string, repo: string, branch: string) => {
    const client = createGithubClient(accessToken);
    const response = await client.get(`/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`);
    
    return response.data.tree.map((item: any) => ({
      name: item.path.split('/').pop(),
      path: item.path,
      type: item.type === 'blob' ? 'file' : 'folder',
      sha: item.sha,
      size: item.size,
    }));
  },

  getFileContent: async (accessToken: string, owner: string, repo: string, path: string, branch?: string) => {
    const client = createGithubClient(accessToken);
    const params: any = {};
    if (branch) params.ref = branch;

    const response = await client.get(`/repos/${owner}/${repo}/contents/${path}`, { params });
    const data = response.data;
    
    let decodedContent = '';
    if (data.content && data.encoding === 'base64') {
      decodedContent = Buffer.from(data.content, 'base64').toString('utf-8');
    }

    return {
      name: data.name,
      path: data.path,
      content: decodedContent,
      sha: data.sha,
      size: data.size,
      encoding: data.encoding, // Typically base64 technically, but we decoded it. We can pass the original encoding type.
    };
  },
};
