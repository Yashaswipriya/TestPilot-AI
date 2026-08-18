import axios from 'axios';

interface GitHubTreeItem {
  name: string;
  path: string;
  type: "file" | "folder";
  sha: string;
  size?: number;
}

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
      id: data.id,
      name: data.name,
      description: data.description,
      owner: data.owner.login,
      clone_url: data.clone_url,
      html_url: data.html_url,
      default_branch: data.default_branch,
      visibility: data.visibility,
      private: data.private,
      stars: data.stargazers_count,
      forks: data.forks_count,
      open_issues: data.open_issues_count,
      language: data.language,
      size: data.size,
    };
  },

  getRepositoryTree: async (
  accessToken: string,
  owner: string,
  repo: string,
  branch: string
): Promise<GitHubTreeItem[]> => {
  const client = createGithubClient(accessToken);

  const response = await client.get(
    `/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`
  );

  return response.data.tree.map((item: any) => ({
    name: item.path.split("/").pop() ?? "",
    path: item.path,
    type: item.type === "blob" ? "file" : "folder",
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

    createOrUpdateFile: async (
    accessToken: string,
    owner: string,
    repo: string,
    path: string,
    content: string,
    message: string,
    branch: string
  ) => {
    const client = createGithubClient(accessToken);

    let existingFileSha: string | undefined;
    try {
      const response = await client.get(
        `/repos/${owner}/${repo}/contents/${path}`,
        {
          params: {
            ref: branch,
          },
        }
      );

      if (
        response.data &&
        !Array.isArray(response.data) &&
        response.data.sha
      ) {
        existingFileSha = response.data.sha;
      }
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        throw error;
      }
    }

    const encodedContent = Buffer.from(
      content,
      "utf-8"
    ).toString("base64");

    const response = await client.put(
      `/repos/${owner}/${repo}/contents/${path}`,
      {
        message,
        content: encodedContent,
        branch,
        ...(existingFileSha
          ? { sha: existingFileSha }
          : {}),
      }
    );

    return {
      path: response.data.content?.path ?? path,
      sha: response.data.content?.sha,
      commit: {
        sha: response.data.commit?.sha,
        message: response.data.commit?.message,
        url: response.data.commit?.html_url,
      },
      action: existingFileSha
        ? "updated"
        : "created",
    };
  },
};
