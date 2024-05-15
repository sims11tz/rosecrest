module.exports = {
	apps: [
	  {
		name: 'server',
		script: './src/index.ts',
		interpreter: '/usr/local/bin/ts-node',
		args: '-r tsconfig-paths/register',
		watch: false,
		env: {
		  NODE_ENV: 'production',
		},
	  },
	],
  };