import ManifestParser from '../../lib/manifest_parser'

describe('ManifestParser', () => {
  let manifestParser

  beforeEach(() => {
    manifestParser = new ManifestParser({chromeExtensionPath: 'spec/support/fixtures/sample-extension/'})
  })

  describe('name', () => {
    it('returns the name of the extension specified in the manifest', () => {
      expect(manifestParser.name()).toEqual('some extension name')
    })
  })
})