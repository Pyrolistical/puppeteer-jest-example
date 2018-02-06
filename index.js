const puppeteer = require('puppeteer')
const {promisify} = require('util')
const fs = require('fs')
const path = require('path')
const {spawn} = require('child_process')

const puppeteerEnvironmentFactory = require('./puppeteer-environment-factory')

const writeFile = promisify(fs.writeFile)
const unlink = promisify(fs.unlink)

async function main() {
  const browser = await puppeteer.launch({})
  const cleanupBrowser = () => {
    return browser.close()
  }

  try {
    const puppeteerEnvironmentFile = path.join(__dirname, 'puppeteer-environment.js')
    const cleanupPuppeteerEnvironmentFile = () => {
      return unlink(puppeteerEnvironmentFile)
    }

    try {
      await writeFile(puppeteerEnvironmentFile, puppeteerEnvironmentFactory(browser.wsEndpoint()))

      const jestProcess = spawn('node_modules/.bin/jest', [], {
        stdio: 'inherit'
      })
      await new Promise((resolve, reject) => {
        let closed = false;
        jestProcess.on('exit', (code, signal) => {
          if (!closed) {
            closed = true
            return resolve({code, signal})
          }
        })
        jestProcess.on('error', (error) => {
          if (!closed) {
            closed = true
            return reject(error)
          }
        })
      })
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
