/**
 * UI DSL Parser
 * Parses supported UI DSL calls into plain JS object tree
 */

import { parse } from '@babel/parser';
import * as t from '@babel/types';

export interface UINode {
  type: string;
  props?: Record<string, any>;
  children?: UINode[];
}

const SUPPORTED_DSL = ['ui', 'column', 'row', 'text', 'button'];

export function parseUICode(sourceCode: string): UINode {
  const ast = parse(sourceCode, {
    sourceType: 'module',
    plugins: []
  });

  // Find the first expression statement with a call expression
  const program = ast.program;
  
  for (const statement of program.body) {
    if (t.isExpressionStatement(statement) && t.isCallExpression(statement.expression)) {
      return parseCallExpression(statement.expression);
    }
  }

  throw new Error('No valid UI DSL call found');
}

function parseCallExpression(node: t.CallExpression): UINode {
  if (!t.isIdentifier(node.callee)) {
    throw new Error('Unsupported syntax: callee must be an identifier');
  }

  const functionName = node.callee.name;

  if (!SUPPORTED_DSL.includes(functionName)) {
    throw new Error(`Unsupported DSL function: ${functionName}`);
  }

  const uiNode: UINode = {
    type: functionName
  };

  // Parse arguments based on function type
  if (functionName === 'button') {
    // button(label, action)
    if (node.arguments.length !== 2) {
      throw new Error('button() requires exactly 2 arguments: label and action');
    }

    const arg0 = node.arguments[0];
    const arg1 = node.arguments[1];

    if (t.isArgumentPlaceholder(arg0) || t.isArgumentPlaceholder(arg1)) {
      throw new Error('Unsupported syntax: argument placeholders not allowed');
    }

    const label = parseArgument(arg0);
    const action = parseArgument(arg1);

    uiNode.props = {
      label,
      action
    };
  } else if (functionName === 'text') {
    // text(content)
    if (node.arguments.length !== 1) {
      throw new Error('text() requires exactly 1 argument');
    }

    const arg0 = node.arguments[0];

    if (t.isArgumentPlaceholder(arg0)) {
      throw new Error('Unsupported syntax: argument placeholders not allowed');
    }

    const content = parseArgument(arg0);
    uiNode.props = { content };
  } else if (functionName === 'column' || functionName === 'row' || functionName === 'ui') {
    // column(...children), row(...children), ui(...children)
    const children: UINode[] = [];

    for (const arg of node.arguments) {
      if (t.isCallExpression(arg)) {
        children.push(parseCallExpression(arg));
      } else {
        throw new Error('Unsupported syntax: arguments must be call expressions');
      }
    }

    if (children.length > 0) {
      uiNode.children = children;
    }
  }

  return uiNode;
}

function parseArgument(node: t.Expression | t.SpreadElement): any {
  if (t.isStringLiteral(node)) {
    return node.value;
  }

  if (t.isNumericLiteral(node)) {
    return node.value;
  }

  if (t.isBooleanLiteral(node)) {
    return node.value;
  }

  if (t.isIdentifier(node)) {
    return node.name;
  }

  throw new Error('Unsupported argument type');
}
