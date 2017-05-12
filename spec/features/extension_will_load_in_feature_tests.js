describe('chrome extension is loaded properly when feature tests run', function () {
  it('loads an alert on the page', function () {
    browser.url('https://www.google.com')
    browser.pause(1000)
    expect(browser.alertText()).toEqual("Hello. This message was sent from scripts/inject.js")
  })
})