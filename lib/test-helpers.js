"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.mockSofeServices = mockSofeServices;
function mockSofeServices(services) {
	if (!window) window = {};
	if (!window.__synchronousSofe__) window.__synchronousSofe__ = {};
	window.__synchronousSofe__ = _extends({}, window.__synchronousSofe__, services);
}