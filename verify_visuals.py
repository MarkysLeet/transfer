from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Use desktop viewport
        page = browser.new_page(viewport={"width": 1280, "height": 800})

        # Navigate to local server
        page.goto("http://localhost:3000/ru")

        # Wait for the main elements to load
        page.wait_for_selector("h1")

        # Scroll down slightly to make sure sticky header doesn't block
        page.mouse.wheel(0, 500)
        page.wait_for_timeout(1000)

        # Ensure How We Work section is visible and take a screenshot
        how_it_works = page.locator("#how-it-works")
        how_it_works.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        how_it_works.screenshot(path="verification/how_it_works.png")

        # Ensure Reviews section is visible and take a screenshot
        reviews = page.locator("#reviews")
        reviews.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        reviews.screenshot(path="verification/reviews.png")

        # Ensure FAQ section is visible and take a screenshot
        faq = page.locator("#faq")
        faq.scroll_into_view_if_needed()
        page.wait_for_timeout(1000)
        faq.screenshot(path="verification/faq.png")

        # Click the first FAQ to test accordion
        faq.locator("button").first.click()
        page.wait_for_timeout(500) # wait for animation
        faq.screenshot(path="verification/faq_open.png")

        browser.close()

if __name__ == "__main__":
    verify_changes()
