import assert from "assert";
import { Hono, type HonoRequest } from "hono";
import { createRemoteJWKSet, jwtVerify, type JWTPayload } from "jose";
import { cors } from "hono/cors";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { db } from "./db";
import { linksTable } from "./db/schema";
import { urlToPath } from "./main";

// Generate a JWKS using jwks_uri obtained from the Logto server
const jwks = createRemoteJWKSet(
  new URL("https://auth.vanvoorden.dev/oidc/jwks")
);

type Env = {
  Variables: {
    canCreate: boolean;
    extUserId: string;
  };
};
export const apiRouter = new Hono<Env>();

apiRouter.use(cors());

function extractBearerToken(req: HonoRequest) {
  const [headerPrefix, token] = (req.header("Authorization") ?? " ").split(" ");
  if (headerPrefix !== "Bearer") return null;
  return token;
}

apiRouter.use(async (c, next) => {
  const token = extractBearerToken(c.req);
  if (!token) return c.text("Unauthorized", { status: 401 });

  try {
    const { payload } = await jwtVerify(token, jwks, {
      issuer: "https://auth.vanvoorden.dev/oidc",
      audience: "https://api.vvoo.link/",
    });

    console.log("payload", payload);

    // Sub is the user ID, used for user identification
    const { scope, sub: userId } = payload;
    if (!userId) throw new Error("No user ID found in token");
    const scopes = ((scope ?? "") as string).split(" ");
    console.log("scopes", scopes);

    const canCreate = scopes.includes("create:links	");

    c.set("extUserId", userId);
    c.set("canCreate", canCreate);

    await next();
  } catch (e) {
    console.error(e);
    return c.text("Unauthorized", { status: 401 });
  }
});

apiRouter.get("/auth", async (c) => {
  return c.text("Authenticated", 200);
});

apiRouter.post(
  "/link",
  zValidator(
    "json",
    z.object({
      path: z.string().url(),
      target: z.string().url(),
    })
  ),
  async (c) => {
    if (!c.var.canCreate) return c.text("Unauthorized", { status: 401 });

    const { path, target } = c.req.valid("json");

    await db.insert(linksTable).values({
      extUserId: c.var.extUserId,
      path: urlToPath(new URL(path)),
      target,
    });
  }
);
