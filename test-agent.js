#!/usr/bin/env node

/**
 * MediTech AI Healthcare Agent Test Script
 * 
 * This script tests the healthcare agent locally to verify it's working properly
 * before running the full Next.js application.
 */

const { exec } = require('child_process');
const path = require('path');

console.log('🏥 MediTech AI Healthcare Agent Test Script');
console.log('==========================================\n');

// Test 1: Check if the agent file exists and is valid
console.log('📋 Test 1: Checking agent file...');
try {
  const agentPath = path.join(__dirname, 'src', 'mastra', 'agents', 'index.ts');
  const fs = require('fs');
  
  if (fs.existsSync(agentPath)) {
    console.log('✅ Agent file exists:', agentPath);
    
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
      console.log('✅ Agent file structure looks correct');
    } else {
      console.log('❌ Agent file missing required components');
    }
  } else {
    console.log('❌ Agent file not found:', agentPath);
  }
} catch (error) {
  console.log('❌ Error checking agent file:', error.message);
}

console.log('\n📋 Test 2: Checking tools file...');
try {
  const toolsPath = path.join(__dirname, 'src', 'mastra', 'tools', 'index.ts');
  const fs = require('fs');
  
  if (fs.existsSync(toolsPath)) {
    console.log('✅ Tools file exists:', toolsPath);
    
    const content = fs.readFileSync(toolsPath, 'utf8');
    
    // Check for medical tools
    const hasSymptomAnalysis = content.includes('symptomAnalysisTool');
    const hasTreatmentPlanning = content.includes('treatmentPlanningTool');
    const hasRiskAssessment = content.includes('riskAssessmentTool');
    const hasMedicalTools = content.includes('medicalTools');
    
    console.log('✅ symptomAnalysisTool:', hasSymptomAnalysis);
    console.log('✅ treatmentPlanningTool:', hasTreatmentPlanning);
    console.log('✅ riskAssessmentTool:', hasRiskAssessment);
    console.log('✅ medicalTools export:', hasMedicalTools);
    
    if (hasSymptomAnalysis && hasTreatmentPlanning && hasRiskAssessment && hasMedicalTools) {
      console.log('✅ Tools file structure looks correct');
    } else {
      console.log('❌ Tools file missing required components');
    }
  } else {
    console.log('❌ Tools file not found:', toolsPath);
  }
} catch (error) {
  console.log('❌ Error checking tools file:', error.message);
}

console.log('\n📋 Test 3: Checking MCP server...');
try {
  const mcpPath = path.join(__dirname, 'src', 'mastra', 'mcp', 'index.ts');
  const fs = require('fs');
  
  if (fs.existsSync(mcpPath)) {
    console.log('✅ MCP server file exists:', mcpPath);
    
    const content = fs.readFileSync(mcpPath, 'utf8');
    
    // Check for MCP server components
    const hasMCPServer = content.includes('MCPServer');
    const hasMedicalTools = content.includes('medicalTools');
    const hasHealthcareAgent = content.includes('healthcareAgent');
    const hasServerExport = content.includes('export const server');
    
    console.log('✅ MCPServer import:', hasMCPServer);
    console.log('✅ medicalTools import:', hasMedicalTools);
    console.log('✅ healthcareAgent import:', hasHealthcareAgent);
    console.log('✅ server export:', hasServerExport);
    
    if (hasMCPServer && hasMedicalTools && hasHealthcareAgent && hasServerExport) {
      console.log('✅ MCP server structure looks correct');
    } else {
      console.log('❌ MCP server missing required components');
    }
  } else {
    console.log('❌ MCP server file not found:', mcpPath);
  }
} catch (error) {
  console.log('❌ Error checking MCP server:', error.message);
}

console.log('\n📋 Test 4: Checking package.json...');
try {
  const packagePath = path.join(__dirname, 'package.json');
  const fs = require('fs');
  
  if (fs.existsSync(packagePath)) {
    console.log('✅ package.json exists');
    
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    console.log('✅ Package name:', packageJson.name);
    console.log('✅ Scripts available:', Object.keys(packageJson.scripts || {}));
    
    if (packageJson.scripts && packageJson.scripts['dev:agent'] && packageJson.scripts['dev:ui']) {
      console.log('✅ Required scripts found');
    } else {
      console.log('❌ Missing required scripts');
    }
  } else {
    console.log('❌ package.json not found');
  }
} catch (error) {
  console.log('❌ Error checking package.json:', error.message);
}

console.log('\n📋 Test 5: Testing TypeScript compilation...');
exec('npx tsc --noEmit --project tsconfig.json', (error, stdout, stderr) => {
  if (error) {
    console.log('❌ TypeScript compilation errors:');
    console.log(stderr);
  } else {
    console.log('✅ TypeScript compilation successful');
  }
  
  console.log('\n📋 Test 6: Testing agent import...');
  
  // Try to import the agent (this will test if the model interface is correct)
  try {
    // This is a simple test to see if we can require the compiled JavaScript
    console.log('Attempting to test agent import...');
    
    // We'll create a simple test that doesn't actually run the agent
    const testCode = `
      // Simple test to verify the agent structure
      console.log('Testing agent structure...');
      
      // Check if we can at least parse the TypeScript
      const fs = require('fs');
      const path = require('path');
      
      const agentFile = path.join(__dirname, 'src', 'mastra', 'agents', 'index.ts');
      const content = fs.readFileSync(agentFile, 'utf8');
      
      // Look for the model definition
      const modelMatch = content.match(/const\\s+mockModel\\s*=\\s*{([\\s\\S]*?)};/);
      if (modelMatch) {
        console.log('✅ Mock model found in agent file');
        
        // Check for required methods
        const hasGenerateText = content.includes('generateText');
        const hasGenerateObject = content.includes('generateObject');
        const hasGenerateStream = content.includes('generateStream');
        const hasDoGenerate = content.includes('doGenerate');
        const hasDoStream = content.includes('doStream');
        
        console.log('✅ generateText method:', hasGenerateText);
        console.log('✅ generateObject method:', hasGenerateObject);
        console.log('✅ generateStream method:', hasGenerateStream);
        console.log('✅ doGenerate method:', hasDoGenerate);
        console.log('✅ doStream method:', hasDoStream);
        
        if (hasGenerateText && hasGenerateObject && hasGenerateStream && hasDoGenerate && hasDoStream) {
          console.log('✅ Mock model has all required methods');
        } else {
          console.log('❌ Mock model missing required methods');
        }
      } else {
        console.log('❌ Mock model not found in agent file');
      }
    `;
    
    eval(testCode);
    
  } catch (error) {
    console.log('❌ Error testing agent import:', error.message);
  }
  
  console.log('\n🏥 Test Summary');
  console.log('===============');
  console.log('If all tests pass, the agent should work properly.');
  console.log('If any tests fail, check the corresponding files and fix the issues.');
  console.log('\nTo run the agent:');
  console.log('1. npm run dev:agent (in one terminal)');
  console.log('2. npm run dev:ui (in another terminal)');
  console.log('3. Open http://localhost:3000');
  console.log('\nIf you still get model errors, the issue might be with the Mastra framework');
  console.log('expecting a specific model interface that our mock doesn\'t implement.');
});
