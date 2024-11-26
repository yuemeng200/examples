export default {
  "name": "vercel/ai-chatbot",
  "description": "A full-featured, hackable Next.js AI chatbot built by Vercel",
  "stars": 9390,
  "forks": 2389,
  "watchers": 9390,
  "mainLanguage": "TypeScript",
  "languages": {
    "TypeScript": 266494,
    "JavaScript": 13271,
    "CSS": 3512
  },
  "topics": [
    "ai",
    "chatgpt",
    "nextjs",
    "react",
    "redis",
    "shadcn-ui",
    "vercel"
  ],
  "readme": "<a href=\"https://chat.vercel.ai/\">\n  <img alt=\"Next.js 14 and App Router-ready AI chatbot.\" src=\"app/(chat)/opengraph-image.png\">\n  <h1 align=\"center\">Next.js AI Chatbot</h1>\n</a>\n\n<p align=\"center\">\n  An Open-Source AI Chatbot Template Built With Next.js and the AI SDK by Vercel.\n</p>\n\n<p align=\"center\">\n  <a href=\"#features\"><strong>Features</strong></a> ·\n  <a href=\"#model-providers\"><strong>Model Providers</strong></a> ·\n  <a href=\"#deploy-your-own\"><strong>Deploy Your Own</strong></a> ·\n  <a href=\"#running-locally\"><strong>Running locally</strong></a>\n</p>\n<br/>\n\n## Features\n\n- [Next.js](https://nextjs.org) App Router\n  - Advanced routing for seamless navigation and performance\n  - React Server Components (RSCs) and Server Actions for server-side rendering and increased performance\n- [AI SDK](https://sdk.vercel.ai/docs)\n  - Unified API for generating text, structured objects, and tool calls with LLMs\n  - Hooks for building dynamic chat and generative user interfaces\n  - Supports OpenAI (default), Anthropic, Cohere, and other model providers\n- [shadcn/ui](https://ui.shadcn.com)\n  - Styling with [Tailwind CSS](https://tailwindcss.com)\n  - Component primitives from [Radix UI](https://radix-ui.com) for accessibility and flexibility\n- Data Persistence\n  - [Vercel Postgres powered by Neon](https://vercel.com/storage/postgres) for saving chat history and user data\n  - [Vercel Blob](https://vercel.com/storage/blob) for efficient file storage\n- [NextAuth.js](https://github.com/nextauthjs/next-auth)\n  - Simple and secure authentication\n\n## Model Providers\n\nThis template ships with OpenAI `gpt-4o` as the default. However, with the [AI SDK](https://sdk.vercel.ai/docs), you can switch LLM providers to [OpenAI](https://openai.com), [Anthropic](https://anthropic.com), [Cohere](https://cohere.com/), and [many more](https://sdk.vercel.ai/providers/ai-sdk-providers) with just a few lines of code.\n\n## Deploy Your Own\n\nYou can deploy your own version of the Next.js AI Chatbot to Vercel with one click:\n\n[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot&env=AUTH_SECRET,OPENAI_API_KEY&envDescription=Learn%20more%20about%20how%20to%20get%20the%20API%20Keys%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fvercel%2Fai-chatbot%2Fblob%2Fmain%2F.env.example&demo-title=AI%20Chatbot&demo-description=An%20Open-Source%20AI%20Chatbot%20Template%20Built%20With%20Next.js%20and%20the%20AI%20SDK%20by%20Vercel.&demo-url=https%3A%2F%2Fchat.vercel.ai&stores=[{%22type%22:%22postgres%22},{%22type%22:%22blob%22}])\n\n## Running locally\n\nYou will need to use the environment variables [defined in `.env.example`](.env.example) to run Next.js AI Chatbot. It's recommended you use [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables) for this, but a `.env` file is all that is necessary.\n\n> Note: You should not commit your `.env` file or it will expose secrets that will allow others to control access to your various OpenAI and authentication provider accounts.\n\n1. Install Vercel CLI: `npm i -g vercel`\n2. Link local instance with Vercel and GitHub accounts (creates `.vercel` directory): `vercel link`\n3. Download your environment variables: `vercel env pull`\n\n```bash\npnpm install\npnpm dev\n```\n\nYour app template should now be running on [localhost:3000](http://localhost:3000/).\n",
  "homepage": "https://chat.vercel.ai",
  "defaultBranch": "main",
  "hasIssues": true,
  "hasWiki": true,
  "license": "Other",
  "createdAt": "2023-05-19T16:36:23Z",
  "updatedAt": "2024-11-17T11:41:26Z",
  "pushedAt": "2024-11-15T19:19:26Z",
  "url": "https://github.com/vercel/ai-chatbot",
  "gitUrl": "git://github.com/vercel/ai-chatbot.git",
  "sshUrl": "git@github.com:vercel/ai-chatbot.git",
  "owner": {
    "name": "vercel",
    "avatarUrl": "https://avatars.githubusercontent.com/u/14985020?v=4",
    "url": "https://github.com/vercel"
  }
}