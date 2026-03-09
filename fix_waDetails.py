import json

files = ['messages/en.json', 'messages/ru.json', 'messages/tr.json', 'messages/de.json']

# We just update the waDetails string inside BookingWidget object.
texts = {
    'en': "Options: {options}",
    'ru': "Опции: {options}",
    'tr': "Seçenekler: {options}",
    'de': "Optionen: {options}"
}

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    lang = file.split('/')[1].split('.')[0]

    if 'BookingWidget' in data:
        data['BookingWidget']['waDetails'] = texts[lang]

    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated waDetails in i18n files to remove date/time from the template string.")
