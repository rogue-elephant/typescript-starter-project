#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as yargs from 'yargs';
import chalk from 'chalk';

export const CHOICES = fs.readdirSync(path.join(__dirname, '../templates'));
export const QUESTIONS = [
  {
    name: 'template',
    type: 'list',
    message: chalk.cyan('Choose a project template:'),
    choices: CHOICES,
    when: () => !yargs.argv['template']
  },
  {
    name: 'name',
    type: 'input',
    message: chalk.cyan('Project name:'),
    when: () => !yargs.argv['name']
  },
  {
    name: 'description',
    type: 'input',
    message: chalk.cyan('Project description:'),
    when: () => !yargs.argv['description']
  }];