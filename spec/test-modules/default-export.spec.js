'use strict';
const babel = require('babel-core');
const fs = require('fs');
const vm = require('vm');
const util = require('util');

const babelOpts = {
	plugins: ['.'],
};

const filePath = __dirname + '/default-export.js';

describe('named-export.js', () => {
	let window;

	beforeEach(() => {
		window = {
			__synchronousSofe__: {
				'my-service': {
					default: 'this is the default export',
					foo: 'ousdfsdif'
				}
			}
		};
	});

	afterEach(() => {
		window = {};
	});

	it('Can get the default export from the synchronous sofe global', () => {
		const result = babel.transform(fs.readFileSync(filePath), babelOpts);
		const sandbox = {
			window: window,
			myServiceDefault: null
		};
		vm.createContext(sandbox);
		vm.runInContext(result.code, sandbox);

		expect(sandbox.myServiceDefault).toEqual('this is the default export');
	});
});
