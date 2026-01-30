import json
import os

def add_missing_keys():
    """Add missing translation keys to all language files."""
    locales_dir = "public/locales"
    
    # Missing key identified from the validation report
    missing_key = "credit.fields.phone_placeholder"
    
    # Translations for each language
    translations = {
        "fr": "+33 6 12 34 56 78",
        "en": "+33 6 12 34 56 78",
        "de": "+33 6 12 34 56 78",
        "es": "+33 6 12 34 56 78",
        "it": "+33 6 12 34 56 78",
        "pt": "+33 6 12 34 56 78"
    }
    
    # Process each language
    for lang in os.listdir(locales_dir):
        file_path = os.path.join(locales_dir, lang, "translation.json")
        if os.path.exists(file_path):
            try:
                # Load existing translations
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                # Check if the key already exists
                if "credit" in data and "fields" in data["credit"]:
                    if "phone_placeholder" not in data["credit"]["fields"]:
                        # Add the missing key
                        data["credit"]["fields"]["phone_placeholder"] = translations.get(lang, "+33 6 12 34 56 78")
                        
                        # Save the updated file
                        with open(file_path, "w", encoding="utf-8") as f:
                            json.dump(data, f, ensure_ascii=False, indent=2)
                        
                        print(f"✅ Added 'phone_placeholder' to {lang}/translation.json")
                    else:
                        print(f"ℹ️  'phone_placeholder' already exists in {lang}/translation.json")
                else:
                    print(f"⚠️  'credit.fields' structure not found in {lang}/translation.json")
                    
            except Exception as e:
                print(f"❌ Error processing {file_path}: {e}")

if __name__ == "__main__":
    add_missing_keys()
    print("\n✨ Done! Run 'python check_translations.py' to verify.")
