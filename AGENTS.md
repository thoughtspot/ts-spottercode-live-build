<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Theme

This app has a light theme only. Do not add dark mode, a theme toggle, or `dark:` styles, and do not respond to `prefers-color-scheme`. This includes styling for ThoughtSpot embeds.

## Dev server

The user will often already have `pnpm dev` running. Do not interrupt it.

- Before starting a dev server, check whether one is already running: read `.next/dev/lock` (it records the PID, port, and URL) or check whether the port is in use. Only one `next dev` can run per project, so starting a second one will not work.
- If a dev server is running, **use it**. Test against its URL, which may not be port 3000. It hot-reloads your edits, so there is no need to restart it.
- Never kill, stop, or restart a process you did not start, and never free up a port by killing whatever is using it.
- Some changes do require a restart: edits to `.env.local` and `next.config.ts`. When that happens, ask the user to restart their dev server instead of doing it yourself.
- If no dev server is running and you need one, start it on a free port (for example `pnpm dev -p 3100` if 3000 is taken), tell the user the URL, and stop it when you are done.

## SpotterCode

This project relies on ThoughtSpot's SpotterCode MCP server for current ThoughtSpot developer docs and REST API reference. Its setup is described in `README.md`.

SpotterCode has two endpoints, and **either one satisfies this requirement**:

- The documentation endpoint (`/mcp/docs`) needs no authentication.
- The authenticated endpoint (`/mcp`) needs the user to log in to a ThoughtSpot instance. It offers the same docs tools plus `execute-thoughtspot-code`.

Authentication is optional. Do not tell the user they must authenticate.

Before doing any ThoughtSpot-related work, check that the SpotterCode docs tools are available. The reliable signal is a tool named `get-developer-docs-reference` (match on the tool name, not the server name, which can vary by setup).

- If the tools are available, proceed. Do not mention SpotterCode setup.
- If they are missing, tell the user once, at the start, that SpotterCode is not connected, and point them to the "Setting up your agent" section of `README.md`.
- If the only SpotterCode tool available is `authenticate`, the user has connected the authenticated endpoint but has not logged in. Tell them they can either authenticate, or switch to the documentation endpoint (no login needed), as described in the README.
- Do not write ThoughtSpot embed or Trusted Auth code from memory in place of SpotterCode. If the user wants to continue without it, say that the result may use outdated APIs.

## ThoughtSpot SDK initialization

`init()` from the Visual Embed SDK must have been called before any embed component (`LiveboardEmbed`, `SpotterEmbed`, etc.) mounts. Otherwise the embed has no host configured and fails with errors such as "Error parsing ThoughtSpot host". This is an ordering bug that appears intermittently, so it can pass one run and fail the next.

- Do not rely on a hook that calls `init()` inside a `useEffect` (for example the SDK's `useInit`) to run before embeds mount. React runs child effects before parent effects, so an embed rendered below a provider can mount before the provider's effect runs.
- Call `init()` synchronously so it completes before the first embed renders. For example, call it once from a client component or module that the layout always loads, behind a module-level guard so it never runs twice and never runs on the server (guard on `typeof window`).
- Treat `NEXT_PUBLIC_THOUGHTSPOT_HOST` with and without a trailing slash as the same URL (`https://example.com` and `https://example.com/`). Normalize it once, where the host is first read (strip trailing slashes), and use the normalized value everywhere, including when building URLs such as the Trusted Auth token endpoint. Never ask the user to remove the slash.
- Keep initialization in one place (a single provider or module) and have every page, including `/dashboard` and `/chat`, render its embed beneath it. Do not call `init()` per page.
- If you instead gate rendering until initialization has finished, do it without setting state inside an effect, which the React lint rules reject.
- Before finishing, load both `/dashboard` and `/chat` in the browser and check the console for ThoughtSpot errors. Reload each a few times, since the failure is intermittent.

## Sizing ThoughtSpot embeds

Embeds must fill the space available on the page. The SDK sets an inline `height: 100%` on the embed's iframe, but that percentage only resolves if the parent has a definite height. In this app's layout (the body uses `min-h-full`, not a fixed height, and the page is a flex column) it does not, so the iframe collapses to its default height. CSS on the wrapper alone cannot fix this, because the iframe is what collapses.

- Wrap each embed in a container that is `relative`, stretches to fill the page (`flex-1`), and has a minimum height. Position the iframe absolutely inside it so its `100%` resolves against the container. For example: `relative min-h-[700px] flex-1 [&_iframe]:absolute [&_iframe]:inset-0`.
- Define that class string once, in a shared module, and use it for every embed (`/dashboard` and `/chat`) so they stay consistent.
- Do not rely on `frameParams` height or on CSS targeting only the wrapper element to size the embed.
- Before finishing, check both pages in the browser at a normal window size. The embed should extend to the bottom of the viewport with no empty gap.

## Environment variables

Configuration lives in `.env.local`, which the user creates from `.env.example` (`cp .env.example .env.local`). `.env.local` is gitignored.

- If `.env.local` does not exist, **stop and tell the user to create it** from `.env.example` and fill in the values. Do not create it yourself, and do not invent placeholder or generated values to work around it.
- Do not add, rename, or remove environment variables without asking. If a change is needed, add the variable to `.env.example` with a comment explaining it, and tell the user which values they need to set in `.env.local`.
- Never commit secrets. Server-only secrets must never use the `NEXT_PUBLIC_` prefix or be read in client code.

### Verify `.env.local` has real values

Before writing or changing code that embeds ThoughtSpot content (for example a dashboard or Spotter), confirm the user has replaced the placeholder values from `.env.example`. Do this once, before the embed work begins.

`.env.local` contains secrets, so this must be a check that reveals nothing:

- **Never** read, `cat`, `grep` with visible output, print, quote, summarize, or otherwise put the contents or values of `.env.local` into the conversation.
- **Never** save any part of it to memory, notes, or other files.
- Run only a command whose output is variable *names* and a status, like the one below. It prints a line only for variables that are missing from `.env.local` or still equal to their `.env.example` value, and prints nothing when everything has been changed:

```bash
while IFS= read -r line; do
  case "$line" in ''|'#'*) continue ;; esac
  key=${line%%=*}
  if ! grep -q "^${key}=" .env.local; then echo "$key: missing"
  elif grep -qxF -- "$line" .env.local; then echo "$key: unchanged"
  fi
done < .env.example
```

If it prints anything, stop and tell the user which variables (by name only) still need real values in `.env.local`, then wait for them to update it. If it prints nothing, continue without comment. If a variable is meant to keep its example value, the user will say so.
