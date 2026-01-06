# Forge

A semantic compiler that transforms JavaScript UI declarations into native application code at build time.

## What Forge Is

Forge is a multi-stage compiler pipeline that eliminates JavaScript runtime execution by extracting semantic intent from UI code and generating native projects. It is not a framework, runtime, or bundler.

## Architecture

```
JavaScript UI DSL
      ↓
  AST Parser
      ↓
Semantic Analyzer
      ↓
Semantic Bundle (.forge/semantic/semantic.json)
      ↓
Native Code Generator
      ↓
Native Project (Gradle/Xcode)
```

Each stage is deterministic, inspectable, and produces explicit artifacts.

## Pipeline Stages

### 1. Web Semantic Builder

Parses JavaScript UI declarations and extracts semantic intent.

**Input:** `src/ui.js`

```javascript
ui(column(text("Hello"), button("Submit", onSubmit)));
```

**Output:** `.forge/semantic/semantic.json`

```json
{
  "ui": {
    "components": [
      {
        "id": "component_0",
        "type": "column",
        "props": {},
        "children": [
          { "type": "text", "props": { "content": "Hello" } },
          { "type": "button", "props": { "label": "Submit", "action": "onSubmit" } }
        ]
      }
    ],
    "layout": { "type": "flex", "direction": "column" }
  },
  "state": { "entities": [], "relationships": [] },
  "action": { "actions": [], "flows": [] },
  "design": { "theme": {...}, "tokens": {...} }
}
```

### 2. Native Compiler

Consumes semantic bundle and generates native projects.

**Current Target:** Android (Jetpack Compose)

**Output:** `.forge/native/android/` (complete Gradle project)

```kotlin
@Composable
fun MainScreen() {
    Column {
        Text(text = "Hello")
        Button(onClick = { Log.d("ForgeApp", "Button clicked: onSubmit") }) {
            Text(text = "Submit")
        }
    }
}
```

## CLI Usage

### Build Commands

```bash
# Generate semantic bundle
forge build web

# Generate Android project
forge build android
```

### Inspector Commands

```bash
# View UI tree
forge inspect ui

# View full semantic bundle
forge inspect semantic
```

**Example Output:**

```
$ forge inspect ui
UI Tree:

column
  text {"content":"Hello"}
  button {"label":"Submit","action":"onSubmit"}
```

## Supported Components (v0.1)

| DSL                       | Android (Jetpack Compose)                   |
| ------------------------- | ------------------------------------------- |
| `text("...")`             | `Text(text = "...")`                        |
| `button("label", action)` | `Button(onClick = {...}) { Text("label") }` |
| `column(...)`             | `Column { ... }`                            |
| `row(...)`                | `Row { ... }`                               |

## What Forge Is Not

Forge is explicitly **not**:

- A JavaScript framework
- A runtime engine (no JS execution on device)
- A WebView wrapper
- React Native, Flutter, or Ionic
- A bundler or build tool
- A UI component library

## Design Constraints

Forge enforces strict compile-time constraints:

- No runtime JavaScript execution
- No DOM or browser APIs
- No dynamic code evaluation
- No CSS or styling DSL (v0.1)
- No state management (v0.1)

These are intentional design decisions, not temporary limitations.

## Current Limitations

**v0.1 supports:**

- Static UI declarations only
- Four component types (text, button, column, row)
- Android target only
- No navigation
- No state management
- No network requests
- No animations

**Not supported:**

- Conditional rendering
- Dynamic lists
- User input handling beyond button clicks
- iOS, Web, or Desktop targets
- Third-party component integration

## Determinism Guarantees

Forge guarantees:

- Identical input produces identical output
- No hidden transformations
- No implicit behavior
- All intermediate artifacts are inspectable

## Development

### Build All Packages

```bash
cd forge-web-builder && npm install && npm run build
cd ../forge-native-android && npm install && npm run build
cd ../forge-cli && npm install && npm run build
```

### Run Tests

```bash
cd forge-web-builder && node test-semantic.js && node test-orchestration.js
cd ../forge-native-android && node test-generator.js
cd ../forge-cli && node test-e2e.js && node test-inspector.js
```

## Project Structure

```
forge/
├── forge-core/              # Type contracts and semantic model
├── forge-web-builder/       # JavaScript → Semantic compiler
├── forge-native-android/    # Semantic → Android generator
└── forge-cli/               # CLI orchestration and inspection
```

## Roadmap

### Completed (v0.1)

- Semantic model definition
- JavaScript UI parser
- Semantic bundle generation
- Android code generator (Jetpack Compose)
- CLI build orchestration
- Inspector commands

### Planned (v0.2)

- Conditional rendering support
- List rendering
- Basic state management
- Navigation primitives

### Future

- iOS target (SwiftUI)
- Web target (framework-agnostic)
- Desktop targets
- Plugin system for custom components

## Android Configuration

- **compileSdk:** 34
- **minSdk:** 24
- **targetSdk:** 34
- **Compose:** 1.5.4
- **Material:** Material3

## Contributing

Forge is architecture-first. Contributions must:

1. Maintain deterministic behavior
2. Preserve compile-time guarantees
3. Not introduce runtime logic
4. Include tests for all code paths

## License

MIT

## Technical Notes

Forge uses Babel for AST parsing, TypeScript for the compiler toolchain, and generates standard Gradle projects with no custom runtime dependencies. The semantic bundle is the single source of truth and can be consumed by any conforming code generator.

The compiler makes no assumptions about target platform capabilities beyond what is explicitly modeled in the semantic bundle. This allows for future targets without modifying the semantic model.
