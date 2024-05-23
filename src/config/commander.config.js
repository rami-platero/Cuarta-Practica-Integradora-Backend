import { Command } from "commander";

const program = new Command();

program
  .option("--persist <persist>", "persistence mode", "mongodb")
  .option("--mode <mode>", "environment mode", "development")
  .parse();

export default program;
