import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, test } from "vitest";

const cleanerPath = fileURLToPath(new URL("./url-porter.clean-config.js", import.meta.url));

/**
 * Executes the cleaner against an isolated fixture and removes its temporary files.
 * @param {string} source Raw JSONC input written to a unique temporary directory.
 * @returns {{status: number | null, stdout: string, stderr: string, output: string}} CLI result and rewritten file contents.
 * @throws {Error} If temporary-file operations or process startup fail.
 */
function runCleaner(source) {
  const directory = mkdtempSync(join(tmpdir(), "fav-cleaner-"));
  const inputPath = join(directory, "url-porter.jsonc");

  try {
    writeFileSync(inputPath, source, "utf8");
    const result = spawnSync(process.execPath, [cleanerPath], {
      cwd: directory,
      encoding: "utf8",
      timeout: 5000,
    });
    if (result.error) throw result.error;

    return {
      status: result.status,
      stdout: result.stdout,
      stderr: result.stderr,
      output: readFileSync(inputPath, "utf8"),
    };
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

describe("URL Porter cleaner CLI", () => {
  test("normalizes JSONC aliases and URLs while removing duplicate pairs", () => {
    const result = runCleaner(`{
      // Preserve the supplied homepage rather than applying the default.
      "homepage": "https://home.example/",
      "configs": [
        [" ||GO^ ", "example.com///"],
        { "from": " go ", "to": "example.com/" },
        { "from": "^Docs^", "to": " https://docs.example/// " },
        ["Café🚀", "https://unicode.example/"],
        /* The same alias can still point to a different URL. */
        ["go", "https://other.example/"],
      ],
    }`);

    expect({ ...result, output: JSON.parse(result.output) }).toMatchInlineSnapshot(`
      {
        "output": {
          "configs": [
            [
              "go",
              "http://example.com",
            ],
            [
              "docs",
              "https://docs.example",
            ],
            [
              "caf",
              "https://unicode.example",
            ],
            [
              "go",
              "https://other.example",
            ],
          ],
          "homepage": "https://home.example/",
        },
        "status": 0,
        "stderr": "",
        "stdout": "Successfully updated url-porter.jsonc
      ",
      }
    `);
  });

  test("accepts bare arrays and retains empty values", () => {
    const result = runCleaner(`[
      ["", ""],
      ["", ""],
      {},
      ["NEWS", "news.example/"],
      ["secure", "HTTPS://secure.example///"]
    ]`);

    expect({ ...result, output: JSON.parse(result.output) }).toMatchInlineSnapshot(`
      {
        "output": {
          "configs": [
            [
              "",
              "",
            ],
            [
              "news",
              "http://news.example",
            ],
            [
              "secure",
              "HTTPS://secure.example",
            ],
          ],
          "homepage": "https://synle.github.io/fav/",
        },
        "status": 0,
        "stderr": "",
        "stdout": "Successfully updated url-porter.jsonc
      ",
      }
    `);
  });

  test("preserves supported optional settings and trims the folder name", () => {
    const result = runCleaner(`{
      "configs": [],
      "bookmarkRules": [{"pattern": "docs", "folder": "Reference"}],
      "bookmarkFolderName": "  Favorites  ",
      "historyAliasLimit": 1,
      "historyEntryLimit": 2,
      "githubOrgThreshold": 3,
      "statsVisitThreshold": 4,
      "statsMaxResults": 5,
      "statsLookbackMonths": 6,
      "unrecognizedSetting": true
    }`);

    expect({ ...result, output: JSON.parse(result.output) }).toMatchInlineSnapshot(`
      {
        "output": {
          "bookmarkFolderName": "Favorites",
          "bookmarkRules": [
            {
              "folder": "Reference",
              "pattern": "docs",
            },
          ],
          "configs": [],
          "githubOrgThreshold": 3,
          "historyAliasLimit": 1,
          "historyEntryLimit": 2,
          "homepage": "https://synle.github.io/fav/",
          "statsLookbackMonths": 6,
          "statsMaxResults": 5,
          "statsVisitThreshold": 4,
        },
        "status": 0,
        "stderr": "",
        "stdout": "Successfully updated url-porter.jsonc
      ",
      }
    `);
  });

  test("omits invalid optional settings and defaults missing configs", () => {
    const result = runCleaner(`{
      "homepage": "",
      "bookmarkRules": {},
      "bookmarkFolderName": "   ",
      "historyAliasLimit": 0,
      "historyEntryLimit": -1,
      "githubOrgThreshold": "3",
      "statsVisitThreshold": null,
      "statsMaxResults": false,
      "statsLookbackMonths": 0
    }`);

    expect({ ...result, output: JSON.parse(result.output) }).toMatchInlineSnapshot(`
      {
        "output": {
          "configs": [],
          "homepage": "https://synle.github.io/fav/",
        },
        "status": 0,
        "stderr": "",
        "stdout": "Successfully updated url-porter.jsonc
      ",
      }
    `);
  });

  test("normalization is idempotent on a second cleaner run", () => {
    const first = runCleaner('{"configs": [["^Go^", "example.com///"]]}');
    const second = runCleaner(first.output);

    expect(first.status).toBe(0);
    expect(first.stderr).toBe("");
    expect(second.status).toBe(0);
    expect(second.stderr).toBe("");
    expect(second.output).toBe(first.output);
  });

  test("reports malformed JSON without overwriting the input", () => {
    const source = '{ "configs": [';
    const result = runCleaner(source);

    // Characterize the existing CLI: parse errors are logged but still exit zero.
    expect(result.status).toBe(0);
    expect(result.stdout).toBe("");
    expect(result.stderr).toContain("Error processing the JSON file:");
    expect(result.output).toBe(source);
  });
});
