module.exports = {
  apps: [
    {
      name: 'dhara-divine-awards',
      script: 'server.ts',
      interpreter: 'node',
      interpreter_args: '--import tsx',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      }
    }
  ]
};
