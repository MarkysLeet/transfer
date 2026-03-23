with open("src/app/[locale]/layout.tsx", "r") as f:
    content = f.read()

import_statement = "import { BookingModal } from \"@/components/ui/booking-widget/BookingModal\";\n"
content = content.replace("import { FloatingNav } from \"@/components/layout/FloatingNav\";\n", "import { FloatingNav } from \"@/components/layout/FloatingNav\";\n" + import_statement)
content = content.replace("<MobileBottomBar />", "<MobileBottomBar />\n            <BookingModal />")

with open("src/app/[locale]/layout.tsx", "w") as f:
    f.write(content)
