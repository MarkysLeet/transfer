from playwright.sync_api import sync_playwright
import time

def run(playwright):
    browser = playwright.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1280, "height": 800}) # Desktop view

    # Go to homepage
    try:
        page.goto("http://localhost:3000", timeout=60000)
    except Exception as e:
        print(f"Error navigating: {e}")
        browser.close()
        return

    # Wait for hero text to be visible (it has animation)
    try:
        page.wait_for_selector("text=Ваш премиальный трансфер", timeout=10000)
    except Exception as e:
        print(f"Error waiting for selector: {e}")
        browser.close()
        return

    # Scroll down to see other sections
    page.evaluate("window.scrollTo(0, 1000)")
    time.sleep(1) # Wait for animations

    page.evaluate("window.scrollTo(0, 2000)")
    time.sleep(1)

    page.evaluate("window.scrollTo(0, 3000)")
    time.sleep(1)

    # Scroll back to top for screenshot
    page.evaluate("window.scrollTo(0, 0)")
    time.sleep(1)

    # Take screenshot of the full page (approximation)
    # Actually, let's take a screenshot of the viewport at the top first
    page.screenshot(path="verification/homepage_desktop.png")

    # Now verify mobile view
    context_mobile = browser.new_context(viewport={"width": 375, "height": 667}, user_agent="Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1")
    page_mobile = context_mobile.new_page()
    page_mobile.goto("http://localhost:3000")

    time.sleep(2)
    page_mobile.screenshot(path="verification/homepage_mobile.png")

    # Scroll to bottom on mobile to see sticky bar and footer
    page_mobile.evaluate("window.scrollTo(0, document.body.scrollHeight)")
    time.sleep(1)
    page_mobile.screenshot(path="verification/homepage_mobile_bottom.png")

    browser.close()

with sync_playwright() as playwright:
    run(playwright)
