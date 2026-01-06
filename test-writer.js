/**
 * Test file to verify Semantic Output Writer behavior
 */

const { parseUICode, buildSemanticBundle, writeSemanticBundle } = require('./dist/index');
const fs = require('fs');
const path = require('path');

console.log('Testing Semantic Output Writer v0.1...\n');

// Test 1: Write simple semantic bundle
try {
    const uiTree1 = parseUICode('text("Hello World")');
    const bundle1 = buildSemanticBundle(uiTree1);

    const testDir1 = path.join(__dirname, 'test-output-1');
    writeSemanticBundle(bundle1, testDir1);

    const outputPath1 = path.join(testDir1, '.forge', 'semantic', 'semantic.json');
    const exists1 = fs.existsSync(outputPath1);

    if (exists1) {
        const content1 = fs.readFileSync(outputPath1, 'utf-8');
        const parsed1 = JSON.parse(content1);
        console.log('✓ Simple bundle written to:', outputPath1);
        console.log('  File size:', content1.length, 'bytes');
    } else {
        console.error('✗ Output file not created');
    }
} catch (e) {
    console.error('✗ Simple write failed:', e.message);
}

console.log('\n---\n');

// Test 2: Write complex nested structure
try {
    const uiTree2 = parseUICode('ui(column(text("Title"), row(button("OK", ok), button("Cancel", cancel))))');
    const bundle2 = buildSemanticBundle(uiTree2);

    const testDir2 = path.join(__dirname, 'test-output-2');
    writeSemanticBundle(bundle2, testDir2);

    const outputPath2 = path.join(testDir2, '.forge', 'semantic', 'semantic.json');
    const content2 = fs.readFileSync(outputPath2, 'utf-8');
    const parsed2 = JSON.parse(content2);

    console.log('✓ Complex bundle written');
    console.log('  Components count:', parsed2.ui.components[0].children[0].children.length);
} catch (e) {
    console.error('✗ Complex write failed:', e.message);
}

console.log('\n---\n');

// Test 3: Verify overwrite behavior
try {
    const uiTree3a = parseUICode('text("First")');
    const bundle3a = buildSemanticBundle(uiTree3a);

    const testDir3 = path.join(__dirname, 'test-output-3');
    writeSemanticBundle(bundle3a, testDir3);

    const outputPath3 = path.join(testDir3, '.forge', 'semantic', 'semantic.json');
    const content3a = fs.readFileSync(outputPath3, 'utf-8');

    // Overwrite with different content
    const uiTree3b = parseUICode('text("Second")');
    const bundle3b = buildSemanticBundle(uiTree3b);
    writeSemanticBundle(bundle3b, testDir3);

    const content3b = fs.readFileSync(outputPath3, 'utf-8');
    const parsed3b = JSON.parse(content3b);

    if (parsed3b.ui.components[0].props.content === 'Second') {
        console.log('✓ Overwrite behavior verified');
    } else {
        console.error('✗ Overwrite failed');
    }
} catch (e) {
    console.error('✗ Overwrite test failed:', e.message);
}

console.log('\n---\n');

// Test 4: Verify output matches input exactly
try {
    const uiTree4 = parseUICode('column(text("Item 1"), text("Item 2"))');
    const bundle4 = buildSemanticBundle(uiTree4);

    const testDir4 = path.join(__dirname, 'test-output-4');
    writeSemanticBundle(bundle4, testDir4);

    const outputPath4 = path.join(testDir4, '.forge', 'semantic', 'semantic.json');
    const content4 = fs.readFileSync(outputPath4, 'utf-8');
    const parsed4 = JSON.parse(content4);

    const originalJson = JSON.stringify(bundle4);
    const parsedJson = JSON.stringify(parsed4);

    if (originalJson === parsedJson) {
        console.log('✓ Output matches input exactly');
    } else {
        console.error('✗ Output does not match input');
    }
} catch (e) {
    console.error('✗ Exact match test failed:', e.message);
}

console.log('\n---\n');

// Test 5: Verify deterministic file output
try {
    const uiTree5 = parseUICode('row(button("Yes", yes), button("No", no))');
    const bundle5 = buildSemanticBundle(uiTree5);

    const testDir5a = path.join(__dirname, 'test-output-5a');
    const testDir5b = path.join(__dirname, 'test-output-5b');

    writeSemanticBundle(bundle5, testDir5a);
    writeSemanticBundle(bundle5, testDir5b);

    const content5a = fs.readFileSync(path.join(testDir5a, '.forge', 'semantic', 'semantic.json'), 'utf-8');
    const content5b = fs.readFileSync(path.join(testDir5b, '.forge', 'semantic', 'semantic.json'), 'utf-8');

    if (content5a === content5b) {
        console.log('✓ Deterministic file output verified');
    } else {
        console.error('✗ Non-deterministic output detected');
    }
} catch (e) {
    console.error('✗ Deterministic test failed:', e.message);
}

console.log('\n---\n');

// Test 6: Verify pretty JSON formatting
try {
    const uiTree6 = parseUICode('text("Test")');
    const bundle6 = buildSemanticBundle(uiTree6);

    const testDir6 = path.join(__dirname, 'test-output-6');
    writeSemanticBundle(bundle6, testDir6);

    const outputPath6 = path.join(testDir6, '.forge', 'semantic', 'semantic.json');
    const content6 = fs.readFileSync(outputPath6, 'utf-8');

    // Check for indentation (pretty formatting)
    if (content6.includes('\n') && content6.includes('  ')) {
        console.log('✓ Pretty JSON formatting verified');
    } else {
        console.error('✗ JSON not pretty formatted');
    }
} catch (e) {
    console.error('✗ Pretty format test failed:', e.message);
}

console.log('\nAll tests completed!');

// Cleanup test directories
console.log('\nCleaning up test directories...');
const testDirs = ['test-output-1', 'test-output-2', 'test-output-3', 'test-output-4', 'test-output-5a', 'test-output-5b', 'test-output-6'];
testDirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        fs.rmSync(fullPath, { recursive: true, force: true });
    }
});
console.log('✓ Cleanup complete');
