export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // This serves the static assets from the site configuration
    return env.ASSETS.fetch(request);
  }
};
