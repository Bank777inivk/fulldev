import json
import os

def add_mobile_translation_keys():
    """Add missing translation keys for mobile credit request form to all language files."""
    locales_dir = "public/locales"
    
    # New translation keys needed for mobile form
    new_keys = {
        "credit.validation": {
            "required": {
                "fr": "Obligatoire",
                "en": "Required",
                "de": "Erforderlich",
                "es": "Obligatorio",
                "it": "Obbligatorio",
                "pt": "Obrigatório"
            },
            "lastname_required": {
                "fr": "Nom requis",
                "en": "Last name required",
                "de": "Nachname erforderlich",
                "es": "Apellido requerido",
                "it": "Cognome richiesto",
                "pt": "Sobrenome obrigatório"
            },
            "firstname_required": {
                "fr": "Prénom requis",
                "en": "First name required",
                "de": "Vorname erforderlich",
                "es": "Nombre requerido",
                "it": "Nome richiesto",
                "pt": "Nome obrigatório"
            },
            "email_required": {
                "fr": "Email requis",
                "en": "Email required",
                "de": "E-Mail erforderlich",
                "es": "Correo electrónico requerido",
                "it": "Email richiesta",
                "pt": "E-mail obrigatório"
            },
            "phone_required": {
                "fr": "Téléphone requis",
                "en": "Phone required",
                "de": "Telefon erforderlich",
                "es": "Teléfono requerido",
                "it": "Telefono richiesto",
                "pt": "Telefone obrigatório"
            },
            "date_required": {
                "fr": "Date requise",
                "en": "Date required",
                "de": "Datum erforderlich",
                "es": "Fecha requerida",
                "it": "Data richiesta",
                "pt": "Data obrigatória"
            },
            "street_required": {
                "fr": "Rue requise",
                "en": "Street required",
                "de": "Straße erforderlich",
                "es": "Calle requerida",
                "it": "Via richiesta",
                "pt": "Rua obrigatória"
            },
            "zip_required": {
                "fr": "CP requis",
                "en": "Postal code required",
                "de": "PLZ erforderlich",
                "es": "Código postal requerido",
                "it": "CAP richiesto",
                "pt": "Código postal obrigatório"
            },
            "bank_required": {
                "fr": "Sélectionnez une banque",
                "en": "Select a bank",
                "de": "Wählen Sie eine Bank",
                "es": "Seleccione un banco",
                "it": "Seleziona una banca",
                "pt": "Selecione um banco"
            },
            "iban_required": {
                "fr": "IBAN requis",
                "en": "IBAN required",
                "de": "IBAN erforderlich",
                "es": "IBAN requerido",
                "it": "IBAN richiesto",
                "pt": "IBAN obrigatório"
            }
        },
        "credit.placeholders": {
            "object_example": {
                "fr": "Ex: Travaux, Achat véhicule, Voyage...",
                "en": "Ex: Renovation, Vehicle purchase, Travel...",
                "de": "Z.B.: Renovierung, Fahrzeugkauf, Reise...",
                "es": "Ej: Obras, Compra de vehículo, Viaje...",
                "it": "Es: Lavori, Acquisto veicolo, Viaggio...",
                "pt": "Ex: Obras, Compra de veículo, Viagem..."
            },
            "employer_example": {
                "fr": "Entreprise / Auto-entreprise",
                "en": "Company / Self-employed",
                "de": "Unternehmen / Selbstständig",
                "es": "Empresa / Autónomo",
                "it": "Azienda / Libero professionista",
                "pt": "Empresa / Autônomo"
            },
            "iban_example": {
                "fr": "FR76 XXXX XXXX XXXX",
                "en": "FR76 XXXX XXXX XXXX",
                "de": "FR76 XXXX XXXX XXXX",
                "es": "FR76 XXXX XXXX XXXX",
                "it": "FR76 XXXX XXXX XXXX",
                "pt": "FR76 XXXX XXXX XXXX"
            }
        }
    }
    
    # Process each language
    for lang in os.listdir(locales_dir):
        file_path = os.path.join(locales_dir, lang, "translation.json")
        if os.path.exists(file_path):
            try:
                # Load existing translations
                with open(file_path, "r", encoding="utf-8") as f:
                    data = json.load(f)
                
                # Ensure credit section exists
                if "credit" not in data:
                    data["credit"] = {}
                
                # Add validation keys
                if "validation" not in data["credit"]:
                    data["credit"]["validation"] = {}
                
                for key, translations in new_keys["credit.validation"].items():
                    if key not in data["credit"]["validation"]:
                        data["credit"]["validation"][key] = translations.get(lang, translations["en"])
                        print(f"✅ Added 'credit.validation.{key}' to {lang}/translation.json")
                
                # Add placeholder keys
                if "placeholders" not in data["credit"]:
                    data["credit"]["placeholders"] = {}
                
                for key, translations in new_keys["credit.placeholders"].items():
                    if key not in data["credit"]["placeholders"]:
                        data["credit"]["placeholders"][key] = translations.get(lang, translations["en"])
                        print(f"✅ Added 'credit.placeholders.{key}' to {lang}/translation.json")
                
                # Save the updated file
                with open(file_path, "w", encoding="utf-8") as f:
                    json.dump(data, f, ensure_ascii=False, indent=2)
                    
            except Exception as e:
                print(f"❌ Error processing {file_path}: {e}")

if __name__ == "__main__":
    add_mobile_translation_keys()
    print("\n✨ Done! All translation keys have been added.")
