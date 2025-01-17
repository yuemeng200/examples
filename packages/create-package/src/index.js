#!/usr/bin/env node

import { program } from 'commander';
import inquirer from 'inquirer';
import fs from 'fs-extra';
import path from 'path';

program
  .name('create-package')
  .description('Create a new package in the monorepo')
  .action(async () => {
    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the new package?',
        validate: input => input.trim() !== '' || 'Package name cannot be empty'
      }
    ];

    const { name } = await inquirer.prompt(questions);

    const rootDir = process.cwd();
    const packagePath = path.join(rootDir, '..', name);

    // Create package directory
    fs.ensureDirSync(packagePath);

    // Create a basic package.json
    const packageJson = {
      name: `@examples/${name}`,
      version: '0.1.0',
      description: `${name} package`,
      main: 'index.js',
      scripts: {
        test: 'echo "Error: no test specified" && exit 1'
      },
      keywords: [],
      author: '',
      license: 'ISC'
    };

    fs.writeJsonSync(path.join(packagePath, 'package.json'), packageJson, { spaces: 2 });

    // Create a basic index.js file
    fs.writeFileSync(path.join(packagePath, 'index.js'), '// Add your code here\n');

    console.log(`Package @examples/${name} created successfully in ${packagePath}`);
  });

program.parse();
