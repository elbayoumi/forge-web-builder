/**
 * Test runWebSemanticBuild orchestration function
 */

const { runWebSemanticBuild } = require('./dist/index');
const fs = require('fs');
const path = require('path');

console.log('Testing runWebSemanticBuild...\n');

// Setup: Create test project structure
const testDir = path.join(__dirname, 'test-orchestration');
const srcDir = path.join(testDir, 'src');
fs.mkdirSync(srcDir, { recursive: true });

// Create src/ui.js
const uiSource = `ui(
  column(
    text("Welcome to Forge"),
    button("Get Started", onStart)
  )
)`;

fs.writeFileSync(path.join(srcDir, 'ui.js'), uiSource);
console.log('✓ Created test project with src/ui.js\n');

// Test 1: Run orchestration
const originalCwd = process.cwd();
try {
    process.chdir(testDir);

    runWebSemanticBuild().then(() => {
        console.log('✓ runWebSemanticBuild() completed\n');

        // Test 2: Verify semantic.json was created
        const semanticPath = path.join(testDir, '.forge', 'semantic', 'semantic.json');
        if (fs.existsSync(semanticPath)) {
            console.log('✓ .forge/semantic/semantic.json created');

            const semanticContent = fs.readFileSync(semanticPath, 'utf-8');
            const bundle = JSON.parse(semanticContent);

            // Test 3: Verify bundle structure
            if (bundle.ui && bundle.state && bundle.action && bundle.design) {
                console.log('✓ Semantic bundle has correct structure');
            } else {
                console.error('✗ Semantic bundle structure incorrect');
                process.exit(1);
            }

            // Test 4: Verify UI components
            if (bundle.ui.components.length > 0) {
                const rootComponent = bundle.ui.components[0];
                console.log('✓ UI components generated');
                console.log(`  Root type: ${rootComponent.type}`);
                console.log(`  Children: ${rootComponent.children ? rootComponent.children.length : 0}`);
            } else {
                console.error('✗ No UI components found');
                process.exit(1);
            }

            console.log('\n---\n');

            // Test 5: Verify error handling (missing src/ui.js)
            process.chdir(originalCwd);
            const testDir2 = path.join(__dirname, 'test-orchestration-2');
            fs.mkdirSync(testDir2, { recursive: true });
            process.chdir(testDir2);

            runWebSemanticBuild().then(() => {
                console.error('✗ Should have thrown error for missing src/ui.js');
                process.exit(1);
            }).catch((error) => {
                if (error.message.includes('UI source file not found')) {
                    console.log('✓ Error handling works for missing src/ui.js');
                    console.log(`  Error: ${error.message}`);
                } else {
                    console.error('✗ Wrong error message:', error.message);
                    process.exit(1);
                }

                console.log('\nAll tests completed!');

                // Cleanup
                process.chdir(originalCwd);
                console.log('\nCleaning up test directories...');
                fs.rmSync(testDir, { recursive: true, force: true });
                fs.rmSync(testDir2, { recursive: true, force: true });
                console.log('✓ Cleanup complete');
            });

        } else {
            console.error('✗ semantic.json not created');
            process.exit(1);
        }

    }).catch((error) => {
        console.error('✗ runWebSemanticBuild() failed:', error.message);
        process.chdir(originalCwd);
        process.exit(1);
    });

} catch (error) {
    console.error('✗ Test setup failed:', error.message);
    process.chdir(originalCwd);
    process.exit(1);
}
