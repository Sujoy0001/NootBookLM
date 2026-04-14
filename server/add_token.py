import sys
with open('config/settings.py', 'r', encoding='utf-8') as f:
    content = f.read()
if "'rest_framework.authtoken'" not in content:
    content = content.replace("'corsheaders',", "'rest_framework.authtoken',\n    'corsheaders',")
    with open('config/settings.py', 'w', encoding='utf-8') as f:
        f.write(content)
print("Updated settings.py")
