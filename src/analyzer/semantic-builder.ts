/**
 * Semantic Builder v0.1
 * Maps parsed UI tree to ForgeSemanticBundle
 */

import { UINode } from "../parser/ui-parser";

// Import types from forge-core
export interface ForgeSemanticBundle {
  ui: UISemanticModel;
  state: StateSemanticModel;
  action: ActionSemanticModel;
  design: DesignSemanticModel;
}

export interface UISemanticModel {
  components: UIComponent[];
  layout: LayoutDefinition;
}

export interface UIComponent {
  id: string;
  type: string;
  props: Record<string, unknown>;
  children?: UIComponent[];
}

export interface LayoutDefinition {
  type: "flex" | "grid" | "stack";
  direction?: "row" | "column";
  gap?: number;
  alignment?: string;
}

export interface StateSemanticModel {
  entities: StateEntity[];
  relationships: StateRelationship[];
}

export interface StateEntity {
  id: string;
  name: string;
  fields: StateField[];
}

export interface StateField {
  name: string;
  type: string;
  required: boolean;
  defaultValue?: unknown;
}

export interface StateRelationship {
  from: string;
  to: string;
  type: "one-to-one" | "one-to-many" | "many-to-many";
}

export interface ActionSemanticModel {
  actions: Action[];
  flows: ActionFlow[];
}

export interface Action {
  id: string;
  name: string;
  type: "mutation" | "query" | "effect";
  inputs: ActionInput[];
  outputs: ActionOutput[];
}

export interface ActionInput {
  name: string;
  type: string;
  required: boolean;
}

export interface ActionOutput {
  name: string;
  type: string;
}

export interface ActionFlow {
  id: string;
  steps: ActionStep[];
}

export interface ActionStep {
  actionId: string;
  order: number;
  condition?: string;
}

export interface DesignSemanticModel {
  theme: ThemeDefinition;
  tokens: DesignTokens;
}

export interface ThemeDefinition {
  name: string;
  colors: Record<string, string>;
  typography: TypographyDefinition;
  spacing: Record<string, number>;
}

export interface TypographyDefinition {
  fontFamily: string;
  fontSize: Record<string, number>;
  fontWeight: Record<string, number>;
  lineHeight: Record<string, number>;
}

export interface DesignTokens {
  colors: Record<string, string>;
  spacing: Record<string, number>;
  borderRadius: Record<string, number>;
  shadows: Record<string, string>;
}

let componentIdCounter = 0;

/**
 * Build ForgeSemanticBundle from parsed UI tree
 */
export function buildSemanticBundle(uiTree: UINode): ForgeSemanticBundle {
  // Reset counter for deterministic output
  componentIdCounter = 0;

  const components = convertUINode(uiTree);
  const layout = inferLayout(uiTree);

  return {
    ui: {
      components: [components],
      layout,
    },
    state: {
      entities: [],
      relationships: [],
    },
    action: {
      actions: [],
      flows: [],
    },
    design: {
      theme: {
        name: '',
        colors: {},
        typography: {
          fontFamily: '',
          fontSize: {},
          fontWeight: {},
          lineHeight: {}
        },
        spacing: {}
      },
      tokens: {
        colors: {},
        spacing: {},
        borderRadius: {},
        shadows: {}
      }
    },
  };
}

/**
 * Convert UINode to UIComponent
 */
function convertUINode(node: UINode): UIComponent {
  const component: UIComponent = {
    id: `component_${componentIdCounter++}`,
    type: node.type,
    props: node.props || {},
  };

  if (node.children && node.children.length > 0) {
    component.children = node.children.map((child) => convertUINode(child));
  }

  return component;
}

/**
 * Infer layout from root UINode
 */
function inferLayout(node: UINode): LayoutDefinition {
  if (node.type === "column") {
    return {
      type: "flex",
      direction: "column",
    };
  }

  if (node.type === "row") {
    return {
      type: "flex",
      direction: "row",
    };
  }

  // Default layout for 'ui' or other types
  return {
    type: "stack",
  };
}
