import { MCPServer } from "@mastra/mcp"
import { medicalTools } from "../tools";
import { healthcareAgent } from "../agents";

export const server = new MCPServer({
  name: "MediTech AI Healthcare Server",
  version: "1.0.0",
  tools: medicalTools,
  agents: { healthcareAgent }, // this agent will become tool "ask_healthcareAgent"
  // workflows: {
  // dataProcessingWorkflow, // this workflow will become tool "run_dataProcessingWorkflow"
  // }
});
