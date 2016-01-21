"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.loadServices = loadServices;
function loadServices(services) {
	if (!Array.isArray(services)) throw new Error("services must be an array of strings");
	if (!window.System) throw new Error("SystemJS and sofe must be loaded");
	window.__synchronousSofe__ = {};
	return Promise.all(services.map(function (serviceName) {
		return new Promise(function (resolve, reject) {
			window.System.import(serviceName + "!sofe").then(function (service) {
				window.__synchronousSofe__[serviceName] = service;
				resolve();
			}).catch(function (ex) {
				reject(ex);
			});
		});
	}));
}