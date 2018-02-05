module.exports = (wsEndpoint) => `
const NodeEnvironment = require('jest-environment-node')
const puppeteer = require('puppeteer')

module.exports = class extends NodeEnvironment {
  constructor(config) {
    super(config)
  }

  async setup() {
    await super.setup()
    this.global.__BROWSER__ = await puppeteer.connect({
      browserWSEndpoint: '${wsEndpoint}'
    })
  }

  async teardown() {
    await super.teardown()
  }

  runScript(script) {
    return super.runScript(script)
  }
}`
