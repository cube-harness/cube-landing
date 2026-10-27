# Memory & Sessions

Persist conversations and reuse project knowledge across separate threads.

<a id="sessions"></a>

## SQLite Sessions, Resume & Fork

Conversations, tool records and context checkpoints are persisted in ~/.cube/memories/memory.sqlite. Local SQLite storage and its database ID/URL/path are owned by Cube; there is no memory.storage configuration block.

Use /resume (alias /threads) to reopen a conversation, /new to prepare a fresh one and /fork to branch the current conversation. Context compaction changes the model's view, not the stored transcript. Child transcripts use private thread/resource IDs in the same database rather than appearing as ordinary parent chats.

Thread titles are derived from the first prompt by default. Enabling generate_title runs an additional model call with its own model/instructions. It does not replace the coding agent's task instructions.

**config.yaml**

```yaml
memory:
  generate_title:
    enabled: false
    model: inherit
    # reasoning_effort: low
    instructions: Generate a concise title under 80 characters.
```

<a id="durable"></a>

## Durable Project Memory

Durable memory captures reusable project facts, evidence and lessons across threads. It is not the same as a compact summary, which only helps continue a particular conversation. Background extraction/consolidation can make additional LLM calls and consumes normal provider usage.

Memory lives under ~/.cube/memories, not a separate .MEMORY directory inside every project. MEMORY.md is the consolidated handbook; memory_summary.md is a short navigation/snapshot index; raw_memories.md stores extracted candidate material; rollout_summaries/`<thread-id>`.md stores per-conversation evidence and findings. Records carry project identity so one project's recall does not return another project's entries.

Cube checks for eligible source conversations at startup and when a thread is activated; it does not run a timer exactly min_idle_hours after every prompt. The source must be unowned by an active runtime and idle for min_idle_hours (default 6). A first extraction also requires at least two complete turns and at least 1,000 characters of projected text/tool data. Incomplete tool exchanges are not promoted.

Extraction calls the configured memory model to produce a cumulative rollout and reusable candidates. Consolidation makes a separate call to deduplicate candidates into the handbook and rebuild its index. A rollout records outcomes and evidence; it is not the continuation summary used by /compact. A pass processes bounded batches, so not every old thread must be extracted at once.

Only the current project's memory_summary.md entry body is loaded into the instruction snapshot, inside `<durable_memory>`, near the start of the model request. Cube does not preload all of MEMORY.md, raw_memories.md, rollouts or SQLite history. That snapshot stays stable during chat; background publication does not silently replace it. /reload or a fresh instruction load adopts committed changes; memory_recall can read committed sources without waiting for the snapshot to refresh.

Cube publishes memory atomically and retains evidence references to original SQLite messages. These Markdown files contain structured metadata: do not delete headers or add arbitrary prose outside the expected entry structure. Cube currently has no dedicated remember/update/delete tool for manual memory CRUD.

**config.yaml**

```yaml
memory:
  durable:
    enabled: true
    model: inherit
    # reasoning_effort: low
    min_idle_hours: 6
```

<a id="memory-files"></a>

## Memory Files: Layout & Examples

All projects share the memory directory and the three top-level Markdown files.
Each file can contain several entries, distinguished by a normalized project_id;
there is not a separate MEMORY.md in each workspace. On Windows, D:\\cube is
normalized to d:/cube. Extraction, recall and embedding filter to that project;
other projects' entries remain in the shared files.

```text
~/.cube/memories/
├── memory.sqlite
├── MEMORY.md
├── memory_summary.md
├── raw_memories.md
└── rollout_summaries/
    └── <thread-id>.md
```

The directory/database can exist before the Markdown files. Files are published
when eligible memory work produces them; opening Cube or running /compact does
not guarantee all four Markdown artifacts immediately appear. With no reusable
candidates, a rollout can exist without a consolidated handbook/index.

These are illustrative entries rendered with Cube's memory serializer, not real
conversation data. The text is Markdown, wrapped in machine-readable HTML
comments. The on-disk header is one JSON line; escaped values such as \u002d are
normal. Do not use these example IDs as real recall arguments.

### MEMORY.md — reusable project knowledge

The consolidation model writes one or more topic entries. It preserves useful
existing knowledge and evidence, records corrections and leaves uncertain facts
explicitly proposed/unresolved. This is the detailed handbook searched by recall.

