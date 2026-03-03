import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const readJson = async (path) => JSON.parse(await readFile(path, "utf8"));

test("Story 1.1 fixes: package versions and scripts are aligned", async () => {
  const packageJson = await readJson(new URL("../package.json", import.meta.url));

  assert.equal(packageJson.dependencies.prisma, "7.2.0");
  assert.equal(packageJson.dependencies["@prisma/client"], "7.2.0");
  assert.equal(packageJson.dependencies.bcryptjs, "^3.0.3");
  assert.ok(packageJson.scripts.dev);
  assert.ok(packageJson.scripts.lint);
  assert.ok(packageJson.scripts.test);
});

test("Story 1.1 fixes: shadcn config is present with default style", async () => {
  const componentsConfig = await readJson(new URL("../components.json", import.meta.url));

  assert.equal(componentsConfig.style, "default");
  assert.equal(componentsConfig.tailwind.css, "src/app/globals.css");
  assert.equal(componentsConfig.tailwind.baseColor, "neutral");
  assert.equal(componentsConfig.tailwind.cssVariables, true);
});

test("Story 1.1 fixes: Prisma is configured for sqlite", async () => {
  const schema = await readFile(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
  const prismaConfig = await readFile(new URL("../prisma.config.ts", import.meta.url), "utf8");

  assert.match(schema, /datasource db\s*{\s*provider = "sqlite"/s);
  assert.match(prismaConfig, /schema:\s*"prisma\/schema\.prisma"/);
  assert.match(prismaConfig, /url:\s*process\.env\["DATABASE_URL"\]/);
});

test("Story 1.1 fixes: layout no longer depends on remote Google Fonts", async () => {
  const layout = await readFile(new URL("../src/app/layout.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(layout, /next\/font\/google/);
  assert.match(layout, /title:\s*"MeuDinheiro"/);
  assert.match(layout, /lang="pt-BR"/);
});
