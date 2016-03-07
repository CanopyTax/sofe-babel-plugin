'use strict';
export function mockSofeServices(services) {
	if (!global.window)
		global.window = {};
	if (!global.window.__synchronousSofe__)
		global.window.__synchronousSofe__ = {};
	global.window.__synchronousSofe__ = {
		...window.__synchronousSofe__,
		...services,
	};
}
