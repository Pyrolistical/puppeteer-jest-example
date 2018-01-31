const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const JestEnvironmentFactory = require('./jest-environment-factory')

async function main() {
  const browser = await puppeteer.launch({})

  const jestEnvironmentFile = path.join(__dirname, 'jest-environment.js')
  fs.writeFileSync(jestEnvironmentFile, JestEnvironmentFactory(browser.wsEndpoint()))

  child_process.exec('node_modules/.bin/jest', async (error) => {
    if (error) {
      console.log(error)
      // fall through to finally
    }
    // finally
    await browser.close()
    fs.unlinkSync(jestEnvironmentFile)
  })
}

main()
