import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { User } from '../models/User';

passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || '/auth/github/callback',
    },
    async (accessToken: string, profile: any, done: any) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (user) {
          user.accessToken = accessToken;
          await user.save();
          return done(null, user);
        }

        user = await User.create({
          githubId: profile.id,
          username: profile.username,
          displayName: profile.displayName || '',
          email: profile.emails?.[0]?.value || '',
          avatarUrl: profile.photos?.[0]?.value || '',
          accessToken,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
