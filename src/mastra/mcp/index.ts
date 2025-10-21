import { MCPServer } from "@mastra/mcp";
import { medicalTools } from "../tools";
import { healthcareAgent } from "../agents";

// Create MCP Server for medical tools and agent
export const server = new MCPServer({
  name: "MediTech AI Healthcare Server",
  version: "1.0.0",
  tools: medicalTools,
  agents: { healthcareAgent }, // This agent will become tool "ask_healthcareAgent"
});


