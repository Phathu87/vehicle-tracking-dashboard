import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["--test", "--test-concurrency=1"], {
  cwd: process.cwd(),
  env: { ...process.env, NODE_ENV: "test", DATABASE_PATH: ":memory:" },
  stdio: "inherit",
});

if (result.error) throw result.error;
process.exitCode = result.status ?? 1;
