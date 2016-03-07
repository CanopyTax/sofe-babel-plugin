'use strict';
const babel = require('babel-core');
const fs = require('fs');
const vm = require('vm');
const util = require('util');

const babelOpts = {
	plugins: ['.'],
};

const filePath = __dirname + '/named-export.js';

describe('named-export.js', () => {
	let window;

	beforeEach(() => {
		window = {
			__synchronousSofe__: {
				'sofe-service': {
					foo: 'this was the foo',
					bar: 'this is the bar',
				}
			}
		};
	});

	afterEach(() => {
		window = {};
	});

	it('Can get named exports from the synchronous sofe global', () => {
		const result = babel.transform(fs.readFileSync(filePath), babelOpts);
		const sandbox = {
			window: window,
			importedFoo: null,
			importedBar: null
		};
		vm.createContext(sandbox);
		vm.runInContext(result.code, sandbox);

		expect(sandbox.importedFoo).toEqual('this was the foo');
		expect(sandbox.importedBar).toEqual('this is the bar');
	});
});
