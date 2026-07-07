import { Request, Response } from 'express';
import { githubService } from '../services/github.service';

export const getRepositories = async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found for user' });
    }

    const repos = await githubService.getRepositories(accessToken);
    res.json(repos);
  } catch (error: any) {
    console.error('Error fetching repositories:', error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch repositories' });
  }
};

export const getRepository = async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found for user' });
    }

    const { owner, repo } = req.params;
    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required parameters' });
    }

    const repository = await githubService.getRepository(accessToken, owner as string, repo as string);
    res.json(repository);
  } catch (error: any) {
    console.error(`Error fetching repository ${req.params.owner}/${req.params.repo}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch repository details' });
  }
};

export const getRepositoryTree = async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found for user' });
    }

    const { owner, repo } = req.params;
    const branch = req.query.branch as string;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required parameters' });
    }

    // Default to 'main' if no branch is specified, or we could fetch the default_branch first.
    // The requirement states "Use the repository's default branch unless a branch parameter is provided."
    // Let's fetch the repo details first to get the default branch if `branch` is missing.
    let targetBranch = branch;
    if (!targetBranch) {
      const repoDetails = await githubService.getRepository(accessToken, owner as string, repo as string);
      targetBranch = repoDetails.default_branch;
    }

    const tree = await githubService.getRepositoryTree(accessToken, owner as string, repo as string, targetBranch as string);
    res.json(tree);
  } catch (error: any) {
    console.error(`Error fetching tree for ${req.params.owner}/${req.params.repo}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch repository tree' });
  }
};

export const getRepositoryFile = async (req: Request, res: Response) => {
  try {
    const accessToken = (req.user as any)?.accessToken;
    if (!accessToken) {
      return res.status(401).json({ error: 'GitHub access token not found for user' });
    }

    const { owner, repo } = req.params;
    const path = req.query.path as string;
    const branch = req.query.branch as string;

    if (!owner || !repo) {
      return res.status(400).json({ error: 'Owner and repo are required parameters' });
    }
    if (!path) {
      return res.status(400).json({ error: 'Path query parameter is required' });
    }

    const file = await githubService.getFileContent(accessToken, owner as string, repo as string, path as string, branch as string);
    res.json(file);
  } catch (error: any) {
    console.error(`Error fetching file ${req.query.path} in ${req.params.owner}/${req.params.repo}:`, error.response?.data || error.message);
    res.status(error.response?.status || 500).json({ error: 'Failed to fetch file content' });
  }
};
