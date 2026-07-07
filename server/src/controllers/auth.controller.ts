import { Request, Response } from 'express';

export const githubCallback = (req: Request, res: Response) => {
  console.log("========== GITHUB CALLBACK ==========");
  console.log("Authenticated:", req.isAuthenticated?.());
  console.log("User:", req.user);
  console.log("Session:", req.session);
  console.log("=====================================");
   req.session.save((err) => {
    if (err) {
      console.error("Session save failed:", err);
      return res.sendStatus(500);
    }
  const frontendUrl = process.env.CLIENT_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/dashboard`);
   });
};

export const getCurrentUser = (req: Request, res: Response) => {
  console.log("Cookie Header:", req.headers.cookie);
  console.log("Session:", req.session);
  console.log("Passport:", (req.session as any).passport);
  console.log("Authenticated:", req.isAuthenticated());
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.status(200).json({ user: req.user });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to logout' });
    }
    if ((req as any).session) {
      (req as any).session.destroy(() => {
        res.clearCookie('connect.sid');
        res.status(200).json({ message: 'Logged out successfully' });
      });
    } else {
      res.clearCookie('connect.sid');
      res.status(200).json({ message: 'Logged out successfully' });
    }
  });
};
