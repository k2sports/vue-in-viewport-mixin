'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _windowEventMediator = require('window-event-mediator');

var _windowEventMediator2 = _interopRequireDefault(_windowEventMediator);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixin definiton

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
exports.default = {

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
	data: function data() {
		return {
			inViewport: false,
			inViewportEntirely: false,
			aboveViewport: false,
			belowViewport: false
		};
	},


	// Add handlers when vm is added to dom unless init is false
	ready: function ready() {
		if (this.inViewportActive) {
			return this.addInViewportHandlers();
		}
	},


	// If comonent is destroyed, clean up listeners
	destroyed: function destroyed() {
		return this.removeInViewportHandlers();
	},


	// Vars to watch
	watch: {

		// Adds handlers if they werent added at runtime
		inViewportActive: function inViewportActive(ready) {
			if (ready) {
				return this.addInViewportHandlers();
			}
		},


		// Adds the `in-viewport` class when the component is in bounds/
		inViewport: function inViewport(visible) {
			if (this.inViewportOnce && visible) {
				this.removeInViewportHandlers();
			}
			if (this.inViewportClass) {
				return $(this.$el).toggleClass(this.inViewportClass, visible);
			}
		},


		// Adds the `in-viewport-entirely` class when the component is in bounds
		inViewportEntirely: function inViewportEntirely(visible) {
			if (this.inViewportEntrelyClass) {
				return $(this.$el).toggleClass(this.inViewportEntrelyClass, visible);
			}
		}
	},

	// Public API
	methods: {

		// Run the check function and map it's response to our data attributes
		onInViewportScroll: function onInViewportScroll() {
			var _this = this;

			return function () {
				var result = [];
				var object = (0, _check2.default)(_this.$el, {
					offsetTop: _this.inViewportOffsetTop,
					offsetBottom: _this.inViewportOffsetBottom
				});
				for (var prop in object) {
					var val = object[prop];
					result.push(_this[prop] = val);
				}
				return result;
			}();
		},


		// Add listeners
		addInViewportHandlers: function addInViewportHandlers() {
			if (this.inViewportHandlersAdded) {
				return;
			}
			this.inViewportHandlersAdded = true;
			_windowEventMediator2.default.on('scroll', this.onInViewportScroll, { throttle: 0 });
			_windowEventMediator2.default.on('resize', this.onInViewportScroll);
			return this.onInViewportScroll();
		},


		// Remove listeners
		removeInViewportHandlers: function removeInViewportHandlers() {
			if (!this.inViewportHandlersAdded) {
				return;
			}
			this.inViewportHandlersAdded = false;
			_windowEventMediator2.default.off('scroll', this.onInViewportScroll);
			return _windowEventMediator2.default.off('resize', this.onInViewportScroll);
		},


		/*
   * Public API for invoking visibility tests
   */

		// Check if the element is visible at all in the viewport
		isInViewport: function isInViewport(el, options) {
			return (0, _check2.default)(el, options).inViewport;
		},


		// Check if the elemetn is entirely visible in the viewport
		isInViewportEntirely: function isInViewportEntirely(el, options) {
			return (0, _check2.default)(el, options).isInViewportEntirely;
		}
	}
};
