#!/usr/bin/env node

const yargs = require('yargs');
const fs = require('fs').promises;
const path = require('path');

// Simple console colors (instead of chalk)
const colors = {
  green: (text) => `\x1b[32m${text}\x1b[0m`,
  blue: (text) => `\x1b[34m${text}\x1b[0m`,
  yellow: (text) => `\x1b[33m${text}\x1b[0m`,
  red: (text) => `\x1b[31m${text}\x1b[0m`,
  gray: (text) => `\x1b[90m${text}\x1b[0m`
};

// Template for new migration files
const migrationTemplate = (version, name) => `export const version = ${version};
export const name = '${name}';
export const description = 'Add description here';

export const up = \`
-- Add your SQL here to create/modify tables
-- Example:
-- CREATE TABLE example (
--   id INTEGER PRIMARY KEY AUTOINCREMENT,
--   name TEXT NOT NULL
-- );
\`;

export const down = \`
-- Add your SQL here to undo the changes above
-- Example:
-- DROP TABLE IF EXISTS example;
\`;
`;

/**
 * Creates a new migration file
 */
async function createMigration(name) {
  try {
    // Find the migrations directory (ROOT level, not in src!)
    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    // Create directory if it doesn't exist
    try {
      await fs.access(migrationsDir);
    } catch {
      await fs.mkdir(migrationsDir, { recursive: true });
      console.log(colors.green('✅ Created migrations directory'));
    }
    
    // Find existing migration files to calculate next version
    const files = await fs.readdir(migrationsDir);
    const migrationFiles = files.filter(f => f.match(/^\d{3}_.*\.js$/));
    
    // Calculate next version number
    const nextVersion = migrationFiles.length + 1;
    const paddedVersion = nextVersion.toString().padStart(3, '0');  // 001, 002, 003...
    
    // Create filename
    const filename = `${paddedVersion}_${name.replace(/\s+/g, '_').toLowerCase()}.js`;
    const filepath = path.join(migrationsDir, filename);
    
    // Create the file with template content
    const content = migrationTemplate(nextVersion, name.replace(/\s+/g, '_').toLowerCase());
    await fs.writeFile(filepath, content);
    
    // Tell user what happened
    console.log(colors.green('✅ Migration created successfully!'));
    console.log(colors.blue(`📁 File: ${filename}`));
    console.log(colors.yellow('⚠️  Don\'t forget to:'));
    console.log(colors.yellow('   1. Add your SQL to the up() function'));
    console.log(colors.yellow('   2. Add rollback SQL to the down() function'));
    console.log(colors.yellow('   3. Update migrationRunner.js to include this migration'));
    
  } catch (error) {
    console.error(colors.red('❌ Error creating migration:'), error.message);
    process.exit(1);
  }
}

/**
 * Shows status of migrations
 */
async function showStatus() {
  try {
    console.log(colors.blue('📊 Migration Status:'));
    console.log(colors.yellow('ℹ️  To see which are applied, run this from your app'));
    
    // Show available migration files (ROOT level migrations folder)
    const migrationsDir = path.join(process.cwd(), 'migrations');
    
    try {
      const files = await fs.readdir(migrationsDir);
      const migrationFiles = files.filter(f => f.match(/^\d{3}_.*\.js$/));
      
      console.log(colors.green(`\n📁 Available migrations (${migrationFiles.length}):`));
      migrationFiles.forEach(file => {
        console.log(colors.gray(`   ${file}`));
      });
    } catch (error) {
      console.log(colors.yellow('⚠️  No migrations directory found. Create one by running:'));
      console.log(colors.green('npm run migration:create "your first migration"'));
    }
    
  } catch (error) {
    console.error(colors.red('❌ Error showing status:'), error.message);
    process.exit(1);
  }
}

// Set up command-line interface
yargs
  .command('create [name]', 'Create a new migration', (yargs) => {
    yargs.positional('name', {
      describe: 'Name of the migration',
      type: 'string',
      demandOption: true
    });
  }, (argv) => {
    createMigration(argv.name);
  })
  .command('install', 'Run all pending migrations', () => {}, () => {
    console.log(colors.blue('🔄 To install migrations, add this to your app:'));
    console.log(colors.green('import { runMigrations } from "./src/database/migrationRunner";'));
    console.log(colors.green('await runMigrations();'));
  })
  .command('downgrade [version]', 'Downgrade to specific version', (yargs) => {
    yargs.positional('version', {
      describe: 'Target migration version',
      type: 'number',
      demandOption: true
    });
  }, (argv) => {
    console.log(colors.blue(`🔄 To downgrade to version ${argv.version}, add this to your app:`));
    console.log(colors.green('import { downgradeTo } from "./src/database/migrationRunner";'));
    console.log(colors.green(`await downgradeTo(${argv.version});`));
  })
  .command('status', 'Show migration status', () => {}, showStatus)
  .demandCommand(1, 'You need to specify a command')
  .help()
  .argv;