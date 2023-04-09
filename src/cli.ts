#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { main } from "./build";

yargs(hideBin(process.argv))
  .command(
    "build <input>",
    "The dir argument must be a path to a directory",
    (yargs) => {
      return yargs.option("o", {
        alias: "output",
        describe: "output directory",
      });
    },
    (argv) => {
      console.info(argv);
      if (typeof argv.input === "string") {
        main(argv.input);
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