```markdown
<!-- cube-memory {"source_id":"memory_33333333\u002d3333\u002d4333\u002d8333\u002d333333333333","source_type":"handbook","project_id":"d:/cube","title":"OAuth account selection","status":"verified","updated_at":"2026\u002d10\u002d27T08:00:00.000Z","revision":"44444444\u002d4444\u002d4444\u002d8444\u002d444444444444","incorporated":{},"sections":[{"start_line":3,"end_line":7,"evidence_refs":[{"thread_id":"11111111\u002d1111\u002d4111\u002d8111\u002d111111111111","message_id":"22222222\u002d2222\u002d4222\u002d8222\u002d222222222222"}]}]} -->
# OAuth account selection

## Account switching
Status: verified
Configured OAuth selection reuses the saved account.
Use Ctrl+D in /gateway to log out before signing in to another account.

<!-- /cube-memory -->
```

### memory_summary.md — the small loaded index

Consolidation writes a short topic/keyword index pointing to handbook source IDs.
This entry's body, not its metadata header, is the project's automatic memory
snapshot. incorporated records which raw candidate revisions were consolidated;
it is not a user setting. The index entry's unresolved status is an internal
marker, not a claim that every linked handbook entry is unresolved.

```markdown
<!-- cube-memory {"source_id":"index_ff26c0e838aefffdeffe2af48c934075baca916b6f6d316670e00ad84f153abe","source_type":"index","project_id":"d:/cube","title":"Project memory index","status":"unresolved","updated_at":"2026\u002d10\u002d27T08:00:00.000Z","revision":"44444444\u002d4444\u002d4444\u002d8444\u002d444444444444","incorporated":{"raw_bd7662a5eeb41614e720d477abfcb2272e19a8a70a93b7e3bc8560d44ad326e9":"44444444\u002d4444\u002d4444\u002d8444\u002d444444444444"},"sections":[]} -->
- OAuth account selection and switching accounts [source_id: memory_33333333-3333-4333-8333-333333333333]
<!-- /cube-memory -->
```

### raw_memories.md — extraction candidates

The extraction model proposes reusable lessons alongside its rollout. These
candidates await consolidation; they are neither automatically injected into chat
nor searched by memory_recall or embedded. incorporated on the index prevents
unchanged candidate revisions from being consolidated again.

```markdown
<!-- cube-memory {"source_id":"raw_bd7662a5eeb41614e720d477abfcb2272e19a8a70a93b7e3bc8560d44ad326e9","source_type":"raw","project_id":"d:/cube","title":"Verified OAuth account selection","status":"verified","updated_at":"2026\u002d10\u002d27T08:00:00.000Z","revision":"44444444\u002d4444\u002d4444\u002d8444\u002d444444444444","thread_id":"11111111\u002d1111\u002d4111\u002d8111\u002d111111111111","boundary":{"ids":["22222222\u002d2222\u002d4222\u002d8222\u002d222222222222"],"fingerprint":"d84b66a6e2689db1957ff1e8b74f7017ef8059f1c15ed44c3c41f5e2726dc0a6"},"incorporated":{},"sections":[{"start_line":3,"end_line":7,"evidence_refs":[{"thread_id":"11111111\u002d1111\u002d4111\u002d8111\u002d111111111111","message_id":"22222222\u002d2222\u002d4222\u002d8222\u002d222222222222"}]}]} -->
# Verified OAuth account selection

## Account switching
Status: verified
Configured OAuth selection reuses the saved account.
Use Ctrl+D in /gateway to log out before signing in to another account.

<!-- /cube-memory -->
```

### `rollout_summaries/<thread-id>.md` — per-thread findings

Extraction writes a cumulative account of the task, outcomes, relevant decisions,
checks and unresolved work, with references to the source conversation. A later
eligible extraction can update that thread's rollout. The filename uses the
thread ID; source_id is a separate rollout_ identifier.

