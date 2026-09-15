import { chalkStderr as chalk } from "chalk";
import { emojify as emoji } from "node-emoji";
import { execSync } from "node:child_process";
import { default as yoctoSpinner } from "yocto-spinner";

// Helper function to run shell commands and return the output
function runCommand(command) {
  try {
    console.log(chalk.blue(`\nRunning command: ${command}\n`));
    return execSync(command, { encoding: "utf-8" });
  } catch (error) {
    console.error(chalk.red(`Error while executing command: ${command}`));
    return error.message;
  }
}

// Get the list of staged files that are added or modified
function getStagedFiles() {
  const result = runCommand("git diff --cached --name-only");
  return result.split("\n").filter((file) => file);
}

// Main function that runs checks and fixes on modified files
(async () => {
  const spinner = yoctoSpinner().start(
    "\nRunning CI checks on modified files...\n",
  );

  const stagedFiles = getStagedFiles();

  if (stagedFiles.length === 0) {
    console.log(chalk.yellow(emoji("⚠️") + " No staged files to check."));
    spinner.stop();
    return;
  }

  // Filter for relevant file types
  const filesToCheck = stagedFiles.filter(
    (file) =>
      file.endsWith(".js") ||
      file.endsWith(".ts") ||
      file.endsWith(".jsx") ||
      file.endsWith(".tsx"),
  );

  if (filesToCheck.length === 0) {
    console.log(
      chalk.yellow(emoji("⚠️") + " No JavaScript/TypeScript files staged."),
    );
    spinner.stop();
    return;
  }

  try {
    // Run lint check
    spinner.start("Running lint check...");
    const lintResult = runCommand(`npm run lint -- ${filesToCheck.join(" ")}`);
    spinner.success(chalk.green(emoji("✅") + " Lint checks passed!"));

    // Run lint:fix
    spinner.start("Applying lint fixes...");
    const lintFixResult = runCommand(
      `npm run lint:fix -- ${filesToCheck.join(" ")}`,
    );
    spinner.success(chalk.green(emoji("⚙️") + " Lint fixes applied!"));

    // Run format check
    spinner.start("Running format check...");
    const formatResult = runCommand(
      `npm run format -- ${filesToCheck.join(" ")}`,
    );
    spinner.success(chalk.green(emoji("✅") + " Format checks passed!"));

    // Run format:fix
    spinner.start("Applying format fixes...");
    const formatFixResult = runCommand(
      `npm run format:fix -- ${filesToCheck.join(" ")}`,
    );
    spinner.success(chalk.green(emoji("⚙️") + " Format fixes applied!"));

    // Output results
    console.log(
      chalk.blue(emoji("💻") + " Lint output:\n") + chalk.gray(lintResult),
    );
    console.log(
      chalk.blue(emoji("🔧") + " Lint fix output:\n") +
        chalk.gray(lintFixResult),
    );
    console.log(
      chalk.blue(emoji("📐") + " Format output:\n") + chalk.gray(formatResult),
    );
    console.log(
      chalk.blue(emoji("🛠️") + " Format fix output:\n") +
        chalk.gray(formatFixResult),
    );

    console.log(
      chalk.cyan(emoji("🚀") + " All checks passed and fixes applied!"),
    );
  } catch (error) {
    spinner.error(chalk.red(emoji("❌") + " An error occurred."));
    console.error(chalk.red(error));
  }
})();
