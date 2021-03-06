/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal, drupalSettings, _, Backbone, JSON, storage) {
  const options = $.extend(drupalSettings.contextual, {
    strings: {
      open: Drupal.t('Open'),
      close: Drupal.t('Close')
    }
  });
  const cachedPermissionsHash = storage.getItem('Drupal.contextual.permissionsHash');
  const permissionsHash = drupalSettings.user.permissionsHash;

  if (cachedPermissionsHash !== permissionsHash) {
    if (typeof permissionsHash === 'string') {
      _.chain(storage).keys().each(key => {
        if (key.substring(0, 18) === 'Drupal.contextual.') {
          storage.removeItem(key);
        }
      });
    }

    storage.setItem('Drupal.contextual.permissionsHash', permissionsHash);
  }

  function adjustIfNestedAndOverlapping($contextual) {
    const $contextuals = $contextual.parents('.contextual-region').eq(-1).find('.contextual');

    if ($contextuals.length <= 1) {
      return;
    }

    const firstTop = $contextuals.eq(0).offset().top;
    const secondTop = $contextuals.eq(1).offset().top;

    if (firstTop === secondTop) {
      const $nestedContextual = $contextuals.eq(1);
      let height = 0;
      const $trigger = $nestedContextual.find('.trigger');
      $trigger.removeClass('visually-hidden');
      height = $nestedContextual.height();
      $trigger.addClass('visually-hidden');
      $nestedContextual.css({
        top: $nestedContextual.position().top + height
      });
    }
  }

  function initContextual($contextual, html) {
    const $region = $contextual.closest('.contextual-region');
    const contextual = Drupal.contextual;
    $contextual.html(html).addClass('contextual').prepend(Drupal.theme('contextualTrigger'));
    const destination = `destination=${Drupal.encodePath(Drupal.url(drupalSettings.path.currentPath))}`;
    $contextual.find('.contextual-links a').each(function () {
      const url = this.getAttribute('href');
      const glue = url.indexOf('?') === -1 ? '?' : '&';
      this.setAttribute('href', url + glue + destination);
    });
    let title = '';
    const $regionHeading = $region.find('h2');

    if ($regionHeading.length) {
      title = $regionHeading[0].textContent.trim();
    }

    const model = new contextual.StateModel({
      title
    });
    const viewOptions = $.extend({
      el: $contextual,
      model
    }, options);
    contextual.views.push({
      visual: new contextual.VisualView(viewOptions),
      aural: new contextual.AuralView(viewOptions),
      keyboard: new contextual.KeyboardView(viewOptions)
    });
    contextual.regionViews.push(new contextual.RegionView($.extend({
      el: $region,
      model
    }, options)));
    contextual.collection.add(model);
    $(document).trigger('drupalContextualLinkAdded', Drupal.deprecatedProperty({
      target: {
        $el: $contextual,
        $region,
        model
      },
      deprecatedProperty: 'model',
      message: 'The model property is deprecated in drupal:9.4.0 and is removed from drupal:10.0.0. There is no replacement.'
    }));
    adjustIfNestedAndOverlapping($contextual);
  }

  Drupal.behaviors.contextual = {
    attach(context) {
      const $context = $(context);
      let $placeholders = $(once('contextual-render', '[data-contextual-id]', context));

      if ($placeholders.length === 0) {
        return;
      }

      const ids = [];
      $placeholders.each(function () {
        ids.push({
          id: $(this).attr('data-contextual-id'),
          token: $(this).attr('data-contextual-token')
        });
      });
      const uncachedIDs = [];
      const uncachedTokens = [];
      ids.forEach(contextualID => {
        const html = storage.getItem(`Drupal.contextual.${contextualID.id}`);

        if (html && html.length) {
          window.setTimeout(() => {
            initContextual($context.find(`[data-contextual-id="${contextualID.id}"]:empty`).eq(0), html);
          });
          return;
        }

        uncachedIDs.push(contextualID.id);
        uncachedTokens.push(contextualID.token);
      });

      if (uncachedIDs.length > 0) {
        $.ajax({
          url: Drupal.url('contextual/render'),
          type: 'POST',
          data: {
            'ids[]': uncachedIDs,
            'tokens[]': uncachedTokens
          },
          dataType: 'json',

          success(results) {
            _.each(results, (html, contextualID) => {
              storage.setItem(`Drupal.contextual.${contextualID}`, html);

              if (html.length > 0) {
                $placeholders = $context.find(`[data-contextual-id="${contextualID}"]`);

                for (let i = 0; i < $placeholders.length; i++) {
                  initContextual($placeholders.eq(i), html);
                }
              }
            });
          }

        });
      }
    }

  };
  Drupal.contextual = {
    views: [],
    regionViews: []
  };
  Drupal.contextual.collection = new Backbone.Collection([], {
    model: Drupal.contextual.StateModel
  });

  Drupal.theme.contextualTrigger = function () {
    return '<button class="trigger visually-hidden focusable" type="button"></button>';
  };

  $(document).on('drupalContextualLinkAdded', (event, data) => {
    Drupal.ajax.bindAjaxLinks(data.$el[0]);
  });
})(jQuery, Drupal, drupalSettings, _, Backbone, window.JSON, window.sessionStorage);