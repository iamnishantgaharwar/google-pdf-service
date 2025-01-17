const { chromium } = require('playwright');

let browserInstances = [];
let contextPool = [];

const getBrowserInstance = async () => {
  if (browserInstances.length < 3) {
    const browser = await chromium.launch();
    browserInstances.push(browser);
    console.log(`Browser instance created. Total instances: ${browserInstances.length}`);
  }
  return browserInstances[Math.floor(Math.random() * browserInstances.length)];
};

const getContext = async (browser) => {
  if (contextPool.length < 5) {
    const context = await browser.newContext();
    contextPool.push(context);
    console.log(`Context created. Total contexts: ${contextPool.length}`);
  }
  return contextPool[Math.floor(Math.random() * contextPool.length)];
};

const closeBrowserInstances = async () => {
  for (const browser of browserInstances) {
    await browser.close();
  }
  console.log(`All browser instances closed.`);
  browserInstances = [];
  contextPool = [];
};

module.exports = { getBrowserInstance, getContext, closeBrowserInstances };