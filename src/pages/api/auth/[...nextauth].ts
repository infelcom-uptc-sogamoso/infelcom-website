import NextAuth, { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { dbUsers } from '@/database';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: 'Custom Login',
      credentials: {
        email: { label: 'Correo:', type: 'email', placeholder: 'correo@gmail.com' },
        password: { label: 'Contraseña:', type: 'password', placeholder: 'Contraseña' },
      },
      async authorize(credentials): Promise<any> {
        return await dbUsers.checkUserEmailPassword(credentials!.email, credentials!.password);
      },
    }),
  ],
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    maxAge: 2592300,
    strategy: 'jwt',
    updateAge: 86400,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case 'oauth':
            token.user = await dbUsers.oAUthToDbUser(user?.email || '', user?.name || '');
            break;
          case 'credentials':
            token.user = user;
            break;
        }
      }
      return token;
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken as any;
      session.user = token.user as any;
      return session;
    },
  },
};

export default NextAuth(authOptions);
