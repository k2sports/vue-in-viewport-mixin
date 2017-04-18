/*jshint esversion: 6 */

/*
 * vm - the view instance
 * vp - the viewport
 */

// Test that the vm is partially in the viewport
let inViewport = (vm, vp, options) =>
	((vm.top + options.offsetTop) <= vp.height) &&
	((vm.bottom + options.offsetBottom) >= 0) &&
	(vm.left <= vp.width) &&
	(vm.right >= 0)
;

// Test that the vm is entirely in the viewport
let inViewportEntirely = (vm, vp, options) =>
	((vm.top + options.offsetTop) >= 0) &&
	((vm.bottom + options.offsetBottom) <= vp.height) &&
	(vm.left >= 0) &&
	(vm.right <= vp.width)
;

// Test that the vm is above the viewport
let aboveViewport = (vm, vp, options) => ((vm.top + vp.height) + options.offsetBottom) <= vp.height;

// Test that the vm is below the viewport
let belowViewport = (vm, vp, options) => (vm.bottom + options.offsetTop) >= vp.height;

// Reusable empty response
let nope = {
	inViewport: false,
	inViewportEntirely: false,
	aboveViewport: false,
	belowViewport: false
};

// Returns an object containing measurements on whether the vm relative to the
// viewport.
export default function(el, options) {

	// Require an el
	if (!el) { return nope; }

	// Default options
	if (!options) { options = {}; }
	if (!options.offsetTop) { options.offsetTop = 0; }
	if (!options.offsetBottom) { options.offsetBottom = 0; }

	// Get Viewport dimensions
	// http://ryanve.com/lab/dimensions/
	let vp = {};
	vp.height = document.documentElement.clientHeight;
	vp.width  = document.documentElement.clientWidth;

	// Support percentage offsets
	for (let key of ['offsetTop', 'offsetBottom']) {
		var middle;
		if (0 < (middle = Math.abs(options[key])) && middle < 1) { options[key] = vp.height * options[key]; }
	}

	// Get element dimensions with offsets
	let vm = el.getBoundingClientRect();
	if ((vm.width === 0) && (vm.height === 0)) { return nope; } // Like if display: none

	// Return object containing measurements
	return {
		inViewport:         inViewport(vm, vp, options),
		inViewportEntirely: inViewportEntirely(vm, vp, options),
		aboveViewport: 			aboveViewport(vm, vp, options),
		belowViewport: 			belowViewport(vm, vp, options)
	};
}
