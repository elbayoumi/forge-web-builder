📘 Forge Framework
Semantic Build → Native Compile Platform

Forge is a semantic compiler that transforms JavaScript UI intent into true native applications at build time — without runtimes, frameworks, or WebViews.

Table of Contents

Overview

Core Philosophy

What Forge Is / Is Not

High-Level Architecture

End-to-End Pipeline

Semantic Model (Core Concepts)

Project Structure

CLI Commands

Web Semantic Build

Native Android Compiler

Inspector

Design Constraints

Determinism & Governance

Roadmap

Contribution Rules

1. Overview

Forge is a semantic compiler platform designed to solve a fundamental problem in modern cross-platform development:

Existing solutions execute JavaScript at runtime.
Forge eliminates runtime execution entirely.

Instead of running JavaScript on native platforms, Forge:

Analyzes JavaScript at build time

Extracts semantic intent

Generates real native projects

2. Core Philosophy

Forge is built on five non-negotiable principles:

Compile-time only

No JavaScript runtime

No WebView

No framework lock-in

Full inspectability

If a feature violates any of these principles, it does not belong in Forge.

3. What Forge Is / Is Not
Forge IS:

A semantic compiler

A build-time toolchain

A native code generator

A deterministic system

A multi-stage compiler pipeline

Forge IS NOT:

A JavaScript framework

A runtime engine

A bundler

React Native

Flutter

Ionic

A UI library

4. High-Level Architecture

Forge is divided into independent, deterministic stages:

JavaScript UI DSL
        ↓
Web Semantic Builder
        ↓
Semantic Artifacts (.forge/)
        ↓
Native Compiler
        ↓
True Native Projects


Each stage:

Has a single responsibility

Produces explicit output

Can be inspected independently

5. End-to-End Pipeline
Step 1 — Web Semantic Build

Parses JavaScript UI DSL

Extracts semantic intent

Produces .forge/semantic/semantic.json

Step 2 — Native Compilation

Consumes semantic artifacts

Generates a native Android project

Uses Jetpack Compose (v0.1)

6. Semantic Model (Core Concepts)
6.1 UI Semantics

Forge does not work with DOM or JSX.

It uses a semantic UI graph:

{
  "type": "container",
  "layout": "column",
  "children": [
    { "type": "text", "value": "Hello" },
    { "type": "button", "label": "Submit", "action": "submit" }
  ]
}


Supported UI nodes (v0.1):

container (column / row)

text

button

6.2 State Semantics

State is declarative only:

{
  "fields": []
}


No lifecycle, no observers, no runtime behavior.

6.3 Actions

Actions describe intent, not implementation:

{
  "name": "submit",
  "effects": [],
  "inputs": []
}

6.4 Semantic Bundle (Source of Truth)

All semantics are stored in a single canonical bundle:

.forge/semantic/semantic.json


This file is:

Deterministic

Rebuildable

Inspectable

The only source of truth

7. Project Structure
forge/
├── forge-core/               # Semantic contracts & validation
├── forge-web-builder/        # JS → Semantic
├── forge-native-android/     # Semantic → Android
├── forge-cli/                # Orchestration & inspection
├── docs/
└── README.md

8. CLI Commands
Build Commands
forge build web
forge build android

Inspection Commands
forge inspect ui
forge inspect semantic

9. Web Semantic Build
Input

JavaScript UI DSL

Fixed project convention (v0.1)

Output
.forge/
└── semantic/
    └── semantic.json

Responsibilities

AST parsing

Semantic extraction

No runtime execution

10. Native Android Compiler (v0.1)
Output Location
.forge/native/android/

Generated Project Includes:

Full Gradle project

MainActivity.kt

Jetpack Compose UI

No WebView

No JavaScript

Android Configuration

compileSdk: 34

minSdk: 24

targetSdk: 34

11. Inspector

Forge includes a read-only inspection system.

Example
forge inspect ui


Prints:

Parsed UI tree

Semantic structure

forge inspect semantic


Prints:

Full semantic bundle (pretty JSON)

12. Design Constraints (Intentional)

Forge enforces strict constraints:

❌ No runtime JavaScript

❌ No DOM

❌ No JSX

❌ No CSS

❌ No dynamic execution

These constraints are features, not limitations.

13. Determinism & Governance

Forge guarantees:

Same input → same output

No hidden behavior

No implicit defaults

No silent fixes

All compiler stages are:

Explicit

Inspectable

Replaceable

14. Roadmap
Completed

Semantic Core

Web Semantic Builder

Android Native Compiler

CLI Orchestration

Inspector

Planned

iOS Compiler (SwiftUI)

Desktop Targets

Extended Semantic Actions

Plugin System (Post v1)

15. Contribution Rules

Forge is architecture-first.

Before contributing:

Read this README

Respect semantic contracts

Do not introduce runtime logic

Do not assume future features

Forge values correctness over convenience.

Final Note

Forge is not a framework.
It is a compiler.

If you approach it as a framework, you will misuse it.