from playwright.sync_api import sync_playwright
import time

with sync_playwright() as p:
    browser = p.chromium.launch()
    page = browser.new_page(viewport={"width": 1280, "height": 800})
    page.goto("http://localhost:3000/en")

    # Scroll down to the features section
    page.evaluate("document.querySelector('#features').scrollIntoView({behavior: 'smooth', block: 'start'})")
    time.sleep(2) # Wait for framer-motion animations

    page.screenshot(path="/home/jules/verification/screenshot_features.png")
    browser.close()
