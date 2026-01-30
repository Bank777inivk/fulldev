import json
import os

def add_pagination_key():
    """Add dashboard.pagination.page key to all language files."""
    locales_dir = "public/locales"
    
    # Translations for the pagination key
    translations = {
        "fr": "Étape {{current}} sur {{total}}",
        "en": "Step {{current}} of {{total}}",
        "de": "Schritt {{current}} von {{total}}",
        "es": "Paso {{current}} de {{total}}",
        "it": "Passo {{current}} di {{total}}",
        "pt": "Passo {{current}} de {{total}}"
    }
    
    # Process each language
    for lang in os.listdir(locales_dir):
        file_path = os.path.join(locales_dir, lang, "translation.json")
        if os.path.exists(file_path):
            try:
                # Load existing translations
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                # Ensure dashboard section exists
                if "dashboard" not in data:
                    data["dashboard"] = {}
                
                # Ensure pagination subsection exists
                if "pagination" not in data["dashboard"]:
                    data["dashboard"]["pagination"] = {}
                
                # Add the page key
                if "page" not in data["dashboard"]["pagination"]:
                    data["dashboard"]["pagination"]["page"] = translations.get(lang, translations["en"])
                    
                    # Save the updated file
                    with open(file_path, "w", encoding="utf-8") as f:
                        json.dump(data, f, ensure_ascii=False, indent=2)
                    
                    print(f"✅ Added 'dashboard.pagination.page' to {lang}/translation.json")
                else:
                    print(f"ℹ️  'dashboard.pagination.page' already exists in {lang}/translation.json")
                    
            except Exception as e:
                print(f"❌ Error processing {file_path}: {e}")

if __name__ == "__main__":
    add_pagination_key()
    print("\n✨ Done! Pagination key has been added to all language files.")
