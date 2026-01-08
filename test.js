console.log('Node.js is working!');
console.log('Testing server startup...');

try {
  console.log('Current directory:', process.cwd());
  console.log('Node version:', process.version);
  console.log('Test completed successfully!');
} catch (error) {
  console.error('Error:', error);
}
