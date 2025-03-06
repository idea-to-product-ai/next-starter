'use client';

import { GithubLoginButton, GoogleLoginButton } from '@/packages/auth/components';

export default function SignInPage() {
  return (
    <div className="container flex min-h-[calc(100vh-4rem)] items-center justify-center">
      <div className="w-full max-w-md space-y-8 rounded-lg border border-zinc-800 bg-zinc-900/50 p-8 backdrop-blur-xl">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-100">Sign in to your account</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Choose your preferred sign in method below
          </p>
        </div>

        <div className="space-y-4">
          <GithubLoginButton />
          <GoogleLoginButton />
        </div>

        <p className="text-center text-sm text-zinc-400">
          By signing in, you agree to our{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="#" className="text-blue-400 hover:text-blue-300">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}
