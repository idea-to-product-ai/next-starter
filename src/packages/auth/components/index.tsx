import { signIn } from 'next-auth/react';
import { Github } from 'lucide-react';
import Image from 'next/image';


export const GithubLoginButton = () => {
    return (
        <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="flex w-full items-center justify-center space-x-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
        >
            <Github className="h-5 w-5" />
            <span>Continue with GitHub</span>
        </button>
    );
};

export const GoogleLoginButton = () => {
    return (
        <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex w-full items-center justify-center space-x-3 rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-200 transition-colors hover:bg-zinc-800"
        >
            <Image
                src="/google.svg"
                alt="Google"
                width={20}
                height={20}
                className="h-5 w-5"
            />
            <span>Continue with Google</span>
        </button>
    );
};