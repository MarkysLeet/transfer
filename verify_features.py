from playwright.sync_api import sync_playwright
import time
import os

def run_verification():
    os.makedirs('verification', exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch()
        # Create a page with standard desktop dimensions to view the sections clearly
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        page.goto("http://localhost:3000/en")
        time.sleep(2) # Give animations a moment to settle

        # Scroll to Features block
        page.evaluate("document.getElementById('features').scrollIntoView()")
        time.sleep(1) # wait for smooth scroll and animations
        page.screenshot(path="verification/features_block.png")

        # Scroll to Loyalty Block
        page.evaluate("document.getElementById('loyalty').scrollIntoView()")
        time.sleep(1)
        # Hover over the first card to see the hover effect
        page.locator("#loyalty > div > div.grid > div:nth-child(1)").hover()
        time.sleep(1)
        page.screenshot(path="verification/loyalty_block.png")

        browser.close()

if __name__ == "__main__":
    run_verification()