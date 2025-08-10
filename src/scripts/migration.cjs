#!/usr/bin/env node

const yargs = require('yargs');

/**
 * Run migrations instructions
 */
async function runMigrations() {
  console.log('🔄 To run migrations:');
  console.log('ℹ️  Add this to your App.js temporarily:');
  console.log('');
  console.log('   import { runMigrations } from "./src/database";');
  console.log('   await runMigrations(); // Add this line once');
  console.log('');
  console.log('ℹ️  Then remove it after migrations run');
}

/**
 * Downgrade instructions
 */
async function downgradeToVersion(argv) {
  const targetVersion = argv.targetVersion;
  console.log(`🔄 To downgrade to version ${targetVersion}:`);
  console.log('ℹ️  Add this to your App.js temporarily:');
  console.log('');
  console.log('   import { downgradeTo } from "./src/database";');
  console.log(`   await downgradeTo(${targetVersion}); // Add this line once`);
  console.log('');
  console.log('ℹ️  Then remove it after downgrade completes');
}

/**
 * Status check instructions
 */
async function showStatus() {
  console.log('📊 To check migration status:');
  console.log('ℹ️  Add this to your App.js temporarily:');
  console.log('');
  console.log('   import { getLatestMigrationVersion, getAppliedMigrations } from "./src/database";');
  console.log('   const version = await getLatestMigrationVersion();');
  console.log('   const applied = await getAppliedMigrations();');
  console.log('   console.log("Version:", version, "Applied:", applied.length);');
  console.log('');
  console.log('ℹ️  Check your app console for results');
}

// Set up commands with fixed yargs configuration
yargs
  .version(false) // Disable built-in version to avoid conflicts
  .command('install', 'Run all pending migrations', () => {}, runMigrations)
  .command('downgrade <targetVersion>', 'Downgrade to specific version', (yargs) => {
    yargs.positional('targetVersion', {
      describe: 'Target migration version number',
      type: 'number'
    });
  }, downgradeToVersion)
  .command('status', 'Show migration status', () => {}, showStatus)
  .demandCommand(1, 'You need to specify a command')
  .help()
  .argv;