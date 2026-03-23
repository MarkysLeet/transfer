from playwright.sync_api import sync_playwright

def verify_feature():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(record_video_dir="/home/jules/verification/video")
        page = context.new_page()

        try:
            # Go to the local app
            page.goto("http://localhost:3000/en")
            page.wait_for_timeout(2000)

            # Look for the new 'Book Transfer' CTA button in Hero
            book_btn = page.locator("button:has-text('Book Transfer')").first
            book_btn.click()
            page.wait_for_timeout(1000)

            # Screenshot showing the modal opened
            page.screenshot(path="/home/jules/verification/verification.png")
            page.wait_for_timeout(1000)

            # Try interacting with Step 1
            # Select Route: round trip toggle
            page.get_by_text("Round trip").click()
            page.wait_for_timeout(500)

            # Since the google places autocomplete dropdowns are tricky to interact with automatically without mocking API,
            # we will just take a screenshot of the open modal state.
            page.screenshot(path="/home/jules/verification/step1_opened.png")

        finally:
            context.close()
            browser.close()

if __name__ == "__main__":
    verify_feature()
