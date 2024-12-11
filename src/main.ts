import { Hono } from "hono";
import { db } from "./db";
import { linksTable } from "./db/schema";
import { eq } from "drizzle-orm";
import { logger } from "hono/logger";
import { apiRouter } from "./api";

export function urlToPath(url: URL) {
  return `/${url.host}${url.pathname}`;
}

const app = new Hono({
  getPath: (req) => {
    const url = new URL(req.url);
    const path = urlToPath(url);
    console.log(path);
    return path;
  },
});

console.log(`/${process.env.API_HOST}/`);
app.route(`/${process.env.API_HOST}/`, apiRouter);

app.get("/*", async (c) => {
  const path = c.req.path; // Example: /sub.domain.com:port/some/path

  const result = await db
    .select()
    .from(linksTable)
    .where(eq(linksTable.path, path));

  if (!result.length) return c.notFound();

  return c.redirect(result[0].target);
});

export default app;
