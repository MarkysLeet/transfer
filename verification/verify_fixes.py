from playwright.sync_api import sync_playwright

def verify_frontend():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Go to the homepage
        page.goto("http://localhost:3000/en")
        page.wait_for_load_state("networkidle")

        page.screenshot(path="/home/jules/verification/hero_and_booking_widget.png", full_page=True)

        # Look for the inputs by getting their actual elements
        inputs = page.locator("input[type='text']")
        inputs.first.click()
        page.wait_for_timeout(1000) # Wait for animation

        page.screenshot(path="/home/jules/verification/combobox_opened.png", full_page=False)

        browser.close()

if __name__ == "__main__":
    verify_frontend()