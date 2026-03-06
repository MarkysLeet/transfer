from playwright.sync_api import sync_playwright

def verify_changes():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page()

        # Navigate to the home page (English locale)
        page.goto("http://localhost:3000/en")

        # Wait for key elements to load
        page.wait_for_selector("text=BLACK DIAMOND TRANSFER")

        # 1. Full page screenshot to check global theme, hero video overlay, typography
        page.screenshot(path="/home/jules/verification/full_page.png", full_page=True)

        # 2. Hero Section and Booking Widget
        hero_section = page.locator("section.relative.min-h-\\[100svh\\]")
        if hero_section.count() > 0:
            hero_section.first.screenshot(path="/home/jules/verification/hero_booking.png")

        # 3. Destinations Section
        destinations_section = page.locator("section.py-24") # Or another specific selector if needed
        # Just scroll down a bit and take a screenshot of destinations
        page.evaluate("window.scrollBy(0, 800)")
        page.wait_for_timeout(1000) # Wait for scroll and animations
        page.screenshot(path="/home/jules/verification/destinations.png")

        # 4. Features/Vito Showcase
        page.evaluate("window.scrollBy(0, 1000)")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/vito_showcase.png")

        # 5. Footer
        page.evaluate("window.scrollTo(0, document.body.scrollHeight)")
        page.wait_for_timeout(1000)
        page.screenshot(path="/home/jules/verification/footer.png")

        browser.close()
        print("Screenshots captured successfully in /home/jules/verification/")

if __name__ == "__main__":
    verify_changes()
