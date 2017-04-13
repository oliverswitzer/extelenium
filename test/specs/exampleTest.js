describe('DuckDuckGo search', function() {
    it('searches for WebdriverIO', function() {
        browser.url('https://pivotaltracker.com');
        browser.setValue('#search_form_input_homepage', 'WebdriverIO');
        browser.click('#search_button_homepage');
        let title = browser.getTitle();
    });
});