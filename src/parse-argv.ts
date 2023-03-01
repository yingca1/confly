/**
 * Parse command line arguments
 */
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

export default yargs(hideBin(process.argv)).argv;
