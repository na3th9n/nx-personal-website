// Regenerates content.schema.json from the zod schema so editors (VS Code +
// the YAML extension) can autocomplete and check content.yaml.
// Run: npm run schema
import { writeFileSync } from "node:fs";
import { z } from "zod";
import { contentSchema } from "../src/lib/schema.ts";

const schema = z.toJSONSchema(contentSchema, { io: "input", unrepresentable: "any" });
writeFileSync(
  new URL("../content.schema.json", import.meta.url),
  JSON.stringify({ title: "content.yaml", ...schema }, null, 2) + "\n",
);
console.log("wrote content.schema.json");