```markdown
<!-- cube-memory {"source_id":"rollout_bd7662a5eeb41614e720d477abfcb2272e19a8a70a93b7e3bc8560d44ad326e9","source_type":"rollout","project_id":"d:/cube","title":"Verified OAuth account selection","status":"verified","updated_at":"2026\u002d10\u002d27T08:00:00.000Z","revision":"44444444\u002d4444\u002d4444\u002d8444\u002d444444444444","thread_id":"11111111\u002d1111\u002d4111\u002d8111\u002d111111111111","boundary":{"ids":["22222222\u002d2222\u002d4222\u002d8222\u002d222222222222"],"fingerprint":"d84b66a6e2689db1957ff1e8b74f7017ef8059f1c15ed44c3c41f5e2726dc0a6"},"incorporated":{},"sections":[{"start_line":3,"end_line":7,"evidence_refs":[{"thread_id":"11111111\u002d1111\u002d4111\u002d8111\u002d111111111111","message_id":"22222222\u002d2222\u002d4222\u002d8222\u002d222222222222"}]}]} -->
# Verified OAuth account selection

## Outcome
Status: verified
Reproduced repeated sign-in on selecting a configured account.
Updated selection to reuse saved credentials; the focused regression check passed.

<!-- /cube-memory -->
```

### What the header means

| Field | Owner and purpose |
| --- | --- |
| source_id / source_type | Cube-generated identity and kind: handbook, index, raw or rollout. A source ID is not an arbitrary path. |
| project_id | Normalized workspace path; enforces project scoping even in shared files. |
| title / status | Topic and certainty: verified, user_stated, proposed or unresolved. Read section statuses as well. |
| updated_at / revision | Publication timestamp and generated entry revision; used to reject stale reads/index work. |
| sections | Line ranges within this entry's body, plus evidence_refs linking thread_id/message_id pairs in SQLite. They are not absolute lines in the combined file. |
| thread_id / boundary | On raw/rollout entries: source thread, covered message IDs and their fingerprint for incremental extraction/revalidation. |
| incorporated | On the index: raw source IDs and revisions already processed by consolidation. Empty on ordinary entries. |

Cube owns these headers and publications. Arbitrary prose such as asd outside an
entry is invalid memory syntax; this is not a free-form notes folder. There is no
foreground remember/update/delete tool. Do not edit these files as a substitute
for a config change. Missing source messages are reported unavailable, and
existing memory text is not proof that the original evidence still exists.

<a id="recall"></a>

## Recall & Evidence

memory_recall queries committed memory entries for the current project. Without embedding retrieval, it uses BM25 keyword relevance over structured Markdown sections. It does not require semantic_recall or the old observational-memory configuration.

Search returns at most five bounded excerpts with source IDs, status, line ranges and evidence references. Only handbook and rollout entries are searchable/readable; the index and raw candidates are not recall sources. A known valid source ID can be read directly; there is no mandatory query-first sequence. Use a returned/loaded source ID rather than guessing arbitrary paths.

```json
{"query":"OAuth configured account Ctrl+D"}
```

A query response reports mode:query, retrieval:bm25 or hybrid, indexing and results. Each result supplies source_id, title, status, score, start_line, end_line, excerpt and evidence_refs. Scores rank relevance, not confidence. Query mode returns references, not all linked original messages.

For more detail, read the source; replace this example ID with one returned by your own search/index:

```json
{"source_id":"memory_33333333-3333-4333-8333-333333333333","start_line":3,"end_line":7}
```

Read mode bundles Markdown lines and the linked original SQLite messages in the same call. Original evidence is a bounded, redacted projection of message text and completed tool records, not an unrestricted dump of hidden reasoning, binary media, credentials or the entire conversation. A page includes up to 120 body lines and eight supporting messages within a 32 KiB response cap; smaller pages are possible. If truncated, use next_read exactly as returned. Continuation cursors are runtime-bound and reject changed revisions; after a restart or stale continuation, issue a fresh query/read. Missing/deleted messages are marked unavailable.

Recall is a tool: the model chooses when more past evidence is needed. The instruction snapshot is not an automatic injection of every historical prompt, and the embedding corpus is not the entire raw SQLite transcript.

<a id="retrieval"></a>

## Embeddings & Hybrid Retrieval

Enable memory.durable.retrieval with a concrete embedding model to combine BM25 with vector similarity using reciprocal-rank fusion (RRF). API embeddings use credentials from auth.json; local embeddings use the existing Ollama/LM Studio server settings. OAuth and inherit are not embedding-model strategies.

Cube embeds only the current project's committed handbook and rollout entries, not raw/index entries or the entire SQLite transcript. It chunks structured Markdown sections rather than embedding shared files indiscriminately. Enabling retrieval starts background indexing. With no usable current-profile chunks, search falls back to BM25; once batches are committed, those valid chunks can participate in hybrid search while remaining chunks continue indexing.

