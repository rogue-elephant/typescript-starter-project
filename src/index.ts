#!/usr/bin/env node
import * as path from 'path';
import * as yargs from 'yargs';
import * as inquirer from 'inquirer';
import chalk from 'chalk';
import { createProject, createDirectoryContents } from './file-system/file-creation';
import { QUESTIONS } from './command-line/input';
import { CliOptions } from './cli-options';
import { postProcessing } from './file-system/post-processing';

const CURR_DIR = process.cwd();
inquirer.prompt(QUESTIONS)
  .then((answers: any) => {
    try {
      answers = Object.assign({}, answers, yargs.argv);
      const projectChoice = (answers['template'] as string);
      const projectName = (answers['name'] as string);
      const description = (answers['description'] as string);
      const templatePath = path.join(__dirname, 'templates', projectChoice);
      const targetPath = path.join(CURR_DIR, projectName);
      const options: CliOptions = {
        projectName,
        description,
        templateName: projectChoice,
        templatePath,
        targetPath
      }
      createProject(targetPath)

      console.log(chalk.yellowBright("Ooooooh") + chalk.cyan("  that sounds lovely! Creating structure now"));
      createDirectoryContents(CURR_DIR, templatePath, projectName, description);
      console.log(chalk.cyan("Structure done - installing dependencies and initialising git"));
      postProcessing(options);
      console.log(chalk.cyanBright(`New ${projectChoice} "${projectName}" created!  `) + chalk.yellowBright("have a great day! :)"));
    } catch (error) {
      console.log(chalk.redBright(error.message));
    }
  });