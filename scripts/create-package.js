#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

program
  .name('create-package')
  .description('Create a new package in the monorepo')
  .argument('<name>', 'Name of the new package')
  .option('-t, --template <template>', 'Template to use', 'default')
  .action((name, options) => {
    const packagePath = path.join(process.cwd(), 'packages', name);

    // Create package directory
    fs.ensureDirSync(packagePath);

    // Initialize package
    execSync('pnpm init -y', { cwd: packagePath, stdio: 'inherit' });

    // Update package.json
    const packageJson = fs.readJsonSync(path.join(packagePath, 'package.json'));
    packageJson.name = `@examples/${name}`;
    fs.writeJsonSync(path.join(packagePath, 'package.json'), packageJson, { spaces: 2 });

    // Copy template files (if any)
    const templatePath = path.join(__dirname, 'templates', options.template);
    if (fs.existsSync(templatePath)) {
      fs.copySync(templatePath, packagePath);
    }

    console.log(`Package @examples/${name} created successfully!`);
  });

program.parse();
