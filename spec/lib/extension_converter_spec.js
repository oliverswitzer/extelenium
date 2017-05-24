import ExtensionConverter from '../../lib/extension_converter'

describe('ExtensionConverter', () => {
  const EMPTY_STDERR = undefined, EMPTY_STDOUT = undefined

  let extensionConverter, execWrapperSpy,
    execWrapperCalls, fsWrapperSpy

  beforeEach(() => {
    execWrapperCalls = []
    execWrapperSpy = jasmine.createSpy('execWrapper').and.callFake((command, callback) => {
      execWrapperCalls.push({command, callback})
    })

    const chromeExtensionPath = 'spec/support/fixtures/sample-extension/'

    fsWrapperSpy = {
      removeSync: jasmine.createSpy('removeSync')
    }
    extensionConverter = new ExtensionConverter({
      chromeExtensionPath,
      execWrapper: execWrapperSpy,
      fsWrapper: fsWrapperSpy
    })
  })

  describe('toCrxFile', () => {
    it('calls crxmake binary with extension path', () => {
      extensionConverter.toCrxFile()

      expect(execWrapperSpy).toHaveBeenCalledWith(
        jasmine.stringMatching('crxmake --pack-extension=spec/support/fixtures/sample-extension/'), jasmine.any(Function)
      )
    })

    describe('crx file output name', () => {
      it('uses chrome extension name in the manifest file', () => {
        extensionConverter.toCrxFile()

        expect(execWrapperSpy).toHaveBeenCalledWith(
          jasmine.stringMatching('--extension-output=some-extension-name.crx'), jasmine.any(Function)
        )
      })
    })

    describe('pem file output name', () => {
      it('uses chrome extension name in the manifest file', () => {
        extensionConverter.toCrxFile()

        expect(execWrapperSpy).toHaveBeenCalledWith(
          jasmine.stringMatching('--key-output=some-extension-name.pem'), jasmine.any(Function)
        )
      })
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
      it('tries to read "some-extension-name.crx" as base64 with openssl', () => {
        extensionConverter.toBase64String()

        expect(execWrapperSpy).toHaveBeenCalledWith(
          jasmine.stringMatching('openssl base64 -in some-extension-name.crx'), jasmine.any(Function)
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
    describe('removes .crx file', () => {
      it('removes some-extension-name.crx file', () => {
        extensionConverter.cleanCrxAndPemFiles()

        expect(fsWrapperSpy.removeSync).toHaveBeenCalledWith(
          jasmine.stringMatching('some-extension-name.crx')
        )
      })

      it('removes .pem file', () => {
        extensionConverter.cleanCrxAndPemFiles()

        expect(fsWrapperSpy.removeSync).toHaveBeenCalledWith(
          jasmine.stringMatching('some-extension-name.pem')
        )
      })
    })
  })
})