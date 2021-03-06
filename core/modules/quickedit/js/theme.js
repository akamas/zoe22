/**
* DO NOT EDIT THIS FILE.
* See the following change record for more information,
* https://www.drupal.org/node/2815083
* @preserve
**/

(function ($, Drupal) {
  Drupal.theme.quickeditBackstage = function (settings) {
    let html = '';
    html += `<div id="${settings.id}"></div>`;
    return html;
  };

  Drupal.theme.quickeditEntityToolbar = function (settings) {
    let html = '';
    html += `<div id="${settings.id}" class="quickedit quickedit-toolbar-container clearfix">`;
    html += '<i class="quickedit-toolbar-pointer"></i>';
    html += '<div class="quickedit-toolbar-content">';
    html += '<div class="quickedit-toolbar quickedit-toolbar-entity clearfix icon icon-pencil">';
    html += '<div class="quickedit-toolbar-label"></div>';
    html += '</div>';
    html += '<div class="quickedit-toolbar quickedit-toolbar-field clearfix"></div>';
    html += '</div><div class="quickedit-toolbar-lining"></div></div>';
    return html;
  };

  Drupal.theme.quickeditEntityToolbarLabel = function (settings) {
    return `<span class="field">${Drupal.checkPlain(settings.fieldLabel)}</span>${Drupal.checkPlain(settings.entityLabel)}`;
  };

  Drupal.theme.quickeditEntityToolbarFence = function () {
    return '<div id="quickedit-toolbar-fence"></div>';
  };

  Drupal.theme.quickeditFieldToolbar = function (settings) {
    return `<div id="${settings.id}"></div>`;
  };

  Drupal.theme.quickeditToolgroup = function (settings) {
    const classes = settings.classes || [];
    classes.unshift('quickedit-toolgroup');
    let html = '';
    html += `<div class="${classes.join(' ')}"`;

    if (settings.id) {
      html += ` id="${settings.id}"`;
    }

    html += '>';
    html += Drupal.theme('quickeditButtons', {
      buttons: settings.buttons
    });
    html += '</div>';
    return html;
  };

  Drupal.theme.quickeditButtons = function (settings) {
    let html = '';

    for (let i = 0; i < settings.buttons.length; i++) {
      const button = settings.buttons[i];

      if (!button.hasOwnProperty('type')) {
        button.type = 'button';
      }

      const attributes = [];
      const attrMap = settings.buttons[i].attributes || {};
      Object.keys(attrMap).forEach(attr => {
        attributes.push(attr + (attrMap[attr] ? `="${attrMap[attr]}"` : ''));
      });
      html += `<button type="${button.type}" class="${button.classes}" ${attributes.join(' ')}>${button.label}</button>`;
    }

    return html;
  };

  Drupal.theme.quickeditFormContainer = function (settings) {
    let html = '';
    html += `<div id="${settings.id}" class="quickedit-form-container">`;
    html += '  <div class="quickedit-form">';
    html += '    <div class="placeholder">';
    html += settings.loadingMsg;
    html += '    </div>';
    html += '  </div>';
    html += '</div>';
    return html;
  };

  Drupal.theme.quickeditImageErrors = function (settings) {
    return `<div class="quickedit-image-errors">${settings.errors}</div>`;
  };

  Drupal.theme.quickeditImageDropzone = function (settings) {
    return `<div class="quickedit-image-dropzone ${settings.state}">` + '  <i class="quickedit-image-icon"></i>' + `  <span class="quickedit-image-text">${settings.text}</span>` + '</div>';
  };

  Drupal.theme.quickeditImageToolbar = function (settings) {
    let html = '<form class="quickedit-image-field-info">';

    if (settings.alt_field) {
      html += `<div><label for="alt" class="${settings.alt_field_required ? 'required' : ''}">${Drupal.t('Alternative text')}</label>` + `<input type="text" placeholder="${settings.alt}" value="${settings.alt}" name="alt" ${settings.alt_field_required ? 'required' : ''}/>` + '  </div>';
    }

    if (settings.title_field) {
      html += `<div><label for="title" class="${settings.title_field_required ? 'form-required' : ''}">${Drupal.t('Title')}</label>` + `<input type="text" placeholder="${settings.title}" value="${settings.title}" name="title" ${settings.title_field_required ? 'required' : ''}/>` + '</div>';
    }

    html += '</form>';
    return html;
  };
})(jQuery, Drupal);