# Skills

Load reusable workflows explicitly and control which skills the model can see.

<a id="sources"></a>

## Skill Sources

A skill is a directory containing SKILL.md with YAML frontmatter and Markdown instructions. Cube discovers project skills under .agents/skills, .cube/skills, .claude/skills and .codex/skills, global skills under ~/.cube/skills and ~/.agents/skills, and its packaged built-in skills.

Project skills take precedence over same-named global skills. Enabled user skills can shadow built-ins of the same name. /skills shows source/path information so you can distinguish duplicates. Invalid YAML or metadata makes that skill unavailable; check logs and the file rather than expecting malformed instructions to load.

<a id="activation"></a>

## Activate with $

Use $skill-name in a prompt, with autocomplete, to explicitly activate a skill. Cube keeps your visible prompt readable and loads the selected SKILL.md instructions into model context. It does not replace your typed mention with the whole file in the message list.

Activated main instructions are already loaded; the model should use skill_read for related references, scripts, assets, templates or other files within that skill. The skill tool loads another related skill whose instructions are not yet in context. Skill search can locate relevant skill resources. /skill-name is not an application command.

**Prompt**

```text
Use $skill-creator to create a project skill for our test workflow.
```

<a id="enable-disable"></a>

## Enable & Disable

Run /skills, search for a skill, use Space to stage a toggle and Enter to apply all staged changes. Disabled skills disappear from both $ autocomplete and the model's available_skills catalog; they are not merely hidden from the picker.

The picker stores canonical SKILL.md paths or builtin:`<name>` keys in skills.disabled. Applying changes affects subsequent turns without restarting. It can change the prompt/tool prefix and reduce provider prompt-cache reuse; this is an intentional tradeoff.

The catalog can discover newly added skills as its native refresh runs. Editing a skill changes what is read on a later activation/turn; it does not retroactively replace content already in a completed request.

**config.yaml · prefer /skills to avoid path mistakes**

```yaml
skills:
  disabled:
    - builtin:cube-delegation
    - 'D:\Projects\my-app\.agents\skills\example\SKILL.md'
```

<a id="creating"></a>

## Creating Skills

Cube includes skill-creator, cube-background, cube-delegation and cube-memory. Activate skill-creator for the authoring workflow, validation and supporting assets instead of copying an unrelated agent's skill format blindly.

The skill directory name must match the frontmatter name. Keep the main instructions focused and place detailed resources in files the model can read when needed. A skill's agents subfolder is not a Cube subagent definition directory; custom subagents are configured separately.

**.agents/skills/project-tests/SKILL.md**

```markdown
---
name: project-tests
description: Run the project's tests and report actual failures when the user requests verification.
---

# Project Tests
Read package.json to find the test command. Run it with execute_command,
respect approvals, and report the actual exit code and failures.
Use references/testing.md only when more project-specific detail is needed.
```

<a id="related-config"></a>

## config.yaml Reference

Settings related to this guide. Merge examples into your existing file; omitted settings use Cube defaults. See [applying changes](/docs/configuration#defaults).

| Field | Type / range | Default | Behavior |
| --- | --- | --- | --- |
| `skills.disabled` | Non-empty string[] | `[]` | Disabled SKILL.md paths, or builtin:`<name>` for a built-in skill. /skills writes canonical identifiers; a bare skill name is not a replacement for its path. |
