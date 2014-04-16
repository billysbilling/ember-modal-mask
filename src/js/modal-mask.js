module.exports = Em.Component.extend({
    classNames: ['modal-mask'],
    
    attributeBindings: ['style'],

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
        Em.run.later(this, function() {
            this.destroy();
        }, 300);
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