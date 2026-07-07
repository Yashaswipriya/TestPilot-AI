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
  passport.authenticate('github', { failWithError: true }),
  githubCallback,
  (err: any, req: any, res: any, next: any) => {
  console.error('Full error object:', JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
  console.error('err.oauthError:', err.oauthError);
  res.status(500).json({ error: err.message });
}
);

router.get('/me', getCurrentUser);

router.post('/logout', logout);

export default router;
