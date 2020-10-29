/* eslint-disable no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable camelcase */
/* eslint-disable no-param-reassign */

/*

datocms-plugin-configure-fields

*/

window.DatoCmsPlugin.init((plugin) => {
  const isDev = plugin.parameters.global.developmentMode;
  const log = (...val) => (isDev ? console.log(...val) : undefined);
  const info = (...val) => (isDev ? console.info(...val) : undefined);
  const warn = (...val) => (isDev ? console.warn(...val) : undefined);
  const error = (...val) => (isDev ? console.error(...val) : undefined);
  const table = (...val) => (isDev ? console.table(...val) : undefined);

  if (plugin.field.attributes.localized) error('this field-addon plugin cannot be added to a localized field!');

  const siteFields = plugin.fields;
  // NB: we're collecting fields for this model *other than the plugin field*
  const modelFields = plugin.itemType.relationships.fields.data.filter(field => field.id !== plugin.field.id);
  const modelFieldKeys = modelFields.map(({ id }) => siteFields[id].attributes.api_key);
  const modelFieldsByKey = modelFields.reduce((obj, { id }) => {
    const field = siteFields[id];
    const fieldKey = field.attributes.api_key;
    obj[fieldKey] = field;
    return obj;
  }, {});

  const hidingConfigs = JSON.parse(plugin.parameters.instance.hiddenFields);

  info('\n/* Configure Fields */\n\n');

  function toggleFields(configName) {
    const config = hidingConfigs[configName] || [];
    modelFieldKeys.forEach((apiKey) => {
      const isHidden = config.includes(apiKey);
      log('toggling', apiKey, !isHidden);
      // compensate for parentFieldId
      const targetApiKey = plugin.parentFieldId
        ? `${plugin.fieldPath.replace(/.[^.]*$/, '')}.${apiKey}`
        : apiKey;
      // check if targetField is localized
      const targetField = modelFieldsByKey[apiKey];
      if (!targetField.attributes.localized) return plugin.toggleField(targetApiKey, !isHidden);
      return plugin.site.attributes.locales.forEach((locale) => {
        plugin.toggleField(`${targetApiKey}.${locale}`, isHidden);
      });
    });
  }

  toggleFields(plugin.getFieldValue(plugin.fieldPath));
  plugin.addFieldChangeListener(plugin.fieldPath, toggleFields);
});
