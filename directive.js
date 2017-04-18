'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _windowEventMediator = require('window-event-mediator');

var _windowEventMediator2 = _interopRequireDefault(_windowEventMediator);

var _check = require('./check');

var _check2 = _interopRequireDefault(_check);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Directive definition

/*
Directive version of the main mixin
*/

// Deps
exports.default = {

	// Global defaults, duck punch to change
	inViewportActive: true,
	inViewportOnce: true,
	inViewportClass: 'in-viewport',
	inViewportOffsetTop: 0,
	inViewportOffsetBottom: 0,

	// Prop-style settings
	params: ['inViewportActive', 'inViewportOnce', 'inViewportClass', 'inViewportOffsetTop', 'inViewportOffsetBottom'],

	// Set default param values and start listening for scrolls
	bind: function bind() {
		var _this = this;

		// Set defaults from the global defaults
		var _arr = ['inViewportActive', 'inViewportOnce', 'inViewportClass', 'inViewportOffsetTop', 'inViewportOffsetBottom'];
		for (var _i = 0; _i < _arr.length; _i++) {
			var key = _arr[_i];if (this.params[key] === null) {
				this.params[key] = this[key];
			}
		}

		// Callback were losing scope unless I explicitly bound it.  And need to
		// save the reference so it can be effectively unbound.
		this.boundOnInViewportScroll = function () {
			return _this.onInViewportScroll();
		};

		// If init was delayed, watch for inViewportActive on the parent vm to become
		// true for when its directives should add their handlers
		if (this.params.inViewportActive) {
			return this.addHandlers();
		} else {
			return this.vm.$watch('inViewportActive', function (ready) {
				if (ready) {
					return _this.addHandlers();
				}
			}, { immediate: true });
		}
	},


	// Remove listener
	unbind: function unbind() {
		return this.removeHandlers();
	},


	// Add listeners
	addHandlers: function addHandlers() {
		if (this.handlersAdded) {
			return;
		}
		this.handlersAdded = true;
		_windowEventMediator2.default.on('scroll', this.boundOnInViewportScroll);
		_windowEventMediator2.default.on('resize', this.boundOnInViewportScroll);
		return this.onInViewportScroll();
	},


	// Remove listeners
	removeHandlers: function removeHandlers() {
		if (!this.handlersAdded) {
			return;
		}
		this.handlersAdded = false;
		_windowEventMediator2.default.off('scroll', this.boundOnInViewportScroll);
		return _windowEventMediator2.default.off('resize', this.boundOnInViewportScroll);
	},


	// Update viewport staus
	onInViewportScroll: function onInViewportScroll() {
		var visible = this.isInViewport();
		var above = this.isAboveViewport();
		var below = this.isBelowViewport();
		if (this.params.inViewportOnce && visible) {
			this.removeHandlers();
		}
		return $(this.el).toggleClass(this.params.inViewportClass, visible);
	},


	// Check if element is in viewport
	isInViewport: function isInViewport() {
		return (0, _check2.default)(this.el, {
			offsetTop: this.params.inViewportOffsetTop,
			offsetBottom: this.params.inViewportOffsetBottom
		}).inViewport;
	},


	// Check if element is above viewport
	isAboveViewport: function isAboveViewport() {
		return (0, _check2.default)(this.el, {
			offsetTop: this.params.inViewportOffsetTop,
			offsetBottom: this.params.inViewportOffsetBottom
		}).aboveViewport;
	},


	// Check if element is below viewport
	isBelowViewport: function isBelowViewport() {
		return (0, _check2.default)(this.el, {
			offsetTop: this.params.inViewportOffsetTop,
			offsetBottom: this.params.inViewportOffsetBottom
		}).belowViewport;
	}
};
