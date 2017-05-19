exports.config = {
  specs: [
    './spec/features/*.js'
  ],
  sync: true,
  logLevel: 'error',
  coloredLogs: true,
  bail: 0,
  screenshotPath: './errorShots/',
  waitforTimeout: 10000,
  connectionRetryTimeout: 90000,
  connectionRetryCount: 3,
  framework: 'jasmine',
  jasmineNodeOpts: {
    defaultTimeoutInterval: 10000,
    expectationResultHandler: function(passed, assertion) {
    }
  }
}
