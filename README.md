# Forge Framework

**Semantic Build → Native Compile Platform**

Forge is a semantic compiler that transforms JavaScript UI intent into true native applications at build time — without runtimes, frameworks, or WebViews.

---

## Overview

Forge eliminates JavaScript runtime execution entirely by:

1. **Analyzing** JavaScript at build time
2. **Extracting** semantic intent
3. **Generating** real native projects

---

## Core Principles

- ✅ **Compile-time only** - No runtime execution
- ✅ **No JavaScript runtime** - Pure native code
- ✅ **No WebView** - True native UI
- ✅ **No framework lock-in** - Standard native projects
- ✅ **Full inspectability** - Every stage is transparent

---

## Quick Start

### 1. Create UI Source

Create `src/ui.js`:

```javascript
ui(column(text("Hello Forge"), button("Click Me", handleClick)));
```

### 2. Build Semantic Bundle

```bash
forge build web
```

Output: `.forge/semantic/semantic.json`

### 3. Generate Native Android

```bash
forge build android
```

Output: `.forge/native/android/` (complete Gradle project)

---

## Architecture

```
JavaScript UI DSL
      ↓
Web Semantic Builder
      ↓
Semantic Bundle (.forge/semantic/semantic.json)
      ↓
Native Compiler
      ↓
Native Android Project (Jetpack Compose)
```

---

## Project Structure

```
forge/
├── forge-core/              # Semantic type contracts
├── forge-web-builder/       # JavaScript → Semantic
├── forge-native-android/    # Semantic → Android
├── forge-cli/               # CLI orchestration
└── README.md
```

---

## CLI Commands

### Build Commands

```bash
# Build web semantic bundle
forge build web

# Build Android native project
forge build android
```

---

## Supported UI Components (v0.1)

| DSL Component             | Android Output                              |
| ------------------------- | ------------------------------------------- |
| `text("...")`             | `Text(text = "...")`                        |
| `button("label", action)` | `Button(onClick = {...}) { Text("label") }` |
| `column(...)`             | `Column { ... }`                            |
| `row(...)`                | `Row { ... }`                               |

---

## Example Workflow

### Input: `src/ui.js`

```javascript
ui(
  column(
    text("Welcome to Forge"),
    row(button("Start", onStart), button("Exit", onExit))
  )
);
```

### Output: `MainActivity.kt`

```kotlin
@Composable
fun MainScreen() {
    Column {
        Text(text = "Welcome to Forge")
        Row {
            Button(onClick = { Log.d("ForgeApp", "Button clicked: onStart") }) {
                Text(text = "Start")
            }
            Button(onClick = { Log.d("ForgeApp", "Button clicked: onExit") }) {
                Text(text = "Exit")
            }
        }
    }
}
```

---

## Android Configuration

- **compileSdk**: 34
- **minSdk**: 24
- **targetSdk**: 34
- **UI Framework**: Jetpack Compose
- **Material**: Material3

---

## What Forge Is NOT

- ❌ Not a JavaScript framework
- ❌ Not a runtime engine
- ❌ Not React Native
- ❌ Not Flutter
- ❌ Not Ionic
- ❌ Not a bundler

---

## Semantic Model

### UI Semantics

```json
{
  "ui": {
    "components": [
      {
        "id": "component_0",
        "type": "column",
        "props": {},
        "children": [...]
      }
    ],
    "layout": {
      "type": "flex",
      "direction": "column"
    }
  }
}
```

### State Semantics (v0.1)

```json
{
  "state": {
    "entities": [],
    "relationships": []
  }
}
```

### Action Semantics (v0.1)

```json
{
  "action": {
    "actions": [],
    "flows": []
  }
}
```

---

## Development

### Build All Packages

```bash
# Build forge-web-builder
cd forge-web-builder
npm install
npm run build

# Build forge-native-android
cd ../forge-native-android
npm install
npm run build

# Build forge-cli
cd ../forge-cli
npm install
npm run build
```

### Run Tests

```bash
# Test web builder
cd forge-web-builder
node test-semantic.js
node test-orchestration.js

# Test Android generator
cd ../forge-native-android
node test-generator.js

# Test CLI end-to-end
cd ../forge-cli
node test-e2e.js
```

---

## Design Constraints

Forge enforces strict constraints by design:

- ❌ No runtime JavaScript
- ❌ No DOM
- ❌ No JSX
- ❌ No CSS
- ❌ No dynamic execution

**These constraints are features, not limitations.**

---

## Determinism Guarantee

Forge guarantees:

- ✅ Same input → same output
- ✅ No hidden behavior
- ✅ No implicit defaults
- ✅ No silent fixes

All compiler stages are:

- **Explicit** - No magic
- **Inspectable** - Full transparency
- **Replaceable** - Modular architecture

---

## Roadmap

### ✅ Completed (v0.1)

- Semantic Core
- Web Semantic Builder
- Android Native Compiler
- CLI Orchestration
- Build Pipeline

### 🔜 Planned

- iOS Compiler (SwiftUI)
- Desktop Targets
- Extended Semantic Actions
- Plugin System (Post v1)

---

## Contributing

Forge is architecture-first. Before contributing:

1. Read this README
2. Respect semantic contracts
3. Do not introduce runtime logic
4. Do not assume future features

**Forge values correctness over convenience.**

---

## License

MIT

---

## Final Note

**Forge is not a framework. It is a compiler.**

If you approach it as a framework, you will misuse it.
