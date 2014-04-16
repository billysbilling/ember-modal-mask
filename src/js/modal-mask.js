var ANIMATION_DURATION = 250;

module.exports = Em.Component.extend({
    classNames: ['modal-mask'],

    classNameBindings: ['animated:modal-mask-animated'],

    attributeBindings: ['style'],

    animated: true,

    animationDuration: function() {
        return this.get('animated') ? ANIMATION_DURATION : 0;
    }.property('animated'),

    isAnimateDestroying: false,

    zIndex: 1000,

    style: function() {
        return 'z-index:'+this.get('zIndex')+';';
    }.property('zIndex'),

    show: function() {
        this.appendTo(this.container.lookup('application:main').get('rootElement'));
    },

    didInsertElement: function() {
        var self = this,
            el = this.$();
        Em.run.next(function() {
            if (self.get('isDestroying')) {
                return;
            }
            el.addClass('visible');
            self.blurBelowLayer(true);
        });
    },

    animateDestroy: function() {
        var el = this.$();
        el.removeClass('visible');
        this.blurBelowLayer(false);
        this.set('isAnimateDestroying', true);
        Em.run.later(this, function() {
            this.destroy();
        }, this.get('animationDuration'));
    },

    blurBelowLayer: function(blurred) {
        var zIndex = this.get('zIndex');
        var belowLayers = this.$().siblings('.application, .layer')
            .filter(function(index, s) {
                var sz = $(s).css('z-index');
                return (sz === 'auto' || sz < zIndex);
            });
        belowLayers[blurred ? 'addClass' : 'removeClass']('modal-mask-blur');
    }
});