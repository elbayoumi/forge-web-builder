/**
 * Forge Web Builder - UI DSL Parser v0.1
 * Entry point
 */

import * as fs from 'fs';
import * as path from 'path';
import { parseUICode } from './parser/ui-parser';
import { buildSemanticBundle } from './analyzer/semantic-builder';
import { writeSemanticBundle } from './output/write-semantic';

export { parseUICode, UINode } from './parser/ui-parser';
export { buildSemanticBundle, ForgeSemanticBundle } from './analyzer/semantic-builder';
export { writeSemanticBundle } from './output/write-semantic';

/**
 * Run full web semantic build pipeline
 * Reads src/ui.js and generates .forge/semantic/semantic.json
 */
export async function runWebSemanticBuild(): Promise<void> {
  const projectRoot = process.cwd();
  const uiSourcePath = path.join(projectRoot, 'src', 'ui.js');

  // Check if src/ui.js exists
  if (!fs.existsSync(uiSourcePath)) {
    throw new Error(`UI source file not found: ${uiSourcePath}`);
  }

  // Read UI source code
  const sourceCode = fs.readFileSync(uiSourcePath, 'utf-8');

  // Parse UI code
  const parsedUI = parseUICode(sourceCode);

  // Build semantic bundle
  const bundle = buildSemanticBundle(parsedUI);

  // Write semantic bundle to disk
  writeSemanticBundle(bundle, projectRoot);
}
