from playwright.sync_api import sync_playwright, expect
import time

def test_homepage(page):
    page.goto("http://localhost:3000", timeout=60000)
    
    # Wait for the page to load
    time.sleep(5)
    
    # Take screenshot of whatever is loaded
    page.screenshot(path="/home/jules/verification/homepage_fail.png", full_page=True)

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        try:
            test_homepage(page)
        finally:
            browser.close()
