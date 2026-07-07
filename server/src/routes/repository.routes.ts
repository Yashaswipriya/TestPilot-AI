import { Router } from 'express';
import {
  getRepositories,
  getRepository,
  getRepositoryTree,
  getRepositoryFile,
} from '../controllers/repository.controller';
import { isAuthenticated } from '../middleware/isAuthenticated';

const router = Router();

router.use(isAuthenticated);

router.get('/', getRepositories);
router.get('/:owner/:repo', getRepository);
router.get('/:owner/:repo/tree', getRepositoryTree);
router.get('/:owner/:repo/file', getRepositoryFile);

export default router;
