const WdioLauncherFactory = require('../../lib/wdio_launcher_factory')
const _ = require('lodash')

describe('WdioLauncherFactory', () => {
  let wdioLauncherFactory

  beforeEach(() => {
    wdioLauncherFactory = new WdioLauncherFactory({
      wdioConfigFilePath: 'spec/support/fixtures/test_wdio.conf.js',
    })
  })

  describe('withExtensionLoaded', () => {
    it('returns an instance of webdriverio with chromeOptions.extensions set to encoded extension string', () => {
      const launcher = wdioLauncherFactory.withExtensionLoaded({
        encodedExtension: 'some base64 extension string'
      })

      const newCapability = _.first(launcher.configParser._capabilities)

      expect(newCapability).toEqual(jasmine.objectContaining(
        {
          chromeOptions: {
            extensions: ['some base64 extension string']
          }
        }
      ))
    })

    it('does not over-write existing capabilities defined in config file', () => {
      const launcher = wdioLauncherFactory.withExtensionLoaded({
        encodedExtension: 'some base64 extension string'
      })

      const existingCapability = _.first(launcher.configParser._capabilities)

      expect(existingCapability).toEqual(jasmine.objectContaining(
        {
          maxInstances: 5,
          browserName: 'chrome'
        }
      ))
    })
  })
})