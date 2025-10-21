#!/usr/bin/env node

/**
 * Debug Script for MediTech AI Healthcare Agent
 * 
 * This script helps debug the agent issues by testing the components step by step.
 */

console.log('🔍 MediTech AI Healthcare Agent - Debug Script');
console.log('==============================================\n');

const fs = require('fs');
const path = require('path');

// Test 1: Check if we can import the agent without errors
console.log('📋 Test 1: Testing Agent Import...');
try {
  // Check if the agent file exists and is valid
  const agentPath = path.join(__dirname, 'src', 'mastra', 'agents', 'index.ts');
  if (fs.existsSync(agentPath)) {
    console.log('✅ Agent file exists');
    
    const content = fs.readFileSync(agentPath, 'utf8');
    
    // Check for key components
    const hasHealthcareAgent = content.includes('healthcareAgent');
    const hasModel = content.includes('model:');
    const hasTools = content.includes('tools:');
    const hasMockModel = content.includes('mockModel');
    
    console.log('✅ healthcareAgent defined:', hasHealthcareAgent);
    console.log('✅ model property:', hasModel);
    console.log('✅ tools property:', hasTools);
    console.log('✅ mockModel defined:', hasMockModel);
    
    if (hasHealthcareAgent && hasModel && hasTools && hasMockModel) {
      console.log('✅ Agent structure looks correct');
    } else {
      console.log('❌ Agent structure has issues');
    }
  } else {
    console.log('❌ Agent file not found');
  }
} catch (error) {
  console.log('❌ Error checking agent file:', error.message);
}

// Test 2: Check TypeScript compilation
console.log('\n📋 Test 2: Testing TypeScript Compilation...');
const { exec } = require('child_process');

exec('npx tsc --noEmit --project tsconfig.json', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ TypeScript compilation errors:');
    console.log(stderr);
  } else {
    console.log('✅ TypeScript compilation successful');
  }
  
  // Test 3: Check if we can start the agent server
  console.log('\n📋 Test 3: Testing Agent Server Startup...');
  
  // Try to start the agent server in a test mode
  const testAgent = exec('npm run dev:agent', { timeout: 10000 }, (error, stdout, stderr) => {
    if (error) {
      console.log('❌ Agent server startup failed:');
      console.log('Error:', error.message);
      console.log('Stderr:', stderr);
    } else {
      console.log('✅ Agent server started successfully');
      console.log('Output:', stdout);
    }
  });
  
  // Kill the test process after 5 seconds
  setTimeout(() => {
    testAgent.kill();
    console.log('\n🔍 Debug Summary');
    console.log('===============');
    console.log('If all tests pass, the agent should work properly.');
    console.log('If any tests fail, check the corresponding files and fix the issues.');
    console.log('\n🚀 To start the agent:');
    console.log('1. Run: start-clean.bat');
    console.log('2. Or manually: npm run dev:agent (in one terminal)');
    console.log('3. And: npm run dev:ui (in another terminal)');
    console.log('4. Open: http://localhost:3000');
  }, 5000);
});

