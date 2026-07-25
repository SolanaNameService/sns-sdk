import { next } from "@vercel/functions";

const AUTH_REALM = "SNS Developer Documentation";

function unauthorized(): Response {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "Cache-Control": "no-store",
      "WWW-Authenticate": `Basic realm="${AUTH_REALM}"`,
    },
  });
}

function parseCredentials(authorization: string | null) {
  const match = authorization?.match(/^Basic +(\S+)$/i);
  if (!match) return null;

  try {
    const decoded = atob(match[1]);
    const separator = decoded.indexOf(":");

    if (separator === -1) return null;

    return {
      username: decoded.slice(0, separator),
      password: decoded.slice(separator + 1),
    };
  } catch {
    return null;
  }
}

export default function middleware(request: Request): Response {
  const expectedUsername = process.env.AUTH_USERNAME;
  const expectedPassword = process.env.AUTH_PASSWORD;

  if (!expectedUsername || !expectedPassword) {
    return new Response("Authentication is not configured", {
      status: 500,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const credentials = parseCredentials(request.headers.get("Authorization"));

  if (!credentials) return unauthorized();

  if (
    credentials.username !== expectedUsername ||
    credentials.password !== expectedPassword
  ) {
    return unauthorized();
  }

  return next();
}

export const config = {
  matcher: "/:path*",
};
