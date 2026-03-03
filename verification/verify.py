from playwright.sync_api import sync_playwright
import time

def verify_changes(page):
    page.goto("http://localhost:3000/ru")

    # Wait for the main elements to load
    page.wait_for_selector("text=BLACK DIAMOND GRAND TRANSFER")

    # The combobox for "Откуда" should be present.
    # We locate it by the input with placeholder "Откуда".
    from_input = page.get_by_placeholder("Откуда")
    from_input.click()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/hero_with_combobox.png")

    # Scroll to Destinations
    destinations = page.locator("#destinations")
    destinations.scroll_into_view_if_needed()
    page.wait_for_timeout(1000)
    page.screenshot(path="verification/destinations.png")

    # Click the first destination inside #destinations to open the modal
    first_card = page.locator("#destinations .group").first
    first_card.click()
    page.wait_for_timeout(2000) # Wait a bit longer for animation
    page.screenshot(path="verification/destination_modal.png")

if __name__ == "__main__":
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.set_viewport_size({"width": 1280, "height": 800})
        try:
            verify_changes(page)
        except Exception as e:
            print(f"Error: {e}")
        finally:
            browser.close()