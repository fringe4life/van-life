import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, "../..");
const SPAWN_MAX_BUFFER_BYTES = 16 * 1024 * 1024;
const MAX_AGENT_MESSAGE_CHARS = 16_384;
const AUDIT_ARGS = [
  "audit",
  "--format",
  "json",
  "--quiet",
  "--explain",
  "--gate-marker",
  "agent",
];
const GIT_MUTATION = /\bgit\s+(?:commit|push)\b/;

const allow = () => {
  console.log(JSON.stringify({ permission: "allow" }));
  process.exit(0);
};

const deny = (message) => {
  const clipped =
    message.length > MAX_AGENT_MESSAGE_CHARS
      ? `${message.slice(0, MAX_AGENT_MESSAGE_CHARS)}\n…truncated`
      : message;
  console.log(
    JSON.stringify({
      permission: "deny",
      user_message: "Fallow audit failed. Fix introduced findings before commit/push.",
      agent_message: clipped,
    })
  );
  process.exit(0);
};

const readStdinJson = () => {
  try {
    return JSON.parse(readFileSync(0, "utf8") || "{}");
  } catch {
    return {};
  }
};

const parseJsonObject = (text) => {
  const start = text.indexOf("{");
  if (start === -1) {
    return;
  }
  try {
    const parsed = JSON.parse(text.slice(start));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed;
    }
  } catch {
    return;
  }
};

const collectIntroduced = (items) => {
  if (!Array.isArray(items)) {
    return [];
  }
  return items.filter((item) => item?.introduced === true);
};

const compactAudit = (audit) => {
  const deadCode = audit.dead_code ?? {};
  const complexity = audit.complexity ?? {};
  const duplication = audit.duplication ?? {};
  const stylingFindings = collectIntroduced(audit.styling_findings);

  return {
    kind: audit.kind,
    verdict: audit.verdict,
    version: audit.version,
    changed_files_count: audit.changed_files_count,
    base_description: audit.base_description,
    summary: audit.summary,
    attribution: audit.attribution,
    next_steps: audit.next_steps,
    introduced: {
      unused_files: collectIntroduced(deadCode.unused_files),
      unused_exports: collectIntroduced(deadCode.unused_exports),
      unused_types: collectIntroduced(deadCode.unused_types),
      unused_dependencies: collectIntroduced(deadCode.unused_dependencies),
      unresolved_imports: collectIntroduced(deadCode.unresolved_imports),
      unlisted_dependencies: collectIntroduced(deadCode.unlisted_dependencies),
      circular_dependencies: collectIntroduced(deadCode.circular_dependencies),
      boundary_violations: collectIntroduced(deadCode.boundary_violations),
      complexity_findings: collectIntroduced(complexity.findings),
      clone_groups: collectIntroduced(duplication.clone_groups),
      styling_findings: stylingFindings,
    },
  };
};

const resolveFallowBin = (root) => {
  const localBin =
    process.platform === "win32"
      ? join(root, "node_modules", ".bin", "fallow.cmd")
      : join(root, "node_modules", ".bin", "fallow");
  if (existsSync(localBin)) {
    return { command: localBin, args: AUDIT_ARGS };
  }
  return { command: "bun", args: ["x", "fallow", ...AUDIT_ARGS] };
};

const runAudit = (root) => {
  const { command, args } = resolveFallowBin(root);
  return spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    maxBuffer: SPAWN_MAX_BUFFER_BYTES,
    env: {
      ...process.env,
      FALLOW_AGENT_SOURCE: "cursor",
    },
  });
};

const main = () => {
  const input = readStdinJson();
  const command = typeof input.command === "string" ? input.command : "";
  if (command && !GIT_MUTATION.test(command)) {
    allow();
  }

  const root =
    typeof input.cwd === "string" && existsSync(join(input.cwd, "package.json"))
      ? input.cwd
      : PROJECT_ROOT;

  try {
    process.chdir(root);
  } catch {
    allow();
  }

  const result = runAudit(root);
  const stdout = result.stdout ?? "";
  const combined = `${stdout}\n${result.stderr ?? ""}`;
  const parsed = parseJsonObject(stdout) ?? parseJsonObject(combined);

  // Exit 2 / missing binary / unreadable envelope: fail-open (same as Claude fallow-gate).
  if (result.error?.code === "ENOENT" || result.status === 127 || result.status === 9009) {
    allow();
  }
  if (result.status === 2 || parsed?.error === true) {
    allow();
  }
  if (!parsed) {
    if (result.status === 1) {
      deny(
        `Fallow audit exited 1 but JSON was unreadable. stdout/stderr:\n${combined.trim()}`
      );
    }
    allow();
  }

  if (parsed.verdict !== "fail") {
    allow();
  }

  deny(
    [
      "Fallow audit verdict: fail. Fix introduced findings, then retry git commit/push.",
      "Gate is new-only: inherited issues on touched files do not fail.",
      JSON.stringify(compactAudit(parsed), null, 2),
    ].join("\n\n")
  );
};

main();
