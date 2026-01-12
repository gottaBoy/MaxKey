import os

root_dir = r"C:\d\flutter_ws\sophon-sso\MaxKey"

print(f"Scanning {root_dir}")

for dirpath, dirnames, filenames in os.walk(root_dir):
    for filename in filenames:
        if filename.endswith(".gradle"):
            path = os.path.join(dirpath, filename)
            try:
                with open(path, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Case sensitive replacement
                new_content = content.replace("Sophon-", "sophon-")
                
                if content != new_content:
                    with open(path, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"Fixed: {path}")
            except Exception as e:
                print(f"Error reading {path}: {e}")
