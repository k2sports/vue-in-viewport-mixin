/*jshint esversion: 6 */

/*
Directive version of the main mixin
*/

// Deps
import win from 'window-event-mediator';
import check from './check';

// Directive definition
export default {

	// Global defaults, duck punch to change
	inViewportActive:       true,
	inViewportOnce:         true,
	inViewportClass:        'in-viewport',
	inViewportOffsetTop:    0,
	inViewportOffsetBottom: 0,

	// Prop-style settings
	params: [
		'inViewportActive',
		'inViewportOnce',
		'inViewportClass',
		'inViewportOffsetTop',
		'inViewportOffsetBottom'
	],

	// Set default param values and start listening for scrolls
	bind() {

		// Set defaults from the global defaults
		for (let key of ([
			'inViewportActive',
			'inViewportOnce',
			'inViewportClass',
			'inViewportOffsetTop',
			'inViewportOffsetBottom'
		])) { if (this.params[key] === null) { this.params[key] = this[key]; } }

		// Callback were losing scope unless I explicitly bound it.  And need to
		// save the reference so it can be effectively unbound.
		this.boundOnInViewportScroll = () => this.onInViewportScroll();

		// If init was delayed, watch for inViewportActive on the parent vm to become
		// true for when its directives should add their handlers
		if (this.params.inViewportActive) {
			return this.addHandlers();
		} else {
			return this.vm.$watch('inViewportActive', ready => {
				if (ready) { return this.addHandlers(); }
			}, {immediate: true});
		}
	},

	// Remove listener
	unbind() { return this.removeHandlers(); },

	// Add listeners
	addHandlers() {
		if (this.handlersAdded) { return; }
		this.handlersAdded = true;
		win.on('scroll', this.boundOnInViewportScroll);
		win.on('resize', this.boundOnInViewportScroll);
		return this.onInViewportScroll();
	},

	// Remove listeners
	removeHandlers() {
		if (!this.handlersAdded) { return; }
		this.handlersAdded = false;
		win.off('scroll', this.boundOnInViewportScroll);
		return win.off('resize', this.boundOnInViewportScroll);
	},

	// Update viewport staus
	onInViewportScroll() {
		let visible = this.isInViewport();
		let above = this.isAboveViewport();
		let below = this.isBelowViewport();
		if (this.params.inViewportOnce && visible) { this.removeHandlers(); }
		return $(this.el).toggleClass(this.params.inViewportClass, visible);
	},

	// Check if element is in viewport
	isInViewport() { return check(this.el, {
			offsetTop:    this.params.inViewportOffsetTop,
			offsetBottom: this.params.inViewportOffsetBottom
		}
		).inViewport; },

	// Check if element is above viewport
	isAboveViewport() { return check(this.el, {
			offsetTop:    this.params.inViewportOffsetTop,
			offsetBottom: this.params.inViewportOffsetBottom
		}
		).aboveViewport; },

	// Check if element is below viewport
	isBelowViewport() { return check(this.el, {
			offsetTop:    this.params.inViewportOffsetTop,
			offsetBottom: this.params.inViewportOffsetBottom
		}
		).belowViewport; }
};
