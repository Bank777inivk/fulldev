import json
import codecs
import collections

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

notif_en = {
    "notifications": {
        "title": "Notifications",
        "mark_all_read": "Mark all as read",
        "empty": "No notifications",
        "close": "Close"
    }
}

notif_fr = {
    "notifications": {
        "title": "Notifications",
        "mark_all_read": "Tout marquer comme lu",
        "empty": "Aucune notification",
        "close": "Fermer"
    }
}

update_json_utf8('C:/Users/tesla/Videos/Nouvelle aventure/BanK/client/public/locales/en/translation.json', notif_en)
update_json_utf8('C:/Users/tesla/Videos/Nouvelle aventure/BanK/client/public/locales/fr/translation.json', notif_fr)
