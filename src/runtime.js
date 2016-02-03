export function loadServices(services) {
	if (!Array.isArray(services))
		throw new Error(`services must be an array of strings`);
	if (!window.System)
		throw new Error(`SystemJS and sofe must be loaded`);
	window.__synchronousSofe__ = {};
	return Promise.all(services.map((serviceName) => {
		return new Promise((resolve, reject) => {
			window.System.import(`${serviceName}!sofe`)
			.then((service) => {
				if (service.default)
					service = service.default;
				window.__synchronousSofe__[serviceName] = service;
				resolve();
			})
			.catch((ex) => {
				reject(ex);
			});
		})
	}));
}
