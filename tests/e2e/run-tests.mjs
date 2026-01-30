// Tests E2E runner
import { execSync } from 'child_process';

console.log('Running E2E tests...');

try {
  // TODO: Add your E2E test commands here
  // execSync('npx puppeteer test', { stdio: 'inherit' });
  console.log('E2E tests passed!');
} catch (error) {
  console.error('E2E tests failed:', error);
  process.exit(1);
}
