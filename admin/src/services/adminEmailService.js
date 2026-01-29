const ADMIN_EMAIL_API_URL = '/api/send-email';

/**
 * Get email template in specified language
 * @param {string} templateName - Name of the template
 * @param {string} lang - Language code (fr, en, pt, it, es, de)
 * @param {object} data - Data to populate the template
 * @returns {object} { subject, html }
 */
const getEmailTemplate = (templateName, lang = 'fr', data) => {
    // Robust mapping for language names and codes
    const normalizedLang = (lang || 'fr').toString().trim().toLowerCase();

    const mapping = {
        'fr': 'fr', 'français': 'fr', 'french': 'fr', 'fr-fr': 'fr',
        'en': 'en', 'english': 'en', 'anglais': 'en', 'en-us': 'en', 'en-gb': 'en',
        'es': 'es', 'español': 'es', 'spanish': 'es', 'espagnol': 'es',
        'it': 'it', 'italiano': 'it', 'italian': 'it', 'italien': 'it',
        'pt': 'pt', 'português': 'pt', 'portuguese': 'pt', 'portugais': 'pt',
        'de': 'de', 'deutsch': 'de', 'german': 'de', 'allemand': 'de'
    };

    const langCode = mapping[normalizedLang] || 'en'; // Default to 'en' instead of 'fr' as a more global fallback

    console.log(`[AdminEmailService] Template: ${templateName}, Input Lang: "${lang}", Resolved Code: ${langCode}`);

    const templates = {
        kycSuccess: {
            fr: {
                subject: "Votre identité a été validée - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">Identité Vérifiée</h1>
                        <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 13px;">INVIK BANK EXCLUSIF</div>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Félicitations ${data.name},</h2>
                            <p style="font-size: 16px;">Nous avons le plaisir de vous informer que vos documents d'identité ont été validés par notre département de conformité.</p>
                            <p style="font-size: 16px;">Votre compte est désormais **pleinement actif**. Vous pouvez maintenant accéder à l'intégralité de nos services :</p>
                        <div style="background: #f8fafc; border-left: 4px solid #003366; padding: 20px; margin: 25px 0;">
                                <ul style="margin: 0; padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;">Émission de votre IBAN européen personnalisé.</li>
                                    <li style="margin-bottom: 10px;">Commande de votre carte de prestige.</li>
                                    <li>Accès aux demandes de financement premium.</li>
                                </ul>
                            </div>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #003366; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 15px rgba(0, 51, 102, 0.2);">Accéder à mon tableau de bord</a>
                            </div>
                            <p>Merci pour votre patience durant ce processus de sécurité.</p>
                        </div>
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                            <p style="margin: 0;">INVIK BANK SA - Sécurité & Prestige</p>
                        </div>
                    </div>
            `
            },
            en: {
                subject: "Your identity has been verified - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">Identity Verified</h1>
                        <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 13px;">INVIK BANK EXCLUSIVE</div>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Congratulations ${data.name},</h2>
                            <p style="font-size: 16px;">We are pleased to inform you that your identity documents have been validated by our compliance department.</p>
                            <p style="font-size: 16px;">Your account is now **fully active**. You can now access all of our services:</p>
                        <div style="background: #f8fafc; border-left: 4px solid #003366; padding: 20px; margin: 25px 0;">
                                <ul style="margin: 0; padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;">Issuance of your personalized European IBAN.</li>
                                    <li style="margin-bottom: 10px;">Ordering your prestige card.</li>
                                    <li>Access to premium financing requests.</li>
                                </ul>
                            </div>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #003366; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 15px rgba(0, 51, 102, 0.2);">Go to my dashboard</a>
                            </div>
                            <p>Thank you for your patience during this security process.</p>
                        </div>
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                            <p style="margin: 0;">INVIK BANK SA - Security & Prestige</p>
                        </div>
                    </div>
            `
            },
            es: {
                subject: "Su identidad ha sido verificada - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">Identidad Verificada</h1>
                        <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 13px;">INVIK BANK EXCLUSIVO</div>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Felicitaciones ${data.name},</h2>
                            <p style="font-size: 16px;">Nos complace informarle que sus documentos de identidad han sido validados por nuestro departamento de cumplimiento.</p>
                            <p style="font-size: 16px;">Su cuenta está ahora **totalmente activa**. Ahora puede acceder a todos nuestros servicios:</p>
                        <div style="background: #f8fafc; border-left: 4px solid #003366; padding: 20px; margin: 25px 0;">
                                <ul style="margin: 0; padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;">Emisión de su IBAN europeo personalizado.</li>
                                    <li style="margin-bottom: 10px;">Pedido de su tarjeta de prestigio.</li>
                                    <li>Acceso a solicitudes de financiación premium.</li>
                                </ul>
                            </div>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #003366; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 15px rgba(0, 51, 102, 0.2);">Ir a mi tablero</a>
                            </div>
                            <p>Gracias por su paciencia durante este proceso de seguridad.</p>
                        </div>
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                            <p style="margin: 0;">INVIK BANK SA - Seguridad y Prestigio</p>
                        </div>
                    </div>
            `
            },
            pt: {
                subject: "Sua identidade foi verificada - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">Identidade Verificada</h1>
                        <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 13px;">INVIK BANK EXCLUSIVO</div>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Parabéns ${data.name},</h2>
                            <p style="font-size: 16px;">Temos o prazer de informar que seus documentos de identidade foram validados pelo nosso departamento de conformidade.</p>
                            <p style="font-size: 16px;">Sua conta está agora **totalmente ativa**. Você pode acessar todos os nossos serviços:</p>
                        <div style="background: #f8fafc; border-left: 4px solid #003366; padding: 20px; margin: 25px 0;">
                                <ul style="margin: 0; padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;">Emissão do seu IBAN europeu personalizado.</li>
                                    <li style="margin-bottom: 10px;">Pedido do seu cartão de prestígio.</li>
                                    <li>Acesso a pedidos de financiamento premium.</li>
                                </ul>
                            </div>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #003366; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 15px rgba(0, 51, 102, 0.2);">Ir para o meu painel</a>
                            </div>
                            <p>Obrigado pela sua paciência durante este processo de segurança.</p>
                        </div>
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                            <p style="margin: 0;">INVIK BANK SA - Segurança e Prestígio</p>
                        </div>
                    </div>
            `
            },
            it: {
                subject: "La tua identità è stata verificata - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">Identità Verificata</h1>
                        <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 13px;">INVIK BANK ESCLUSIVO</div>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Congratulazioni ${data.name},</h2>
                            <p style="font-size: 16px;">Siamo lieti di informarvi che i vostri documenti d'identità sono stati convalidati dal nostro dipartimento di compliance.</p>
                            <p style="font-size: 16px;">Il tuo account è ora **completamente attivo**. Ora puoi accedere a tutti i nostri servizi:</p>
                        <div style="background: #f8fafc; border-left: 4px solid #003366; padding: 20px; margin: 25px 0;">
                                <ul style="margin: 0; padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;">Emissione del tuo IBAN europeo personalizzato.</li>
                                    <li style="margin-bottom: 10px;">Ordinazione della tua carta prestigio.</li>
                                    <li>Accesso a richieste di finanziamento premium.</li>
                                </ul>
                            </div>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #003366; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 15px rgba(0, 51, 102, 0.2);">Vai alla mia dashboard</a>
                            </div>
                            <p>Grazie per la pazienza durante questo processo di sicurezza.</p>
                        </div>
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                            <p style="margin: 0;">INVIK BANK SA - Sicurezza e Prestigio</p>
                        </div>
                    </div>
            `
            },
            de: {
                subject: "Ihre Identität wurde verifiziert - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                    <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">Identität Verifiziert</h1>
                        <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 13px;">INVIK BANK EXKLUSIV</div>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Herzlichen Glückwunsch ${data.name},</h2>
                            <p style="font-size: 16px;">Wir freuen uns, Ihnen mitteilen zu können, dass Ihre Identitätsdokumente von unserer Compliance-Abteilung validiert wurden.</p>
                            <p style="font-size: 16px;">Ihr Konto ist nun **vollständig aktiv**. Sie können nun auf alle unsere Dienstleistungen zugreifen:</p>
                        <div style="background: #f8fafc; border-left: 4px solid #003366; padding: 20px; margin: 25px 0;">
                                <ul style="margin: 0; padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;">Ausstellung Ihrer persönlichen europäischen IBAN.</li>
                                    <li style="margin-bottom: 10px;">Bestellung Ihrer Prestige-Karte.</li>
                                    <li>Zugang zu Premium-Finanzierungsanfragen.</li>
                                </ul>
                            </div>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #003366; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 15px rgba(0, 51, 102, 0.2);">Zum Dashboard</a>
                            </div>
                            <p>Vielen Dank für Ihre Geduld während dieses Sicherheitsprozesses.</p>
                        </div>
                    <div style="background: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                            <p style="margin: 0;">INVIK BANK SA - Sicherheit & Prestige</p>
                        </div>
                    </div>
            `
            }
        },
        kycRejection: {
            fr: {
                subject: "Action requise sur votre dossier KYC - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">ACTION REQUISE</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #ef4444; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p style="font-size: 16px;">Après examen de vos pièces justificatives, nous n'avons pas pu valider votre dossier KYC pour la raison suivante :</p>
                        <div style="background: #fffbfa; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0; color: #991b1b; font-weight: 600;">
                                "${data.reason || "Documents illisibles ou non conformes."}"
                            </div>
                            <p style="font-size: 16px;">Pas d'inquiétude, vous pouvez soumettre de nouveaux documents directement depuis votre espace client pour finaliser l'activation de votre compte.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; border: 2px solid #ef4444; color: #ef4444; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Soumettre à nouveau</a>
                            </div>
                        </div>
                    </div>
            `
            },
            en: {
                subject: "Action required on your KYC file - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">ACTION REQUIRED</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #ef4444; margin-top: 0;">Hello ${data.name},</h2>
                            <p style="font-size: 16px;">After reviewing your supporting documents, we have not been able to validate your KYC file for the following reason:</p>
                        <div style="background: #fffbfa; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0; color: #991b1b; font-weight: 600;">
                                "${data.reason || "Unreadable or non-compliant documents."}"
                            </div>
                            <p style="font-size: 16px;">Don't worry, you can submit new documents directly from your customer area to finalize the activation of your account.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; border: 2px solid #ef4444; color: #ef4444; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Submit again</a>
                            </div>
                        </div>
                    </div>
            `
            },
            es: {
                subject: "Acción requerida en su solicitud KYC - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">ACCIÓN REQUERIDA</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #ef4444; margin-top: 0;">Hola ${data.name},</h2>
                            <p style="font-size: 16px;">Tras revisar sus documentos justificativos, no hemos podido validar su expediente KYC por el siguiente motivo:</p>
                        <div style="background: #fffbfa; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0; color: #991b1b; font-weight: 600;">
                                "${data.reason || "Documentos ilegibles o no conformes."}"
                            </div>
                            <p style="font-size: 16px;">No se preocupe, puede volver a enviar los documentos directamente desde su área de cliente para finalizar la activación de su cuenta.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; border: 2px solid #ef4444; color: #ef4444; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Enviar de nuevo</a>
                            </div>
                        </div>
                    </div>
            `
            },
            pt: {
                subject: "Ação necessária no seu pedido KYC - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">AÇÃO NECESSÁRIA</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #ef4444; margin-top: 0;">Olá ${data.name},</h2>
                            <p style="font-size: 16px;">Após a análise dos seus documentos comprovativos, não conseguimos validar o seu processo KYC pelo seguinte motivo:</p>
                        <div style="background: #fffbfa; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0; color: #991b1b; font-weight: 600;">
                                "${data.reason || "Documentos ilegíveis ou não conformes."}"
                            </div>
                            <p style="font-size: 16px;">Não se preocupe, pode submeter novos documentos diretamente da sua área de cliente para finalizar a ativação da sua conta.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; border: 2px solid #ef4444; color: #ef4444; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Submeter novamente</a>
                            </div>
                        </div>
                    </div>
            `
            },
            it: {
                subject: "Azione richiesta sulla vostra pratica KYC - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">AZIONE RICHIESTA</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #ef4444; margin-top: 0;">Ciao ${data.name},</h2>
                            <p style="font-size: 16px;">Dopo aver esaminato i vostri documenti giustificativi, non abbiamo potuto convalidare la vostra pratica KYC per il seguente motivo:</p>
                        <div style="background: #fffbfa; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0; color: #991b1b; font-weight: 600;">
                                "${data.reason || "Documenti illeggibili o non conformi."}"
                            </div>
                            <p style="font-size: 16px;">Non preoccupatevi, potete inviare nuovi documenti direttamente dalla vostra area clienti per finalizzare l'attivazione del vostro account.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; border: 2px solid #ef4444; color: #ef4444; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Invia di nuovo</a>
                            </div>
                        </div>
                    </div>
            `
            },
            de: {
                subject: "Handlungsbedarf bei Ihrem KYC-Antrag - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">HANDLUNGSBEDARF</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #ef4444; margin-top: 0;">Hallo ${data.name},</h2>
                            <p style="font-size: 16px;">Nach Prüfung Ihrer Unterlagen konnten wir Ihren KYC-Antrag aus folgendem Grund nicht validieren:</p>
                        <div style="background: #fffbfa; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0; color: #991b1b; font-weight: 600;">
                                "${data.reason || "Unleserliche oder nicht konforme Dokumente."}"
                            </div>
                            <p style="font-size: 16px;">Keine Sorge, Sie können neue Dokumente direkt in Ihrem Kundenbereich einreichen, um die Aktivierung Ihres Kontos abzuschließen.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; border: 2px solid #ef4444; color: #ef4444; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Erneut einreichen</a>
                            </div>
                        </div>
                    </div>
            `
            }
        },
        loanApproved: {
            fr: {
                subject: "Approbation de votre demande de prêt - INVIK BANK",
                html: (data) => `
                <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">PRÊT APPROUVÉ</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #10b981; margin-top: 0;">Bonne nouvelle, ${data.name}</h2>
                            <p style="font-size: 16px;">Votre demande de financement a été approuvée par notre comité de crédit.</p>
                        <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #dcfce7;">
                                <span style="display: block; color: #065f46; font-size: 14px; font-weight: 700; text-transform: uppercase;">Montant débloqué</span>
                                <span style="display: block; color: #059669; font-size: 36px; font-weight: 900;">${(Number(data.amount) || 0).toLocaleString('fr-FR')} ${data.currency}</span>
                            </div>
                            <p style="font-size: 16px;">Les fonds seront visibles sur votre compte principal sous un délai de 24h à 48h ouvrés.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800;">Consulter mon solde</a>
                            </div>
                        </div>
                    </div>
`
            },
            en: {
                subject: "Loan application approval - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">LOAN APPROVED</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #10b981; margin-top: 0;">Good news, ${data.name}</h2>
                            <p style="font-size: 16px;">Your financing request has been approved by our credit committee.</p>
                        <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #dcfce7;">
                                <span style="display: block; color: #065f46; font-size: 14px; font-weight: 700; text-transform: uppercase;">Unlocked amount</span>
                                <span style="display: block; color: #059669; font-size: 36px; font-weight: 900;">${(Number(data.amount) || 0).toLocaleString('en-US')} ${data.currency}</span>
                            </div>
                            <p style="font-size: 16px;">The funds will be visible on your main account within 24 to 48 business hours.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800;">Check my balance</a>
                            </div>
                        </div>
                    </div>
`
            },
            es: {
                subject: "Aprobación de su solicitud de préstamo - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">PRÉSTAMO APROBADO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #10b981; margin-top: 0;">Buenas noticias, ${data.name}</h2>
                            <p style="font-size: 16px;">Su solicitud de financiación ha sido aprobada por nuestro comité de crédito.</p>
                        <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #dcfce7;">
                                <span style="display: block; color: #065f46; font-size: 14px; font-weight: 700; text-transform: uppercase;">Monto desbloqueado</span>
                                <span style="display: block; color: #059669; font-size: 36px; font-weight: 900;">${(Number(data.amount) || 0).toLocaleString('es-ES')} ${data.currency}</span>
                            </div>
                            <p style="font-size: 16px;">Los fondos estarán visibles en su cuenta principal en un plazo de 24 a 48 horas hábiles.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800;">Consultar mi saldo</a>
                            </div>
                        </div>
                    </div>
`
            },
            pt: {
                subject: "Aprovação do seu pedido de empréstimo - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">EMPRÉSTIMO APROVADO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #10b981; margin-top: 0;">Boas notícias, ${data.name}</h2>
                            <p style="font-size: 16px;">O seu pedido de financiamento foi aprovado pelo nosso comité de crédito.</p>
                        <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #dcfce7;">
                                <span style="display: block; color: #065f46; font-size: 14px; font-weight: 700; text-transform: uppercase;">Montante desbloqueado</span>
                                <span style="display: block; color: #059669; font-size: 36px; font-weight: 900;">${(Number(data.amount) || 0).toLocaleString('pt-PT')} ${data.currency}</span>
                            </div>
                            <p style="font-size: 16px;">Os fundos estarão visíveis na sua conta principal num prazo de 24h a 48h úteis.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800;">Consultar o meu saldo</a>
                            </div>
                        </div>
                    </div>
`
            },
            it: {
                subject: "Approvazione della vostra richiesta di prestito - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">PRESTITO APPROVATO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #10b981; margin-top: 0;">Buone notizie, ${data.name}</h2>
                            <p style="font-size: 16px;">La vostra richiesta di finanziamento è stata approvata dal nostro comitato di credito.</p>
                        <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #dcfce7;">
                                <span style="display: block; color: #065f46; font-size: 14px; font-weight: 700; text-transform: uppercase;">Importo sbloccato</span>
                                <span style="display: block; color: #059669; font-size: 36px; font-weight: 900;">${(Number(data.amount) || 0).toLocaleString('it-IT')} ${data.currency}</span>
                            </div>
                            <p style="font-size: 16px;">I fondi saranno visibili sul vostro conto principale entro 24-48 ore lavorative.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800;">Consultare il mio saldo</a>
                            </div>
                        </div>
                    </div>
`
            },
            de: {
                subject: "Genehmigung Ihres Kreditantrags - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">KREDIT GENEHMIGT</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #10b981; margin-top: 0;">Gute Nachrichten, ${data.name}</h2>
                            <p style="font-size: 16px;">Ihr Finanzierungsantrag wurde von unserem Kreditausschuss genehmigt.</p>
                        <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #dcfce7;">
                                <span style="display: block; color: #065f46; font-size: 14px; font-weight: 700; text-transform: uppercase;">Freigeschalteter Betrag</span>
                                <span style="display: block; color: #059669; font-size: 36px; font-weight: 900;">${(Number(data.amount) || 0).toLocaleString('de-DE')} ${data.currency}</span>
                            </div>
                            <p style="font-size: 16px;">Die Mittel werden innerhalb von 24 bis 48 Werksstunden auf Ihrem Hauptkonto sichtbar sein.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800;">Meinen Kontostand prüfen</a>
                            </div>
                        </div>
                    </div>
`
            }
        },
        loanRejected: {
            fr: {
                subject: "Mise à jour de votre demande de financement - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;">
                    <div style="background: #475569; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">DÉCISION PRÊT</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #475569; margin-top: 0;">Monsieur/Madame ${data.name},</h2>
                            <p style="font-size: 16px;">Nous avons étudié votre demande de financement avec la plus grande attention. Malheureusement, nous ne sommes pas en mesure d'y donner une suite favorable pour le moment.</p>
                            <p style="font-size: 14px; color: #64748b; font-style: italic;">Motif : ${data.reason || "Critères d'éligibilité non remplis."}</p>
                            <p style="font-size: 16px;">Cette décision est basée sur our politique actuelle d'octroi de crédit. Nous vous invitons à renouveler votre demande dans 6 mois si votre situation évolue.</p>
                        </div>
                    </div>
`
            },
            en: {
                subject: "Financing request update - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;">
                    <div style="background: #475569; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">LOAN DECISION</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #475569; margin-top: 0;">Dear ${data.name},</h2>
                            <p style="font-size: 16px;">We have reviewed your financing request with the greatest attention. Unfortunately, we are not able to provide a favorable response at this time.</p>
                            <p style="font-size: 14px; color: #64748b; font-style: italic;">Reason: ${data.reason || "Eligibility criteria not met."}</p>
                            <p style="font-size: 16px;">This decision is based on our current credit granting policy. We invite you to renew your request in 6 months if your situation evolves.</p>
                        </div>
                    </div>
`
            },
            es: {
                subject: "Actualización de su solicitud de financiación - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;">
                    <div style="background: #475569; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">DECISIÓN PRÉSTAMO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #475569; margin-top: 0;">Estimado/a ${data.name},</h2>
                            <p style="font-size: 16px;">Hemos revisado su solicitud de financiación con la mayor atención. Lamentablemente, no podemos dar una respuesta favorable en este momento.</p>
                            <p style="font-size: 14px; color: #64748b; font-style: italic;">Motivo: ${data.reason || "Criterios de elegibilidad no cumplidos."}</p>
                            <p style="font-size: 16px;">Esta decisión se basa en nuestra política actual de concesión de créditos. Le invitamos a renovar su solicitud en 6 meses si su situación evoluciona.</p>
                        </div>
                    </div>
`
            },
            pt: {
                subject: "Atualização do seu pedido de financiamento - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;">
                    <div style="background: #475569; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">DECISÃO EMPRÉSTIMO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #475569; margin-top: 0;">Prezado/a ${data.name},</h2>
                            <p style="font-size: 16px;">Analisámos o seu pedido de financiamento com a maior atenção. Infelizmente, não podemos dar uma resposta favorável neste momento.</p>
                            <p style="font-size: 14px; color: #64748b; font-style: italic;">Motivo: ${data.reason || "Critérios de elegibilidade não cumpridos."}</p>
                            <p style="font-size: 16px;">Esta decisão baseia-se na nossa política atual de concessão de crédito. Convidamo-lo a renovar o seu pedido em 6 meses se a sua situação evoluir.</p>
                        </div>
                    </div>
`
            },
            it: {
                subject: "Aggiornamento della vostra richiesta di finanziamento - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;">
                    <div style="background: #475569; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">DECISIONE PRESTITO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #475569; margin-top: 0;">Gentile ${data.name},</h2>
                            <p style="font-size: 16px;">Abbiamo esaminato la vostra richiesta di finanziamento con la massima attenzione. Purtroppo, non siamo in grado di fornire una risposta favorevole in questo momento.</p>
                            <p style="font-size: 14px; color: #64748b; font-style: italic;">Motivo: ${data.reason || "Criteri di ammissibilità non soddisfatti."}</p>
                            <p style="font-size: 16px;">Questa decisione si basa sulla nostra attuale politica di concessione del credito. Vi invitiamo a rinnovare la vostra richiesta tra 6 mesi se la vostra situazione dovesse evolvere.</p>
                        </div>
                    </div>
`
            },
            de: {
                subject: "Aktualisierung Ihres Finanzierungsantrags - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;">
                    <div style="background: #475569; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800;">KREDITENTSCHEIDUNG</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #475569; margin-top: 0;">Sehr geehrte/r ${data.name},</h2>
                            <p style="font-size: 16px;">Wir haben Ihren Finanzierungsantrag mit größter Sorgfalt geprüft. Leider können wir Ihnen zum jetzigen Zeitpunkt keine positive Antwort geben.</p>
                            <p style="font-size: 14px; color: #64748b; font-style: italic;">Grund: ${data.reason || "Teilnahmekriterien nicht erfüllt."}</p>
                            <p style="font-size: 16px;">Diese Entscheidung basiert auf unserer aktuellen Kreditvergabepolitik. Wir laden Sie ein, Ihren Antrag in 6 Monaten zu erneuern, falls sich Ihre Situation ändert.</p>
                        </div>
                    </div>
`
            }
        },
        cardShipped: {
            fr: {
                subject: "Votre carte INVIK BANK a été expédiée !",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #000000; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">VOTRE CARTE EST EN ROUTE</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #000000; margin-top: 0;">Excellent choix, ${data.name}</h2>
                            <p style="font-size: 16px;">Votre carte **${data.cardType}** a été préparée et remise à notre transporteur partenaire.</p>
                        <div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 25px 0;">
                                <i class="fas fa-truck" style="font-size: 40px; color: #003366; margin-bottom: 15px;"></i>
                                <p style="margin: 0; font-weight: 700; color: #003366;">Délai de livraison estimé : 3 à 5 jours ouvrés</p>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Pour des raisons de sécurité, votre carte est expédiée inactive. Vous pourrez l'activer dès réception depuis votre application.</p>
                        </div>
                    </div>
`
            },
            en: {
                subject: "Your INVIK BANK card has been shipped!",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #000000; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">YOUR CARD IS ON ITS WAY</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #000000; margin-top: 0;">Excellent choice, ${data.name}</h2>
                            <p style="font-size: 16px;">Your **${data.cardType}** card has been prepared and handed over to our carrier partner.</p>
                        <div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 25px 0;">
                                <i class="fas fa-truck" style="font-size: 40px; color: #003366; margin-bottom: 15px;"></i>
                                <p style="margin: 0; font-weight: 700; color: #003366;">Estimated delivery time: 3 to 5 business days</p>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">For security reasons, your card is shipped inactive. You can activate it as soon as you receive it from your application.</p>
                        </div>
                    </div>
`
            },
            es: {
                subject: "¡Su tarjeta INVIK BANK ha sido enviada!",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #000000; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">SU TARJETA ESTÁ EN CAMINO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #000000; margin-top: 0;">Excelente elección, ${data.name}</h2>
                            <p style="font-size: 16px;">Su tarjeta **${data.cardType}** ha sido preparada y entregada a nuestro transportista asociado.</p>
                        <div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 25px 0;">
                                <i class="fas fa-truck" style="font-size: 40px; color: #003366; margin-bottom: 15px;"></i>
                                <p style="margin: 0; font-weight: 700; color: #003366;">Plazo de entrega estimado: 3 a 5 días hábiles</p>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Por razones de seguridad, su tarjeta se envía inactiva. Podrá activarla en cuanto la reciba desde su aplicación.</p>
                        </div>
                    </div>
`
            },
            pt: {
                subject: "Seu cartão INVIK BANK foi enviado!",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #000000; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">O SEU CARTÃO ESTÁ A CAMINHO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #000000; margin-top: 0;">Excelente escolha, ${data.name}</h2>
                            <p style="font-size: 16px;">O seu cartão **${data.cardType}** foi preparado e entregue ao nosso transportador parceiro.</p>
                        <div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 25px 0;">
                                <i class="fas fa-truck" style="font-size: 40px; color: #003366; margin-bottom: 15px;"></i>
                                <p style="margin: 0; font-weight: 700; color: #003366;">Prazo de entrega estimado: 3 a 5 dias úteis</p>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Por razões de segurança, o seu cartão é enviado inativo. Poderá ativá-lo assim que o receber através da sua aplicação.</p>
                        </div>
                    </div>
`
            },
            it: {
                subject: "La vostra carta INVIK BANK è stata spedita!",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #000000; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">LA VOSTRA CARTA È IN ARRIVO</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #000000; margin-top: 0;">Eccellente scelta, ${data.name}</h2>
                            <p style="font-size: 16px;">La vostra carta **${data.cardType}** è stata preparata e consegnata al nostro corriere partner.</p>
                        <div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 25px 0;">
                                <i class="fas fa-truck" style="font-size: 40px; color: #003366; margin-bottom: 15px;"></i>
                                <p style="margin: 0; font-weight: 700; color: #003366;">Tempi di consegna stimati: da 3 a 5 giorni lavorativi</p>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Per motivi di sicurezza, la carta viene spedita inattiva. Potrete attivarla non appena la riceverete dalla vostra applicazione.</p>
                        </div>
                    </div>
`
            },
            de: {
                subject: "Ihre INVIK BANK Karte wurde versandt!",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #000000; padding: 40px 20px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">IHRE KARTE IST UNTERWEGS</h1>
                        </div>
                    <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                            <h2 style="color: #000000; margin-top: 0;">Ausgezeichnete Wahl, ${data.name}</h2>
                            <p style="font-size: 16px;">Ihre **${data.cardType}** Karte wurde vorbereitet und an unseren Versandpartner übergeben.</p>
                        <div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 25px 0;">
                                <i class="fas fa-truck" style="font-size: 40px; color: #003366; margin-bottom: 15px;"></i>
                                <p style="margin: 0; font-weight: 700; color: #003366;">Voraussichtliche Lieferzeit: 3 bis 5 Werktage</p>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Aus Sicherheitsgründen wird Ihre Karte inaktiv versandt. Sie können sie sofort nach Erhalt über Ihre App aktivieren.</p>
                        </div>
                    </div>
`
            }
        },
        transactionValidated: {
            fr: {
                subject: "Confirmation de virement sortant - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #10b981; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Virement Transmis</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Bonjour ${data.name},</p>
                            <p>Votre virement vers l'extérieur a été validé et transmis au réseau bancaire international.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="color: #64748b; padding-bottom: 10px;">Montant</td><td style="text-align: right; font-weight: 700;">${(Number(data.amount) || 0).toLocaleString('fr-FR')} ${data.currency}</td></tr>
                                    <tr><td style="color: #64748b;">Description</td><td style="text-align: right; font-weight: 700;">${data.description}</td></tr>
                                </table>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Ce virement devrait atteindre le compte destinataire sous 24h à 72h.</p>
                        </div>
                    </div>
`
            },
            en: {
                subject: "Outgoing transfer confirmation - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #10b981; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Transfer Transmitted</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hello ${data.name},</p>
                            <p>Your external transfer has been validated and transmitted to the international banking network.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="color: #64748b; padding-bottom: 10px;">Amount</td><td style="text-align: right; font-weight: 700;">${(Number(data.amount) || 0).toLocaleString('en-US')} ${data.currency}</td></tr>
                                    <tr><td style="color: #64748b;">Description</td><td style="text-align: right; font-weight: 700;">${data.description}</td></tr>
                                </table>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">This transfer should reach the recipient's account within 24 to 72 hours.</p>
                        </div>
                    </div>
`
            },
            es: {
                subject: "Confirmación de transferencia saliente - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #10b981; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Transferencia Transmitida</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hola ${data.name},</p>
                            <p>Su transferencia externa ha sido validada y transmitida a la red bancaria internacional.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="color: #64748b; padding-bottom: 10px;">Monto</td><td style="text-align: right; font-weight: 700;">${(Number(data.amount) || 0).toLocaleString('es-ES')} ${data.currency}</td></tr>
                                    <tr><td style="color: #64748b;">Descripción</td><td style="text-align: right; font-weight: 700;">${data.description}</td></tr>
                                </table>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Esta transferencia debería llegar a la cuenta del destinatario en un plazo de 24 a 72 horas.</p>
                        </div>
                    </div>
`
            },
            pt: {
                subject: "Confirmação de transferência enviada - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #10b981; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Transferência Transmitida</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Olá ${data.name},</p>
                            <p>A sua transferência externa foi validada e transmitida para a rede bancária internacional.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="color: #64748b; padding-bottom: 10px;">Montante</td><td style="text-align: right; font-weight: 700;">${(Number(data.amount) || 0).toLocaleString('pt-PT')} ${data.currency}</td></tr>
                                    <tr><td style="color: #64748b;">Descrição</td><td style="text-align: right; font-weight: 700;">${data.description}</td></tr>
                                </table>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Esta transferência deverá chegar à conta do destinatário num prazo de 24h a 72h.</p>
                        </div>
                    </div>
`
            },
            it: {
                subject: "Conferma bonifico in uscita - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #10b981; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Bonifico Trasmesso</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Buongiorno ${data.name},</p>
                            <p>Il vostro bonifico esterno è stato convalidato e trasmesso alla rete bancaria internazionale.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="color: #64748b; padding-bottom: 10px;">Importo</td><td style="text-align: right; font-weight: 700;">${(Number(data.amount) || 0).toLocaleString('it-IT')} ${data.currency}</td></tr>
                                    <tr><td style="color: #64748b;">Descrizione</td><td style="text-align: right; font-weight: 700;">${data.description}</td></tr>
                                </table>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Questo bonifico dovrebbe raggiungere il conto del destinatario entro 24-72 ore.</p>
                        </div>
                    </div>
`
            },
            de: {
                subject: "Bestätigung der ausgehenden Überweisung - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #10b981; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Überweisung Übermittelt</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Guten Tag ${data.name},</p>
                            <p>Ihre externe Überweisung wurde validiert und an das internationale Bankennetz übermittelt.</p>
                        <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="color: #64748b; padding-bottom: 10px;">Betrag</td><td style="text-align: right; font-weight: 700;">${(Number(data.amount) || 0).toLocaleString('de-DE')} ${data.currency}</td></tr>
                                    <tr><td style="color: #64748b;">Beschreibung</td><td style="text-align: right; font-weight: 700;">${data.description}</td></tr>
                                </table>
                            </div>
                            <p style="font-size: 14px; color: #64748b;">Diese Überweisung sollte das Empfängerkonto innerhalb von 24 bis 72 Stunden erreichen.</p>
                        </div>
                    </div>
`
            }
        },
        transactionInReview: {
            fr: {
                subject: "Vérification en cours sur votre transaction - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #f59e0b; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Vérification de Sécurité</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Bonjour ${data.name},</p>
                            <p>Dans le cadre de nos procédures de sécurité habituelles, votre virement de **${(Number(data.amount) || 0).toLocaleString('fr-FR')} ${data.currency}** est actuellement en cours de vérification approfondie.</p>
                            <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; font-size: 14px;">
                                <strong>Pourquoi ?</strong> Cette étape permet de protéger votre compte contre toute activité inhabituelle. Un conseiller INVIK BANK peut vous contacter si des informations complémentaires sont nécessaires.
                            </p>
                            <p>Le virement sera libéré dès la fin de cet examen (généralement sous quelques heures).</p>
                        </div>
                    </div>
`
            },
            en: {
                subject: "Security check on your transaction - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #f59e0b; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Security Verification</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hello ${data.name},</p>
                            <p>As part of our standard security procedures, your transfer of **${(Number(data.amount) || 0).toLocaleString('en-US')} ${data.currency}** is currently undergoing an in-depth review.</p>
                            <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; font-size: 14px;">
                                <strong>Why?</strong> This step helps protect your account from any unusual activity. An INVIK BANK advisor may contact you if additional information is needed.
                            </p>
                            <p>The transfer will be released as soon as this review is completed (usually within a few hours).</p>
                        </div>
                    </div>
`
            },
            es: {
                subject: "Verificación en curso de su transacción - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #f59e0b; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Verificación de Seguridad</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hola ${data.name},</p>
                            <p>Como parte de nuestros procedimientos de seguridad habituales, su transferencia de **${(Number(data.amount) || 0).toLocaleString('es-ES')} ${data.currency}** está siendo objeto de una revisión exhaustiva.</p>
                            <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; font-size: 14px;">
                                <strong>¿Por qué?</strong> Este paso ayuda a proteger su cuenta de cualquier actividad inusual. Un asesor de INVIK BANK puede ponerse en contacto con usted si se requiere información adicional.
                            </p>
                            <p>La transferencia se liberará en cuanto finalice esta revisión (normalmente en unas pocas horas).</p>
                        </div>
                    </div>
`
            },
            pt: {
                subject: "Verificação em curso da sua transação - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #f59e0b; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Verificação de Segurança</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Olá ${data.name},</p>
                            <p>Como parte dos nossos procedimentos de segurança habituais, a sua transferência de **${(Number(data.amount) || 0).toLocaleString('pt-PT')} ${data.currency}** está atualmente a ser submetida a uma revisão minuciosa.</p>
                            <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; font-size: 14px;">
                                <strong>Porquê?</strong> Esta etapa ajuda a proteger a sua conta de qualquer atividade invulgar. Um consultor do INVIK BANK poderá contactá-lo se forem necessárias informações adicionais.
                            </p>
                            <p>A transferência será libertada assim que esta revisão estiver concluída (geralmente em poucas horas).</p>
                        </div>
                    </div>
`
            },
            it: {
                subject: "Verifica in corso sulla vostra transazione - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #f59e0b; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Verifica di Sicurezza</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Buongiorno ${data.name},</p>
                            <p>Nell'ambito delle nostre normali procedure di sicurezza, il vostro bonifico di **${(Number(data.amount) || 0).toLocaleString('it-IT')} ${data.currency}** è attualmente oggetto di una revisione approfondita.</p>
                            <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; font-size: 14px;">
                                <strong>Perché?</strong> Questo passaggio aiuta a proteggere il vostro account da qualsiasi attività insolita. Un consulente INVIK BANK potrebbe contattarvi se fossero necessarie ulteriori informazioni.
                            </p>
                            <p>Il bonifico sarà sbloccato non appena questa verifica sarà completata (solitamente entro poche ore).</p>
                        </div>
                    </div>
`
            },
            de: {
                subject: "Sicherheitsprüfung Ihrer Transaktion - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #f59e0b; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Sicherheitsüberprüfung</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Guten Tag ${data.name},</p>
                            <p>Im Rahmen unserer üblichen Sicherheitsverfahren wird Ihre Überweisung in Höhe von **${(Number(data.amount) || 0).toLocaleString('de-DE')} ${data.currency}** derzeit einer eingehenden Prüfung unterzogen.</p>
                            <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; font-size: 14px;">
                                <strong>Warum?</strong> Dieser Schritt hilft, Ihr Konto vor ungewöhnlichen Aktivitäten zu schützen. Ein Berater der INVIK BANK kann Sie kontaktieren, falls zusätzliche Informationen benötigt werden.
                            </p>
                            <p>Die Überweisung wird freigegeben, sobald diese Prüfung abgeschlossen ist (in der Regel innerhalb einiger Stunden).</p>
                        </div>
                    </div>
`
            }
        },
        transactionRejected: {
            fr: {
                subject: "Alerte Sécurité : Virement refusé - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Virement Refusé</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Bonjour ${data.name},</p>
                            <p>Votre demande de virement de **${(Number(data.amount) || 0).toLocaleString('fr-FR')} ${data.currency}** a été refusée par notre département de sécurité.</p>
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; color: #991b1b; margin: 20px 0;">
                                <strong>Motif :</strong> ${data.reason || "Alerte de sécurité ou informations destinataire invalides."}
                            </div>
                            <p>Le montant a été intégralement replacé sur votre solde disponible.</p>
                        </div>
                    </div>
`
            },
            en: {
                subject: "Security Alert: Transfer rejected - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Transfer Rejected</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hello ${data.name},</p>
                            <p>Your transfer request of **${(Number(data.amount) || 0).toLocaleString('en-US')} ${data.currency}** was rejected by our security department.</p>
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; color: #991b1b; margin: 20px 0;">
                                <strong>Reason:</strong> ${data.reason || "Security alert or invalid recipient information."}
                            </div>
                            <p>The amount has been fully returned to your available balance.</p>
                        </div>
                    </div>
`
            },
            es: {
                subject: "Alerta de Seguridad: Transferencia rechazada - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Transferencia Rechazada</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hola ${data.name},</p>
                            <p>Su solicitud de transferencia de **${(Number(data.amount) || 0).toLocaleString('es-ES')} ${data.currency}** ha sido rechazada por nuestro departamento de seguridad.</p>
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; color: #991b1b; margin: 20px 0;">
                                <strong>Motivo:</strong> ${data.reason || "Alerta de seguridad o información del destinatario no válida."}
                            </div>
                            <p>El importe ha sido devuelto íntegramente a su saldo disponible.</p>
                        </div>
                    </div>
`
            },
            pt: {
                subject: "Alerta de Segurança: Transferência rejeitada - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Transferência Rejeitada</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Olá ${data.name},</p>
                            <p>O seu pedido de transferência de **${(Number(data.amount) || 0).toLocaleString('pt-PT')} ${data.currency}** foi rejeitado pelo nosso departamento de segurança.</p>
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; color: #991b1b; margin: 20px 0;">
                                <strong>Motivo:</strong> ${data.reason || "Alerta de segurança ou informações de destinatário inválidas."}
                            </div>
                            <p>O montante foi integralmente devolvido ao seu saldo disponível.</p>
                        </div>
                    </div>
`
            },
            it: {
                subject: "Avviso di Sicurezza: Bonifico rifiutato - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Bonifico Rifiutato</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Buongiorno ${data.name},</p>
                            <p>La vostra richiesta di bonifico di **${(Number(data.amount) || 0).toLocaleString('it-IT')} ${data.currency}** è stata rifiutata dal nostro dipartimento di sicurezza.</p>
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; color: #991b1b; margin: 20px 0;">
                                <strong>Motivo:</strong> ${data.reason || "Allerta di sicurezza o informazioni sul destinatario non valide."}
                            </div>
                            <p>L'importo è stato interamente riaccreditato sul vostro saldo disponibile.</p>
                        </div>
                    </div>
`
            },
            de: {
                subject: "Sicherheitswarnung: Überweisung abgelehnt - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                    <div style="background: #ef4444; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Überweisung Abgelehnt</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Guten Tag ${data.name},</p>
                            <p>Ihr Überweisungsantrag über **${(Number(data.amount) || 0).toLocaleString('de-DE')} ${data.currency}** wurde von unserer Sicherheitsabteilung abgelehnt.</p>
                        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; color: #991b1b; margin: 20px 0;">
                                <strong>Grund:</strong> ${data.reason || "Sicherheitswarnung oder ungültige Empfängerinformationen."}
                            </div>
                            <p>Der Betrag wurde vollständig Ihrem verfügbaren Guthaben gutgeschrieben.</p>
                        </div>
                    </div>
`
            }
        },
        supportResponse: {
            fr: {
                subject: "Nouvelle réponse de votre conseiller - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #003366; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Réponse de votre conseiller</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Bonjour ${data.name},</p>
                            <p>Un conseiller de l'équipe support a répondu à votre demande concernant : <strong>"${data.subject}"</strong>.</p>
                            <p>Vous pouvez consulter la réponse et poursuivre la discussion directement depuis votre messagerie sécurisée.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/support" style="display: inline-block; background: #003366; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Voir ma messagerie</a>
                            </div>
                        </div>
                    </div>
`
            },
            en: {
                subject: "New response from your advisor - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #003366; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Advisor's response</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hello ${data.name},</p>
                            <p>An advisor from the support team has responded to your request regarding: <strong>"${data.subject}"</strong>.</p>
                            <p>You can view the response and continue the discussion directly from your secure messaging center.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/support" style="display: inline-block; background: #003366; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Go to my messages</a>
                            </div>
                        </div>
                    </div>
`
            },
            es: {
                subject: "Nueva respuesta de su asesor - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #003366; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Respuesta de su asesor</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Hola ${data.name},</p>
                            <p>Un asesor del equipo de soporte ha respondido a su solicitud sobre: <strong>"${data.subject}"</strong>.</p>
                            <p>Puede consultar la respuesta y continuar la discusión directamente desde su centro de mensajes seguro.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/support" style="display: inline-block; background: #003366; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Ver mis mensajes</a>
                            </div>
                        </div>
                    </div>
`
            },
            pt: {
                subject: "Nova resposta do seu consultor - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #003366; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Resposta do seu consultor</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Olá ${data.name},</p>
                            <p>Um consultor da equipa de suporte respondeu ao seu pedido relativo a: <strong>"${data.subject}"</strong>.</p>
                            <p>Pode consultar a resposta e continuar a discussão diretamente através da sua central de mensagens segura.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/support" style="display: inline-block; background: #003366; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Ver mensagens</a>
                            </div>
                        </div>
                    </div>
`
            },
            it: {
                subject: "Nuova risposta dal vostro consulente - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #003366; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Risposta del consulente</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Buongiorno ${data.name},</p>
                            <p>Un consulente del team di supporto ha risposto alla vostra richiesta riguardante: <strong>"${data.subject}"</strong>.</p>
                            <p>Potete visualizzare la risposta e continuare la discussione direttamente dal vostro centro messaggi sicuro.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/support" style="display: inline-block; background: #003366; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Vai ai messaggi</a>
                            </div>
                        </div>
                    </div>
`
            },
            de: {
                subject: "Neue Antwort von Ihrem Berater - INVIK BANK",
                html: (data) => `
<div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                    <div style="background: #003366; padding: 30px 20px; text-align: center; color: white;">
                            <h2 style="margin: 0; font-size: 20px;">Antwort Ihres Beraters</h2>
                        </div>
                    <div style="padding: 40px; color: #1e293b;">
                            <p>Guten Tag ${data.name},</p>
                            <p>Ein Berater des Support-Teams hat auf Ihre Anfrage zu folgendem Thema geantwortet: <strong>"${data.subject}"</strong>.</p>
                            <p>Sie können die Antwort einsehen und das Gespräch direkt über Ihr sicheres Nachrichtencenter fortsetzen.</p>
                        <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/support" style="display: inline-block; background: #003366; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Zu meinen Nachrichten</a>
                            </div>
                        </div>
                    </div>
`
            }
        },
    };

    const templateSet = templates[templateName] || templates.kycSuccess;
    const template = templateSet[langCode] || templateSet.en || templateSet.fr;

    return {
        subject: template.subject,
        html: template.html(data)
    };
};

