interface FaqItem {
  question: string;
  answer: string;
}

export const FAQS: FaqItem[] = [
  {
    "question": "How does the installer work?",
    "answer": "Run the PowerShell installer on Windows x64, or the shell installer on macOS arm64/x64 and Linux/WSL x64. It downloads a Cube package with a bundled Node.js runtime and verifies its SHA-256 checksum. No separate Node.js installation is needed. On macOS and Linux, you may need to add ~/.local/bin to PATH."
  },
  {
    "question": "Which accounts and model gateways can I connect?",
    "answer": "Use /gateway to choose OAuth for Anthropic, OpenAI, xAI, or Google, an API key from one of 15 supported providers, or local Ollama/LM Studio. Then use /model to select a model. Available models, account eligibility, usage limits, and billing depend on the provider."
  },
  {
    "question": "Where are my data stored and where do prompts go?",
    "answer": "Cube stores conversation history and memory in local SQLite under ~/.cube/memories, and credentials in ~/.cube/auth.json. Model requests go to your selected provider or local server. Connected MCP servers and network tools can receive data when used. Retention and training policies depend on those services; local storage does not imply zero data retention by a provider."
  },
  {
    "question": "Can I use local models without cloud inference?",
    "answer": "Yes. Start Ollama or LM Studio with a downloaded model, run /gateway, select local/ollama or local/lmstudio, then choose a model with /model. Inference uses the configured local server. Installation, update checks, web tools, remote MCP servers, and cloud-backed memory features may still use the network."
  },
  {
    "question": "How does Cube discover project context and rules?",
    "answer": "Launch cube in the directory you want to use as the workspace. Cube loads AGENTS.md there and in .agents, .cube, .claude, and .codex, plus global instructions from ~/.cube/AGENTS.md. It discovers scoped AGENTS.md files as tools explore workspace paths. Manage skills with /skills and refresh instructions and MCP configuration with /reload."
  },
  {
    "question": "How do tool permissions and updates work?",
    "answer": "Cube asks for workspace trust on first use. File edits, writes, patches, and shell commands require approval by default; /permissions lets you configure allow, ask, or deny rules, including MCP tools. Installed builds check for updates at startup and offer a verified download and restart. Re-running the installer also updates Cube while preserving ~/.cube data."
  }
];

