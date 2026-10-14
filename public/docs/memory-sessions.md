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

Eligible source conversations must be idle for min_idle_hours (default 6), with additional ownership/content checks. A brand-new tiny chat does not guarantee an extraction call. Existing Markdown memory is loaded into the project snapshot; /reload refreshes that snapshot when new committed memory becomes available.

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

<a id="recall"></a>

## Recall & Evidence

memory_recall queries committed memory entries for the current project. Without embedding retrieval, it uses BM25 keyword relevance over structured Markdown sections. It does not require semantic_recall or the old observational-memory configuration.

Search results include bounded excerpts, source IDs, line ranges and evidence references. If an excerpt is insufficient, the model can read a returned source ID/range and its linked original-message evidence through memory_recall. It should use IDs supplied by search, not guess arbitrary file paths.

Recall is a tool: the model chooses when more past evidence is needed. The instruction snapshot is not an automatic injection of every historical prompt, and the embedding corpus is not the entire raw SQLite transcript.

<a id="retrieval"></a>

## Embeddings & Hybrid Retrieval

Enable memory.durable.retrieval with a concrete embedding model to combine BM25 with vector similarity. API embeddings use credentials from auth.json; local embeddings use the existing Ollama/LM Studio server settings. OAuth and inherit are not embedding-model strategies.

Cube embeds only the current project's committed handbook and rollout entries, not raw/index entries or the entire SQLite transcript. It chunks structured Markdown sections rather than embedding shared files indiscriminately. Enabling retrieval starts background indexing. With no usable current-profile chunks, search falls back to BM25; once batches are committed, those valid chunks can participate in hybrid search while remaining chunks continue indexing.

Memory edits re-embed only changed inputs; stale/deleted entries are filtered out. Changing the embedding model/profile, dimensions, prefixes or chunk settings requires a new index generation for this project. Vectors from different models/dimensions cannot be mixed. Changing revision forces a rebuild when an alias silently changes its weights.

Completed indexing batches survive /exit and can be resumed; the active indexing worker is stopped at shutdown. BM25 remains available if embeddings are interrupted or the provider fails. API indexing adds request cost; local indexing uses machine resources.

The retrieval fields control two separate operations: document embedding during indexing, and query embedding during memory_recall search. They do not configure the chat model or its reasoning effort.

| Setting | Practical effect |
| --- | --- |
| enabled | false uses BM25 without embedding calls; true enables background indexing and hybrid search when valid vectors are available. Durable memory must also be enabled. |
| model | Concrete embedding model, independent of the chat gateway/model. API credentials come from auth.json; local endpoints come from gateway_options. |
| revision | Cube-only version label, not sent to the provider. Change it to invalidate vectors after an alias silently changes model weights. |
| dimensions | Requested vector length, when supported. More dimensions consume more index space; fewer dimensions can trade retrieval quality for size. null uses the model default. |
| document_prefix | Text prepended to each memory chunk before embedding, for models that require document-task prefixes. Not an instruction injected into chat. |
| query_prefix | Text prepended to the search query before embedding, for query-task prefixes. Not a keyword appended to BM25 search. |
| provider_options.document | Namespaced native provider options for document embedding only. Leave {} unless the model requires specific options. |
| provider_options.query | Namespaced native provider options for query embedding only. Keep query/document task options separate. |
| chunk.max_chars | Maximum characters in each embedding chunk, not tokens. Smaller chunks are more focused but produce more vectors; larger chunks retain more neighboring context. |
| chunk.overlap_chars | Characters shared across chunk boundaries to avoid losing context at a cut. More overlap increases duplicated embedding input. Must be smaller than max_chars. |

In the current implementation, the whole retrieval configuration and endpoint identify the embedding profile. Changing even query_prefix or query options creates a new project index generation; it is not limited to changes in model or dimensions. Credentials, headers, endpoint overrides and custom input payloads are forbidden inside provider_options; the combined options must fit 16 KiB. Omitted prefixes stay empty, so do not copy Nomic prefixes onto unrelated models.

**config.yaml · Ollama Nomic example**

```yaml
memory:
  durable:
    enabled: true
    retrieval:
      enabled: true
      model: ollama/nomic-embed-text:latest
      revision: null
      dimensions: null
      document_prefix: "search_document: "
      query_prefix: "search_query: "
      provider_options:
        document: {}
        query: {}
      chunk:
        max_chars: 1024
        overlap_chars: 128
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
| `memory.durable.retrieval.revision` | Non-empty string ≤256 chars or null | `null` | Change this when an embedding model alias changes weights without changing its ID, so Cube rebuilds the project's embedding generation. |
| `memory.durable.retrieval.dimensions` | Integer: 1–65,536 or null | `null` | Optional requested embedding dimensions when supported by the provider. null leaves dimensions provider-defined; changing them rebuilds the index. |
| `memory.durable.retrieval.document_prefix` | String ≤512 chars | `""` | Text prepended to documents for models requiring task prefixes, such as Nomic's search_document: . Part of the embedding profile. |
| `memory.durable.retrieval.query_prefix` | String ≤512 chars | `""` | Text prepended to retrieval queries, such as Nomic's search_query: . Part of the embedding profile. |
| `memory.durable.retrieval.provider_options.document` | JSON object | `{}` | Provider-specific document embedding options. Combined provider_options must fit 16 KiB and cannot contain credentials, headers, endpoint or input-payload overrides, even nested. |
| `memory.durable.retrieval.provider_options.query` | JSON object | `{}` | Provider-specific query embedding options, subject to the same 16 KiB and safety constraints. Keep provider-required document/query task options distinct. |
| `memory.durable.retrieval.chunk.max_chars` | Integer: 128–16,384 | `1024` | Embedding chunk size in characters, not tokens. Chunks respect project ownership and Markdown memory structure. |
| `memory.durable.retrieval.chunk.overlap_chars` | Non-negative integer <max_chars | `128` | Chunk overlap in characters. Must remain smaller than max_chars; changing chunk settings rebuilds affected index data. |
