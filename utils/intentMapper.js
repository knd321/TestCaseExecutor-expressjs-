const { click } = require('./click');
const { fillInput } = require('./fillInput');
const { fillPassword } = require('./fillPassword');

const intentMapper = {
  'click': async (page, step, screenshotsDir, stepName) => {
    await click(page, step.text);
  },
  'fill': async (page, step, screenshotsDir, stepName) => {
    await fillInput(page, step.text, step.value);
  },
  'fillPassword': async (page, step, screenshotsDir, stepName) => {
    await fillPassword(page, step.text, step.value);
  }
};

module.exports = { intentMapper };
