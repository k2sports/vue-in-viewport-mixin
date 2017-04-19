var scrollMonitor;

scrollMonitor = require('scrollmonitor');

module.exports = {
  props: {
    inViewportActive: {
      type: Boolean,
      "default": true
    },
    inViewportOnce: {
      type: Boolean,
      "default": false
    },
    inViewportOffset: {
      type: Number,
      "default": 0
    },
    inViewportOffsetTop: {
      type: Number,
      "default": null
    },
    inViewportOffsetBottom: {
      type: Number,
      "default": null
    }
  },
  data: function() {
    return {
      inViewport: {
        now: null,
        fully: null,
        above: null,
        below: null,
        listening: false
      }
    };
  },
  computed: {
    inViewportOffsetTopComputed: function() {
      var ref;
      return (ref = this.inViewportOffsetTop) != null ? ref : this.inViewportOffset;
    },
    inViewportOffsetBottomComputed: function() {
      var ref;
      return (ref = this.inViewportOffsetBottom) != null ? ref : this.inViewportOffset;
    },
    inViewportOffsetComputed: function() {
      return {
        top: this.inViewportOffsetTopComputed,
        bottom: this.inViewportOffsetBottomComputed
      };
    }
  },
  mounted: function() {
    return this.inViewportInit();
  },
  destroyed: function() {
    return this.removeInViewportHandlers();
  },
  watch: {
    inViewportActive: function(active) {
      if (active) {
        return this.addInViewportHandlers();
      } else {
        return this.removeInViewportHandlers();
      }
    },
    inViewportOffsetComputed: {
      deep: true,
      handler: function() {
        this.removeInViewportHandlers();
        return this.inViewportInit();
      }
    }
  },
  methods: {
    inViewportInit: function() {
      if (this.inViewportActive) {
        return this.addInViewportHandlers();
      }
    },
    addInViewportHandlers: function() {
      if (this.inViewport.listening) {
        return;
      }
      this.inViewport.listening = true;
      this.scrollMonitor = scrollMonitor.create(this.$el, this.inViewportOffsetComputed);
      this.scrollMonitor.on('stateChange', this.updateInViewport);
      return this.updateInViewport();
    },
    removeInViewportHandlers: function() {
      if (!this.inViewport.listening) {
        return;
      }
      this.inViewport.listening = false;
      if (this.scrollMonitor) {
        this.scrollMonitor.destroy();
      }
      return delete this.scrollMonitor;
    },
    updateInViewport: function() {
      this.inViewport.now = this.scrollMonitor.isInViewport;
      this.inViewport.fully = this.scrollMonitor.isFullyInViewport;
      this.inViewport.above = this.scrollMonitor.isAboveViewport;
      this.inViewport.below = this.scrollMonitor.isBelowViewport;
      if (this.inViewportOnce && this.inViewport.now) {
        return this.removeInViewportHandlers();
      }
    }
  }
};
