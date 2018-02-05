const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')
const child_process = require('child_process')

const puppeteerEnvironmentFactory = require('./puppeteer-environment-factory')

function promiseCallback(closure) {
  return new Promise((resolve, reject) => {
    closure((error, ...results) => {
      if (error) {
        return reject(error)
      }
      return resolve(results)
    })
  })
}

const writeFile = (file, data) => promiseCallback((callback) => fs.writeFile(file, data, callback))
const unlink = (file) => promiseCallback((callback) => fs.unlink(file, callback))
const exec = (command) => promiseCallback((callback) => child_process.exec(command, callback))

async function main() {
  const browser = await puppeteer.launch({})
  const cleanupBrowser = () => {
    console.log('closing')
    return browser.close()
  }

  try {
    const puppeteerEnvironmentFile = path.join(__dirname, 'puppeteer-environment.js')
    const cleanupPuppeteerEnvironmentFile = () => {
      return unlink(puppeteerEnvironmentFile)
    }

    try {
      await writeFile(puppeteerEnvironmentFile, puppeteerEnvironmentFactory(browser.wsEndpoint()))

      const [stdout, stderr] = await exec('node_modules/.bin/jest')
      console.log({stdout, stderr})
    } catch (error) {
      await cleanupPuppeteerEnvironmentFile()
      throw error
    }
    await cleanupPuppeteerEnvironmentFile()

  } catch (error) {
    await cleanupBrowser()
    throw error
  }
  await cleanupBrowser()

}

main()
