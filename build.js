#!/usr/bin/env node

import { spawn } from 'child_process';

// Run Next.js build with type checking disabled
const buildProcess = spawn('next', ['build', '--no-lint'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    SKIP_ENV_VALIDATION: '1',
    NEXT_TYPESCRIPT_CHECK: '0',
    NEXT_SKIP_TYPECHECKING: '1',
  },
});

buildProcess.on('close', (code) => {
  process.exit(code);
});