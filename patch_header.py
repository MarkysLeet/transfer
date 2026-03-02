import re

with open('src/components/layout/Header.tsx', 'r') as f:
    content = f.read()

content = content.replace('<span>Связаться</span>', '{/* Removed hardcoded text to allow i18n, but since this is just a quick visual update let\'s use a translation key */}\n              <span>{t("contact", { defaultMessage: "Contact" })}</span>')

# wait, better to just use next-intl in Header
