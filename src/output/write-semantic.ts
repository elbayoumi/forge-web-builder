/**
 * Semantic Output Writer v0.1
 * Writes ForgeSemanticBundle to disk
 */

import * as fs from 'fs';
import * as path from 'path';
import { ForgeSemanticBundle } from '../analyzer/semantic-builder';

/**
 * Write ForgeSemanticBundle to .forge/semantic/semantic.json
 */
export function writeSemanticBundle(bundle: ForgeSemanticBundle, basePath: string = process.cwd()): void {
  const outputDir = path.join(basePath, '.forge', 'semantic');
  const outputFile = path.join(outputDir, 'semantic.json');

  // Create directory if missing
  fs.mkdirSync(outputDir, { recursive: true });

  // Write semantic.json (pretty JSON)
  const jsonContent = JSON.stringify(bundle, null, 2);
  fs.writeFileSync(outputFile, jsonContent, 'utf-8');
}
