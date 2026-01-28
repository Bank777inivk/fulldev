import json
import os

def localize_dashboard():
    dashboard_keys = [
        "accounts", "transactions", "actions", "transfers", "cards", 
        "credits", "deposit", "sidebar", "history", "status", 
        "beneficiaries", "settings", "support", "documents", 
        "kyc", "header", "banner", "notifications", "welcome", "loading"
    ]

    base_path = r"C:\Users\tesla\Videos\Nouvelle aventure\BanK\client\public\locales"
    
    # English acts as our reference for keys
    en_file = os.path.join(base_path, "en", "translation.json")
    if not os.path.exists(en_file):
        print(f"Error: {en_file} not found.")
        return

    with open(en_file, "r", encoding="utf-8") as f:
        en_data = json.load(f)

    # Comprehensive translations for other languages
    translations = {
        "es": {
            "welcome": "¡Hola, {{name}} 👋",
            "loading": "Preparando su espacio personal...",
            "header": {
                "search_placeholder": "Buscar una transacción...",
                "profile_title": "Ajustes de la cuenta"
            },
            "sidebar": {
                "nav": {
                    "dashboard": "Panel de Control",
                    "accounts": "Mis Cuentas",
                    "transfers": "Transferencias",
                    "beneficiaries": "Beneficiarios",
                    "deposit": "Recargar",
                    "cards": "Tarjetas",
                    "credits": "Créditos",
                    "history": "Historial",
                    "documents": "Documentos",
                    "support": "Soporte",
                    "settings": "Ajustes"
                },
                "user": {
                    "account_type": "Cuenta {{type}}"
                },
                "logout": "Cerrar sesión"
            },
            "notifications": {
                "title": "Notificaciones",
                "mark_all_read": "Marcar todo como leído",
                "empty": "No hay notificaciones",
                "close": "Cerrar"
            },
            "kyc": {
                "title": "Verificación de Identidad (KYC)",
                "subtitle": "Para asegurar su cuenta, envíenos un documento de identidad y los documentos adicionales requeridos.",
                "status": {
                    "submitted": "Sus documentos ya están siendo revisados.",
                    "verified": "Su cuenta ya está verificada.",
                    "action_required": "Acción requerida:",
                    "rejection_msg": "Algunos documentos deben ser reenviados."
                },
                "sections": {
                    "required": "(OBLIGATORIO)",
                    "identity": "1. Justificante de identidad",
                    "identity_sub": "Elija un primer documento válido (DNI, Pasaporte, etc.)",
                    "biometric": "2. Verificación biométrica",
                    "biometric_sub": "Fotos recientes para confirmar su identidad.",
                    "address": "3. Justificante de domicilio",
                    "address_sub": "Documento oficial de menos de 3 meses de antigüedad.",
                    "income": "4. Justificante de ingresos",
                    "income_sub": "Según su situación (Empleado, Jubilado, etc.).",
                    "bank": "5. Justificante bancario",
                    "bank_sub": "Certificado de Titularidad Bancaria (RIB / IBAN).",
                    "bank_notice": "El RIB debe estar imperativamente a nombre del solicitante (titular exclusivo)."
                },
                "labels": {
                    "type_doc": "Tipo de documento",
                    "select_type": "Seleccionar tipo de documento",
                    "front": "Anverso / Página principal",
                    "back": "Reverso (si aplica)",
                    "load_front": "Cargar anverso",
                    "load_back": "Cargar reverso",
                    "load_doc": "Cargar documento",
                    "selfie": "Selfie Simple",
                    "selfie_hint": "Sin filtros ni gafas",
                    "face_clear": "Rostro despejado",
                    "selfie_id": "Selfie con documento",
                    "selfie_id_hint": "Debe ser legible",
                    "hold_id": "Sujete su documento de identidad",
                    "example": "Ver un ejemplo",
                    "loaded": "Documento cargado",
                    "example_ref": "Referencia para un envío conforme",
                    "back_btn": "Volver",
                    "submit_btn": "Enviar mi expediente completo",
                    "sending": "Envío seguro...",
                    "securing_sending": "Asegurando y enviando..."
                },
                "types": {
                    "id": {
                        "cni": "Documento Nacional de Identidad (DNI)",
                        "passport": "Pasaporte",
                        "driver": "Permiso de conducir",
                        "residence": "Tarjeta de residencia"
                    },
                    "address": {
                        "utility": "Factura de Electricidad / Gas / Agua",
                        "telecom": "Factura de Internet / Teléfono fijo",
                        "tax": "Aviso fiscal",
                        "insurance": "Certificado de seguro de hogar",
                        "rent": "Recibo de alquiler",
                        "hosting": "Certificado de alojamiento + ID del anfitrión"
                    },
                    "income": {
                        "payslip": "Últimas 3 nóminas",
                        "contract": "Contrato de trabajo",
                        "tax": "Último aviso fiscal",
                        "kbis": "Certificado de empresa (Autónomo)",
                        "pension": "Justificante de pensión (Jubilado)",
                        "unemployment": "Certificado de desempleo",
                        "statement": "Extracto bancario reciente"
                    }
                },
                "messages": {
                    "file_too_large": "El archivo es demasiado grande (máx. 5MB)",
                    "upload_error": "Error de carga",
                    "select_id_type": "Por favor, seleccione un tipo de documento de identidad.",
                    "missing_files": "Por favor, proporcione todos los justificantes obligatorios.",
                    "success": "¡Expediente KYC enviado con éxito!",
                    "error": "Ocurrió un error durante el envío: "
                },
                "legal": "Los documentos proporcionados se utilizan exclusivamente para la verificación de identidad (KYC), prevención de fraude y cumplimiento normativo. Se procesan de forma segura y confidencial de acuerdo con el RGPD."
            },
            "banner": {
                "loading": "Cargando verificación...",
                "toasts": {
                    "verified": "Su identidad está verificada. Tiene acceso a todas las funciones.",
                    "submitted": "Sus documentos están siendo analizados. Se le notificará en cuanto finalice la verificación."
                },
                "status": {
                    "verified": "Cuenta Verificada",
                    "submitted": "En curso...",
                    "rejected": "Rechazada (Detalles)",
                    "verify_now": "Verificar Identidad",
                    "click_to_verify": "Clic para verificar"
                },
                "blocking": {
                    "refused": "Validación Rechazada",
                    "in_progress": "Verificación en curso",
                    "required": "Verificación Requerida",
                    "motif": "Motivo:",
                    "not_compliant": "Algunos documentos no son conformes. Por favor, vuelva a enviarlos.",
                    "analyzing": "Estamos analizando sus documentos. Este procedimiento suele tardar menos de 24 horas.",
                    "restricted": "Por razones de seguridad y cumplimiento, el acceso a esta función está restringido. Por favor, complete su verificación de identidad para desbloquear su cuenta.",
                    "waiting": "Esperando validación",
                    "start": "Iniciar verificación",
                    "secure": "Datos Encriptados y Seguros"
                }
            },
            "accounts": {
                "title": "Mis Cuentas",
                "subtitle": "Resumen de su situación financiera.",
                "total_balance": "Saldo Total",
                "main": "Cuenta Corriente",
                "savings": "Cuenta de Ahorros",
                "credit": "Cuenta de Crédito",
                "hidden_iban": "IBAN oculto (Verificación requerida)",
                "rate": "Tasa anual: 3.50%",
                "repayment": "Próxima cuota en curso",
                "no_debt": "Sin deuda acumulada",
                "card": {
                    "main": "Cuenta Corriente",
                    "savings": "Cuenta de Ahorros",
                    "credit": "Cuenta de Crédito",
                    "currency": "Cuenta en Divisas",
                    "other": "Otra cuenta",
                    "actions": {
                        "transfer": "Transferir",
                        "deposit": "Recargar",
                        "rib": "Ver RIB"
                    }
                },
                "rib_modal": {
                    "title": "Identidad Bancaria (RIB)",
                    "subtitle": "Detalles de su cuenta para recibir transferencias.",
                    "copy_toast": "{{label}} copiado!",
                    "close": "Cerrar",
                    "labels": {
                        "holder": "Titular",
                        "iban": "IBAN",
                        "bic": "BIC / SWIFT",
                        "bank": "Banco",
                        "type": "Tipo de cuenta"
                    }
                },
                "request_modal": {
                    "title": "Abrir una nueva cuenta",
                    "subtitle": "Solicite la apertura de un nuevo tipo de cuenta.",
                    "button": "Nueva cuenta",
                    "type_label": "Elija el tipo de cuenta",
                    "message_label": "Información complementaria (opcional)",
                    "placeholder": "Describa brevemente su necesidad...",
                    "cancel": "Cancelar",
                    "confirm": "Enviar solicitud",
                    "success": "¡Solicitud de apertura enviada!",
                    "error": "Error al enviar la solicitud."
                }
            },
            "transactions": {
                "title": "Últimas Transacciones",
                "empty": "No hay transacciones recientes.",
                "deposit": "Depósito",
                "transfer": "Transferencia",
                "by_card": "por tarjeta",
                "by_transfer": "por transferencia"
            },
            "actions": {
                "title": "Acciones Rápidas",
                "transfer": "Transferir",
                "credit": "Créditos",
                "deposit": "Recargar",
                "cards": "Tarjetas"
            },
            "transfers": {
                "title": "Área de Transferencias",
                "subtitle": "Gestione sus transferencias con facilidad.",
                "tabs": {
                    "internal": "Mis Cuentas",
                    "internal_desc": "Transferencia interna",
                    "invik": "Transferencia INVIK",
                    "invik_desc": "Instantánea y Gratuita",
                    "sepa": "Transferencia SEPA",
                    "sepa_desc": "A otro banco",
                    "history": "Seguimiento"
                },
                "steps": {
                    "accounts": "Cuentas",
                    "amount": "Importe",
                    "validation": "Validación"
                },
                "account_selection": {
                    "source": "¿Desde qué cuenta?",
                    "dest": "¿A qué beneficiario?"
                },
                "warnings": {
                    "single_account_title": "Transferencia interna imposible",
                    "single_account_desc": "Usted solo tiene una cuenta."
                },
                "invik_network": {
                    "title": "RED INVIK INSTANTÁNEA",
                    "desc": "Transfiera fondos en milisegundos a cualquier cliente de INVIK BANK, sin cargo."
                },
                "beneficiary_type": {
                    "saved": "Cliente Registrado",
                    "new": "Nuevo Beneficiario"
                },
                "inputs": {
                    "select_invik": "Seleccione un cliente INVIK",
                    "select_beneficiary": "Seleccione un beneficiario",
                    "name": "Nombre Completo",
                    "name_placeholder": "Ej: Juan Pérez",
                    "iban": "IBAN",
                    "iban_placeholder": "ES... o FR...",
                    "bic": "BIC (opcional)",
                    "bic_placeholder": "Ej: ABCDFRPP",
                    "email": "Email del beneficiario (opcional)",
                    "email_placeholder": "Para notificación inmediata",
                    "save_invik": "Guardar este beneficiario INVIK",
                    "save_beneficiary": "Guardar este beneficiario para futuras transferencias"
                },
                "amount": {
                    "title": "¿Cuánto desea transferir?",
                    "available": "Saldo disponible:",
                    "insufficient_funds": "Atención: El importe supera el saldo disponible.",
                    "limit_exceeded": "Límite máximo autorizado: 50.000 € por transferencia"
                },
                "review": {
                    "title": "Verificar detalles",
                    "from": "Desde",
                    "to": "Hacia",
                    "total": "Total",
                    "certified": "Transferencia Instantánea Certificada",
                    "certified_desc": "Ejecución inmediata a través de la red segura de INVIK BANK."
                },
                "success": {
                    "title": "TRANSFERENCIA COMPLETADA",
                    "review_title": "INFORMACIÓN CRÍTICA",
                    "new_button": "Realizar otra transferencia"
                },
                "history": {
                    "title": "Historial de transferencias recientes",
                    "empty": "No hay transferencias recientes."
                },
                "buttons": {
                    "next": "Siguiente",
                    "back": "Volver",
                    "confirm": "Confirmar",
                    "edit": "Editar"
                },
                "errors": {
                    "invalid_amount": "Por favor, introduzca un importe válido",
                    "insufficient_balance": "Saldo insuficiente para esta operación",
                    "limit_exceeded": "El importe máximo por transferencia es de 50.000 €",
                    "check_beneficiary": "Por favor, verifique la información del beneficiario",
                    "not_invik_iban": "Este IBAN no pertenece a la red INVIK. Use la pestaña 'Transferencia SEPA'.",
                    "invalid_iban": "Formato de IBAN no válido."
                },
                "success_messages": {
                    "internal": "¡Transferencia interna realizada con éxito!",
                    "instant": "¡Transferencia instantánea a {{name}} realizada con éxito!",
                    "pending": "Transferencia pendiente de verificación de seguridad. Plazo SEPA: 24h a 48h."
                },
                "form": {
                    "step_source": "1. Cuenta de origen",
                    "step_dest": "2. Cuenta de destino",
                    "step_dest_invik": "2. Destinatario INVIK",
                    "step_dest_beneficiary": "2. Beneficiario",
                    "step_amount": "Importe a transferir",
                    "sending": "Enviando..."
                }
            },
            "cards": {
                "title": "Mis Tarjetas",
                "subtitle": "Gestione sus tarjetas físicas y virtuales.",
                "empty": {
                    "title": "Sin tarjeta activa",
                    "desc": "Aún no tiene ninguna tarjeta asociada a su cuenta.",
                    "button": "Solicitar una tarjeta"
                },
                "list_title": "Sus Tarjetas Activas ({{count}})",
                "actions": {
                    "show_number": "Ver número",
                    "hide_number": "Ocultar",
                    "flip": "Girar",
                    "block": "Bloquear",
                    "unblock": "Desbloquear",
                    "disabled": "Desactivada",
                    "activate": "Activar",
                    "options": "Opciones",
                    "delete": "Eliminar"
                },
                "details": {
                    "status": "Estado:",
                    "type": "Tipo:",
                    "limit": "Límite:",
                    "updated": "Actualizado:",
                    "holder": "TITULAR",
                    "expiry": "CADUCA FIN",
                    "cvv": "CVV",
                    "support": "Soporte",
                    "title": "Detalles de la tarjeta",
                    "virtual_uppercase": "TARJETA VIRTUAL",
                    "physical_uppercase": "TARJETA FÍSICA",
                    "property_notice": "Esta tarjeta es propiedad de INVIK BANK SA.",
                    "active": "Activa",
                    "inactive": "Desactivada",
                    "blocked": "Bloqueada",
                    "virtual": "Virtual",
                    "physical": "Física"
                },
                "physical_order": {
                    "title": "Tarjeta Física",
                    "mobile_title": "Solicitar tarjeta física",
                    "desc": "Reciba su tarjeta exclusiva INVIK en su domicilio en un plazo de 3 a 5 días hábiles.",
                    "features": {
                        "withdrawals": "Retiradas gratuitas en cualquier lugar",
                        "contactless": "Pago sin contacto",
                        "design": "Diseño Negro Mate Premium"
                    },
                    "button": {
                        "order": "Solicitar ahora",
                        "processing": "Solicitud en curso",
                        "shipped": "Tarjeta enviada",
                        "delivered": "Tarjeta recibida ✅",
                        "cancel": "Cancelar solicitud"
                    },
                    "status": {
                        "pending": "Estamos procesando su solicitud",
                        "delivered": "¡Felicidades! Su tarjeta ha llegado. ¡Disfrute de sus nuevas ventajas! 🎁✨",
                        "shipped": "¡Su tarjeta está en camino! 🚀 Llegará en 3 a 5 días.",
                        "rejected": "Última solicitud rechazada:",
                        "free": "Gratis • Incluida en su oferta"
                    }
                },
                "virtual_promo": {
                    "title": "¿Necesita una tarjeta virtual?",
                    "desc": "Cree una tarjeta al instante para sus compras seguras en línea.",
                    "button": "Crear tarjeta virtual"
                },
                "options_modal": {
                    "title": "Opciones de tarjeta",
                    "alias_label": "NOMBRE DE LA TARJETA (ALIAS)",
                    "alias_placeholder": "Ej: Compras Amazon, Personal...",
                    "limit_label": "LÍMITE MENSUAL (€)",
                    "limit_help": "El límite predeterminado es de 2.000 €.",
                    "save": "Guardar cambios"
                },
                "messages": {
                    "blocked": "Su tarjeta ha sido bloqueada.",
                    "unblocked": "Su tarjeta ha sido desbloqueada.",
                    "order_success": "¡Su solicitud de tarjeta física se ha enviado correctamente!",
                    "order_error": "Ha ocurrido un error al solicitar la tarjeta.",
                    "options_saved": "¡Ajustes de la tarjeta actualizados!",
                    "delete_confirm": "¿Realmente desea eliminar permanentemente esta tarjeta de su espacio? Esta acción es irreversible.",
                    "delete_success": "Tarjeta eliminada correctamente.",
                    "request_cancel_confirm": "¿Cancelar y eliminar esta solicitud de tarjeta?",
                    "request_cancelled": "Solicitud cancelada."
                }
            },
            "history": {
                "title": "Historial",
                "subtitle": "Consulte todas sus transacciones pasadas.",
                "empty": "No se encontraron transacciones.",
                "columns": {
                    "date": "Fecha",
                    "type": "Tipo",
                    "category": "Categoría",
                    "amount": "Importe",
                    "fees": "Comisiones"
                },
                "types": {
                    "deposit": "Depósito",
                    "transfer_internal": "Transf. Interna a {{name}}",
                    "transfer_instant": "Transf. Instantánea a {{name}}",
                    "receive_instant": "Recepción Instantánea",
                    "transfer_external": "Transf. Externa a {{name}}",
                    "operation": "Operación",
                    "internal_account": "Cuenta Interna",
                    "beneficiary": "Beneficiario"
                },
                "details": {
                    "iban_label": "IBAN: {{iban}}",
                    "ref": "Ref:",
                    "sender": "De {{name}}"
                }
            },
            "status": {
                "pending": "Pendiente",
                "completed": "Completado",
                "rejected": "Rechazado",
                "in_review": "En revisión"
            },
            "settings": {
                "title": "Ajustes de la Cuenta",
                "subtitle": "Consulte y modifique su perfil bancario.",
                "tabs": {
                    "profile": "Perfil",
                    "security": "Seguridad",
                    "prefs": "Ajustes",
                    "my_info": "Mi Información",
                    "security_access": "Seguridad y Acceso",
                    "preferences": "Preferencias"
                },
                "profile": {
                    "title": "Información Personal",
                    "email_verified": "Email Verificado",
                    "email_contact": "EMAIL DE CONTACTO",
                    "first_name": "Nombre",
                    "last_name": "Apellido",
                    "dob": "Fecha de nacimiento",
                    "pob": "Lugar de nacimiento",
                    "phone": "Teléfono",
                    "nationality": "Nacionalidad",
                    "address": "Dirección",
                    "city": "Ciudad",
                    "zip": "Código Postal",
                    "save_btn": "Guardar ajustes",
                    "update_btn": "Actualizar parámetros"
                },
                "security": {
                    "title": "Seguridad de Autenticación",
                    "password_title": "Seguridad de Contraseña",
                    "password_desc": "Una contraseña fuerte protege su cuenta bancaria de accesos no autorizados.",
                    "new_password": "Nueva contraseña",
                    "confirm_password": "Confirmar contraseña",
                    "update_pwd_btn": "Actualizar contraseña",
                    "update_access_btn": "Actualizar mis accesos",
                    "last_mod": "Última modificación",
                    "days_ago": "Hace {{count}} días",
                    "encrypted_storage": "Almacenamiento Cifrado",
                    "protected_aes": "Protegido por AES-256",
                    "security_reqs": "Requisitos de seguridad",
                    "tip_8_chars": "Al menos 8 caracteres",
                    "tip_caps": "Una mayúscula",
                    "tip_numbers": "Un número",
                    "tip_special": "Un carácter especial (!@#$)",
                    "strength": {
                        "label": "Fortaleza:",
                        "weak": "Débil",
                        "medium": "Media",
                        "excellent": "Excelente"
                    }
                },
                "advisor": {
                    "title": "MI ASESOR FINANCIERO",
                    "role": "Asesor Senior en Gestión de Patrimonio",
                    "available": "Disponible actualmente",
                    "email_label": "EMAIL PROFESIONAL",
                    "phone_label": "LÍNEA DIRECTA"
                },
                "preferences": {
                    "title": "Preferencias de la Cuenta",
                    "lang_label": "Idioma de la Interfaz",
                    "lang_desc": "Idioma utilizado para los menús y extractos."
                },
                "messages": {
                    "success": "Ajustes actualizados correctamente.",
                    "error": "Ha ocurrido un error.",
                    "pwd_success": "Contraseña actualizada correctamente."
                }
            },
            "support": {
                "title": "Ayuda y Soporte",
                "subtitle": "Consulte la ayuda en línea o chatee con un asesor.",
                "faq": {
                    "title": "FAQ y Ayuda rápida",
                    "q1": {
                        "q": "Transferencias no recibidas",
                        "a": "Una transferencia SEPA clásica suele tardar de 1 a 2 días hábiles. Si espera una transferencia internacional, puede tardar hasta 5 días. Verifique que el IBAN proporcionado sea correcto."
                    },
                    "q2": {
                        "q": "Límites de la tarjeta",
                        "a": "Puede consultar sus límites actuales en la sección 'Cartas'. Para un aumento temporal o permanente, contacte con su asesor mediante un ticket de soporte."
                    },
                    "q3": {
                        "q": "Asegurar mi cuenta",
                        "a": "Active siempre la autenticación de dos factores (2FA). Nunca comparta los códigos recibidos por SMS. En caso de duda sobre una transacción, bloquee inmediatamente su tarjeta desde la aplicación."
                    },
                    "q4": {
                        "q": "Comisiones bancarias",
                        "a": "Nuestras tarifas son transparentes. La cuenta estándar es gratuita. Las comisiones de mantenimiento de cuenta para las cuentas premium se cobran mensualmente. Consulte nuestra tabla de tarifas en 'Documentos'."
                    },
                    "q5": {
                        "q": "Contraseña olvidada",
                        "a": "Haga clic en '¿Olvidó su contraseña?' en la página de inicio de sesión. Se le enviará un enlace de restablecimiento por correo electrónico al instante."
                    }
                },
                "tickets": {
                    "title": "Mis solicitudes",
                    "new_btn": "Nuevo ticket",
                    "subject_placeholder": "Asunto",
                    "message_placeholder": "Detalle su solicitud para un procesamiento más rápido...",
                    "create_btn": "Crear ticket",
                    "send_btn": "Enviar ticket",
                    "cancel_btn": "Cancelar",
                    "empty": "No tiene ningún ticket de soporte activo.",
                    "status": {
                        "open": "EN CURSO",
                        "resolved": "RESUELTO",
                        "closed": "Cerrado"
                    },
                    "categories": {
                        "technical": "Problema técnico",
                        "billing": "Pregunta sobre comisiones",
                        "cards": "Gestión de tarjetas",
                        "other": "Otro"
                    }
                },
                "chat": {
                    "reply_placeholder": "Responder...",
                    "input_placeholder": "Describa su problema...",
                    "send": "Enviar"
                }
            },
            "beneficiaries": {
                "title": "Beneficiarios",
                "subtitle": "Gestione sus destinatarios de transferencias.",
                "stats": {
                    "total": "{{count}} Beneficiarios",
                    "invik": "{{count}} Instantáneos"
                },
                "empty": {
                    "title": "Sin beneficiarios",
                    "subtitle": "Añada su primer beneficiario para comenzar sus transferencias.",
                    "search_no_results": "Sin resultados para su búsqueda.",
                    "search_try_again": "Reintente con otro nombre o IBAN."
                },
                "card": {
                    "iban_prefix": "IBAN",
                    "bic_prefix": "BIC",
                    "email_prefix": "Email",
                    "actions": {
                        "transfer": "Transferir",
                        "quick_transfer": "Transferencia Rápida",
                        "delete": "Eliminar"
                    }
                },
                "form": {
                    "add_title": "Añadir un Beneficiario",
                    "new_title": "Nuevo Beneficiario",
                    "name_label": "NOMBRE COMPLETO",
                    "name_placeholder": "Ej: Juan Pérez",
                    "iban_label": "IBAN",
                    "iban_placeholder": "ES...",
                    "bic_label": "BIC (OPCIONAL)",
                    "bic_placeholder": "Opcional",
                    "email_label": "EMAIL (OPCIONAL)",
                    "email_placeholder": "Opcional",
                    "submit": "Añadir beneficiario",
                    "confirm_submit": "Confirmar adición",
                    "validation": {
                        "iban_invalid": "Formato de IBAN no válido",
                        "iban_valid": "IBAN válido"
                    }
                },
                "search_placeholder": "Buscar un beneficiario...",
                "toasts": {
                    "add_success": "¡Beneficiario añadido con éxito!",
                    "add_error": "Error al añadir el beneficiario.",
                    "delete_success": "Beneficiario eliminado.",
                    "delete_error": "Error al eliminar el beneficiario."
                },
                "confirm_delete": "¿Está seguro de que desea eliminar este beneficiario?"
            },
            "credits": {
                "title": "Créditos y Financiación",
                "subtitle": "Simule su proyecto y obtenga una respuesta en 24h",
                "form": {
                    "simulator_title": "Simulador",
                    "your_simulation": "Su simulación",
                    "project_type": "Tipo de proyecto",
                    "project_description": "Descripción del proyecto (Obligatorio)",
                    "project_description_placeholder": "Detalle su proyecto en unas pocas líneas...",
                    "specific_project": "Su proyecto específico",
                    "specific_project_placeholder": "Describa brevemente su proyecto...",
                    "amount": "Importe del préstamo",
                    "months": "Duración del reembolso",
                    "interest_rate": "Tasa de interés (TAE)",
                    "monthly_payment": "Cuota mensual",
                    "monthly_payment_est": "estimada",
                    "apply_button": "Solicitar este préstamo",
                    "apply_button_official": "Realizar una solicitud oficial",
                    "processing": "Procesando...",
                    "sending": "Enviando...",
                    "years": "años",
                    "months_label": "meses"
                },
                "types": {
                    "personnel": "Préstamo Personal",
                    "immobilier": "Crédito Inmobiliario",
                    "vehicule": "Crédito Vehículo",
                    "professionnel": "Proyecto Profesional",
                    "autre": "Otro (Especificar...)"
                },
                "status": {
                    "pending": "En revisión",
                    "approved": "Aprobado ",
                    "rejected": "Rechazado",
                    "dossier_title": "Expediente en revisión",
                    "dossier_desc": "Estamos revisando actualmente su solicitud de {{amount}} €.",
                    "dossier_notice": "Se le informará del progreso en tiempo real por correo electrónico. Para cualquier modificación, contacte con soporte."
                },
                "history": {
                    "title": "Mis solicitudes",
                    "tracking": "Seguimiento de solicitudes",
                    "empty": "No hay solicitudes en curso.",
                    "empty_desktop": "Sus solicitudes de crédito aparecerán aquí."
                },
                "messages": {
                    "already_pending": "Ya tiene una solicitud en curso.",
                    "description_short": "Por favor, describa su proyecto (mín. 10 caracteres).",
                    "success": "¡Solicitud enviada! Un asesor contactará con usted.",
                    "error": "Error durante la solicitud.",
                    "confirm_title": "Confirmar su solicitud",
                    "confirm_button": "Confirmar y Enviar",
                    "credit_opened": "Su Cuenta de Crédito ha sido abierta y los fondos depositados.",
                    "credit_available_title": "Crédito Aprobado ",
                    "credit_available_desc": "Su solicitud de crédito de {{amount}} € ha sido aprobada. Los fondos están disponibles.",
                    "congrats": "¡Felicidades! Su crédito de {{amount}} € está disponible."
                },
                "support": {
                    "contact_btn": "Contactar con soporte",
                    "need_help": "¿Necesita asistencia?",
                    "advisors_desc": "Nuestros asesores están disponibles para revisar su expediente complejo.",
                    "contact_advisor": "Contactar con un asesor",
                    "fonds_avail": "Fondos disponibles en su espacio",
                    "access_btn": "Acceder a mi Crédito"
                }
            },
            "deposit": {
                "title": "Recargar",
                "subtitle": "Alimente su cuenta de forma segura.",
                "methods": {
                    "card": {
                        "title": "Tarjeta Bancaria",
                        "desc": "Crédito inmediato"
                    },
                    "bank": {
                        "title": "Transferencia SEPA",
                        "desc": "2-3 días hábiles"
                    }
                },
                "form": {
                    "amount_label": "Importe a acreditar",
                    "amount_placeholder": "0.00",
                    "card_number": "Número de tarjeta",
                    "holder_label": "TITULAR",
                    "holder_placeholder": "NOMBRE APELLIDO",
                    "expiry_label": "EXP",
                    "cvc_label": "CVC / CVV",
                    "target_account": "Cuenta de destino",
                    "account_types": {
                        "main": "Cuenta Principal",
                        "savings": "Cuenta de Ahorros"
                    },
                    "submit_card": "Recargar {{amount}} €",
                    "enter_amount": "Introduzca un importe",
                    "invalid_card": "Número de tarjeta no válido",
                    "invalid_expiry": "Fecha de caducidad no válida",
                    "invalid_cvc": "CVC no válido",
                    "pay": "Pagar {{amount}} EUR",
                    "secure_notice": "Transacción segura SSL"
                },
                "bank_details": {
                    "title": "Transferencia Bancaria",
                    "desc": "Use los detalles a continuación para realizar su transferencia desde su otro banco.",
                    "beneficiary": "Beneficiario",
                    "bank_name": "Banco",
                    "bic": "BIC / SWIFT",
                    "iban": "IBAN",
                    "processing_delay": "El tiempo de procesamiento es de 24 a 48 horas hábiles.",
                    "copy_toast": "¡{{label}} copiado al portapapeles!",
                    "header": "Detalles de la transferencia"
                },
                "history": {
                    "title": "Sus recargas recientes",
                    "empty": "No hay depósitos recientes.",
                    "methods": {
                        "card": "Tarjeta",
                        "transfer": "Transferencia"
                    }
                },
                "messages": {
                    "check_card": "Por favor, verifique la información de su tarjeta.",
                    "success": "Su solicitud de recarga está siendo procesada. Su saldo se actualizará en breve.",
                    "pending_alert": "Un depósito está siendo procesado actualmente en su cuenta."
                },
                "pagination": {
                    "page": "Página {{current}} de {{total}}"
                }
            },
            "documents": {
                "title": "Mis Documentos",
                "subtitle": "Descargue sus comprobantes de identidad bancaria y certificados oficiales.",
                "sections": {
                    "rib": "Comprobantes de Identidad Bancaria (RIB)",
                    "contracts": "Certificados & Contratos"
                },
                "rib": {
                    "title": "RIB - {{name}}",
                    "holder": "Titular de la cuenta",
                    "bank": "ESTABLECIMIENTO BANCARIO",
                    "bank_code": "Código del Banco",
                    "branch_code": "Código de Sucursal",
                    "account_number": "Número de cuenta",
                    "key": "Clave RIB",
                    "iban": "IBAN",
                    "bic": "BIC (SWIFT)",
                    "download_pdf": "Descargar PDF",
                    "print": "Imprimir",
                    "share_msg": "Aquí están mis datos bancarios para la cuenta {{name}} (IBAN: {{iban}})",
                    "not_defined": "No definido"
                },
                "contract": {
                    "title": "Contrato de Apertura",
                    "client_contract": "Contrato de Cliente",
                    "signed_on": "Firmado el {{date}}",
                    "download": "DESCARGAR PDF",
                    "pdf_title": "CONTRATO DE APERTURA DE CUENTA PERSONAL",
                    "parties": "ENTRE LOS ABAJO FIRMANTES:",
                    "bank_party": "1. El establecimiento bancario INVIK S.A., en adelante 'El Banco'.",
                    "client_party": "2. Sr./Sra. {{name}}, en adelante 'El Cliente'.",
                    "residing_at": "Residente en: {{address}}, {{zip}} {{city}}",
                    "object_title": "OBJETO DEL CONTRATO",
                    "object_text": "El objeto de este contrato es definir las condiciones generales y especiales para la apertura y funcionamiento de las cuentas abiertas a nombre del Cliente en los libros de INVIK S.A.",
                    "terms_title": "CONDICIONES DE USO",
                    "terms_1": "- El Cliente tiene acceso permanente a sus cuentas a través de la interfaz digital segura.",
                    "terms_2": "- El Banco se compromete a garantizar la seguridad de los fondos y la confidencialidad de los datos de acuerdo con el RGPD.",
                    "terms_3": "- El Cliente es responsable de mantener la confidencialidad de sus accesos bancarios.",
                    "terms_4": "- Las operaciones de transferencia y pago están sujetas a los límites definidos en las condiciones tarifarias.",
                    "duration_title": "DURACIÓN Y RESCISIÓN",
                    "duration_text": "Este contrato se celebra por tiempo indefinido. Cada parte puede rescindirlo en cualquier momento previo aviso de 30 días, de acuerdo con la normativa aplicable.",
                    "signatures_title": "FIRMAS",
                    "made_at": "Hecho en Luxemburgo, el {{date}}",
                    "client_sig": "Firma del Cliente",
                    "certified_sig": "(Firma digital certificada)",
                    "bank_sig": "Por INVIK S.A."
                },
                "branding": {
                    "tagline": "Banco Digital Premium",
                    "legal_1": "Este documento es un acto oficial generado por los servicios digitales de INVIK S.A.",
                    "legal_2": "INVIK S.A. - Derecho luxemburgués S.A. - RCS Luxemburgo B 138.554 - Capital 31.000.000 EUR",
                    "legal_3": "Sede social: 51, Boulevard Grande-Duchesse Charlotte, L-1331 Luxemburgo"
                },
                "messages": {
                    "rib_success": "¡RIB generado con éxito!",
                    "rib_error": "Error al generar el RIB",
                    "contract_success": "¡Contrato generado con éxito!",
                    "contract_error": "Error al generar el contrato",
                    "iban_copied": "¡IBAN copiado al portapapeles!",
                    "empty": "No hay documentos disponibles.",
                    "available": "Disp."
                }
            }
        },
        "it": {
            "welcome": "Buongiorno, {{name}} 👋",
            "loading": "Preparazione del tuo spazio personale...",
            "header": {
                "search_placeholder": "Cerca una transazione...",
                "profile_title": "Impostazioni account"
            },
            "sidebar": {
                "nav": {
                    "dashboard": "Dashboard",
                    "accounts": "I miei Conti",
                    "transfers": "Trasferimenti",
                    "beneficiaries": "Beneficiari",
                    "deposit": "Ricaricare",
                    "cards": "Carte",
                    "credits": "Crediti",
                    "history": "Cronologia",
                    "documents": "Documenti",
                    "support": "Supporto",
                    "settings": "Impostazioni"
                },
                "user": {
                    "account_type": "Conto {{type}}"
                },
                "logout": "Disconnetti"
            },
            "notifications": {
                "title": "Notifiche",
                "mark_all_read": "Segna tutto come letto",
                "empty": "Nessuna notifica",
                "close": "Chiudi"
            },
            "kyc": {
                "title": "Verifica Identità (KYC)",
                "subtitle": "Per proteggere il tuo conto, inviaci un documento d'identità e gli altri documenti richiesti.",
                "status": {
                    "submitted": "I tuoi documenti sono già in fase di revisione.",
                    "verified": "Il tuo account è già verificato.",
                    "action_required": "Azione richiesta:",
                    "rejection_msg": "Alcuni documenti devono essere rinviati."
                },
                "sections": {
                    "required": "(OBBLIGATORIO)",
                    "identity": "1. Prova di identità",
                    "identity_sub": "Scegli un primo documento valido (Carta d'identità, Passaporto, ecc.)",
                    "biometric": "2. Verifica biometrica",
                    "biometric_sub": "Foto recenti per confermare la tua identità.",
                    "address": "3. Prova di indirizzo",
                    "address_sub": "Documento ufficiale datato meno di 3 mesi fa.",
                    "income": "4. Prova di reddito",
                    "income_sub": "In base alla tua situazione (Dipendente, Pensionato, ecc.).",
                    "bank": "5. Prova bancaria",
                    "bank_sub": "Documento di identità bancaria (RIB / IBAN).",
                    "bank_notice": "Il RIB deve essere tassativamente intestato al richiedente (titolare esclusivo)."
                },
                "labels": {
                    "type_doc": "Tipo documento",
                    "select_type": "Seleziona tipo documento",
                    "front": "Fronte / Pagina principale",
                    "back": "Retro (se applicabile)",
                    "load_front": "Carica fronte",
                    "load_back": "Carica retro",
                    "load_doc": "Carica documento",
                    "selfie": "Selfie Semplice",
                    "selfie_hint": "Senza filtri o occhiali",
                    "face_clear": "Viso scoperto",
                    "selfie_id": "Selfie con documento",
                    "selfie_id_hint": "Deve essere leggibile",
                    "hold_id": "Tieni il tuo documento d'identità",
                    "example": "Vedi un esempio",
                    "loaded": "Documento caricato",
                    "example_ref": "Riferimento per un invio conforme",
                    "back_btn": "Indietro",
                    "submit_btn": "Invia pratica completa",
                    "sending": "Invio sicuro...",
                    "securing_sending": "Protezione e invio..."
                },
                "types": {
                    "id": {
                        "cni": "Carta d'Identità Nazionale (CNI)",
                        "passport": "Passaporto",
                        "driver": "Patente di guida",
                        "residence": "Permesso di soggiorno"
                    },
                    "address": {
                        "utility": "Bolletta Luce / Gas / Acqua",
                        "telecom": "Bolletta Internet / Telefono fisso",
                        "tax": "Avviso fiscale",
                        "insurance": "Certificato assicurazione casa",
                        "rent": "Ricevuta affitto",
                        "hosting": "Certificato di ospitalità + ID ospitante"
                    },
                    "income": {
                        "payslip": "Ultime 3 buste paga",
                        "contract": "Contratto di lavoro",
                        "tax": "Ultimo avviso fiscale",
                        "kbis": "Estratto Kbis (Imprenditore)",
                        "pension": "Prospetto pensione (Pensionato)",
                        "unemployment": "Certificato di disoccupazione",
                        "statement": "Estratto conto recente"
                    }
                },
                "messages": {
                    "file_too_large": "Il file è troppo grande (max 5MB)",
                    "upload_error": "Errore di caricamento",
                    "select_id_type": "Seleziona un tipo di documento d'identità.",
                    "missing_files": "Si prega di fornire tutti i giustificativi obbligatori.",
                    "success": "Pratica KYC inviata con successo!",
                    "error": "Errore durante l'invio: "
                },
                "legal": "I documenti forniti vengono utilizzati esclusivamente per la verifica dell'identità (KYC), la prevenzione delle frodi e il rispetto delle normative. Sono trattati in modo sicuro e riservato in conformità con il GDPR."
            },
            "banner": {
                "loading": "Caricamento verifica...",
                "toasts": {
                    "verified": "La tua identità è verificata. Hai accesso a tutte le funzioni.",
                    "submitted": "I tuoi documenti sono in fase di analisi. Verrai informato non appena la verifica sarà completata."
                },
                "status": {
                    "verified": "Conto Verificato",
                    "submitted": "In corso...",
                    "rejected": "Rifiutato (Dettagli)",
                    "verify_now": "Verifica Identità",
                    "click_to_verify": "Clicca per verificare"
                },
                "blocking": {
                    "refused": "Validazione Rifiutata",
                    "in_progress": "Verifica in corso",
                    "required": "Verifica Richiesta",
                    "motif": "Motivo:",
                    "not_compliant": "Alcuni documenti non sono conformi. Si prega di rinviarli.",
                    "analyzing": "Stiamo analizzando i tuoi documenti. Questa procedura richiede solitamente meno di 24 ore.",
                    "restricted": "Per ragioni di sicurezza e conformità, l'accesso a questa funzione è limitato. Completa la verifica dell'identità per sbloccare il conto.",
                    "waiting": "In attesa di validazione",
                    "start": "Inizia verifica",
                    "secure": "Dati Criptati e Sicuri"
                }
            },
            "accounts": {
                "title": "I miei Conti",
                "subtitle": "Panoramica della vostra situazione finanziaria.",
                "total_balance": "Saldo Totale",
                "main": "Conto Corrente",
                "savings": "Conto di Risparmio",
                "credit": "Conto di Credito",
                "hidden_iban": "IBAN nascosto (Verifica richiesta)",
                "rate": "Tasso annuo: 3.50%",
                "repayment": "Prossima rata in corso",
                "no_debt": "Nessun debito accumulato",
                "card": {
                    "main": "Conto Corrente",
                    "savings": "Conto di Risparmio",
                    "credit": "Conto di Credito",
                    "currency": "Conto in Valuta",
                    "other": "Altro conto",
                    "actions": {
                        "transfer": "Trasferire",
                        "deposit": "Ricaricare",
                        "rib": "Vedi RIB"
                    }
                },
                "rib_modal": {
                    "title": "Identità Bancaria (RIB)",
                    "subtitle": "Dettagli del tuo conto per ricevere bonifici.",
                    "copy_toast": "{{label}} copiato!",
                    "close": "Chiudi",
                    "labels": {
                        "holder": "Titolare",
                        "iban": "IBAN",
                        "bic": "BIC / SWIFT",
                        "bank": "Banca",
                        "type": "Tipo di conto"
                    }
                },
                "request_modal": {
                    "title": "Apri un nuovo conto",
                    "subtitle": "Richiedi l'apertura di un nuovo tipo di conto.",
                    "button": "Nuovo conto",
                    "type_label": "Scegli il tipo di conto",
                    "message_label": "Informazioni aggiuntive (opzionale)",
                    "placeholder": "Descrivi brevemente la tua necessità...",
                    "cancel": "Annulla",
                    "confirm": "Invia richiesta",
                    "success": "Richiesta di apertura inviata!",
                    "error": "Errore durante l'invio della richiesta."
                }
            },
            "transactions": {
                "title": "Ultime Transazioni",
                "empty": "Nessuna transazione recente.",
                "deposit": "Deposito",
                "transfer": "Bonifico",
                "by_card": "tramite carta",
                "by_transfer": "tramite bonifico"
            },
            "actions": {
                "title": "Azioni Rapide",
                "transfer": "Trasferire",
                "credit": "Crediti",
                "deposit": "Ricaricare",
                "cards": "Carte"
            },
            "transfers": {
                "title": "Area Trasferimenti",
                "subtitle": "Gestisci i tuoi trasferimenti con facilità.",
                "tabs": {
                    "internal": "I miei Conti",
                    "internal_desc": "Trasferimento interno",
                    "invik": "Trasferimento INVIK",
                    "invik_desc": "Istantaneo e Gratuito",
                    "sepa": "Trasferimento SEPA",
                    "sepa_desc": "Verso un'altra banca",
                    "history": "Tracciamento"
                },
                "steps": {
                    "accounts": "Conti",
                    "amount": "Importo",
                    "validation": "Validazione"
                },
                "account_selection": {
                    "source": "Da quale conto?",
                    "dest": "Verso quale beneficiario?"
                },
                "warnings": {
                    "single_account_title": "Trasferimento interno impossibile",
                    "single_account_desc": "Possiedi un solo conto."
                },
                "invik_network": {
                    "title": "RETE INVIK ISTANTANEA",
                    "desc": "Trasferisci fondi in millisecondi a qualsiasi cliente INVIK BANK, gratuitamente."
                },
                "beneficiary_type": {
                    "saved": "Cliente Registrato",
                    "new": "Nuovo Beneficiario"
                },
                "inputs": {
                    "select_invik": "Seleziona un cliente INVIK",
                    "select_beneficiary": "Seleziona un beneficiario",
                    "name": "Nome Completo",
                    "name_placeholder": "Es: Mario Rossi",
                    "iban": "IBAN",
                    "iban_placeholder": "IT... o FR...",
                    "bic": "BIC (opzionale)",
                    "bic_placeholder": "Es: ABCDFRPP",
                    "email": "Email del beneficiario (opzionale)",
                    "email_placeholder": "Per notifica immediata",
                    "save_invik": "Salva questo beneficiario INVIK",
                    "save_beneficiary": "Salva questo beneficiario per futuri trasferimenti"
                },
                "amount": {
                    "title": "Quanto vorresti trasferire?",
                    "available": "Saldo disponibile:",
                    "insufficient_funds": "Attenzione: L'importo supera il saldo disponibile.",
                    "limit_exceeded": "Limite massimo autorizzato: 50.000 € per trasferimento"
                },
                "review": {
                    "title": "Verifica i dettagli",
                    "from": "Da",
                    "to": "A",
                    "total": "Totale",
                    "certified": "Trasferimento Istantaneo Certificato",
                    "certified_desc": "Esecuzione immediata tramite la rete sicura INVIK BANK."
                },
                "success": {
                    "title": "TRASFERIMENTO COMPLETATO",
                    "review_title": "INFORMAZIONI IMPORTANTI",
                    "new_button": "Effettua un altro trasferimento"
                },
                "history": {
                    "title": "Cronologia trasferimenti recenti",
                    "empty": "Nessun trasferimento recente."
                },
                "buttons": {
                    "next": "Avanti",
                    "back": "Indietro",
                    "confirm": "Conferma",
                    "edit": "Modifica"
                },
                "errors": {
                    "invalid_amount": "Inserisci un importo valido",
                    "insufficient_balance": "Saldo insufficiente per questa operazione",
                    "limit_exceeded": "L'importo massimo per trasferimento è di 50.000 €",
                    "check_beneficiary": "Verifica le informazioni del beneficiario",
                    "not_invik_iban": "Questo IBAN non appartiene alla rete INVIK. Usa la scheda 'Trasferimento SEPA'.",
                    "invalid_iban": "Formato IBAN non valido."
                },
                "success_messages": {
                    "internal": "Trasferimento interno completato con successo!",
                    "instant": "Trasferimento istantaneo a {{name}} completato con successo!",
                    "pending": "Trasferimento in attesa di verifica di sicurezza. Tempi SEPA: 24h-48h."
                },
                "form": {
                    "step_source": "1. Conto di origine",
                    "step_dest": "2. Conto di destinazione",
                    "step_dest_invik": "2. Destinatario INVIK",
                    "step_dest_beneficiary": "2. Beneficiario",
                    "step_amount": "Importo da trasferire",
                    "sending": "Invio in corso..."
                }
            },
            "cards": {
                "title": "Le mie Carte",
                "subtitle": "Gestisci le tue carte fisiche e virtuali.",
                "empty": {
                    "title": "Nessuna carta attiva",
                    "desc": "Non hai ancora nessuna carta associata al tuo conto.",
                    "button": "Ordina una carta"
                },
                "list_title": "Le tue Carte Attive ({{count}})",
                "actions": {
                    "show_number": "Mostra numero",
                    "hide_number": "Nascondi",
                    "flip": "Gira",
                    "block": "Blocca",
                    "unblock": "Sblocca",
                    "disabled": "Disattivata",
                    "activate": "Attiva",
                    "options": "Opzioni",
                    "delete": "Elimina"
                },
                "details": {
                    "status": "Stato:",
                    "type": "Tipo:",
                    "limit": "Limite:",
                    "updated": "Aggiornato:",
                    "holder": "TITOLARE",
                    "expiry": "SCADE FINE",
                    "cvv": "CVV",
                    "support": "Supporto",
                    "title": "Dettagli della carta",
                    "virtual_uppercase": "CARTA VIRTUALE",
                    "physical_uppercase": "CARTA FISICA",
                    "property_notice": "Questa carta è di proprietà di INVIK BANK SA.",
                    "active": "Attiva",
                    "inactive": "Disattivata",
                    "blocked": "Bloccata",
                    "virtual": "Virtuale",
                    "physical": "Fisica"
                },
                "physical_order": {
                    "title": "Carta Fisica",
                    "mobile_title": "Richiedi una carta fisica",
                    "desc": "Ricevi la tua esclusiva carta INVIK a casa tua entro 3-5 giorni lavorativi.",
                    "features": {
                        "withdrawals": "Prelievi gratuiti ovunque",
                        "contactless": "Pagamento contactless",
                        "design": "Design Nero Opaco Premium"
                    },
                    "button": {
                        "order": "Ordina ora",
                        "processing": "Richiesta in corso",
                        "shipped": "Carta spedita",
                        "delivered": "Carta ricevuta ✅",
                        "cancel": "Annulla richiesta"
                    },
                    "status": {
                        "pending": "Stiamo elaborando la tua richiesta",
                        "delivered": "Congratulazioni! La tua carta è arrivata. Goditi i tuoi nuovi vantaggi! 🎁✨",
                        "shipped": "La tua carta è in viaggio! 🚀 Arriverà entro 3-5 giorni.",
                        "rejected": "Ultima richiesta rifiutata:",
                        "free": "Gratuita • Inclusa nella tua offerta"
                    }
                },
                "virtual_promo": {
                    "title": "Serve una carta virtuale?",
                    "desc": "Crea una carta istantaneamente per i tuoi acquisti online sicuri.",
                    "button": "Crea una carta virtuale"
                },
                "options_modal": {
                    "title": "Opzioni carta",
                    "alias_label": "NOME DELLA CARTA (ALIAS)",
                    "alias_placeholder": "Es: Acquisti Amazon, Personale...",
                    "limit_label": "LIMITE MENSILE (€)",
                    "limit_help": "Il limite predefinito è di 2.000 €.",
                    "save": "Salva modifiche"
                },
                "messages": {
                    "blocked": "La tua carta è stata bloccata.",
                    "unblocked": "La tua carta è stata sbloccata.",
                    "order_success": "La tua richiesta di carta fisica è stata inviata con successo!",
                    "order_error": "Si è verificato un errore durante l'ordine.",
                    "options_saved": "Impostazioni della carta aggiornate!",
                    "delete_confirm": "Vuoi davvero eliminare definitivamente questa carta dal tuo spazio? Questa azione è irreversibile.",
                    "delete_success": "Carta eliminata con successo.",
                    "request_cancel_confirm": "Annullare ed eliminare questa richiesta di carta?",
                    "request_cancelled": "Richiesta annullata."
                }
            },
            "history": {
                "title": "Cronologia",
                "subtitle": "Visualizza tutte le tue transazioni passate.",
                "empty": "Nessuna transazione trovata.",
                "columns": {
                    "date": "Data",
                    "type": "Tipo",
                    "category": "Categoria",
                    "amount": "Importo",
                    "fees": "Commissioni"
                },
                "types": {
                    "deposit": "Deposito",
                    "transfer_internal": "Trasf. Interno a {{name}}",
                    "transfer_instant": "Trasf. Istantaneo a {{name}}",
                    "receive_instant": "Ricezione Istantanea",
                    "transfer_external": "Trasf. Esterno a {{name}}",
                    "operation": "Operazione",
                    "internal_account": "Conto Interno",
                    "beneficiary": "Beneficiario"
                },
                "details": {
                    "iban_label": "IBAN: {{iban}}",
                    "ref": "Ref:",
                    "sender": "Da {{name}}"
                }
            },
            "status": {
                "pending": "In attesa",
                "completed": "Completato",
                "rejected": "Rifiutato",
                "in_review": "In revisione"
            },
            "settings": {
                "title": "Impostazioni Account",
                "subtitle": "Visualizza e modifica il tuo profilo bancario.",
                "tabs": {
                    "profile": "Profilo",
                    "security": "Sicurezza",
                    "prefs": "Impostazioni",
                    "my_info": "Le mie Informazioni",
                    "security_access": "Sicurezza & Accesso",
                    "preferences": "Preferenze"
                },
                "profile": {
                    "title": "Informazioni Personali",
                    "email_verified": "Email Verificata",
                    "email_contact": "EMAIL DI CONTATTO",
                    "first_name": "Nome",
                    "last_name": "Cognome",
                    "dob": "Data di nascita",
                    "pob": "Luogo di nascita",
                    "phone": "Telefono",
                    "nationality": "Nazionalità",
                    "address": "Indirizzo",
                    "city": "Città",
                    "zip": "Codice Postale",
                    "save_btn": "Salva impostazioni",
                    "update_btn": "Aggiorna parametri"
                },
                "security": {
                    "title": "Sicurezza di Autenticazione",
                    "password_title": "Sicurezza Password",
                    "password_desc": "Una password sicura protegge il tuo conto bancario da accessi non autorizzati.",
                    "new_password": "Nuova password",
                    "confirm_password": "Conferma password",
                    "update_pwd_btn": "Aggiorna password",
                    "update_access_btn": "Aggiorna i miei accessi",
                    "last_mod": "Ultima modifica",
                    "days_ago": "{{count}} giorni fa",
                    "encrypted_storage": "Archiviazione Crittografata",
                    "protected_aes": "Protetto da AES-256",
                    "security_reqs": "Requisiti di sicurezza",
                    "tip_8_chars": "Almeno 8 caratteri",
                    "tip_caps": "Una lettera maiuscola",
                    "tip_numbers": "Un numero",
                    "tip_special": "Un carattere speciale (!@#$)",
                    "strength": {
                        "label": "Robustezza:",
                        "weak": "Debole",
                        "medium": "Media",
                        "excellent": "Eccellente"
                    }
                },
                "advisor": {
                    "title": "IL MIO CONSULENTE FINANZIARIO",
                    "role": "Consulente Senior Gestione Patrimoniale",
                    "available": "Disponibile ora",
                    "email_label": "EMAIL PROFESSIONALE",
                    "phone_label": "LINEA DIRETTA"
                },
                "preferences": {
                    "title": "Preferenze Account",
                    "lang_label": "Lingua Interfaccia",
                    "lang_desc": "Lingua utilizzata per i menu e gli estratti conto."
                },
                "messages": {
                    "success": "Impostazioni aggiornate con successo.",
                    "error": "Si è verificato un errore.",
                    "pwd_success": "Password aggiornata con successo."
                }
            },
            "support": {
                "title": "Assistenza & Supporto",
                "subtitle": "Consulta l'aiuto online o chatta con un consulente.",
                "faq": {
                    "title": "FAQ & Aiuto rapido",
                    "q1": {
                        "q": "Bonifici non ricevuti",
                        "a": "Un bonifico SEPA classico richiede solitamente 1-2 giorni lavorativi. Se aspetti un bonifico internazionale, possono essere necessari fino a 5 giorni. Verifica che l'IBAN fornito sia corretto."
                    },
                    "q2": {
                        "q": "Limiti della carta",
                        "a": "Puoi consultare i tuoi limiti attuali nella sezione 'Carte'. Per un aumento temporaneo o permanente, contatta il tuo consulente tramite un ticket di supporto."
                    },
                    "q3": {
                        "q": "Proteggere il mio conto",
                        "a": "Attiva sempre l'autenticazione a due fattori (2FA). Non condividere mai i codici ricevuti via SMS. In caso di dubbi su una transazione, blocca immediatamente la tua carta dall'app."
                    },
                    "q4": {
                        "q": "Spese bancarie",
                        "a": "Le nostre tariffe sono trasparenti. Il conto standard è gratuito. Le spese di gestione per i conti premium vengono addebitate mensilmente. Consulta la nostra tabella delle tariffe in 'Documenti'."
                    },
                    "q5": {
                        "q": "Password dimenticata",
                        "a": "Clicca su 'Password dimenticata?' nella pagina di accesso. Ti verrà inviato istantaneamente un link di ripristino via email."
                    }
                },
                "tickets": {
                    "title": "Le mie richieste",
                    "new_btn": "Nuovo ticket",
                    "subject_placeholder": "Oggetto",
                    "message_placeholder": "Dettaglia la tua richiesta per un'elaborazione più rapida...",
                    "create_btn": "Crea ticket",
                    "send_btn": "Invia ticket",
                    "cancel_btn": "Annulla",
                    "empty": "Non hai ticket di supporto attivi.",
                    "status": {
                        "open": "IN CORSO",
                        "resolved": "RISOLTO",
                        "closed": "Chiudi"
                    },
                    "categories": {
                        "technical": "Problema tecnico",
                        "billing": "Domanda sulle commissioni",
                        "cards": "Gestione delle carte",
                        "other": "Altro"
                    }
                },
                "chat": {
                    "reply_placeholder": "Rispondi...",
                    "input_placeholder": "Descrivi il tuo problema...",
                    "send": "Invia"
                }
            },
            "beneficiaries": {
                "title": "Beneficiari",
                "subtitle": "Gestisci i tuoi destinatari di trasferimento.",
                "stats": {
                    "total": "{{count}} Beneficiari",
                    "invik": "{{count}} Istantanei"
                },
                "empty": {
                    "title": "Nessun beneficiario",
                    "subtitle": "Aggiungi il tuo primo beneficiario per iniziare i tuoi trasferimenti.",
                    "search_no_results": "Nessun risultato per la tua ricerca.",
                    "search_try_again": "Riprova con un altro nome o IBAN."
                },
                "card": {
                    "iban_prefix": "IBAN",
                    "bic_prefix": "BIC",
                    "email_prefix": "Email",
                    "actions": {
                        "transfer": "Trasferire",
                        "quick_transfer": "Trasferimento Rapido",
                        "delete": "Elimina"
                    }
                },
                "form": {
                    "add_title": "Aggiungi un Beneficiario",
                    "new_title": "Nuovo Beneficiario",
                    "name_label": "NOME COMPLETO",
                    "name_placeholder": "Es: Mario Rossi",
                    "iban_label": "IBAN",
                    "iban_placeholder": "IT...",
                    "bic_label": "BIC (OPZIONALE)",
                    "bic_placeholder": "Opzionale",
                    "email_label": "EMAIL (OPZIONALE)",
                    "email_placeholder": "Opzionale",
                    "submit": "Aggiungi beneficiario",
                    "confirm_submit": "Conferma aggiunta",
                    "validation": {
                        "iban_invalid": "Formato IBAN non valido",
                        "iban_valid": "IBAN valido"
                    }
                },
                "search_placeholder": "Cerca un beneficiario...",
                "toasts": {
                    "add_success": "Beneficiario aggiunto con successo!",
                    "add_error": "Errore durante l'aggiunta del beneficiario.",
                    "delete_success": "Beneficiario eliminato.",
                    "delete_error": "Errore durante l'eliminazione del beneficiario."
                },
                "confirm_delete": "Sei sicuro di voler eliminare questo beneficiario?"
            },
            "credits": {
                "title": "Crediti e Finanziamenti",
                "subtitle": "Simula il tuo progetto e ottieni una risposta entro 24 ore",
                "form": {
                    "simulator_title": "Simulatore",
                    "your_simulation": "La tua simulazione",
                    "project_type": "Tipo di progetto",
                    "project_description": "Descrizione del progetto (Obbligatorio)",
                    "project_description_placeholder": "Dettaglia il tuo progetto in poche righe...",
                    "specific_project": "Il tuo progetto specifico",
                    "specific_project_placeholder": "Descrivi brevemente il tuo progetto...",
                    "amount": "Importo del prestito",
                    "months": "Durata del rimborso",
                    "interest_rate": "Tasso di interesse (TAEG)",
                    "monthly_payment": "Rata mensile",
                    "monthly_payment_est": "stimata",
                    "apply_button": "Richiedi questo prestito",
                    "apply_button_official": "Fai una richiesta ufficiale",
                    "processing": "Elaborazione...",
                    "sending": "Invio...",
                    "years": "anni",
                    "months_label": "mesi"
                },
                "types": {
                    "personnel": "Prestito Personale",
                    "immobilier": "Credito Immobiliare",
                    "vehicule": "Credito Veicolo",
                    "professionnel": "Progetto Professionale",
                    "autre": "Altro (Specificare...)"
                },
                "status": {
                    "pending": "In revisione",
                    "approved": "Approvato ",
                    "rejected": "Rifiutato",
                    "dossier_title": "Pratica in revisione",
                    "dossier_desc": "Stiamo attualmente revisionando la tua richiesta di {{amount}} €.",
                    "dossier_notice": "Sarai informato sui progressi in tempo reale via email. Per qualsiasi modifica, contatta il supporto."
                },
                "history": {
                    "title": "Le mie richieste",
                    "tracking": "Tracciamento richieste",
                    "empty": "Nessuna richiesta in corso.",
                    "empty_desktop": "Le tue richieste di credito appariranno qui."
                },
                "messages": {
                    "already_pending": "Hai già una richiesta in corso.",
                    "description_short": "Descrivi il tuo progetto (min. 10 caratteri).",
                    "success": "Richiesta inviata! Un consulente ti contatterà.",
                    "error": "Errore durante la richiesta.",
                    "confirm_title": "Conferma la tua richiesta",
                    "confirm_button": "Conferma e Invia",
                    "credit_opened": "Il tuo Conto Credito è stato aperto e i fondi depositati.",
                    "credit_available_title": "Credito Approvato ",
                    "credit_available_desc": "La tua richiesta di credito di {{amount}} € è stata approvata. I fondi sono disponibili.",
                    "congrats": "Congratulazioni! Il tuo credito di {{amount}} € è disponibile."
                },
                "support": {
                    "contact_btn": "Contatta il supporto",
                    "need_help": "Serve assistenza?",
                    "advisors_desc": "I nostri consulenti sono disponibili per revisionare la tua pratica complessa.",
                    "contact_advisor": "Contatta un consulente",
                    "fonds_avail": "Fondi disponibili nel tuo spazio",
                    "access_btn": "Accedi al mio Credito"
                }
            },
            "deposit": {
                "title": "Ricaricare",
                "subtitle": "Alimenta il tuo conto in modo sicuro.",
                "methods": {
                    "card": {
                        "title": "Carta Bancaria",
                        "desc": "Credito immediato"
                    },
                    "bank": {
                        "title": "Trasferimento SEPA",
                        "desc": "2-3 giorni lavorativi"
                    }
                },
                "form": {
                    "amount_label": "Importo da accreditare",
                    "amount_placeholder": "0.00",
                    "card_number": "Numero di carta",
                    "holder_label": "TITOLARE",
                    "holder_placeholder": "NOME COGNOME",
                    "expiry_label": "SCAD",
                    "cvc_label": "CVC / CVV",
                    "target_account": "Conto di destinazione",
                    "account_types": {
                        "main": "Conto Principale",
                        "savings": "Conto Risparmio"
                    },
                    "submit_card": "Ricarica {{amount}} €",
                    "enter_amount": "Inserisci un importo",
                    "invalid_card": "Numero di carta non valido",
                    "invalid_expiry": "Data di scadenza non valida",
                    "invalid_cvc": "CVC non valido",
                    "pay": "Paga {{amount}} EUR",
                    "secure_notice": "Transazione sicura SSL"
                },
                "bank_details": {
                    "title": "Bonifico Bancario",
                    "desc": "Usa i dettagli qui sotto per effettuare il bonifico dalla tua altra banca.",
                    "beneficiary": "Beneficiario",
                    "bank_name": "Banca",
                    "bic": "BIC / SWIFT",
                    "iban": "IBAN",
                    "processing_delay": "Il tempo di elaborazione è di 24-48 ore lavorative.",
                    "copy_toast": "{{label}} copiato negli appunti!",
                    "header": "Dettagli del bonifico"
                },
                "history": {
                    "title": "Le tue ricariche recenti",
                    "empty": "Nessun deposito recente.",
                    "methods": {
                        "card": "Carta",
                        "transfer": "Bonifico"
                    }
                },
                "messages": {
                    "check_card": "Verifica le informazioni della tua carta.",
                    "success": "La tua richiesta di ricarica è in fase di elaborazione. Il tuo saldo sarà aggiornato a breve.",
                    "pending_alert": "Un deposito è attualmente in fase di elaborazione sul tuo conto."
                },
                "pagination": {
                    "page": "Pagina {{current}} di {{total}}"
                }
            },
            "documents": {
                "title": "I miei Documenti",
                "subtitle": "Scarica le tue coordinate bancarie e i certificati ufficiali.",
                "sections": {
                    "rib": "Coordinate Bancarie (RIB)",
                    "contracts": "Certificati & Contratti"
                },
                "rib": {
                    "title": "RIB - {{name}}",
                    "holder": "Titolare del conto",
                    "bank": "ISTITUTO BANCARIO",
                    "bank_code": "Codice ABI",
                    "branch_code": "Codice CAB",
                    "account_number": "Numero di conto",
                    "key": "Chiave RIB",
                    "iban": "IBAN",
                    "bic": "BIC (SWIFT)",
                    "download_pdf": "Scarica PDF",
                    "print": "Stampa",
                    "share_msg": "Ecco le mie coordinate bancarie per il conto {{name}} (IBAN: {{iban}})",
                    "not_defined": "Non definito"
                },
                "contract": {
                    "title": "Contratto di Apertura",
                    "client_contract": "Contratto Cliente",
                    "signed_on": "Firmato il {{date}}",
                    "download": "SCARICA PDF",
                    "pdf_title": "CONTRATTO DI APERTURA CONTO PERSONALE",
                    "parties": "TRA I SOTTOSCRITTI:",
                    "bank_party": "1. L'istituto bancario INVIK S.A., di seguito denominato 'La Banca'.",
                    "client_party": "2. Sig./Sig.ra {{name}}, di seguito denominato 'Il Cliente'.",
                    "residing_at": "Residente in: {{address}}, {{zip}} {{city}}",
                    "object_title": "OGGETTO DEL CONTRATTO",
                    "object_text": "Lo scopo del presente contratto è definire le condizioni generali e speciali per l'apertura e la gestione dei conti aperti a nome del Cliente presso INVIK S.A.",
                    "terms_title": "CONDIZIONI D'USO",
                    "terms_1": "- Il Cliente ha accesso permanente ai propri conti tramite l'interfaccia digitale sicura.",
                    "terms_2": "- La Banca si impegna a garantire la sicurezza dei fondi e la riservatezza dei dati in conformità con il GDPR.",
                    "terms_3": "- Il Cliente è responsabile del mantenimento della riservatezza dei propri accessi bancari.",
                    "terms_4": "- Le operazioni di trasferimento e pagamento sono soggette ai limiti definiti nelle condizioni tariffarie.",
                    "duration_title": "DURATA E RESCISSIONE",
                    "duration_text": "Il presente contratto è stipulato a tempo indeterminato. Ciascuna parte può recedere in qualsiasi momento previo preavviso di 30 giorni, in conformità con le normative vigenti.",
                    "signatures_title": "FIRME",
                    "made_at": "Fatto a Lussemburgo, il {{date}}",
                    "client_sig": "Firma del Cliente",
                    "certified_sig": "(Firma digitale certificata)",
                    "bank_sig": "Per INVIK S.A."
                },
                "branding": {
                    "tagline": "Banca Digitale Premium",
                    "legal_1": "Questo documento è un atto ufficiale generato dai servizi digitali di INVIK S.A.",
                    "legal_2": "INVIK S.A. - Diritto lussemburghese S.A. - RCS Lussemburgo B 138.554 - Capitale 31.000.000 EUR",
                    "legal_3": "Sede legale: 51, Boulevard Grande-Duchesse Charlotte, L-1331 Lussemburgo"
                },
                "messages": {
                    "rib_success": "RIB generato con successo!",
                    "rib_error": "Errore durante la generazione del RIB",
                    "contract_success": "Contratto generato con successo!",
                    "contract_error": "Errore durante la generazione del contratto",
                    "iban_copied": "IBAN copiato negli appunti!",
                    "empty": "Nessun documento disponibile.",
                    "available": "Disp."
                }
            }
        },
        "pt": {
            "welcome": "Olá, {{name}} 👋",
            "loading": "Preparando o seu espaço pessoal...",
            "header": {
                "search_placeholder": "Procurar uma transação...",
                "profile_title": "Ajustes da conta"
            },
            "sidebar": {
                "nav": {
                    "dashboard": "Painel de Controlo",
                    "accounts": "Minhas Contas",
                    "transfers": "Transferências",
                    "beneficiaries": "Beneficiários",
                    "deposit": "Recarregar",
                    "cards": "Cartões",
                    "credits": "Créditos",
                    "history": "Histórico",
                    "documents": "Documentos",
                    "support": "Suporte",
                    "settings": "Ajustes"
                },
                "user": {
                    "account_type": "Conta {{type}}"
                },
                "logout": "Sair"
            },
            "notifications": {
                "title": "Notificações",
                "mark_all_read": "Marcar tudo como lido",
                "empty": "Nenhuma notificação",
                "close": "Fechar"
            },
            "kyc": {
                "title": "Verificação de Identidade (KYC)",
                "subtitle": "Para proteger a sua conta, envie-nos um documento de identidade e os outros documentos solicitados.",
                "status": {
                    "submitted": "Os seus documentos já estão a ser revistos.",
                    "verified": "A sua conta já está verificada.",
                    "action_required": "Ação necessária:",
                    "rejection_msg": "Alguns documentos precisam de ser reenviados."
                },
                "sections": {
                    "required": "(OBRIGATÓRIO)",
                    "identity": "1. Justificativo de identidade",
                    "identity_sub": "Escolha um primeiro documento válido (Cartão Cidadão, Passaporte, etc.)",
                    "biometric": "2. Verificação biométrica",
                    "biometric_sub": "Fotos recentes para confirmar a sua identidade.",
                    "address": "3. Justificativo de morada",
                    "address_sub": "Documento oficial com menos de 3 meses.",
                    "income": "4. Justificativo de rendimentos",
                    "income_sub": "Dependendo da sua situação (Empregado, Reformado, etc.).",
                    "bank": "5. Justificativo bancário",
                    "bank_sub": "Extrato de Identidade Bancária (RIB / IBAN).",
                    "bank_notice": "O RIB deve ser imperativamente em nome do requerente (titular exclusivo)."
                },
                "labels": {
                    "type_doc": "Tipo de documento",
                    "select_type": "Selecionar tipo de documento",
                    "front": "Frente / Página principal",
                    "back": "Verso (se aplicável)",
                    "load_front": "Carregar frente",
                    "load_back": "Carregar verso",
                    "load_doc": "Carregar documento",
                    "selfie": "Selfie Simples",
                    "selfie_hint": "Sem filtros ou óculos",
                    "face_clear": "Rosto visível",
                    "selfie_id": "Selfie com documento",
                    "selfie_id_hint": "Deve estar legível",
                    "hold_id": "Segure o seu documento de identidade",
                    "example": "Ver um exemplo",
                    "loaded": "Documento carregado",
                    "example_ref": "Referência para um envio conforme",
                    "back_btn": "Voltar",
                    "submit_btn": "Enviar dossiê completo",
                    "sending": "Envio seguro...",
                    "securing_sending": "Protegendo e enviando..."
                },
                "types": {
                    "id": {
                        "cni": "Cartão de Cidadão / Bilhete de Identidade",
                        "passport": "Passaporte",
                        "driver": "Carta de condução",
                        "residence": "Título de residência"
                    },
                    "address": {
                        "utility": "Fatura de Eletricidade / Gás / Água",
                        "telecom": "Fatura de Internet / Telefone fixo",
                        "tax": "Aviso fiscal",
                        "insurance": "Certificado seguro de habitação",
                        "rent": "Recibo de aluguer",
                        "hosting": "Atestado de residência + ID do anfitrião"
                    },
                    "income": {
                        "payslip": "Últimos 3 recibos de vencimento",
                        "contract": "Contrato de trabalho",
                        "tax": "Último aviso fiscal",
                        "kbis": "Certidão comercial (Empresário)",
                        "pension": "Declaração de pensão (Reformado)",
                        "unemployment": "Certificado de desemprego",
                        "statement": "Extrato bancário recente"
                    }
                },
                "messages": {
                    "file_too_large": "O ficheiro é demasiado grande (máx 5MB)",
                    "upload_error": "Erro de carregamento",
                    "select_id_type": "Selecione um tipo de documento de identidade.",
                    "missing_files": "Por favor, forneça todos os comprovativos obrigatórios.",
                    "success": "Dossiê KYC enviado com sucesso!",
                    "error": "Ocorreu um erro durante o envio: "
                },
                "legal": "Os documentos fornecidos são utilizados exclusivamente para fins de verificação de identidade (KYC), para a prevenção de fraude e para a conformidade regulamentar. São tratados de forma segura e confidencial de acordo com o RGPD."
            },
            "banner": {
                "loading": "Carregando verificação...",
                "toasts": {
                    "verified": "A sua identidade está verificada. Tem acesso a todas as funcionalidades.",
                    "submitted": "Os seus documentos estão a ser analisados. Será notificado assim que a verificação estiver completa."
                },
                "status": {
                    "verified": "Conta Verificada",
                    "submitted": "Em curso...",
                    "rejected": "Rejeitada (Detalhes)",
                    "verify_now": "Verificar Identidade",
                    "click_to_verify": "Clique para verificar"
                },
                "blocking": {
                    "refused": "Validação Recusada",
                    "in_progress": "Verificação em curso",
                    "required": "Verificação Necessária",
                    "motif": "Motivo:",
                    "not_compliant": "Alguns documentos não estão conformes. Por favor, reenvie-os.",
                    "analyzing": "Estamos a analisar os seus documentos. Este procedimento demora geralmente menos de 24 horas.",
                    "restricted": "Por razões de segurança e conformidade, o acesso a esta funcionalidade está restrito. Complete a verificação de identidade para desbloquear a sua conta.",
                    "waiting": "A aguardar validação",
                    "start": "Iniciar verificação",
                    "secure": "Dados Encriptados e Seguros"
                }
            },
            "accounts": {
                "title": "Minhas Contas",
                "subtitle": "Resumo da sua situação financeira.",
                "total_balance": "Saldo Total",
                "main": "Conta Corrente",
                "savings": "Conta Poupança",
                "credit": "Conta de Crédito",
                "hidden_iban": "IBAN oculto (Verificação necessária)",
                "rate": "Taxa anual: 3.50%",
                "repayment": "Próxima parcela em curso",
                "no_debt": "Sem dívida acumulada",
                "card": {
                    "main": "Conta Corrente",
                    "savings": "Conta Poupança",
                    "credit": "Conta de Crédito",
                    "currency": "Conta em Divisas",
                    "other": "Outra conta",
                    "actions": {
                        "transfer": "Transferir",
                        "deposit": "Recarregar",
                        "rib": "Ver RIB"
                    }
                },
                "rib_modal": {
                    "title": "Identidade Bancária (RIB)",
                    "subtitle": "Detalhes da sua conta para receber transferências.",
                    "copy_toast": "{{label}} copiado!",
                    "close": "Fechar",
                    "labels": {
                        "holder": "Titular",
                        "iban": "IBAN",
                        "bic": "BIC / SWIFT",
                        "bank": "Banco",
                        "type": "Tipo de conta"
                    }
                },
                "request_modal": {
                    "title": "Abrir uma nova conta",
                    "subtitle": "Solicite a abertura de um novo tipo de conta.",
                    "button": "Nova conta",
                    "type_label": "Escolha o tipo de conta",
                    "message_label": "Informações complementares (opcional)",
                    "placeholder": "Descreva brevemente a sua necessidade...",
                    "cancel": "Cancelar",
                    "confirm": "Enviar pedido",
                    "success": "Pedido de abertura enviado!",
                    "error": "Erro ao enviar o pedido."
                }
            },
            "transactions": {
                "title": "Últimas Transações",
                "empty": "Nenhuma transação recente.",
                "deposit": "Depósito",
                "transfer": "Transferência",
                "by_card": "por cartão",
                "by_transfer": "por transferência"
            },
            "actions": {
                "title": "Ações Rápidas",
                "transfer": "Transferir",
                "credit": "Créditos",
                "deposit": "Recarregar",
                "cards": "Cartões"
            },
            "transfers": {
                "title": "Área de Transferências",
                "subtitle": "Gira as suas transferências com facilidade.",
                "tabs": {
                    "internal": "Minhas Contas",
                    "internal_desc": "Transferência interna",
                    "invik": "Transferência INVIK",
                    "invik_desc": "Instantânea e Gratuita",
                    "sepa": "Transferência SEPA",
                    "sepa_desc": "Para outro banco",
                    "history": "Acompanhamento"
                },
                "steps": {
                    "accounts": "Contas",
                    "amount": "Montante",
                    "validation": "Validação"
                },
                "account_selection": {
                    "source": "De qual conta?",
                    "dest": "Para qual beneficiário?"
                },
                "warnings": {
                    "single_account_title": "Transferência interna impossível",
                    "single_account_desc": "Você possui apenas uma conta."
                },
                "invik_network": {
                    "title": "REDE INVIK INSTANTÂNEA",
                    "desc": "Transfira fundos em milissegundos para qualquer cliente INVIK BANK, sem custos."
                },
                "beneficiary_type": {
                    "saved": "Cliente Registrado",
                    "new": "Novo Beneficiário"
                },
                "inputs": {
                    "select_invik": "Selecione um cliente INVIK",
                    "select_beneficiary": "Selecione um beneficiário",
                    "name": "Nome Completo",
                    "name_placeholder": "Ex: João Silva",
                    "iban": "IBAN",
                    "iban_placeholder": "PT... ou FR...",
                    "bic": "BIC (opcional)",
                    "bic_placeholder": "Ex: ABCDFRPP",
                    "email": "Email do beneficiário (opcional)",
                    "email_placeholder": "Para notificação imediata",
                    "save_invik": "Guardar este beneficiário INVIK",
                    "save_beneficiary": "Guardar este beneficiário para futuras transferências"
                },
                "amount": {
                    "title": "Quanto gostaria de transferir?",
                    "available": "Saldo disponível:",
                    "insufficient_funds": "Aviso: O montante excede o saldo disponível.",
                    "limit_exceeded": "Limite máximo autorizado: 50.000 € por transferência"
                },
                "review": {
                    "title": "Verificar detalhes",
                    "from": "De",
                    "to": "Para",
                    "total": "Total",
                    "certified": "Transferência Instantânea Certificada",
                    "certified_desc": "Execução imediata através da rede segura INVIK BANK."
                },
                "success": {
                    "title": "TRANSFERÊNCIA CONCLUÍDA",
                    "review_title": "INFORMAÇÕES CRÍTICAS",
                    "new_button": "Fazer outra transferência"
                },
                "history": {
                    "title": "Histórico de transferências recentes",
                    "empty": "Nenhuma transferência recente."
                },
                "buttons": {
                    "next": "Seguinte",
                    "back": "Voltar",
                    "confirm": "Confirmar",
                    "edit": "Editar"
                },
                "errors": {
                    "invalid_amount": "Por favor, insira um montante válido",
                    "insufficient_balance": "Saldo insuficiente para esta operação",
                    "limit_exceeded": "O montante máximo por transferência é de 50.000 €",
                    "check_beneficiary": "Verifique as informações do beneficiário",
                    "not_invik_iban": "Este IBAN não pertence à rede INVIK. Use o separador 'Transferência SEPA'.",
                    "invalid_iban": "Formato de IBAN inválido."
                },
                "success_messages": {
                    "internal": "Transferência interna realizada com sucesso!",
                    "instant": "Transferência instantânea para {{name}} realizada com sucesso!",
                    "pending": "Transferência pendente de verificação de segurança. Prazo SEPA: 24h a 48h."
                },
                "form": {
                    "step_source": "1. Conta de origem",
                    "step_dest": "2. Conta de destino",
                    "step_dest_invik": "2. Destinatário INVIK",
                    "step_dest_beneficiary": "2. Beneficiário",
                    "step_amount": "Montante a transferir",
                    "sending": "A enviar..."
                }
            },
            "cards": {
                "title": "Meus Cartões",
                "subtitle": "Gira os seus cartões físicos e virtuais.",
                "empty": {
                    "title": "Nenhum cartão ativo",
                    "desc": "Ainda não tem nenhum cartão associado à sua conta.",
                    "button": "Pedir um cartão"
                },
                "list_title": "Os seus Cartões Ativos ({{count}})",
                "actions": {
                    "show_number": "Ver número",
                    "hide_number": "Ocultar",
                    "flip": "Girar",
                    "block": "Bloquear",
                    "unblock": "Desbloquear",
                    "disabled": "Desativado",
                    "activate": "Ativar",
                    "options": "Opções",
                    "delete": "Eliminar"
                },
                "details": {
                    "status": "Estado:",
                    "type": "Tipo:",
                    "limit": "Limite:",
                    "updated": "Atualizado:",
                    "holder": "TITULAR",
                    "expiry": "VALIDADE",
                    "cvv": "CVV",
                    "support": "Suporte",
                    "title": "Detalhes do cartão",
                    "virtual_uppercase": "CARTÃO VIRTUAL",
                    "physical_uppercase": "CARTÃO FÍSICO",
                    "property_notice": "Este cartão é propriedade do INVIK BANK SA.",
                    "active": "Ativo",
                    "inactive": "Desativado",
                    "blocked": "Bloqueado",
                    "virtual": "Virtual",
                    "physical": "Físico"
                },
                "physical_order": {
                    "title": "Cartão Físico",
                    "mobile_title": "Pedir cartão físico",
                    "desc": "Receba o seu cartão exclusivo INVIK em sua casa no prazo de 3 a 5 dias úteis.",
                    "features": {
                        "withdrawals": "Levantamentos gratuitos em qualquer lugar",
                        "contactless": "Pagamento contactless",
                        "design": "Design Preto Mate Premium"
                    },
                    "button": {
                        "order": "Pedir agora",
                        "processing": "Pedido em curso",
                        "shipped": "Cartão enviado",
                        "delivered": "Cartão recebido ✅",
                        "cancel": "Cancelar pedido"
                    },
                    "status": {
                        "pending": "Estamos a processar o seu pedido",
                        "delivered": "Parabéns! O seu cartão chegou. Desfrute das suas novas vantagens! 🎁✨",
                        "shipped": "O seu cartão está a caminho! 🚀 Chegará em 3 a 5 dias.",
                        "rejected": "Último pedido rejeitado:",
                        "free": "Gratuito • Incluído na sua oferta"
                    }
                },
                "virtual_promo": {
                    "title": "Precisa de um cartão virtual?",
                    "desc": "Crie um cartão instantaneamente para as suas compras online seguras.",
                    "button": "Criar cartão virtual"
                },
                "options_modal": {
                    "title": "Opções do cartão",
                    "alias_label": "NOME DO CARTÃO (ALIAS)",
                    "alias_placeholder": "Ex: Compras Amazon, Pessoal...",
                    "limit_label": "LIMITE MENSAL (€)",
                    "limit_help": "O limite predefinido é de 2.000 €.",
                    "save": "Guardar alterações"
                },
                "messages": {
                    "blocked": "O seu cartão foi bloqueado.",
                    "unblocked": "O seu cartão foi desbloqueado.",
                    "order_success": "O seu pedido de cartão físico foi enviado com sucesso!",
                    "order_error": "Ocorreu um erro ao pedir o cartão.",
                    "options_saved": "Definições do cartão atualizadas!",
                    "delete_confirm": "Deseja realmente eliminar permanentemente este cartão do seu espaço? Esta ação é irreversível.",
                    "delete_success": "Cartão eliminado com sucesso.",
                    "request_cancel_confirm": "Cancelar e eliminar este pedido de cartão?",
                    "request_cancelled": "Pedido cancelado."
                }
            },
            "history": {
                "title": "Histórico",
                "subtitle": "Consulte todas as suas transações passadas.",
                "empty": "Nenhuma transação encontrada.",
                "columns": {
                    "date": "Data",
                    "type": "Tipo",
                    "category": "Categoria",
                    "amount": "Montante",
                    "fees": "Taxas"
                },
                "types": {
                    "deposit": "Depósito",
                    "transfer_internal": "Transf. Interna para {{name}}",
                    "transfer_instant": "Transf. Instantânea para {{name}}",
                    "receive_instant": "Receção Instantânea",
                    "transfer_external": "Transf. Externa para {{name}}",
                    "operation": "Operação",
                    "internal_account": "Conta Interna",
                    "beneficiary": "Beneficiário"
                },
                "details": {
                    "iban_label": "IBAN: {{iban}}",
                    "ref": "Ref:",
                    "sender": "De {{name}}"
                }
            },
            "status": {
                "pending": "Pendente",
                "completed": "Concluído",
                "rejected": "Rejeitado",
                "in_review": "Em revisão"
            },
            "settings": {
                "title": "Ajustes da Conta",
                "subtitle": "Consulte e modifique o seu perfil bancario.",
                "tabs": {
                    "profile": "Perfil",
                    "security": "Segurança",
                    "prefs": "Ajustes",
                    "my_info": "Minhas Informações",
                    "security_access": "Segurança & Acesso",
                    "preferences": "Preferências"
                },
                "profile": {
                    "title": "Informações Pessoais",
                    "email_verified": "Email Verificado",
                    "email_contact": "EMAIL DE CONTACTO",
                    "first_name": "Nome",
                    "last_name": "Apelido",
                    "dob": "Data de nascimento",
                    "pob": "Naturalidade",
                    "phone": "Telefone",
                    "nationality": "Nacionalidade",
                    "address": "Morada",
                    "city": "Cidade",
                    "zip": "Código Postal",
                    "save_btn": "Guardar ajustes",
                    "update_btn": "Actualizar parâmetros"
                },
                "security": {
                    "title": "Segurança de Autenticação",
                    "password_title": "Segurança de Senha",
                    "password_desc": "Uma senha forte protege a sua conta bancária de acessos não autorizados.",
                    "new_password": "Nova senha",
                    "confirm_password": "Confirmar senha",
                    "update_pwd_btn": "Actualizar senha",
                    "update_access_btn": "Actualizar meus acessos",
                    "last_mod": "Última modificação",
                    "days_ago": "Há {{count}} dias",
                    "encrypted_storage": "Armazenamento Criptografado",
                    "protected_aes": "Protegido por AES-256",
                    "security_reqs": "Requisitos de segurança",
                    "tip_8_chars": "Pelo menos 8 caracteres",
                    "tip_caps": "Uma letra maiúscula",
                    "tip_numbers": "Um número",
                    "tip_special": "Um carácter especial (!@#$)",
                    "strength": {
                        "label": "Força:",
                        "weak": "Fraca",
                        "medium": "Média",
                        "excellent": "Excelente"
                    }
                },
                "advisor": {
                    "title": "O MEU ASSESSOR FINANCEIRO",
                    "role": "Assessor Sénior de Gestão de Património",
                    "available": "Disponível agora",
                    "email_label": "EMAIL PROFISSIONAL",
                    "phone_label": "LINHA DIRETA"
                },
                "preferences": {
                    "title": "Preferências da Conta",
                    "lang_label": "Idioma da Interface",
                    "lang_desc": "Idioma utilizado para os menus e extractos."
                },
                "messages": {
                    "success": "Ajustes atualizados com sucesso.",
                    "error": "Ocorreu um erro.",
                    "pwd_success": "Senha atualizada com sucesso."
                }
            },
            "support": {
                "title": "Assistência & Suporte",
                "subtitle": "Consulte a ajuda online ou converse com um assessor.",
                "faq": {
                    "title": "FAQ & Ajuda rápida",
                    "q1": {
                        "q": "Transferências não recebidas",
                        "a": "Uma transferência SEPA clássica demora geralmente 1 a 2 dias úteis. Se espera uma transferência internacional, pode demorar até 5 dias. Verifique se o IBAN fornecido está correto."
                    },
                    "q2": {
                        "q": "Limites do cartão",
                        "a": "Pode consultar os seus limites atuais na secção 'Cartões'. Para um aumento temporário ou permanente, contacte o seu assessor através de um ticket de suporte."
                    },
                    "q3": {
                        "q": "Segurar a minha conta",
                        "a": "Ative sempre a autenticação de dois fatores (2FA). Nunca partilhe os códigos recebidos por SMS. Em caso de dúvida sobre uma transação, bloqueie imediatamente o seu cartão através da aplicação."
                    },
                    "q4": {
                        "q": "Taxas bancárias",
                        "a": "As nossas tarifas são transparentes. A conta padrão é gratuita. As taxas de manutenção de conta para as contas premium são cobradas mensalmente. Consulte a nossa tabela de tarifas em 'Documentos'."
                    },
                    "q5": {
                        "q": "Senha esquecida",
                        "a": "Clique em 'Esqueceu a senha?' na página de login. Um link de redefinição será enviado por e-mail instantaneamente."
                    }
                },
                "tickets": {
                    "title": "Meus pedidos",
                    "new_btn": "Novo ticket",
                    "subject_placeholder": "Assunto",
                    "message_placeholder": "Detalhe o seu pedido para um processamento mais rápido...",
                    "create_btn": "Criar ticket",
                    "send_btn": "Enviar ticket",
                    "cancel_btn": "Cancelar",
                    "empty": "Não tem nenhum ticket de suporte ativo.",
                    "status": {
                        "open": "EM CURSO",
                        "resolved": "RESOLVIDO",
                        "closed": "Fechado"
                    },
                    "categories": {
                        "technical": "Problema técnico",
                        "billing": "Questão sobre taxas",
                        "cards": "Gestão de cartões",
                        "other": "Outro"
                    }
                },
                "chat": {
                    "reply_placeholder": "Responder...",
                    "input_placeholder": "Descreva o seu problema...",
                    "send": "Enviar"
                }
            },
            "beneficiaries": {
                "title": "Beneficiários",
                "subtitle": "Gira os seus destinatários de transferência.",
                "stats": {
                    "total": "{{count}} Beneficiários",
                    "invik": "{{count}} Instantâneos"
                },
                "empty": {
                    "title": "Nenhum beneficiário",
                    "subtitle": "Adicione o seu primeiro beneficiário para começar as suas transferências.",
                    "search_no_results": "Nenhum resultado para a sua pesquisa.",
                    "search_try_again": "Tente novamente com outro nome ou IBAN."
                },
                "card": {
                    "iban_prefix": "IBAN",
                    "bic_prefix": "BIC",
                    "email_prefix": "Email",
                    "actions": {
                        "transfer": "Transferir",
                        "quick_transfer": "Transferência Rápida",
                        "delete": "Eliminar"
                    }
                },
                "form": {
                    "add_title": "Adicionar um Beneficiário",
                    "new_title": "Novo Beneficiario",
                    "name_label": "NOME COMPLETO",
                    "name_placeholder": "Ex: João Silva",
                    "iban_label": "IBAN",
                    "iban_placeholder": "PT...",
                    "bic_label": "BIC (OPCIONAL)",
                    "bic_placeholder": "Opcional",
                    "email_label": "EMAIL (OPZIONALE)",
                    "email_placeholder": "Opcional",
                    "submit": "Adicionar beneficiário",
                    "confirm_submit": "Confirmar adição",
                    "validation": {
                        "iban_invalid": "Formato de IBAN inválido",
                        "iban_valid": "IBAN válido"
                    }
                },
                "search_placeholder": "Procurar um beneficiário...",
                "toasts": {
                    "add_success": "Beneficiário adicionado com sucesso!",
                    "add_error": "Erro ao adicionar o beneficiário.",
                    "delete_success": "Beneficiario eliminado.",
                    "delete_error": "Erro ao eliminar o beneficiário."
                },
                "confirm_delete": "Tem a certeza que deseja eliminar este beneficiário?"
            },
            "credits": {
                "title": "Créditos e Financiamentos",
                "subtitle": "Simule o seu projeto e obtenha uma resposta em 24 horas",
                "form": {
                    "simulator_title": "Simulador",
                    "your_simulation": "A sua simulação",
                    "project_type": "Tipo de projeto",
                    "project_description": "Descrição do projeto (Obrigatório)",
                    "project_description_placeholder": "Detalhe o seu projeto em algumas linhas...",
                    "specific_project": "O seu projeto específico",
                    "specific_project_placeholder": "Descreva brevemente o seu projeto...",
                    "amount": "Montante do empréstimo",
                    "months": "Duração do reembolso",
                    "interest_rate": "Taxa de juro (TAEG)",
                    "monthly_payment": "Mensalidade",
                    "monthly_payment_est": "estimada",
                    "apply_button": "Pedir este empréstimo",
                    "apply_button_official": "Fazer um pedido oficial",
                    "processing": "Processando...",
                    "sending": "Enviando...",
                    "years": "anos",
                    "months_label": "meses"
                },
                "types": {
                    "personnel": "Empréstimo Pessoal",
                    "immobilier": "Crédito Imobiliário",
                    "vehicule": "Crédito Veículo",
                    "professionnel": "Projeto Profissional",
                    "autre": "Outro (Especificar...)"
                },
                "status": {
                    "pending": "Em análise",
                    "approved": "Aprovado ",
                    "rejected": "Rejeitado",
                    "dossier_title": "Processo em análise",
                    "dossier_desc": "Estamos atualmente a analisar o seu pedido de {{amount}} €.",
                    "dossier_notice": "Será informado do progresso em tempo real por email. Para qualquer modificação, contacte o suporte."
                },
                "history": {
                    "title": "Os meus pedidos",
                    "tracking": "Acompanhamento de pedidos",
                    "empty": "Nenhum pedido em curso.",
                    "empty_desktop": "Os seus pedidos de crédito aparecerão aqui."
                },
                "messages": {
                    "already_pending": "Já tem um pedido em curso.",
                    "description_short": "Por favor, descreva o seu projeto (mín. 10 caracteres).",
                    "success": "Pedido enviado! Um consultor entrará em contacto.",
                    "error": "Ocorreu um erro durante o pedido.",
                    "confirm_title": "Confirmar o seu pedido",
                    "confirm_button": "Confirmar e Enviar",
                    "credit_opened": "A sua Conta de Crédito foi aberta e os fundos depositados.",
                    "credit_available_title": "Crédito Aprovado ",
                    "credit_available_desc": "O seu pedido de crédito de {{amount}} € foi aprovado. Os fundos estão disponíveis.",
                    "congrats": "Parabéns! O seu crédito de {{amount}} € está disponível."
                },
                "support": {
                    "contact_btn": "Contactar o suporte",
                    "need_help": "Precisa de assistência?",
                    "advisors_desc": "Os nossos consultores estão disponíveis para analisar o seu processo complexo.",
                    "contact_advisor": "Contactar um consultor",
                    "fonds_avail": "Fundos disponíveis no seu espaço",
                    "access_btn": "Aceder ao meu Crédito"
                }
            },
            "deposit": {
                "title": "Recarregar",
                "subtitle": "Alimente a sua conta de forma segura.",
                "methods": {
                    "card": {
                        "title": "Cartão Bancário",
                        "desc": "Crédito imediato"
                    },
                    "bank": {
                        "title": "Transferência SEPA",
                        "desc": "2-3 dias úteis"
                    }
                },
                "form": {
                    "amount_label": "Montante a creditar",
                    "amount_placeholder": "0.00",
                    "card_number": "Número do cartão",
                    "holder_label": "TITULAR",
                    "holder_placeholder": "NOME APELIDO",
                    "expiry_label": "VAL",
                    "cvc_label": "CVC / CVV",
                    "target_account": "Conta de destino",
                    "account_types": {
                        "main": "Conta Principal",
                        "savings": "Conta Poupança"
                    },
                    "submit_card": "Recarregar {{amount}} €",
                    "enter_amount": "Insira um montante",
                    "invalid_card": "Número de cartão inválido",
                    "invalid_expiry": "Data de validade inválida",
                    "invalid_cvc": "CVC inválido",
                    "pay": "Pagar {{amount}} EUR",
                    "secure_notice": "Transação segura SSL"
                },
                "bank_details": {
                    "title": "Transferência Bancaria",
                    "desc": "Use os detalhes abaixo para realizar a sua transferência do seu outro banco.",
                    "beneficiary": "Beneficiário",
                    "bank_name": "Banco",
                    "bic": "BIC / SWIFT",
                    "iban": "IBAN",
                    "processing_delay": "O tempo de processamento é de 24 a 48 horas úteis.",
                    "copy_toast": "{{label}} copiado para a área de transferência!",
                    "header": "Detalhes da transferência"
                },
                "history": {
                    "title": "As suas recargas recentes",
                    "empty": "Nenhum depósito recente.",
                    "methods": {
                        "card": "Cartão",
                        "transfer": "Transferência"
                    }
                },
                "messages": {
                    "check_card": "Por favor, verifique as informações do seu cartão.",
                    "success": "O seu pedido de recarga está a ser processado. O seu saldo será atualizado em breve.",
                    "pending_alert": "Um depósito está atualmente a ser processado na sua conta."
                },
                "pagination": {
                    "page": "Página {{current}} de {{total}}"
                }
            },
            "documents": {
                "title": "Meus Documentos",
                "subtitle": "Descarregue os seus comprovativos de identidade bancária e certificados oficiais.",
                "sections": {
                    "rib": "Comprovativos de Identidade Bancária (RIB)",
                    "contracts": "Certificados & Contratos"
                },
                "rib": {
                    "title": "RIB - {{name}}",
                    "holder": "Titular da conta",
                    "bank": "ESTABELECIMENTO BANCÁRIO",
                    "bank_code": "Código do Banco",
                    "branch_code": "Código da Agência",
                    "account_number": "Número da conta",
                    "key": "Chave RIB",
                    "iban": "IBAN",
                    "bic": "BIC (SWIFT)",
                    "download_pdf": "Descarregar PDF",
                    "print": "Imprimir",
                    "share_msg": "Aqui estão os meus dados bancários para a conta {{name}} (IBAN: {{iban}})",
                    "not_defined": "Não definido"
                },
                "contract": {
                    "title": "Contrato de Abertura",
                    "client_contract": "Contrato de Cliente",
                    "signed_on": "Assinado em {{date}}",
                    "download": "DESCARREGAR PDF",
                    "pdf_title": "CONTRATO DE ABERTURA DE CONTA PESSOAL",
                    "parties": "ENTRE OS ABAIXO ASSINADOS:",
                    "bank_party": "1. O estabelecimento bancário INVIK S.A., doravante designado 'O Banco'.",
                    "client_party": "2. Sr./Sra. {{name}}, doravante designado 'O Cliente'.",
                    "residing_at": "Residente em: {{address}}, {{zip}} {{city}}",
                    "object_title": "OBJETO DO CONTRATO",
                    "object_text": "O objetivo deste contrato é definir as condições gerais e especiais para a abertura e funcionamento das contas abertas em nome do Cliente nos livros do INVIK S.A.",
                    "terms_title": "CONDIÇÕES DE UTILIZAÇÃO",
                    "terms_1": "- O Cliente tem acesso permanente às suas contas através da interface digital segura.",
                    "terms_2": "- O Banco compromete-se a garantir a segurança dos fundos e a confidencialità dos dados em conformidade com o RGPD.",
                    "terms_3": "- O Cliente é responsável por manter a confidencialidade dos seus acessos bancários.",
                    "terms_4": "- As operações de transferência e pagamento estão sujeitas aos limites definidos nas condições tarifárias.",
                    "duration_title": "DURAÇÃO E RESCISÃO",
                    "duration_text": "Este contrato é celebrado por tempo indeterminado. Cada parte pode rescindi-lo a qualquer momento, mediante pré-aviso de 30 dias, em conformidade com os regulamentos aplicáveis.",
                    "signatures_title": "ASSINATURAS",
                    "made_at": "Feito no Luxemburgo, em {{date}}",
                    "client_sig": "Assinatura do Cliente",
                    "certified_sig": "(Assinatura digital certificada)",
                    "bank_sig": "Pelo INVIK S.A."
                },
                "branding": {
                    "tagline": "Banco Digital Premium",
                    "legal_1": "Este documento é um ato oficial gerado pelos serviços digitais do INVIK S.A.",
                    "legal_2": "INVIK S.A. - Direito luxemburguês S.A. - RCS Luxemburgo B 138.554 - Capital 31.000.000 EUR",
                    "legal_3": "Sede social: 51, Boulevard Grande-Duchesse Charlotte, L-1331 Luxemburgo"
                },
                "messages": {
                    "rib_success": "RIB gerado com sucesso!",
                    "rib_error": "Erro durante a geração do RIB",
                    "contract_success": "Contrato gerado com sucesso!",
                    "contract_error": "Erro durante a geração do contrato",
                    "iban_copied": "IBAN copiado para a área de transferência!",
                    "empty": "Nenhum documento disponível.",
                    "available": "Disp."
                }
            }
        },
        "de": {
            "common": {
                "client": "Kunde",
                "loading": "Wird geladen...",
                "error": "Es ist ein Fehler aufgetreten"
            },
            "welcome": "Willkommen bei der INVIK BANK",
            "loading": "Ihr persönlicher Bereich wird vorbereitet...",
            "header": {
                "search_placeholder": "Transaktion suchen...",
                "profile_title": "Kontoeinstellungen"
            },
            "sidebar": {
                "nav": {
                    "dashboard": "Dashboard",
                    "accounts": "Meine Konten",
                    "transfers": "Überweisungen",
                    "beneficiaries": "Empfänger",
                    "deposit": "Aufladen",
                    "cards": "Karten",
                    "credits": "Kredite",
                    "history": "Verlauf",
                    "documents": "Dokumente",
                    "support": "Support",
                    "settings": "Einstellungen"
                },
                "user": {
                    "account_type": "{{type}}-Konto"
                },
                "logout": "Abmelden"
            },
            "notifications": {
                "title": "Benachrichtigungen",
                "mark_all_read": "Alle als gelesen markieren",
                "empty": "Keine Benachrichtigungen",
                "close": "Schließen"
            },
            "kyc": {
                "title": "Identitätsprüfung (KYC)",
                "subtitle": "Um Ihr Konto zu sichern, senden Sie uns bitte einen Identitätsnachweis und die erforderlichen zusätzlichen Dokumente.",
                "status": {
                    "submitted": "Ihre Dokumente werden bereits geprüft.",
                    "verified": "Ihr Konto ist bereits verifiziert.",
                    "action_required": "Aktion erforderlich:",
                    "rejection_msg": "Einige Dokumente müssen erneut eingereicht werden."
                },
                "sections": {
                    "required": "(PFLICHTFELD)",
                    "identity": "1. Identitätsnachweis",
                    "identity_sub": "Wählen Sie ein erstes gültiges Dokument (Personalausweis, Reisepass usw.)",
                    "biometric": "2. Biometrische Verifizierung",
                    "biometric_sub": "Aktuelle Fotos zur Bestätigung Ihrer Identität.",
                    "address": "3. Adressnachweis",
                    "address_sub": "Offizielles Dokument, das nicht älter als 3 Monate ist.",
                    "income": "4. Einkommensnachweis",
                    "income_sub": "Je nach Ihrer Situation (Angestellter, Rentner usw.).",
                    "bank": "5. Banknachweis",
                    "bank_sub": "Kontoidentitätsnachweis (RIB / IBAN).",
                    "bank_notice": "Der RIB muss zwingend auf den Namen des Antragstellers lauten (Alleininhaber)."
                },
                "labels": {
                    "type_doc": "Dokumenttyp",
                    "select_type": "Dokumenttyp auswählen",
                    "front": "Vorderseite / Hauptseite",
                    "back": "Rückseite (falls zutreffend)",
                    "load_front": "Vorderseite laden",
                    "load_back": "Rückseite laden",
                    "load_doc": "Dokument laden",
                    "selfie": "Einfaches Selfie",
                    "selfie_hint": "Ohne Filter oder Brille",
                    "face_clear": "Klares Gesicht",
                    "selfie_id": "Selfie mit Dokument",
                    "selfie_id_hint": "Muss lesbar sein",
                    "hold_id": "Halten Sie Ihren Ausweis",
                    "example": "Beispiel ansehen",
                    "loaded": "Dokument geladen",
                    "example_ref": "Referenz für konformen Versand",
                    "back_btn": "Zurück",
                    "submit_btn": "Meine vollständigen Unterlagen einreichen",
                    "sending": "Sicherer Versand...",
                    "securing_sending": "Sichern und Senden..."
                },
                "types": {
                    "id": {
                        "cni": "Nationaler Identitätsnachweis (Personalausweis)",
                        "passport": "Reisepass",
                        "driver": "Führerschein",
                        "residence": "Aufenthaltstitel"
                    },
                    "address": {
                        "utility": "Strom- / Gas- / Wasserrechnung",
                        "telecom": "Internet- / Festnetzrechnung",
                        "tax": "Steuerbescheid",
                        "insurance": "Hausratversicherungsbescheinigung",
                        "rent": "Mietquittung",
                        "hosting": "Wohnsitzbestätigung + ID des Gastgebers"
                    },
                    "income": {
                        "payslip": "Letzte 3 Lohnabrechnungen",
                        "contract": "Arbeitsvertrag",
                        "tax": "Letzter Steuerbescheid",
                        "kbis": "Gewerbeanmeldung (Unternehmer)",
                        "pension": "Rentennachweis (Rentner)",
                        "unemployment": "Bescheinigung der Arbeitsagentur",
                        "statement": "Aktueller Kontoauszug"
                    }
                },
                "messages": {
                    "file_too_large": "Die Datei ist zu groß (max. 5 MB)",
                    "upload_error": "Fehler beim Hochladen",
                    "select_id_type": "Bitte wählen Sie eine Ausweisart aus.",
                    "missing_files": "Bitte reichen Sie alle erforderlichen Nachweise ein.",
                    "success": "Vollständige KYC-Unterlagen erfolgreich eingereicht!",
                    "error": "Beim Senden ist ein Fehler aufgetreten: "
                },
                "legal": "Die bereitgestellten Dokumente werden ausschließlich zur Identitätsprüfung (KYC), zur Betrugsprävention und zur Einhaltung gesetzlicher Vorschriften verwendet. Sie werden gemäß der DSGVO sicher und vertraulich verarbeitet."
            },
            "banner": {
                "loading": "Verifizierung wird geladen...",
                "toasts": {
                    "verified": "Ihre Identität ist verifiziert. Sie haben Zugriff auf alle Funktionen.",
                    "submitted": "Ihre Dokumente werden analysiert. Sie werden benachrichtigt, sobald die Verifizierung abgeschlossen ist."
                },
                "status": {
                    "verified": "Verifiziertes Konto",
                    "submitted": "In Bearbeitung...",
                    "rejected": "Abgelehnt (Details)",
                    "verify_now": "Identität verifizieren",
                    "click_to_verify": "Zum Verifizieren klicken"
                },
                "blocking": {
                    "refused": "Validierung abgelehnt",
                    "in_progress": "Verifizierung läuft",
                    "required": "Verifizierung erforderlich",
                    "motif": "Grund:",
                    "not_compliant": "Einige Dokumente entsprechen nicht den Anforderungen. Bitte reichen Sie diese erneut ein.",
                    "analyzing": "Wir analysieren Ihre Dokumente. Dieses Verfahren dauert in der Regel weniger als 24 Stunden.",
                    "restricted": "Aus Sicherheits- und Compliance-Gründen ist der Zugriff auf diese Funktion eingeschränkt. Bitte schließen Sie Ihre Identitätsprüfung ab, um Ihr Konto freizuschalten.",
                    "waiting": "Warten auf Validierung",
                    "start": "Verifizierung starten",
                    "secure": "Verschlüsselte & sichere Daten"
                }
            },
            "accounts": {
                "title": "Meine Konten",
                "subtitle": "Übersicht über Ihre finanzielle Situation.",
                "total_balance": "Gesamtguthaben",
                "main": "Girokonto",
                "savings": "Sparkonto",
                "credit": "Kreditkonto",
                "hidden_iban": "IBAN ausgeblendet (Verifizierung erforderlich)",
                "rate": "Jahreszins: 3,50%",
                "repayment": "Nächste Rate in Bearbeitung",
                "no_debt": "Keine aufgelaufenen Schulden",
                "card": {
                    "main": "Girokonto",
                    "savings": "Sparkonto",
                    "credit": "Kreditkonto",
                    "currency": "Währungskonto",
                    "other": "Anderes Konto",
                    "actions": {
                        "transfer": "Überweisen",
                        "deposit": "Aufladen",
                        "rib": "RIB anzeigen"
                    }
                },
                "rib_modal": {
                    "title": "Bankverbindung (RIB)",
                    "subtitle": "Kontodaten für den Empfang von Überweisungen.",
                    "copy_toast": "{{label}} kopiert!",
                    "close": "Schließen",
                    "labels": {
                        "holder": "Inhaber",
                        "iban": "IBAN",
                        "bic": "BIC / SWIFT",
                        "bank": "Bank",
                        "type": "Kontotyp"
                    }
                },
                "request_modal": {
                    "title": "Neues Konto eröffnen",
                    "subtitle": "Beantragen Sie die Eröffnung eines neuen Kontotyps.",
                    "button": "Neues Konto",
                    "type_label": "Kontotyp wählen",
                    "message_label": "Zusätzliche Informationen (optional)",
                    "placeholder": "Beschreiben Sie kurz Ihr Anliegen...",
                    "cancel": "Abbrechen",
                    "confirm": "Antrag senden",
                    "success": "Eröffnungsantrag gesendet!",
                    "error": "Fehler beim Senden des Antrags."
                }
            },
            "transactions": {
                "title": "Letzte Transaktionen",
                "empty": "Keine letzten Transaktionen.",
                "review": "In Prüfung",
                "deposit": "Einzahlung",
                "transfer": "Überweisung",
                "by_card": "per Karte",
                "by_transfer": "per Überweisung"
            },
            "actions": {
                "title": "Schnellaktionen",
                "transfer": "Überweisen",
                "credit": "Kredite",
                "deposit": "Aufladen",
                "cards": "Karten"
            },
            "transfers": {
                "title": "Überweisungen",
                "subtitle": "Geld sofort im INVIK-Netzwerk oder per SEPA senden.",
                "tabs": {
                    "internal": "Eigene Konten",
                    "internal_desc": "Sofortige Überweisung zwischen Ihren Konten",
                    "invik": "INVIK-Mitglied",
                    "invik_desc": "Sofort & Kostenlos",
                    "sepa": "SEPA-Überweisung",
                    "sepa_desc": "An eine andere Bank",
                    "history": "Verlauf"
                },
                "steps": {
                    "accounts": "Konten",
                    "amount": "Betrag",
                    "validation": "Bestätigung"
                },
                "warnings": {
                    "security": "Sicherheit aktiviert",
                    "instant": "INVIK-Überweisungen werden rund um die Uhr in Echtzeit verarbeitet.",
                    "sepa_delay": "SEPA-Überweisungen können 24 bis 48 Werktage dauern.",
                    "single_account_title": "Zweitkonto erforderlich",
                    "single_account_desc": "Sie benötigen mindestens zwei Konten, um interne Überweisungen vorzunehmen."
                },
                "invik_network": {
                    "title": "INVIK-Netzwerk",
                    "desc": "Kostenlose und sofortige Überweisung zwischen Mitgliedern"
                },
                "account_selection": {
                    "source": "Von Konto",
                    "dest": "An Konto"
                },
                "beneficiary_type": {
                    "select": "Empfängertyp",
                    "internal": "Eigene Konten",
                    "external": "Extern (SEPA)",
                    "invik": "INVIK-Mitglied",
                    "saved": "Gespeicherter Empfänger",
                    "new": "Neuer Empfänger"
                },
                "inputs": {
                    "select_invik": "INVIK-Empfänger auswählen",
                    "select_beneficiary": "Empfänger auswählen",
                    "name": "Vollständiger Name",
                    "name_placeholder": "Z.B. Max Mustermann",
                    "iban": "IBAN",
                    "iban_placeholder": "DE... oder FR...",
                    "bic": "BIC (Optional)",
                    "bic_placeholder": "Z.B. ABCDFRPP",
                    "email": "E-Mail (Optional)",
                    "email_placeholder": "Für sofortige Benachrichtigung",
                    "save_invik": "Diesen Empfänger speichern",
                    "save_beneficiary": "Empfänger für zukünftige Überweisungen speichern"
                },
                "amount": {
                    "title": "Überweisungsbetrag",
                    "available": "Verfügbares Guthaben:",
                    "insufficient_funds": "Unzureichendes Guthaben.",
                    "limit_exceeded": "Limit überschritten (Max. 50.000 €)"
                },
                "review": {
                    "title": "Überprüfung",
                    "from": "Von",
                    "to": "An",
                    "total": "Gesamtbetrag",
                    "certified": "Zertifizierte Überweisung",
                    "certified_desc": "Ausführung über das sichere INVIK-Netzwerk."
                },
                "success": {
                    "title": "ÜBERWEISUNG ERFOLGREICH",
                    "review_title": "ZUSAMMENFASSUNG",
                    "new_button": "Neue Überweisung"
                },
                "history": {
                    "title": "Letzte Überweisungen",
                    "empty": "Keine Transaktionen."
                },
                "buttons": {
                    "next": "Weiter",
                    "back": "Zurück",
                    "confirm": "Bestätigen",
                    "edit": "Ändern"
                },
                "errors": {
                    "invalid_amount": "Ungültiger Betrag",
                    "insufficient_balance": "Guthaben nicht ausreichend",
                    "limit_exceeded": "Max. 50.000 € pro Überweisung",
                    "check_beneficiary": "Empfängerdaten prüfen",
                    "not_invik_iban": "Keine INVIK-IBAN. Bitte SEPA verwenden.",
                    "invalid_iban": "IBAN-Format ungültig"
                },
                "success_messages": {
                    "internal": "Interne Überweisung erfolgreich!",
                    "instant": "Sofortüberweisung an {{name}} erfolgreich!",
                    "pending": "Überweisung wird geprüft. SEPA-Dauer: 24h-48h."
                },
                "mobile_title": "Überweisung",
                "form": {
                    "step_source": "1. Quellkonto",
                    "step_dest": "2. Zielkonto",
                    "step_dest_invik": "2. INVIK-Empfänger",
                    "step_dest_beneficiary": "2. Empfänger",
                    "step_amount": "Betrag",
                    "sending": "Wird gesendet..."
                },
                "pagination": {
                    "page": "Seite {{current}} von {{total}}"
                }
            },
            "cards": {
                "title": "Meine Karten",
                "subtitle": "Verwalten Sie Ihre physischen und virtuellen Karten.",
                "empty": {
                    "title": "Keine aktive Karte",
                    "desc": "Sie haben noch keine Karte mit Ihrem Konto verknüpft.",
                    "button": "Karte bestellen"
                },
                "list_title": "Ihre aktiven Karten ({{count}})",
                "actions": {
                    "show_number": "Nummer zeigen",
                    "hide_number": "Ausblenden",
                    "flip": "Drehen",
                    "block": "Sperren",
                    "unblock": "Entsperren",
                    "disabled": "Deaktiviert",
                    "activate": "Aktivieren",
                    "options": "Optionen",
                    "delete": "Löschen"
                },
                "details": {
                    "status": "Status:",
                    "type": "Typ:",
                    "limit": "Limit:",
                    "updated": "Aktualisiert:",
                    "holder": "KARTENINHABER",
                    "expiry": "GÜLTIG BIS",
                    "cvv": "CVV",
                    "support": "Support",
                    "title": "Kartendetails",
                    "virtual_uppercase": "VIRTUELLE KARTE",
                    "physical_uppercase": "PHYSISCHE KARTE",
                    "property_notice": "Diese Karte ist Eigentum der INVIK BANK SA. Im Falle eines Verlusts sperren Sie diese bitte sofort über die App.",
                    "active": "Aktiv",
                    "inactive": "Deaktiviert",
                    "blocked": "Gesperrt",
                    "virtual": "Virtuell",
                    "physical": "Physisch",
                    "recently": "Vor kurzem"
                },
                "physical_order": {
                    "title": "Physische Karte",
                    "mobile_title": "Physische Karte bestellen",
                    "desc": "Erhalten Sie Ihre exklusive INVIK-Karte innerhalb von 3-5 Werktagen direkt zu Ihnen nach Hause.",
                    "default_address_label": "Mit dem Konto verknüpfte Adresse",
                    "features": {
                        "withdrawals": "Kostenlose Abhebungen überall",
                        "contactless": "Kontaktloses Bezahlen",
                        "design": "Premium Matt-Schwarz Design"
                    },
                    "button": {
                        "order_now": "Jetzt bestellen",
                        "processing": "Bestellung läuft",
                        "shipped": "Karte versendet",
                        "delivered": "Karte erhalten ✅",
                        "cancel": "Bestellung stornieren"
                    },
                    "status": {
                        "pending": "Wir bearbeiten Ihre Bestellung",
                        "delivered": "Glückwunsch! Ihre Karte ist da. Genießen Sie Ihre neuen Vorteile! 🎁✨",
                        "shipped": "Ihre Karte ist unterwegs! 🚀 Sie wird in 3-5 Tagen ankommen.",
                        "rejected": "Letzte Bestellung abgelehnt:",
                        "default_reject_reason": "Identitätsnachweis nicht konform.",
                        "free": "Kostenlos • In Ihrem Angebot enthalten"
                    }
                },
                "virtual_promo": {
                    "title": "Virtuelle Karte benötigt?",
                    "desc": "Erstellen Sie sofort eine Karte für Ihre sicheren Online-Einkäufe.",
                    "button": "Virtuelle Karte erstellen"
                },
                "options_modal": {
                    "title": "Kartenoptionen",
                    "alias_label": "KARTENNAME (ALIAS)",
                    "alias_placeholder": "Z.B. Amazon, Privat...",
                    "limit_label": "MONATLICHES LIMIT (€)",
                    "limit_help": "Das Standardlimit beträgt 2.000 €.",
                    "save": "Änderungen speichern"
                },
                "messages": {
                    "blocked": "Ihre Karte wurde gesperrt.",
                    "unblocked": "Ihre Karte wurde entsperrt.",
                    "order_success": "Ihre Kartenbestellung wurde erfolgreich gesendet!",
                    "order_error": "Fehler bei der Kartenbestellung.",
                    "options_saved": "Karteneinstellungen aktualisiert!",
                    "delete_confirm": "Möchten Sie diese Karte wirklich dauerhaft löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
                    "delete_success": "Karte erfolgreich gelöscht.",
                    "request_cancel_confirm": "Diese Kartenbestellung wirklich stornieren?",
                    "request_cancelled": "Bestellung storniert."
                }
            },
            "credits": {
                "title": "Kredite & Finanzierung",
                "subtitle": "Simulieren Sie Ihr Projekt und erhalten Sie eine Antwort innerhalb von 24 Stunden",
                "form": {
                    "simulator_title": "Simulator",
                    "your_simulation": "Ihre Simulation",
                    "project_type": "Projektart",
                    "project_description": "Projektbeschreibung (Pflichtfeld)",
                    "project_description_placeholder": "Beschreiben Sie Ihr Projekt kurz...",
                    "specific_project": "Ihr spezifisches Projekt",
                    "specific_project_placeholder": "Kurzbeschreibung Ihres Projekts...",
                    "amount": "Kreditbetrag",
                    "months": "Rückzahlungsdauer",
                    "interest_rate": "Zinssatz (eff. Jahreszins)",
                    "monthly_payment": "Monatliche Rate",
                    "monthly_payment_est": "geschätzt",
                    "apply_button": "Diesen Kredit beantragen",
                    "apply_button_official": "Offiziellen Antrag stellen",
                    "processing": "Wird bearbeitet...",
                    "sending": "Wird gesendet...",
                    "years": "Jahre",
                    "months_label": "Monate"
                },
                "types": {
                    "personnel": "Privatkredit",
                    "immobilier": "Immobilienkredit",
                    "vehicule": "Fahrzeugkredit",
                    "professionnel": "Geschäftliches Projekt",
                    "autre": "Sonstiges (Bitte angeben...)"
                },
                "status": {
                    "pending": "In Prüfung",
                    "approved": "Genehmigt ",
                    "rejected": "Abgelehnt",
                    "dossier_title": "Unterlagen in Prüfung",
                    "dossier_desc": "Wir prüfen derzeit Ihren Antrag über {{amount}} €.",
                    "dossier_notice": "Sie werden per E-Mail in Echtzeit über den Fortschritt informiert. Für Änderungen kontaktieren Sie bitte den Support."
                },
                "history": {
                    "title": "Meine Anträge",
                    "tracking": "Antragsverfolgung",
                    "empty": "Keine laufenden Anträge.",
                    "empty_desktop": "Ihre Kreditanträge werden hier angezeigt."
                },
                "messages": {
                    "already_pending": "Sie haben bereits einen laufenden Antrag.",
                    "description_short": "Bitte beschreiben Sie Ihr Projekt (mind. 10 Zeichen).",
                    "success": "Antrag gesendet! Ein Berater wird Sie kontaktieren.",
                    "error": "Fehler beim Antrag.",
                    "confirm_title": "Antrag bestätigen",
                    "confirm_button": "Bestätigen und Absenden",
                    "credit_opened": "Ihr Kreditkonto wurde eröffnet und die Mittel ausgezahlt.",
                    "credit_available_title": "Kredit genehmigt ",
                    "credit_available_desc": "Ihr Kreditantrag über {{amount}} € wurde genehmigt. Die Mittel sind verfügbar.",
                    "congrats": "Glückwunsch! Ihr Kredit über {{amount}} € ist verfügbar."
                },
                "support": {
                    "contact_btn": "Support kontaktieren",
                    "need_help": "Benötigen Sie Hilfe?",
                    "advisors_desc": "Unsere Berater stehen zur Verfügung, um Ihre komplexen Unterlagen zu prüfen.",
                    "contact_advisor": "Berater kontaktieren",
                    "fonds_avail": "Mittel in Ihrem Bereich verfügbar",
                    "access_btn": "Auf meinen Kredit zugreifen"
                }
            },
            "deposit": {
                "title": "Aufladen",
                "subtitle": "Füllen Sie Ihr Konto sicher auf.",
                "methods": {
                    "card": {
                        "title": "Bankkarte",
                        "desc": "Sofortige Gutschrift"
                    },
                    "bank": {
                        "title": "SEPA-Überweisung",
                        "desc": "2-3 Werktage",
                        "desc_full": "Verwenden Sie die untenstehenden Daten für Ihre Überweisung von einer anderen Bank."
                    }
                },
                "form": {
                    "amount_label": "Guthabenbetrag",
                    "amount_placeholder": "0.00",
                    "card_number": "Kartennummer",
                    "holder_label": "KARTENINHABER",
                    "holder_placeholder": "VORNAME NACHNAME",
                    "expiry_label": "GÜLT",
                    "cvc_label": "CVC / CVV",
                    "target_account": "Zielkonto",
                    "account_types": {
                        "main": "Girokonto",
                        "savings": "Sparkonto"
                    },
                    "submit_card": "{{amount}} € aufladen",
                    "enter_amount": "Betrag eingeben",
                    "invalid_card": "Ungültige Karte",
                    "invalid_expiry": "Ablaufdatum ungültig",
                    "invalid_cvc": "CVC ungültig",
                    "pay": "{{amount}} EUR bezahlen",
                    "secure_notice": "Sichere SSL-Transaktion"
                },
                "bank_details": {
                    "title": "Banküberweisung",
                    "desc": "Nutzen Sie diese Daten für Ihre Überweisung.",
                    "beneficiary": "Begünstigter",
                    "bank_name": "Bank",
                    "bic": "BIC / SWIFT",
                    "iban": "IBAN",
                    "processing_delay": "Bearbeitungszeit: 24 bis 48 Werktage.",
                    "copy_toast": "{{label}} kopiert!",
                    "header": "Überweisungsdetails"
                },
                "history": {
                    "title": "Letzte Aufladungen",
                    "empty": "Keine Einzahlungen.",
                    "methods": {
                        "card": "Karte",
                        "transfer": "Überweisung"
                    }
                },
                "messages": {
                    "check_card": "Prüfen Sie Ihre Karteninfos.",
                    "success": "Antrag in Bearbeitung. Guthaben wird in Kürze aktualisiert.",
                    "pending_alert": "Einzahlung wird derzeit bearbeitet."
                },
                "pagination": {
                    "page": "Seite {{current}} von {{total}}"
                }
            },
            "history": {
                "title": "Verlauf",
                "subtitle": "Alle Ihre bisherigen Transaktionen anzeigen.",
                "empty": "Keine Transaktionen gefunden.",
                "columns": {
                    "date": "Datum",
                    "type": "Typ",
                    "category": "Kategorie",
                    "amount": "Betrag",
                    "fees": "Gebühren"
                },
                "types": {
                    "deposit": "Einzahlung",
                    "transfer_internal": "Interne Überw. an {{name}}",
                    "transfer_instant": "Sofortüberw. an {{name}}",
                    "receive_instant": "Soforteingang",
                    "transfer_external": "Externe Überw. an {{name}}",
                    "operation": "Operation",
                    "internal_account": "Internes Konto",
                    "beneficiary": "Empfänger"
                },
                "details": {
                    "iban_label": "IBAN: {{iban}}",
                    "ref": "Ref:",
                    "sender": "Von {{name}}"
                }
            },
            "status": {
                "pending": "Ausstehend",
                "completed": "Abgeschlossen",
                "rejected": "Abgelehnt",
                "in_review": "In Prüfung"
            },
            "settings": {
                "title": "Kontoeinstellungen",
                "subtitle": "Anzeigen und Ändern Ihres Bankprofils.",
                "tabs": {
                    "profile": "Profil",
                    "security": "Sicherheit",
                    "prefs": "Einstellungen",
                    "my_info": "Meine Informationen",
                    "security_access": "Sicherheit & Zugriff",
                    "preferences": "Präferenzen"
                },
                "profile": {
                    "title": "Persönliche Informationen",
                    "email_verified": "Email verifiziert",
                    "email_contact": "KONTAKT-E-MAIL",
                    "first_name": "Vorname",
                    "last_name": "Nachname",
                    "dob": "Geburtsdatum",
                    "pob": "Geburtsort",
                    "phone": "Telefon",
                    "nationality": "Nationalität",
                    "address": "Adresse",
                    "city": "Stadt",
                    "zip": "Postleitzahl",
                    "save_btn": "Einstellungen speichern",
                    "update_btn": "Parameter aktualisieren"
                },
                "security": {
                    "title": "Authentifizierungssicherheit",
                    "password_title": "Passwortsicherheit",
                    "password_desc": "Ein starkes Passwort schützt Ihr Bankkonto vor unbefugtem Zugriff.",
                    "new_password": "Neues Passwort",
                    "confirm_password": "Passwort bestätigen",
                    "update_pwd_btn": "Passwort aktualisieren",
                    "update_access_btn": "Meine Zugriffe aktualisieren",
                    "last_mod": "Letzte Änderung",
                    "days_ago": "Vor {{count}} Tagen",
                    "encrypted_storage": "Verschlüsselte Speicherung",
                    "protected_aes": "Geschützt durch AES-256",
                    "security_reqs": "Sicherheitsanforderungen",
                    "tip_8_chars": "Mindestens 8 Zeichen",
                    "tip_caps": "Ein Großbuchstabe",
                    "tip_numbers": "Eine Zahl",
                    "tip_special": "Ein Sonderzeichen (!@#$)",
                    "strength": {
                        "label": "Stärke:",
                        "weak": "Schwach",
                        "medium": "Mittel",
                        "excellent": "Hervorragend"
                    }
                },
                "advisor": {
                    "title": "MEIN FINANZBERATER",
                    "role": "Senior Wealth Management Advisor",
                    "available": "Derzeit verfügbar",
                    "email_label": "BERUFLICHE E-MAIL",
                    "phone_label": "DIREKTWAHL"
                },
                "preferences": {
                    "title": "Kontopräferenzen",
                    "lang_label": "Oberflächensprache",
                    "lang_desc": "Sprache für Menüs und Auszüge."
                }
            },
            "support": {
                "title": "Hilfe & Support",
                "subtitle": "Online-Hilfe konsultieren oder mit einem Berater chatten.",
                "faq": {
                    "title": "FAQ & Schnelle Hilfe",
                    "q1": {
                        "q": "Überweisungen nicht erhalten",
                        "a": "Eine klassische SEPA-Überweisung dauert in der Regel 1 bis 2 Werktage. Wenn Sie auf eine internationale Überweisung warten, kann dies bis zu 5 Tage dauern. Überprüfen Sie, ob die angegebene IBAN korrekt ist."
                    },
                    "q2": {
                        "q": "Kartenlimits",
                        "a": "Sie können Ihre aktuellen Limits im Bereich 'Karten' einsehen. Für eine temporäre oder permanente Erhöhung kontaktieren Sie bitte Ihren Berater über ein Support-Ticket."
                    },
                    "q3": {
                        "q": "Mein Konto sichern",
                        "a": "Aktivieren Sie immer die Zwei-Faktor-Authentifizierung (2FA). Geben Sie niemals Ihre per SMS erhaltenen Codes weiter. Im Falle eines Zweifels an einer Transaktion sperren Sie Ihre Karte sofort über die App."
                    },
                    "q4": {
                        "q": "Bankgebühren",
                        "a": "Unsere Tarife sind transparent. Das Standardkonto ist kostenlos. Die Kontoführungsgebühren für Premium-Konten werden monatlich erhoben. Konsultieren Sie unsere Gebührentabelle unter 'Dokumente'."
                    },
                    "q5": {
                        "q": "Passwort vergessen",
                        "a": "Klicken Sie auf der Login-Seite auf 'Passwort vergessen?'. Ein Link zum Zurücksetzen wird Ihnen umgehend per E-Mail zugeschickt."
                    }
                },
                "tickets": {
                    "title": "Meine Anfragen",
                    "new_btn": "Neues Ticket",
                    "subject_placeholder": "Betreff",
                    "message_placeholder": "Bitte beschreiben Sie Ihr Anliegen für eine schnellere Bearbeitung...",
                    "create_btn": "Ticket erstellen",
                    "send_btn": "Ticket senden",
                    "cancel_btn": "Abbrechen",
                    "empty": "Sie haben keine aktiven Support-Tickets.",
                    "status": {
                        "open": "IN BEARBEITUNG",
                        "resolved": "GELÖST",
                        "closed": "Geschlossen"
                    },
                    "categories": {
                        "technical": "Technisches Problem",
                        "billing": "Frage zu Gebühren",
                        "cards": "Kartenverwaltung",
                        "other": "Sonstiges"
                    }
                },
                "chat": {
                    "reply_placeholder": "Antworten...",
                    "input_placeholder": "Beschreiben Sie Ihr Problem...",
                    "send": "Senden"
                }
            },
            "beneficiaries": {
                "title": "Empfänger",
                "subtitle": "Verwalten Sie Ihre Überweisungsempfänger.",
                "stats": {
                    "total": "{{count}} Empfänger",
                    "active": "Aktive Empfänger",
                    "invik": "{{count}} Sofort"
                },
                "search_placeholder": "Empfänger suchen...",
                "empty": {
                    "title": "Keine Empfänger",
                    "subtitle": "Fügen Sie Ihren ersten Empfänger hinzu.",
                    "search_no_results": "Keine Ergebnisse für Ihre Suche.",
                    "search_try_again": "Versuchen Sie es mit einem anderen Namen oder IBAN."
                },
                "form": {
                    "add_title": "Empfänger hinzufügen",
                    "new_title": "Neuer Empfänger",
                    "name_label": "VOLLSTÄNDIGER NAME",
                    "name_placeholder": "Z.B. Max Mustermann",
                    "iban_label": "IBAN",
                    "iban_placeholder": "DE ...",
                    "bic_label": "BIC (OPTIONAL)",
                    "bic_placeholder": "Optional",
                    "email_label": "E-MAIL (OPTIONAL)",
                    "email_placeholder": "Optional",
                    "confirm_submit": "Hinzufügen",
                    "validation": {
                        "iban_invalid": "IBAN-Format ungültig",
                        "iban_valid": "IBAN gültig"
                    }
                },
                "card": {
                    "actions": {
                        "transfer": "Überweisen"
                    }
                },
                "toasts": {
                    "add_success": "Empfänger erfolgreich hinzugefügt!",
                    "add_error": "Fehler beim Hinzufügen des Empfängers.",
                    "delete_success": "Empfänger gelöscht.",
                    "delete_error": "Fehler beim Löschen des Empfängers."
                },
                "confirm_delete": {
                    "title": "Empfänger löschen",
                    "message": "Möchten Sie diesen Empfänger wirklich löschen?",
                    "confirm": "Löschen",
                    "cancel": "Abbrechen"
                }
            },
            "documents": {
                "title": "Meine Dokumente",
                "subtitle": "Laden Sie Ihre Bankidentitätsnachweise und offiziellen Bescheinigungen herunter.",
                "sections": {
                    "rib": "Bankidentitätsnachweise (RIB)",
                    "contracts": "Bescheinigungen & Verträge"
                },
                "rib": {
                    "title": "RIB - {{name}}",
                    "holder": "Kontoinhaber",
                    "bank": "BANKINSTITUT",
                    "bank_code": "Bankleitzahl",
                    "branch_code": "Zweigstellen-Code",
                    "account_number": "Kontonummer",
                    "key": "RIB-Schlüssel",
                    "iban": "IBAN",
                    "bic": "BIC (SWIFT)",
                    "download_pdf": "PDF herunterladen",
                    "print": "Drucken",
                    "share_msg": "Hier sind meine Bankdaten für das Konto {{name}} (IBAN: {{iban}})",
                    "not_defined": "Nicht definiert"
                },
                "contract": {
                    "title": "Kontoeröffnungsvertrag",
                    "client_contract": "Kundenvertrag",
                    "signed_on": "Unterzeichnet am {{date}}",
                    "download": "PDF HERUNTERLADEN",
                    "pdf_title": "VERTRAG ZUR ERÖFFNUNG EINES PRIVATKONTOS",
                    "parties": "ZWISCHEN DEN UNTERZEICHNETEN:",
                    "bank_party": "1. Das Bankinstitut INVIK S.A., im Folgenden 'Die Bank' genannt.",
                    "client_party": "2. Herr/Frau {{name}}, im Folgenden 'Der Kunde' genannt.",
                    "residing_at": "Wohnhaft in: {{address}}, {{zip}} {{city}}",
                    "object_title": "GEGENSTAND DES VERTRAGS",
                    "object_text": "Gegenstand dieses Vertrags ist die Festlegung der allgemeinen und besonderen Bedingungen für die Eröffnung und Führung von Konten, die im Namen des Kunden in den Büchern von INVIK S.A. geführt werden.",
                    "terms_title": "NUTZUNGSBEDINGUNGEN",
                    "terms_1": "- Der Kunde hat permanenten Zugriff auf seine Konten über die gesicherte digitale Schnittstelle.",
                    "terms_2": "- Die Bank verpflichtet sich, die Sicherheit der Gelder und die Vertraulichkeit der Daten gemäß der DSGVO zu gewährleisten.",
                    "terms_3": "- Der Kunde ist für die Geheimhaltung seiner Bankzugangsdaten verantwortlich.",
                    "terms_4": "- Überweisungen und Zahlungen unterliegen den in den Gebührenbedingungen festgelegten Limits.",
                    "duration_title": "DAUER UND KÜNDIGUNG",
                    "duration_text": "Dieser Vertrag wird auf unbestimmte Zeit geschlossen. Jede Partei kann ihn jederzeit unter Einhaltung einer Frist von 30 Tagen gemäß den geltenden Vorschriften kündigen.",
                    "signatures_title": "UNTERSCHRIFTEN",
                    "made_at": "Geschehen in Luxemburg, am {{date}}",
                    "client_sig": "Unterschrift des Kunden",
                    "certified_sig": "(Zertifizierte digitale Unterschrift)",
                    "bank_sig": "Für INVIK S.A."
                },
                "branding": {
                    "tagline": "Premium-Digitalbank",
                    "legal_1": "Dieses Dokument ist ein offizielles Dokument, das von den digitalen Diensten der INVIK S.A. erstellt wurde.",
                    "legal_2": "INVIK S.A. - Luxemburger Recht S.A. - RCS Luxemburg B 138.554 - Kapital 31.000.000 EUR",
                    "legal_3": "Sitz der Gesellschaft: 51, Boulevard Grande-Duchesse Charlotte, L-1331 Luxemburg"
                },
                "messages": {
                    "rib_success": "RIB erfolgreich generiert!",
                    "rib_error": "Fehler bei der RIB-Generierung",
                    "contract_success": "Vertrag erfolgreich generiert!",
                    "contract_error": "Fehler bei der Vertragsgenerierung",
                    "iban_copied": "IBAN in die Zwischenablage kopiert!",
                    "empty": "Kein Dokument verfügbar.",
                    "available": "Verfügbar"
                }
            }
        }
    }

    for lang, dashboard_data in translations.items():
        file_path = os.path.join(base_path, lang, "translation.json")
        if os.path.exists(file_path):
            with open(file_path, "r", encoding="utf-8") as f:
                lang_data = json.load(f)
            
            # Merge dashboard sections
            for key in dashboard_keys:
                if key in dashboard_data:
                    lang_data[key] = dashboard_data[key]
                elif key in en_data:
                    # Fallback to English if not provided in translation map 
                    # but required for dashboard structure
                    lang_data[key] = en_data[key]
            
            with open(file_path, "w", encoding="utf-8") as f:
                json.dump(lang_data, f, ensure_ascii=False, indent=4)
            print(f"Localized dashboard for {lang}")
        else:
            print(f"Warning: {file_path} not found")

if __name__ == "__main__":
    localize_dashboard()
