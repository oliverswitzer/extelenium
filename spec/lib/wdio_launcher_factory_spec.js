const WdioLauncherFactory = require('../../lib/wdio_launcher_factory')
const _ = require('lodash')

describe('WdioLauncherFactory', () => {
  let wdioLauncherFactory

  describe('withExtensionLoaded', () => {
    describe('when capabilities have been specified in existing config file', () => {
      beforeEach(() => {
        wdioLauncherFactory = new WdioLauncherFactory({
          wdioConfigFilePath: 'spec/support/fixtures/test_wdio-with-predefined-capabilities.conf.js',
        })
      })

      it('does not over-write existing capabilities defined in config file', () => {
        const launcher = wdioLauncherFactory.withExtensionLoaded({
          encodedExtension: 'some base64 extension string'
        })

        const existingCapability = _.first(launcher.configParser._config.capabilities)

        expect(existingCapability).toEqual(jasmine.objectContaining(
          {
            maxInstances: 5,
            browserName: 'chrome'
          }
        ))
      })

      itProperlyAddsTheChromeExtensionCapability()
    })

    describe('when capabilities key is missing from wdio.conf.js', () => {
      beforeEach(() => {
        wdioLauncherFactory = new WdioLauncherFactory({
          wdioConfigFilePath: 'spec/support/fixtures/test_wdio-with-no-predefined-capabilities.conf.js'
        })
      })

      it('throws an error', () => {
        expect(() => {wdioLauncherFactory.withExtensionLoaded({
          encodedExtension: 'some base64 extension string'
        })}).toThrow(new Error('must specify config.capabilities in your wdio configuration file'))
      })
    })

    describe('when browserName is missing from wdio.conf.js', () => {
      beforeEach(() => {
        wdioLauncherFactory = new WdioLauncherFactory({
          wdioConfigFilePath: 'spec/support/fixtures/test_wdio-with-no-browserName-capability.conf.js'
        })
      })

      it('adds "browserName: chrome" as a capability', () => {
        const launcher = wdioLauncherFactory.withExtensionLoaded({
          encodedExtension: 'some base64 extension string'
        })

        const existingCapability = _.first(launcher.configParser._config.capabilities)

        expect(existingCapability).toEqual(jasmine.objectContaining(
          {
            browserName: 'chrome'
          }
        ))
      })

      itProperlyAddsTheChromeExtensionCapability()
    })
  })

  function itProperlyAddsTheChromeExtensionCapability() {
    it('returns an instance of webdriverio with chromeOptions.extensions set to encoded extension string', () => {
      const launcher = wdioLauncherFactory.withExtensionLoaded({
        encodedExtension: 'some base64 extension string'
      })

      const newCapability = _.first(launcher.configParser._config.capabilities)

      expect(newCapability).toEqual(jasmine.objectContaining(
        {
          chromeOptions: {
            extensions: ['some base64 extension string']
          }
        }
      ))
    })
  }
})