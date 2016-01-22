export function mockSofeServices(services) {
	if (!window)
		window = {};
	if (!window.__synchronousSofe__)
		window.__synchronousSofe__ = {};
	window.__synchronousSofe__ = {
		...window.__synchronousSofe__,
		...services,
	};
}
