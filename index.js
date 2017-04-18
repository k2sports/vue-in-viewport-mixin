/*jshint esversion: 6 */

/*
Determines if the view is in visible in the browser window.

Example usage:
	Just require the mixin from your component.
	Use the optional offset props like:

	large-copy(
		:in-viewport-offset-top="300"
		:in-viewport-offset-bottom="0.5"

		* Only add the `in-viewport` class once per page load
		:in-viewport-once="false"
	)

*/

// Deps
import win from 'window-event-mediator';
import check from './check';

// Mixin definiton
export default {

	// Settings
	props: {

		// Add listeners and check if in viewport immediately
		inViewportActive: {
			type: 'Boolean',
			default: true
		},

		// Whether to only update in-viewport class once
		inViewportOnce: {
			type: 'Boolean',
			default: true
		},

		// Whether to only update in-viewport class once
		inViewportClass: {
			type: 'string',
			default: 'in-viewport'
		},

		// Whether to only update in-viewport class once
		inViewportEntrelyClass: {
			type: 'string',
			default: 'in-viewport-entirely'
		},

		// A positive offset triggers "late" when scrolling down
		inViewportOffsetTop: {
			type: Number,
			default: 0
		},

		// A negative offset triggers "early" when scrolling down
		inViewportOffsetBottom: {
			type: Number,
			default: 0
		}
	},

	// Boolean stores whether component is in viewport
	data() {
		return {
			inViewport: false,
			inViewportEntirely: false,
			aboveViewport: false,
			belowViewport: false
		};
	},

	// Add handlers when vm is added to dom unless init is false
	ready() { if (this.inViewportActive) { return this.addInViewportHandlers(); } },

	// If comonent is destroyed, clean up listeners
	destroyed() { return this.removeInViewportHandlers(); },

	// Vars to watch
	watch: {

		// Adds handlers if they werent added at runtime
		inViewportActive(ready) {
			if (ready) { return this.addInViewportHandlers(); }
		},

		// Adds the `in-viewport` class when the component is in bounds/
		inViewport(visible) {
			if (this.inViewportOnce && visible) { this.removeInViewportHandlers(); }
			if (this.inViewportClass) { return $(this.$el).toggleClass(this.inViewportClass, visible); }
		},

		// Adds the `in-viewport-entirely` class when the component is in bounds
		inViewportEntirely(visible) {
			if (this.inViewportEntrelyClass) { return $(this.$el).toggleClass(this.inViewportEntrelyClass, visible); }
		}
	},

	// Public API
	methods: {

		// Run the check function and map it's response to our data attributes
		onInViewportScroll() {
			return (() => {
				let result = [];
				let object = check(this.$el, {
				offsetTop:    this.inViewportOffsetTop,
				offsetBottom: this.inViewportOffsetBottom
			}
			);
				for (let prop in object) {
					let val = object[prop];
					result.push(this[prop] = val);
				}
				return result;
			})();
		},

		// Add listeners
		addInViewportHandlers() {
			if (this.inViewportHandlersAdded) { return; }
			this.inViewportHandlersAdded = true;
			win.on('scroll', this.onInViewportScroll, {throttle: 0});
			win.on('resize', this.onInViewportScroll);
			return this.onInViewportScroll();
		},

		// Remove listeners
		removeInViewportHandlers() {
			if (!this.inViewportHandlersAdded) { return; }
			this.inViewportHandlersAdded = false;
			win.off('scroll', this.onInViewportScroll);
			return win.off('resize', this.onInViewportScroll);
		},

		/*
		 * Public API for invoking visibility tests
		 */

		// Check if the element is visible at all in the viewport
		isInViewport(el, options) {
			return check(el, options).inViewport;
		},

		// Check if the elemetn is entirely visible in the viewport
		isInViewportEntirely(el, options) {
			return check(el, options).isInViewportEntirely;
		}
	}
};
