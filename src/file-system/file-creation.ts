#!/usr/bin/env node
import * as fs from 'fs';
import * as path from 'path';
import { renderTemplate } from "../utils/template";

// list of file/folder that should not be copied
const SKIP_FILES = ['node_modules', '.template.json'];
export function createDirectoryContents(currentDirectory: string, templatePath: string, projectName: string, description: string) {
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
      const writePath = path.join(currentDirectory, projectName, file);
      fs.writeFileSync(writePath, contents, 'utf8');
    } else if (stats.isDirectory()) {
      // create folder in destination folder
      fs.mkdirSync(path.join(currentDirectory, projectName, file));
      // copy files/folder inside current folder recursively
      createDirectoryContents(currentDirectory, path.join(templatePath, file), path.join(projectName, file), path.join(description, file));
    }
  });
}

export function createProject(projectPath: string) {
  if (fs.existsSync(projectPath)) {
    throw new FolderExistsError(projectPath);
  }
  fs.mkdirSync(projectPath);

  return true;
}

export class FolderExistsError extends Error {
  constructor(path: string) {
    super()
    throw new Error(`Folder ${path} exists. Delete or use another name.`); 
  }
}
