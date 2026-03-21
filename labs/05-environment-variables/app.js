const config = {
  title:   process.env.APP_TITLE   || 'Untitled',
  color:   process.env.APP_COLOR   || 'default',
  version: process.env.APP_VERSION || 'unknown',
  env:     process.env.APP_ENV     || 'not set',
  debug:   process.env.APP_DEBUG   || 'false',
};

console.log('=== Environment Variables Lab ===');
console.log(`  Title:   ${config.title}`);
console.log(`  Color:   ${config.color}`);
console.log(`  Version: ${config.version}`);
console.log(`  Env:     ${config.env}`);
console.log(`  Debug:   ${config.debug}`);
console.log('=================================');
