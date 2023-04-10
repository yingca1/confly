#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { synth, print } from "./synthesize";

yargs(hideBin(process.argv))
  .scriptName("confly")
  .usage("$0 <cmd> [args]")
  .command(
    "synth <dir>",
    `Compile the organized files in the specified working directory into the "snapshots" folder according to the specified rules.`,
    (yargs) => {
      return yargs;
    },
    (argv) => {
      if (typeof argv.dir === "string") {
        synth(argv.dir);
      }
    }
  )
  .command(
    "print <dir>",
    `Display the results of the current snapshots, which can be displayed according to the profile.`,
    (yargs) => {
      return yargs.option("p", {
        alias: "profile",
        type: "string",
        describe: "Select the profile that needs to be printed.",
      });
    },
    (argv) => {
      if (typeof argv.dir === "string") {
        print(argv);
      }
    }
  )
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .demandCommand(1)
  .parse();
