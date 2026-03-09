import os

directory = 'src/components/'
old_color = '#9A7B4F'
new_color = '#2F4157'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            if old_color in content:
                content = content.replace(old_color, new_color)
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Replaced colors in {filepath}")
