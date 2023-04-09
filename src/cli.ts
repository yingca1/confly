#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

yargs(hideBin(process.argv))
  .command(
    "<dir>",
    "The dir argument must be a path to a directory containing 'confly.yml'",
    () => {
      console.log("This is the help text for the <dir> command");
    },
    (argv) => {
      console.info(argv);
    }
  )
  .demandCommand(1)
  .parse();
