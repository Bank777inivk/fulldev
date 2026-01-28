import json
import codecs
import collections

en_path = r'C:\Users\tesla\Videos\Nouvelle aventure\BanK\client\public\locales\en\translation.json'
fr_path = r'C:\Users\tesla\Videos\Nouvelle aventure\BanK\client\public\locales\fr\translation.json'

def update_json_utf8(path, updates):
    try:
        with codecs.open(path, 'r', encoding='utf-8') as f:
            data = json.load(f, object_pairs_hook=collections.OrderedDict)
        
        def deep_update(d, u):
            for k, v in u.items():
                if isinstance(v, collections.abc.Mapping):
                    d[k] = deep_update(d.get(k, collections.OrderedDict()), v)
                else:
                    d[k] = v
            return d

        data = deep_update(data, updates)

        with codecs.open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4, ensure_ascii=False)
        print(f"Updated {path}")
    except Exception as e:
        print(f"Error updating {path}: {e}")

en_updates = {
    "transactions": {
        "deposit": "Deposit",
        "by_card": "by Credit Card",
        "by_transfer": "by Bank Transfer",
        "transfer": "Transfer",
        "review": "in review"
    },
    "beneficiaries": {
        "title": "Beneficiaries",
        "subtitle": "Manage your transfer recipients.",
        "stats": {
            "total": "{{count}} Beneficiaries",
            "invik": "{{count}} Instants"
        },
        "search_placeholder": "Search a beneficiary...",
        "empty": {
            "title": "No beneficiaries",
            "subtitle": "Add your first one to start transferring.",
            "search_no_results": "No results found for your search.",
            "search_try_again": "Try again with another name or IBAN."
        },
        "form": {
            "add_title": "Add a Beneficiary",
            "new_title": "New Beneficiary",
            "name_label": "FULL NAME",
            "name_placeholder": "Ex: John Doe",
            "iban_label": "IBAN",
            "iban_placeholder": "FR76 ...",
            "bic_label": "BIC (OPTIONAL)",
            "bic_placeholder": "Optional",
            "email_label": "EMAIL (OPTIONAL)",
            "email_placeholder": "Optional",
            "confirm_submit": "Confirm and Add",
            "validation": {
                "iban_invalid": "Invalid IBAN format",
                "iban_valid": "IBAN valid"
            }
        },
        "card": {
            "actions": {
                "transfer": "Transfer"
            }
        },
        "toasts": {
            "add_success": "Beneficiary successfully added!",
            "add_error": "Error while adding beneficiary.",
            "delete_success": "Beneficiary deleted.",
            "delete_error": "Error while deleting beneficiary."
        },
        "confirm_delete": "Are you sure you want to delete this beneficiary?"
    }
}

fr_updates = {
    "sidebar": {
        "nav": {
            "documents": "Documents",
            "support": "Support client",
            "settings": "Paramètres"
        }
    },
    "beneficiaries": {
        "title": "Bénéficiaires",
        "subtitle": "Gérez vos destinataires de virement.",
        "stats": {
            "total": "{{count}} Bénéficiaires",
            "invik": "{{count}} Instants"
        },
        "search_placeholder": "Rechercher un bénéficiaire...",
        "empty": {
            "title": "Aucun bénéficiaire",
            "subtitle": "Ajoutez votre premier bénéficiaire pour commencer vos virements.",
            "search_no_results": "Aucun résultat pour votre recherche.",
            "search_try_again": "Réessayez avec un autre nom ou IBAN."
        },
        "form": {
            "add_title": "Ajouter un Bénéficiaire",
            "new_title": "Nouveau Bénéficiaire",
            "name_label": "NOM COMPLET",
            "name_placeholder": "Ex: Jean Dupont",
            "iban_label": "IBAN",
            "iban_placeholder": "FR76 ...",
            "bic_label": "BIC (OPTIONNEL)",
            "bic_placeholder": "Optionnel",
            "email_label": "EMAIL (OPTIONNEL)",
            "email_placeholder": "Optionnel",
            "confirm_submit": "Confirmer l'ajout",
            "validation": {
                "iban_invalid": "Format IBAN invalide",
                "iban_valid": "IBAN valide"
            }
        },
        "card": {
            "actions": {
                "transfer": "Transférer"
            }
        },
        "toasts": {
            "add_success": "Bénéficiaire ajouté avec succès !",
            "add_error": "Erreur lors de l'ajout du bénéficiaire.",
            "delete_success": "Bénéficiaire supprimé.",
            "delete_error": "Erreur lors de la suppression du bénéficiaire."
        },
        "confirm_delete": "Êtes-vous sûr de vouloir supprimer ce bénéficiaire ?"
    }
}

update_json_utf8(en_path, en_updates)
update_json_utf8(fr_path, fr_updates)
