#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import * as yargs from 'yargs';

const CHOICES = fs.readdirSync(path.join(__dirname, 'templates'));
const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: 'Choose a project template:',
    choices: CHOICES,
    when: () => !yargs.argv['template']
  },
  {
    name: 'name',
    type: 'input',
    message: 'Project name:',
    when: () => !yargs.argv['name']
  },
  {
    name: 'description',
    type: 'input',
    message: 'Project description:',
    when: () => !yargs.argv['description']
  }];

function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    console.log(chalk.red(`Folder ${projectPath} exists. Delete or use another name.`));
    return false;
  }
  fs.mkdirSync(projectPath);

  return true;
}

function postProcess(options: CliOptions) {
  const isNode = fs.existsSync(path.join(options.templatePath, 'package.json'));
  if (isNode) {
      shell.cd(options.targetPath);
      const result = shell.exec('git init && npm install');
      if (result.code !== 0) {
          return false;
      }
  }
  
  return true;
}

// list of file/folder that should not be copied
const SKIP_FILES = ['node_modules', '.template.json'];
function createDirectoryContents(templatePath: string, projectName: string, description: string) {
  // read all files/folders (1 level) from template folder
  const filesToCreate = fs.readdirSync(templatePath);
  // loop each file/folder
  filesToCreate.forEach(file => {
    const origFilePath = path.join(templatePath, file);

    // get stats about the current file
    const stats = fs.statSync(origFilePath);

    // skip files that should not be copied
    if (SKIP_FILES.indexOf(file) > -1) return;

    if (stats.isFile()) {
      // read file content and transform it using template engine
      let contents = fs.readFileSync(origFilePath, 'utf8');
      contents = renderTemplate(contents, { projectName, description });
      // write file to destination folder
      const writePath = path.join(CURR_DIR, projectName, file);
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(CURR_DIR, projectName, file));
      // copy files/folder inside current folder recursively
      createDirectoryContents(path.join(templatePath, file), path.join(projectName, file), path.join(description, file));
    }
  });
}

import * as inquirer from 'inquirer';
import chalk from 'chalk';
import { renderTemplate } from './utils/template';
export interface CliOptions {
  projectName: string
  description: string
  templateName: string
  templatePath: string
  targetPath: string
}
const CURR_DIR = process.cwd();
inquirer.prompt(QUESTIONS)
  .then(answers => {
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
    if (!createProject(targetPath)) {
      return;
    }
    console.log("Oooh that sounds lovely! Creating structure now");
    createDirectoryContents(templatePath, projectName, description);
    console.log("Structure done - installing dependencies and initialising git");
    postProcess(options);
    console.log(`New ${projectChoice} "${projectName}" created! have a great day! :)`);
  });