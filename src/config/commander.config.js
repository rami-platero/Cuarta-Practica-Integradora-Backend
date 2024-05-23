import { Command } from "commander";

const program = new Command();

program
  .option("--persist <persist>", "persistence mode", "mongodb")
  .option("--mode <mode>", "Modo de trabajo", "development")
  .parse();

export default program;
