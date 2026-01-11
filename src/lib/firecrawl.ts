import Firecrawl from "@mendable/firecrawl-js";

// Lazy instantiation to avoid errors during build when API key is not set
let firecrawlInstance: Firecrawl | null = null;

export const getFirecrawl = (): Firecrawl => {
  if (!firecrawlInstance) {
    const apiKey = process.env.FIRECRAWL_API_KEY;
    if (!apiKey) {
      throw new Error("FIRECRAWL_API_KEY environment variable is not set");
    }
    firecrawlInstance = new Firecrawl({ apiKey });
  }
  return firecrawlInstance;
};

// For backwards compatibility
export const firecrawl = {
  scrape: (...args: Parameters<Firecrawl["scrape"]>) => getFirecrawl().scrape(...args),
};
