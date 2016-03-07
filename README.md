# sofe-babel-plugin
sofe-babel-plugin provides a babel plugin and a few other utility functions that make life easier when using [sofe services](https://github.com/CanopyTax/sofe). It primarily is used for (1) webpack apps that depend on sofe services and (2) testing modules that depend on sofe services.

## (1) Webpack workflow
Since webpack bundles at build-time, but sofe loads modules at runtime, writing webpack apps that depend on sofe services can become tedious. The problem is that asynchronous `System.import('service!sofe')` statements are much less convenient than their synchronous counterpart `import service from 'service!sofe'`. So `sofe-babel-plugin` gives you a way to still think about your code in a synchronous, bundled way while still loading sofe services at runtime in the browser. This is achieved by altering your bootstrap process to preload sofe services, and then using the sofe-babel-plugin to replace all the sofe `import` statements with references to the preloaded services.

Steps:

1. Set up [`sofe`](https://github.com/CanopyTax/sofe#quick-start)
2. Make sure your webpack configuration is [set up for babel](https://babeljs.io/docs/setup/#webpack)
3. `npm install --save-dev sofe-babel-plugin`
4. Add `"sofe-babel-plugin"` to the `"plugins"` property of your [.babelrc or package.json](https://babeljs.io/docs/usage/babelrc/)
5. Run `webpack` to bundle your app just like you normally would.
6. `jspm install npm:sofe-babel-plugin`
7. For now, remove the `<script>` tag for your webpack bundle.
8. Alter your html file to include the following (after the script tag for `system.js`):
```js
<script>
  System.import('sofe-babel-plugin/lib/runtime')
  .then(function(sofeBabelRuntime) {
    // List here all of the sofe services you need in your webpack app
    sofeBabelRuntime.loadServices([
      'sofe-service-1',
      'sofe-service-2',
      'another-service'
    ])
    .then(loadWebpackApp)
    .catch(function(ex) {
      throw new Error('Could not bootstrap sofe services');
    });
    
    function loadWebpackApp() {
      var webpackScriptElement = document.createElement('script');
      webpackScriptElement.setAttribute('src', '/replace-this-url-with-the-path-to-the-webpack-bundle.js');
      document.head.appendChild(webpackScriptElement);
    }
  })
  .catch(function(ex) {
    console.error("Could not find sofe-babel-plugin's runtime, to bootstrap the sofe services")
    throw ex;
  });
</script>
```

## (2) Testing modules that depend on sofe services
Without sofe-babel-plugin, testing modules that depend on sofe services can be insurmountably burdensome. Since sofe services are loaded at runtime and cannot be found in your node_modules, your test setup usually involves a beastly karma / jspm config plus a test environment with full network access. If you've pulled this off, I applaud you. But if you're looking for something simpler, take a look at the following steps for how to mock sofe services in a test environment:

1. `npm install sofe-babel-plugin --save-dev`
2. Add `"sofe-babel-plugin"` to the `"plugins"` property of your [.babelrc or package.json](https://babeljs.io/docs/usage/babelrc/)
3. Make sure that babel is compiling your code before the tests are run on it. For the major test frameworks, see the [babel docs](https://babeljs.io/docs/setup/#webpack).
4. Ensure that the following code is run before your test framework tries to run any tests:
```js
const sofeTestHelpers = require('sofe-babel-plugin/lib/test-helpers.js');

sofeTestHelpers.mockSofeServices({
  'sofe-service-1': {
    func1: funtion() {},
    prop2: 'oiufs',
    default: 'this is the default exported value'
  },
	
  'sofe-service-2': {
    func1: funtion() {},
    prop2: 'oiufs',
  },
});
```

## API

### The babel plugin
The babel plugin finds all `import` statements that end with `!sofe` and replaces them with references to the `window.__synchronousSofe__['sofe-service-name']` object. It can handle named exports and default exports. To use it, `npm install --save-dev sofe-babel-plugin` and then add `"sofe-babel-plugin"` to the `"plugins"` property of your [.babelrc or package.json](https://babeljs.io/docs/usage/babelrc/)

### The runtime library
The runtime library (used via `import * as sofeBabelRuntime from 'sofe-babel-plugin/lib/runtime.js'`) is intended to be used by browser applications during bootstrap. It provides one api, `loadServices`, that will load sofe services and put them into the `window.__synchronousSofe__` object so that dependent code that was compiled with the `sofe-babel-plugin` will reference the correct global object for all imported sofe services. For examples, see the Webpack Workflow section above. Below are the functions that are provided:

##### `loadServices(serviceNames)`
Will call `System.import` on all of the `serviceNames`, preloading the services into the global object that is referenced by code that was compiled by the sofe babel plugin.

**Parameters**
- `serviceNames`: An array of strings, where each string is the name of the sofe service. You do not need to append `!sofe` to the end of each service name.

**Returns**: a `Promise` that is either resolved with an array of all of the loaded sofe services, or rejected with a SystemJS error.

### The test helpers
The test helpers (used via `import * as sofeTestHelpers from 'sofe-babel-plugin/lib/test-helpers'`) provide helper functions that allow you to easily mock sofe services when testing. The following functions are provided:

##### `mockSofeServices(services)`

Mocks the sofe services by preloading `window.__synchronousSofe__` with the mocked services.

**Parameters**

- `services`: An object whose keys are the names of sofe services and whose values are objects. The object values, in turn, have keys for each named / default export, and values of whatever the mocked value of that export should be.

**Returns:** undefined.

**Example:**

```js
import * as sofeTestUtils from 'sofe-babel-plugin/lib/test-helpers.js';

sofeTestUtils.mockSofeServices({
  'sofe-service-1': {
    func1: funtion() {},
    prop2: 'oiufs',
    default: 'this is the default exported value'
  },
	
  'sofe-service-2': {
    func1: funtion() {},
    prop2: 'oiufs',
  },
});
```