export const adminEmailService = {
    triggerEmail: async (to, subject, html) => {
        console.log(`[AdminEmailService] Attempting to send email to ${to} with subject: ${subject} `);
        try {
            const response = await fetch(ADMIN_EMAIL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, html })
            });

            console.log(`[AdminEmailService] Received response status: ${response.status} `);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`[AdminEmailService] API Error(${response.status}): `, errorText);
                throw new Error(`Email API returned ${response.status}: ${errorText} `);
            }

            const result = await response.json();
            console.log(`[AdminEmailService] Email sent successfully: `, result);
            return result;
        } catch (error) {
            console.error('[AdminEmailService] Error triggering admin email:', error);
            throw error;
        }
    },

    // --- KYC TEMPLATES ---
    sendKYCSuccessEmail: async (toEmail, name, lang = 'fr') => {
        const template = getEmailTemplate('kycSuccess', lang, { name });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendKYCRejectionEmail: async (toEmail, name, reason, lang = 'fr') => {
        const template = getEmailTemplate('kycRejection', lang, { name, reason });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    // --- LOAN TEMPLATES ---
    sendLoanApprovedEmail: async (toEmail, name, amount, currency, lang = 'fr') => {
        const template = getEmailTemplate('loanApproved', lang, { name, amount, currency });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendLoanRejectedEmail: async (toEmail, name, reason, lang = 'fr') => {
        const template = getEmailTemplate('loanRejected', lang, { name, reason });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    // --- CARD TEMPLATES ---
    sendCardShippedEmail: async (toEmail, name, cardType, lang = 'fr') => {
        const template = getEmailTemplate('cardShipped', lang, { name, cardType });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    // --- TRANSACTION TEMPLATES ---
    sendTransactionValidatedEmail: async (toEmail, name, amount, currency, description, lang = 'fr') => {
        const template = getEmailTemplate('transactionValidated', lang, { name, amount, currency, description });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendTransactionInReviewEmail: async (toEmail, name, amount, currency, description, lang = 'fr') => {
        const template = getEmailTemplate('transactionInReview', lang, { name, amount, currency, description });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    sendTransactionRejectedEmail: async (toEmail, name, amount, currency, reason, lang = 'fr') => {
        const template = getEmailTemplate('transactionRejected', lang, { name, amount, currency, reason });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    },

    // --- SUPPORT TEMPLATE ---
    sendSupportResponseEmail: async (toEmail, name, subject, lang = 'fr') => {
        const template = getEmailTemplate('supportResponse', lang, { name, subject });
        return adminEmailService.triggerEmail(toEmail, template.subject, template.html);
    }
};