Memory edits re-embed only changed inputs; stale/deleted entries are filtered out. Changing the model ID or local endpoint automatically creates a new index generation for this project. Cube also invalidates indexes when its internal embedding policy changes. Vectors from different generations cannot be mixed. A provider silently replacing weights behind the same model ID cannot be detected from that ID alone.

Completed indexing batches survive /exit and can be resumed; the active indexing worker is stopped at shutdown. BM25 remains available if embeddings are interrupted or the provider fails. API indexing adds request cost; local indexing uses machine resources.

The retrieval fields control two separate operations: document embedding during indexing, and query embedding during memory_recall search. They do not configure the chat model or its reasoning effort.

| Setting | Practical effect |
| --- | --- |
| enabled | false uses BM25 without embedding calls; true enables background indexing and hybrid search when valid vectors are available. Durable memory must also be enabled. |
| model | Concrete embedding model, independent of the chat gateway/model. API credentials come from auth.json; local endpoints come from gateway_options. |

Cube owns the embedding policy, not config.yaml. It uses provider-default vector dimensions and preserves each Markdown section when it fits the input budget. Only oversized sections are split, with their heading/status retained in each fragment. The byte budget is conservative: native model input limits where available, known family limits otherwise, and a 2,048-byte fallback for unknown models, minus a 128-byte safety reserve. There is no universal tokenizer guarantee; rejected inputs fall back to BM25.

Task formatting is model-specific: Nomic uses search_document/search_query, standard E5 uses passage/query, supported Google embedding models use native retrieval task types, and Gemini Embedding 2 uses its text task format instead. Unknown models receive plain text, not guessed prefixes. Embedding errors do not block the chat turn.

This policy recognizes specific model IDs; it does not discover every model's required task instruction. Renamed local models and unsupported model families may not be recognized. Successful vector generation does not prove optimal retrieval quality; missing required task formatting can reduce quality without an API error. After editing retrieval.enabled/model or the local embedding endpoint in config.yaml, use /reload to apply the new retrieval profile; this does not change the chat model.

**config.yaml · Ollama Nomic example**

```yaml
memory:
  durable:
    enabled: true
    retrieval:
      enabled: true
      model: ollama/nomic-embed-text:latest
```

<a id="related-config"></a>

## config.yaml Reference

Settings related to this guide. Merge examples into your existing file; omitted settings use Cube defaults. See [applying changes](/docs/configuration#defaults).

| Field | Type / range | Default | Behavior |
| --- | --- | --- | --- |
| `memory.generate_title.enabled` | Boolean | `false` | Enable an extra model call to generate a thread title. Otherwise Cube derives it from the first prompt. |
| `memory.generate_title.model` | Non-empty model ID or inherit | `inherit` | Model used only for title generation when enabled. |
| `memory.generate_title.reasoning_effort` | Optional effort enum | `Not set` | Override title-generation reasoning. Omitted: inherit parent options for model: inherit, otherwise use provider defaults. default suppresses parent-effort inheritance. |
| `memory.generate_title.instructions` | Non-empty string | `Generate a concise title under 80 characters.` | Instructions for the title generator, not the main coding agent. |
| `memory.durable.enabled` | Boolean | `true` | Enable background extraction and consolidation of durable project memory. These are separate model calls from compaction. |
| `memory.durable.model` | Non-empty model ID or inherit | `inherit` | Model for memory extraction/consolidation; inherit uses the main model rather than requiring another credential strategy. |
| `memory.durable.reasoning_effort` | Optional effort enum | `Not set` | Override extraction/consolidation reasoning. Omitted: inherit parent options for model: inherit, otherwise use provider defaults. default suppresses parent-effort inheritance. |
| `memory.durable.min_idle_hours` | Finite number: 0–720 | `6` | Minimum source-thread inactivity before memory extraction is eligible. 0 removes the age requirement; other safety/size checks still apply. |
| `memory.durable.retrieval.enabled` | Boolean | `false` | Enable embeddings/hybrid retrieval. BM25 remains the fallback when no usable index/chunks exist or embeddings fail; committed chunks can be searched while other chunks are indexing. |
| `memory.durable.retrieval.model` | Concrete provider/model or null | `null` | Required when retrieval is enabled. Use a supported API-key provider, ollama or lmstudio. OAuth and inherit are not embedding choices. |
