import ExtensionConverter from '../../lib/extension_converter'

describe('ExtensionConverter', () => {
  const EMPTY_STDERR = undefined, EMPTY_STDOUT = undefined

  let extensionConverter, execWrapperSpy, pathWrapperSpy, execWrapperCalls, fsWrapperSpy

  beforeEach(() => {
    execWrapperCalls = []
    execWrapperSpy = jasmine.createSpy('execWrapper').and.callFake((command, callback) => {
      execWrapperCalls.push({command, callback})
    })

    pathWrapperSpy = {basename: jasmine.createSpy('basename').and.returnValue('extension')}

    fsWrapperSpy = {
      removeSync: jasmine.createSpy('removeSync')
    }

    extensionConverter = new ExtensionConverter({
      chromeExtensionPath: '/some/path/to/chrome/extension',
      execWrapper: execWrapperSpy,
      pathWrapper: pathWrapperSpy,
      fsWrapper: fsWrapperSpy
    })
  })

  describe('toCrxFile', () => {
    it('calls crxmake binary with extension path', () => {
      extensionConverter.toCrxFile()

      expect(execWrapperSpy).toHaveBeenCalledWith(
        jasmine.stringMatching('crxmake --pack-extension=/some/path/to/chrome/extension'), jasmine.any(Function)
      )
    })

    it('calls crxmake binary with output of crx file using base path of chrome extension', () => {
      extensionConverter.toCrxFile()

      expect(execWrapperSpy).toHaveBeenCalledWith(
        jasmine.stringMatching('--extension-output=extension.crx'), jasmine.any(Function)
      )
    })

    describe('crxmake command fails', () => {
      it('rejects promise and prints the stacktrace', (done) => {
        extensionConverter.toCrxFile()
          .then(() => {
            fail('promise should not be resolved')

            done()
          })
          .catch((err) => {
            expect(err).toEqual('some error occured')

            done()
          })


        execWrapperCalls[0].callback('some error occured', EMPTY_STDOUT)
      })
    })
  })

  describe('toBase64String', () => {
    describe('after crx file is generated', () => {
      it('tries to read "extension.crx" as base64 with openssl', () => {
        extensionConverter.toBase64String()

        expect(execWrapperSpy).toHaveBeenCalledWith(
          jasmine.stringMatching('openssl base64 -in extension.crx'), jasmine.any(Function)
        )
      })

      it('resolves with a string of the result of the encoding', (done) => {
        extensionConverter.toBase64String().then(result => {
          expect(result).toEqual('some base64 encoded crx string')

          done()
        })

        execWrapperCalls[0].callback(EMPTY_STDERR, 'some base64 encoded crx string')
      })
    })
  })

  describe('cleanCrxAndPemFiles', () => {
    describe('removes extension.crx file', () => {
      it('removes "extension.crx" file', () => {
        extensionConverter.cleanCrxAndPemFiles()

        expect(fsWrapperSpy.removeSync).toHaveBeenCalledWith(
          jasmine.stringMatching('extension.crx')
        )
      })

      it('removes "extension.pem" file', () => {
        extensionConverter.cleanCrxAndPemFiles()

        expect(fsWrapperSpy.removeSync).toHaveBeenCalledWith(
          jasmine.stringMatching('extension.pem')
        )
      })
    })
  })
})