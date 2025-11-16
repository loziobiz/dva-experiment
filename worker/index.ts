export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Serve static assets
    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

interface Env {
  ASSETS: Fetcher;
  GEMINI_API_KEY?: string;
}

