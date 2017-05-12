import ExtensionLoader from '../../lib/extension_loader'

describe('ExtensionLoader', () => {
  let extensionLoader, execWrapperSpy, pathWrapperSpy, execWrapperCalls

  beforeEach(() => {
    execWrapperCalls = [];
    execWrapperSpy = jasmine.createSpy('execWrapper').and.callFake((command, callback) => {
      execWrapperCalls.push({ command, callback })
    });

    pathWrapperSpy = { basename: jasmine.createSpy('basename').and.returnValue('extension') }

    extensionLoader = new ExtensionLoader({
      chromeExtensionPath: '/some/path/to/chrome/extension',
      execWrapper: execWrapperSpy,
      pathWrapper: pathWrapperSpy
    })
  })

  it('calls crxmake binary with extension path', () => {
    extensionLoader.load()

    expect(execWrapperSpy).toHaveBeenCalledWith(
      jasmine.stringMatching('crxmake --pack-extension=/some/path/to/chrome/extension'), jasmine.any(Function)
    )
  })

  it('calls crxmake binary with output of crx file using base path of chrome extension', () => {
    extensionLoader.load()

    expect(execWrapperSpy).toHaveBeenCalledWith(
      jasmine.stringMatching('--extension-output=extension.crx'), jasmine.any(Function)
    )
  })

  describe('after crx file is generated', () => {
    it('converts the crx file to base64 with openssl', () => {
      extensionLoader.load()
      execWrapperSpy.calls.reset()
      execWrapperCalls[0].callback()

      expect(execWrapperSpy).toHaveBeenCalledWith(
        jasmine.stringMatching('openssl base64 -in extension.crx'), jasmine.any(Function)
      )
    })
  })

  describe('after crx file is base64 encoded', () => {
    it('resolves with a string of the result of the encoding', (done) => {
      extensionLoader.load().then(result => {
        expect(result).toEqual('some base64 encoded crx string')

        done()
      })

      execWrapperCalls[0].callback()
      execWrapperCalls[1].callback(undefined, 'some base64 encoded crx string')
    })
  })
})