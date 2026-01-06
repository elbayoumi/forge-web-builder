/**
 * Test file to verify Semantic Builder behavior
 */

const { parseUICode, buildSemanticBundle } = require('./dist/index');

console.log('Testing Semantic Builder v0.1...\n');

// Test 1: Simple text component
try {
    const uiTree1 = parseUICode('text("Hello World")');
    const bundle1 = buildSemanticBundle(uiTree1);
    console.log('✓ text() semantic bundle:', JSON.stringify(bundle1, null, 2));
} catch (e) {
    console.error('✗ text() failed:', e.message);
}

console.log('\n---\n');

// Test 2: Button component
try {
    const uiTree2 = parseUICode('button("Click me", handleClick)');
    const bundle2 = buildSemanticBundle(uiTree2);
    console.log('✓ button() semantic bundle:', JSON.stringify(bundle2, null, 2));
} catch (e) {
    console.error('✗ button() failed:', e.message);
}

console.log('\n---\n');

// Test 3: Column with nested children
try {
    const uiTree3 = parseUICode('column(text("Item 1"), text("Item 2"))');
    const bundle3 = buildSemanticBundle(uiTree3);
    console.log('✓ column() semantic bundle:', JSON.stringify(bundle3, null, 2));
} catch (e) {
    console.error('✗ column() failed:', e.message);
}

console.log('\n---\n');

// Test 4: Complex nested structure
try {
    const uiTree4 = parseUICode('ui(column(text("Title"), row(button("OK", ok), button("Cancel", cancel))))');
    const bundle4 = buildSemanticBundle(uiTree4);
    console.log('✓ Complex nesting semantic bundle:', JSON.stringify(bundle4, null, 2));
} catch (e) {
    console.error('✗ Complex nesting failed:', e.message);
}

console.log('\n---\n');

// Test 5: Deterministic output - run twice and compare
try {
    const uiTree5a = parseUICode('row(button("Yes", yes), button("No", no))');
    const bundle5a = buildSemanticBundle(uiTree5a);

    const uiTree5b = parseUICode('row(button("Yes", yes), button("No", no))');
    const bundle5b = buildSemanticBundle(uiTree5b);

    const json5a = JSON.stringify(bundle5a);
    const json5b = JSON.stringify(bundle5b);

    if (json5a === json5b) {
        console.log('✓ Deterministic output verified - identical results on multiple runs');
    } else {
        console.error('✗ Non-deterministic output detected!');
    }
} catch (e) {
    console.error('✗ Deterministic test failed:', e.message);
}

console.log('\n---\n');

// Test 6: Verify empty state/action/design
try {
    const uiTree6 = parseUICode('text("Test")');
    const bundle6 = buildSemanticBundle(uiTree6);

    const hasEmptyState = bundle6.state.entities.length === 0 && bundle6.state.relationships.length === 0;
    const hasEmptyActions = bundle6.action.actions.length === 0 && bundle6.action.flows.length === 0;
    const hasValidDesign = bundle6.design.theme && bundle6.design.tokens;

    if (hasEmptyState && hasEmptyActions && hasValidDesign) {
        console.log('✓ Empty state/actions verified, design structure present');
    } else {
        console.error('✗ Unexpected state/action/design values');
    }
} catch (e) {
    console.error('✗ Empty verification failed:', e.message);
}

console.log('\nAll tests completed!');
