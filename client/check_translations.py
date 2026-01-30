import json
import os
import re
import sys

def get_keys_from_json(data, prefix=""):
    """Recursively get all keys from a nested dictionary with dot notation."""
    keys = set()
    for key, value in data.items():
        new_prefix = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            keys.update(get_keys_from_json(value, new_prefix))
        else:
            keys.add(new_prefix)
    return keys

def scan_source_code(src_dir):
    """Scan source code for t('key') and <Trans i18nKey='key'> patterns."""
    keys_in_code = set()
    # More precise patterns for i18next
    patterns = [
        re.compile(r"(?:\bt|i18n\.t)\(['\"]([^'\"$\{\}]+?)['\"]\)"),
        re.compile(r"i18nKey=['\"]([^'\"$\{\}]+?)['\"]")
    ]
    
    # Technical strings to ignore (false positives)
    ignore_list = {'2d', 'canvas', 'utf-8', 'hex', 'base64', '/', ':', 'true', 'false', 'info', 'success', 'warning', 'error'}
    
    for root, _, files in os.walk(src_dir):
        for file in files:
            if file.endswith(('.js', '.jsx', '.ts', '.tsx')):
                file_path = os.path.join(root, file)
                try:
                    with open(file_path, "r", encoding="utf-8") as f:
                        content = f.read()
                        for pattern in patterns:
                            matches = pattern.findall(content)
                            for m in matches:
                                if m not in ignore_list and not m.startswith(('./', '../', 'http')):
                                    keys_in_code.add(m)
                except Exception as e:
                    print(f"⚠️  [WARN] Could not read {file_path}: {e}")
    return keys_in_code

def check_translations(locales_dir, src_dir):
    """Deep scan and validation of i18n."""
    # 1. Load JSON translations
    json_files = {}
    for lang in os.listdir(locales_dir):
        file_path = os.path.join(locales_dir, lang, "translation.json")
        if os.path.exists(file_path):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    def detect_duplicates(pairs):
                        d = {}
                        for k, v in pairs:
                            if k in d:
                                print(f"❌ [DUP] Duplicate key in '{lang}': {k}")
                            d[k] = v
                        return d
                    data = json.load(f, object_pairs_hook=detect_duplicates)
                    json_files[lang] = get_keys_from_json(data)
            except Exception as e:
                print(f"❌ [ERR] JSON parse error in {file_path}: {e}")

    if not json_files:
        print("❌ No translation files found.")
        return

    # 2. Scan code for usage
    print(f"🔍 Scanning source code in {src_dir}...")
    code_keys = scan_source_code(src_dir)
    print(f"✅ Found {len(code_keys)} unique translation keys used in code.")

    # 3. Create union of all keys defined across all JSON files
    all_json_keys = set()
    for keys in json_files.values():
        all_json_keys.update(keys)

    print(f"\n--- 1. MISSING IN JSON (Used in code but missing in files) ---")
    any_missing_in_json = False
    for lang, keys in json_files.items():
        missing = code_keys - keys
        if missing:
            any_missing_in_json = True
            print(f"\n🌍 Language: {lang} (Missing {len(missing)} keys)")
            for m in sorted(list(missing))[:15]:
                print(f"   - {m}")
            if len(missing) > 15:
                print(f"   ... and {len(missing)-15} more.")
    
    if not any_missing_in_json:
        print("✨ All keys used in code are defined in all JSON files.")

    print(f"\n--- 2. CROSS-LANGUAGE INCONSISTENCY ---")
    for lang, keys in json_files.items():
        missing = all_json_keys - keys
        if missing:
            print(f"🌍 {lang}: Missing {len(missing)} keys defined in OTHER languages.")
            # We don't list them all to avoid noise, section 1 is more critical.

    print(f"\n--- 3. DEAD KEYS (Defined in JSON but never used in code) ---")
    dead_keys = all_json_keys - code_keys
    if dead_keys:
        print(f"💀 Found {len(dead_keys)} unused keys (potential cleanup):")
        for d in sorted(list(dead_keys))[:10]:
            print(f"   - {d}")
        if len(dead_keys) > 10:
            print(f"   ... and {len(dead_keys)-10} more.")
    else:
        print("✨ No dead keys found.")

if __name__ == "__main__":
    locales = "client/public/locales"
    src = "client/src"
    
    # Adjust paths if run from different locations
    if not os.path.exists(locales): locales = "public/locales"
    if not os.path.exists(src): src = "src"
    
    # Capture output to file
    import sys
    class Logger(object):
        def __init__(self):
            self.terminal = sys.stdout
            self.log = open("client/i18n_report.txt", "w", encoding="utf-8")
        def write(self, message):
            self.terminal.write(message)
            self.log.write(message)
        def flush(self):
            pass

    sys.stdout = Logger()
    
    check_translations(locales, src)
