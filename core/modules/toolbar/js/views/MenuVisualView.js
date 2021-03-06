/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Backbone, Drupal) {
  Drupal.toolbar.MenuVisualView = Backbone.View.extend({
    initialize() {
      this.listenTo(this.model, 'change:subtrees', this.render);
    },

    render() {
      const subtrees = this.model.get('subtrees');
      Object.keys(subtrees || {}).forEach(id => {
        $(once('toolbar-subtrees', this.$el.find(`#toolbar-link-${id}`))).after(subtrees[id]);
      });

      if ('drupalToolbarMenu' in $.fn) {
        this.$el.children('.toolbar-menu').drupalToolbarMenu();
      }
    }

  });
})(jQuery, Backbone, Drupal);