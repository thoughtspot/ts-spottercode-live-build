# ThoughtSpot: Zero To Embed

A sample Next.js app for following along with ThoughtSpot's webinar, "Build AI Analytics into Your App in 30 Minutes with Claude Code." The app is a deliberately bare shell. You use a coding agent, with ThoughtSpot's SpotterCode connected, to embed ThoughtSpot into it.

## What's in the shell

| Route | Description |
| --- | --- |
| `/` | Landing page with a **Login** button |
| `/login` | Email and password form. It is **not** connected to anything yet. Submitting it goes straight to `/dashboard`. |
| `/dashboard` | Empty placeholder where a ThoughtSpot dashboard will be embedded |
| `/chat` | Empty placeholder where ThoughtSpot Spotter will be embedded |

Built with [Next.js](https://nextjs.org) (App Router), React and [Tailwind CSS](https://tailwindcss.com).

## Prerequisites

- Node.js and [pnpm](https://pnpm.io)
- A coding agent, such as [Claude Code](https://claude.com/claude-code), Cursor or Codex
- A ThoughtSpot instance to embed from

## Getting started

```bash
pnpm install
cp .env.example .env.local
```

Then edit `.env.local` and fill in the values:

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_THOUGHTSPOT_HOST` | URL of your ThoughtSpot instance, for example `https://your.thoughtspot.cloud` |
| `THOUGHTSPOT_SECRET_KEY` | Your instance's Trusted Auth secret key. It is used on the server only, so never commit it or expose it to the browser. |

Start the app:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

`.env.local` is gitignored. If your agent needs a new environment variable, it should add it to `.env.example` and tell you, not create its own.

## Setting up your agent

This repo is set up for **Claude Code**. `CLAUDE.md` and `AGENTS.md` hold the project instructions.

You need to connect your agent to the [SpotterCode](https://developers.thoughtspot.com/docs/SpotterCode) MCP server yourself. It gives your agent ThoughtSpot's developer docs and REST API reference, so it writes current embed code and doesn't rely on memory. The repo does not ship a connection.

### SpotterCode MCP endpoints

SpotterCode offers two [MCP server endpoints](https://developers.thoughtspot.com/docs/SpotterCode#_mcp_server_endpoints):

| Endpoint | URL | Authentication | Tools |
| --- | --- | --- | --- |
| Documentation | `https://spottercode.thoughtspot.app/mcp/docs` | Not required | `get-rest-api-reference`, `get-developer-docs-reference` |
| Authenticated | `https://spottercode.thoughtspot.app/mcp` | Requires a ThoughtSpot instance | The two above, plus `execute-thoughtspot-code` |

The documentation endpoint only looks up docs. The authenticated endpoint can also run operations against your ThoughtSpot instance through its public REST APIs.

**We recommend the authenticated endpoint.** The [walkthrough](#walkthrough) is written for it: your agent can look up your dashboards and models by name in your ThoughtSpot instance. It requires access to a ThoughtSpot instance, which you need for this project anyway. The documentation endpoint works without logging in, but you'll have to give your agent the GUIDs of the dashboard and model to embed (see [step 2](#2-embed-a-dashboard-and-spotter)).

### Add SpotterCode to Claude Code

Run this from the repo directory:

```bash
claude mcp add --transport http SpotterCode https://spottercode.thoughtspot.app/mcp
```

Then authenticate: run `/mcp` in Claude Code, select SpotterCode, and follow the prompts to log in to your ThoughtSpot instance. For per-IDE setup and the full authentication flow, see ThoughtSpot's [SpotterCode documentation](https://developers.thoughtspot.com/docs/SpotterCode).

To use the documentation endpoint instead, use `https://spottercode.thoughtspot.app/mcp/docs` as the URL in the command above. No authentication is needed.

To confirm SpotterCode is set up, run `/mcp` in Claude Code. SpotterCode should be listed as connected. If it isn't, your agent has no access to ThoughtSpot's docs and will tell you so when you start.

### Using a different agent?

Follow your agent's instructions for adding an HTTP MCP server, using one of the URLs above. Or ask it something like:

> Set up an MCP connection to ThoughtSpot's authenticated SpotterCode endpoint, `https://spottercode.thoughtspot.app/mcp`, then follow `AGENTS.md`.

## Walkthrough

Give your agent these three prompts **in order**. Each one builds on the previous one, so don't skip ahead.

Before you start, make sure:

- `.env.local` is created and filled in (see [Getting started](#getting-started))
- SpotterCode is connected to your agent (see [Setting up your agent](#setting-up-your-agent))
- `pnpm dev` is running. Your agent should reuse it and not restart it.

Agents are non-deterministic, so your results may differ slightly from what's described. If a step doesn't work, run it again or paste the error back to your agent.

### 1. Add Trusted Auth

```text
Add ThoughtSpot trusted auth (cookieless) to the application. Require a username and password but, for the purpose of this demo, we will not validate the password so allow any value. Require authentication for all pages aside from / and /login.
```

This replaces the placeholder login with real ThoughtSpot Trusted Authentication, using cookieless authentication.

You should see:

- Logging in takes you to `/dashboard`.
- Visiting `/dashboard` or `/chat` while logged out sends you to `/login`. `/` and `/login` stay public.

The username must match an existing user in your ThoughtSpot instance. If you see a "user does not exist" error, that's the cause.

### 2. Embed a dashboard and Spotter

```text
On the /dashboard page, embed the dashboard titled “(Sample) Sales Performance”. On the /chat page, embed Spotter using the model that the “(Sample) Sales Performance” dashboard was built on.
```

Before it starts, your agent checks that you've replaced the placeholder values in `.env.local`. It reports only the names of any variables that still match `.env.example`, and never reads or repeats the values.

You should see the dashboard on `/dashboard` and a Spotter chat on `/chat`, both signed in as the user you logged in with.

"(Sample) Sales Performance" comes with every ThoughtSpot instance. How your agent finds it depends on which [SpotterCode endpoint](#spottercode-mcp-endpoints) you connected:

- **Authenticated endpoint (`/mcp`):** the agent can look the dashboard and its model up by name in your instance, so the prompt works as written. To embed your own content, replace the title in the prompt with the name of any dashboard in your ThoughtSpot instance. Spotter will use the model that dashboard was built on.
- **Documentation endpoint (`/mcp/docs`):** the agent can't query your instance, so it can't look anything up by name. Give it the GUIDs of the dashboard and the model instead:

  ```text
  On the /dashboard page, embed the dashboard with the GUID <dashboard-guid>. On the /chat page, embed Spotter using the model with the GUID <model-guid>.
  ```

  Each GUID appears in the object's URL when you open it in ThoughtSpot. This works with any dashboard and model in your instance, not just the sample.

### 3. Style the embedded content

```text
Customize the styling of the embedded dashboard and Spotter, using ThoughtSpot's style customization, so they match the colors and fonts of this application.
```

You should see the embedded dashboard and Spotter pick up the colors and fonts of the surrounding app instead of ThoughtSpot's defaults.

## Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Create a production build |
| `pnpm start` | Run the production build |
| `pnpm lint` | Run ESLint |
