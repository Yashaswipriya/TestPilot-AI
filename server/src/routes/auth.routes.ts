import { Router } from 'express';
import passport from 'passport';
import { githubCallback, getCurrentUser, logout } from '../controllers/auth.controller';

const router = Router();

router.get(
  '/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/login' }),
  githubCallback
);

router.get('/me', getCurrentUser);

router.post('/logout', logout);

export default router;
