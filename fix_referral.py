import json

translations = {
    'en.json': 'Referral System',
    'ru.json': 'Реферальная система',
    'tr.json': 'Tavsiye Sistemi',
    'de.json': 'Empfehlungsprogramm'
}

files = ['messages/en.json', 'messages/ru.json', 'messages/tr.json', 'messages/de.json']

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    filename = file.split('/')[1]
    replacement = translations[filename]

    # Check Navigation
    if 'Navigation' in data and 'club' in data['Navigation']:
        data['Navigation']['club'] = replacement

    # Check Loyalty Section
    if 'Loyalty' in data and 'title' in data['Loyalty']:
        data['Loyalty']['title'] = replacement

    # Check Footer Section
    if 'Footer' in data and 'club' in data['Footer']:
        data['Footer']['club'] = replacement

    with open(file, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

print("Updated Black Diamond Club to Referral System across all languages.")
