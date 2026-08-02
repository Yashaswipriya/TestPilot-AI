import Repository from "../models/Repository";
import { githubService } from "./github.service";

class RepositoryService {
  async getOrCreateRepository(
    userId: string,
    owner: string,
    repo: string,
    accessToken: string
  ) {
    //Check if repository already exists for this user
    const existingRepository = await Repository.findOne({
      userId,
      owner,
      repoName: repo,
    });

    if (existingRepository) {
      return existingRepository;
    }

    //Fetch repository details from GitHub
    const githubRepo = await githubService.getRepository(
      accessToken,
      owner,
      repo
    );

    //Create a new repository document
    const repository = await Repository.create({
      userId,
      repoId: githubRepo.id,
      owner: githubRepo.owner,
      repoName: githubRepo.name,
      cloneUrl: githubRepo.clone_url,
      defaultBranch: githubRepo.default_branch,
      language: githubRepo.language || "",
      visibility: githubRepo.private ? "private" : "public",
      githubUrl: githubRepo.html_url,
    });

    return repository;
  }
}

export const repositoryService = new RepositoryService();