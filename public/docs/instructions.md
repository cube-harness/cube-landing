# Instructions

Separate agent personality from project rules, and reload them deliberately.

<a id="soul"></a>

## SOUL.md

~/.cube/SOUL.md defines personality, communication style and preferences. Cube's operating rules, tool-use guidance and execution environment are separate built-in instruction sources; avoid copying them into SOUL.md.

soul.max_characters is a length limit, defaulting to 2,000 characters. An oversized SOUL.md is rejected, not silently truncated: shorten it or explicitly increase the limit. Changing the file does not hot-reload an active snapshot; use /reload or restart Cube. Existing user files are not overwritten simply because a new release ships a shorter template.

**config.yaml**

```yaml
soul:
  max_characters: 2000
```

<a id="agents"></a>

## Project AGENTS.md

Put project-specific conventions, build/test commands, architecture and constraints in AGENTS.md. Cube loads applicable ancestor instructions between the current directory and workspace root, plus root .agents/AGENTS.md, .cube/AGENTS.md, .claude/AGENTS.md and .codex/AGENTS.md. ~/.cube/AGENTS.md supplies global guidance.

Project instructions are sent as a clearly delimited user-context block after system instructions, not as an extra question and not as a user-visible chat message. Their source and scope are included. More specific project scopes win over parent/global conflicts; non-conflicting guidance remains applicable.

The startup info box shows the loaded files and character counts. A missing AGENTS.md is normal; it is not fabricated or required to start a conversation.

<a id="discovery"></a>

## Snapshots & Scoped Discovery

Opening Cube and /new prepare instruction snapshots. Once loaded, instruction content is reused rather than read for each model request. Resume/fork refresh applicable scopes from disk; /reload explicitly refreshes the current project snapshot.

When the agent works with a new path, discovery can load applicable nested AGENTS.md scopes. It checks ancestors of touched paths, not every descendant of the repository, and caches both found files and misses. An already visited scope is not reread during chat.

Editing an existing AGENTS.md, or creating one in an already checked scope, does not silently change the active snapshot. Reload to adopt it. This is separate from skills, whose availability/activation is evaluated per turn.

<a id="init-reload"></a>

## /init & /reload

/init submits Cube's project-initialization instructions to the model instead of making you type them. It asks the agent to inspect the project and create or update AGENTS.md; normal tool approvals still apply. The hidden initialization prompt is not rendered as a long user message in the TUI.

After the file is created, run /reload to adopt its contents in the current conversation. /reload also refreshes custom-agent definitions and MCP configuration. It is not a promise to hot-apply every startup setting in config.yaml, and it is not the same as restarting a running MCP server.

**Cube**

```text
/init
# After reviewing the generated file:
/reload
```

<a id="environment"></a>

## Environment & Current Date

Cube supplies execution OS/shell/workspace information separately from personality and project rules. A host-local environment_context signal provides the current date and timezone, remains stable through one turn's tool steps, and is refreshed when those values change.

The date signal helps resolve relative dates; it does not provide live world knowledge. Current news, schedules or other changing facts still require current sources through available permitted tools. Environment context is hidden from ordinary TUI chat messages.

<a id="related-config"></a>

## config.yaml Reference

Settings related to this guide. Merge examples into your existing file; omitted settings use Cube defaults. See [applying changes](/docs/configuration#defaults).

| Field | Type / range | Default | Behavior |
| --- | --- | --- | --- |
| `soul.max_characters` | Integer: 1–1,000,000 | `2000` | SOUL.md length limit. Oversized content fails validation rather than being silently truncated. Keep personality concise; Cube's operating instructions are built in separately. |
