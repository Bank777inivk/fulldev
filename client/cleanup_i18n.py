import json
import os

def merge_dicts(dict1, dict2):
    """Recursively merge two dictionaries."""
    for key, value in dict2.items():
        if key in dict1 and isinstance(dict1[key], dict) and isinstance(value, dict):
            merge_dicts(dict1[key], value)
        else:
            dict1[key] = value
    return dict1

def cleanup_file(file_path):
    if not os.path.exists(file_path): return
    
    with open(file_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
    
    merged_data = {}
    
    # We use a custom parser to merge duplicates instead of throwing errors
    # Actually, json.load doesn't allow duplicates if we want to merge them
    # So we'll use a trick with object_pairs_hook
    def merge_pairs(pairs):
        d = {}
        for k, v in pairs:
            if k in d:
                if isinstance(d[k], dict) and isinstance(v, dict):
                    merge_dicts(d[k], v)
                else:
                    d[k] = v # Overwrite with last occurrence
            else:
                d[k] = v
        return d

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            data = json.load(f, object_pairs_hook=merge_pairs)
        
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"✅ Cleaned and merged: {file_path}")
    except Exception as e:
        print(f"❌ Error cleaning {file_path}: {e}")

if __name__ == "__main__":
    locales_dir = "client/public/locales"
    for lang in os.listdir(locales_dir):
        path = os.path.join(locales_dir, lang, "translation.json")
        cleanup_file(path)
