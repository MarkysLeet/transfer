from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True, args=['--no-sandbox'])
    page = browser.new_page()
    page.goto('http://localhost:3000')
    footer_html = page.evaluate("document.querySelector('footer').outerHTML")
    print(footer_html)
    browser.close()
