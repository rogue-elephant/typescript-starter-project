#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import * as shell from 'shelljs';
import { CliOptions } from "../cli-options";

export function postProcessing(options: CliOptions) {
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