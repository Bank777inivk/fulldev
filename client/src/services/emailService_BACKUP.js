const ADMIN_EMAIL = 'contact@inviksa.com';

/**
 * Get email template in specified language
 * @param {string} templateName - Name of the template
 * @param {string} lang - Language code ('fr' or 'en')
 * @param {object} data - Data to populate the template
 * @returns {object} { subject, html }
 */
const getEmailTemplate = (templateName, lang = 'fr', data) => {
    // Email translations object
    const emailTemplates = {
        // Public Lead Confirmation (Simulator/Credit Request)
        publicLeadConfirmation: {
            fr: {
                subject: "Confirmation de votre demande de simulation - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Votre demande de financement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous avons bien reçu votre demande de simulation de crédit. Un conseiller INVIK BANK va étudier vos informations pour vous proposer une solution adaptée.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant estimé :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('fr-FR')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durée :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} mois</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualité :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('fr-FR')} €/mois</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Type de projet :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulation'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Dossier en attente</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Pour accélérer le traitement de votre dossier, nous vous invitons à créer votre espace client sécurisé si ce n'est pas déjà fait.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finaliser ma demande</a>
                            </div>

                            <p>Merci de votre confiance,<br><strong>L'équipe Crédit INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Confirmation of your loan simulation request - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Your financing request</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We have received your loan simulation request. An INVIK BANK advisor will review your information to propose a suitable solution.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estimated amount:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">€${parseFloat(data.montant).toLocaleString('en-US')}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} months</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monthly payment:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">€${parseFloat(data.mensualite).toLocaleString('en-US')}/month</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Project type:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulation'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Pending review</td>
                                    </tr>
                                </table>
                            </div>

                            <p>To expedite the processing of your application, we invite you to create your secure client account if you haven't already.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Complete my request</a>
                            </div>

                            <p>Thank you for your trust,<br><strong>The INVIK BANK Credit Team</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Confirmação do seu pedido de simulação - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">O seu pedido de financiamento</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Recebemos o seu pedido de simulação de crédito. Um consultor do INVIK BANK analisará as suas informações para lhe propor uma solução adequada.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montante estimado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('pt-PT')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duração:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} meses</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualidade:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('pt-PT')} €/mês</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tipo de projeto:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulação'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Dossiê em espera</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Para acelerar o tratamento do seu pedido, convidamo-lo a criar a sua área de cliente segura, caso ainda não o tenha feito.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finalizar o meu pedido</a>
                            </div>

                            <p>Obrigado pela sua confiança,<br><strong>A Equipa de Crédito INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Conferma della tua richiesta di simulazione - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">La tua richiesta di finanziamento</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Abbiamo ricevuto la tua richiesta di simulazione di credito. Un consulente INVIK BANK esaminerà le tue informazioni per proporti una soluzione adeguata.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Importo stimato:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('it-IT')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durata:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} mesi</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Rata mensile:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('it-IT')} €/mese</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tipo di progetto:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulazione'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Stato:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Pratica in attesa</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Per accelerare il trattamento della tua richiesta, ti invitiamo a creare la tua area clienti sicura, se non l'hai già fatto.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finalizzare la mia richiesta</a>
                            </div>

                            <p>Grazie per la tua fiducia,<br><strong>Il Team di Credito INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Confirmación de su solicitud de simulación - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Su solicitud de financiación</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Hemos recibido su solicitud de simulación de crédito. Un asesor de INVIK BANK revisará su información para proponerle una solución adecuada.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monto estimado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('es-ES')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duración:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} meses</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualidad:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('es-ES')} €/mes</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Tipo de proyecto:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulación'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estado:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Expediente en espera</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Para agilizar el trámite de su solicitud, le invitamos a crear su área de cliente segura, si aún no lo ha hecho.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Finalizar mi solicitud</a>
                            </div>

                            <p>Gracias por su confianza,<br><strong>El equipo de crédito de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Bestätigung Ihrer Kreditsimulationsanfrage - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Ihre Finanzierungsanfrage</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>wir haben Ihre Kreditsimulationsanfrage erhalten. Ein Berater der INVIK BANK wird Ihre Informationen prüfen, um Ihnen eine passende Lösung anzubieten.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Geschätzter Betrag:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b;">${parseFloat(data.montant).toLocaleString('de-DE')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Dauer:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree} Monate</td>
                                    </tr>
                                    ${data.mensualite ? `
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Monatliche Rate:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite).toLocaleString('de-DE')} €/Monat</td>
                                    </tr>
                                    ` : ''}
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Projekttyp:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.typeCredit || 'Simulation'}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Status:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Unterlagen in Warteschlange</td>
                                    </tr>
                                </table>
                            </div>

                            <p>Um die Bearbeitung Ihrer Anfrage zu beschleunigen, laden wir Sie ein, Ihren sicheren Kundenbereich einzurichten, falls Sie dies noch nicht getan haben.</p>
                            
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/register" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Anfrage abschließen</a>
                            </div>

                            <p>Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Kredit-Team</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // Welcome Email
        welcome: {
            fr: {
                subject: "Bienvenue chez INVIK BANK !",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BIENVENUE</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">L'excellence bancaire commence ici</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>C'est un plaisir de vous compter parmi nos nouveaux clients. Votre compte est désormais actif et prêt à l'emploi.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Vos premiers pas avec INVIK :</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complétez votre profil et vérifiez votre identité</li>
                                    <li style="margin-bottom: 10px;">Commandez votre carte INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Effectuez votre premier dépôt par virement SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Accéder à mon espace client</a>
                            </div>

                            <p>Notre équipe est à votre entière disposition pour vous accompagner dans tous vos projets financiers.</p>
                            <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Welcome to INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">WELCOME</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">Banking excellence starts here</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>It is a pleasure to have you among our new clients. Your account is now active and ready to use.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Your first steps with INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complete your profile and verify your identity</li>
                                    <li style="margin-bottom: 10px;">Order your INVIK Black Edition card</li>
                                    <li style="margin-bottom: 0;">Make your first deposit via SEPA transfer</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Access my account</a>
                            </div>

                            <p>Our team is at your full disposal to accompany you in all your financial projects.</p>
                            <p style="margin-top: 30px;">See you soon,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Bem-vindo ao INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BEM-VINDO</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">A excelência bancária começa aqui</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>É um prazer tê-lo como um dos nossos novos clientes. A sua conta está agora ativa e pronta a usar.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Os seus primeiros passos com o INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complete o seu perfil e verifique a sua identidade</li>
                                    <li style="margin-bottom: 10px;">Encomende o seu cartão INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Faça o seu primeiro depósito via transferência SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Aceder à minha conta</a>
                            </div>

                            <p>A nossa equipa está à sua inteira disposição para o acompanhar em todos os seus projetos financeiros.</p>
                            <p style="margin-top: 30px;">Até breve,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Benvenuto in INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BENVENUTO</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">L'eccellenza bancaria inizia qui</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>È un piacere averti tra i nostri nuovi clienti. Il tuo conto è ora attivo e pronto all'uso.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">I tuoi primi passi con INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Completa il tuo profilo e verifica la tua identità</li>
                                    <li style="margin-bottom: 10px;">Ordina la tua carta INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Effettua il tuo primo deposito tramite bonifico SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Accedi al mio account</a>
                            </div>

                            <p>Il nostro team è a tua completa disposizione per accompagnarti in tutti i tuoi progetti finanziari.</p>
                            <p style="margin-top: 30px;">A presto,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "¡Bienvenido a INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">BIENVENIDO</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">La excelencia bancaria comienza aquí</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Es un placer contar con usted entre nuestros nuevos clientes. Su cuenta ya está activa y lista para usar.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Sus primeros pasos con INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Complete su perfil y verifique su identidad</li>
                                    <li style="margin-bottom: 10px;">Solicite su tarjeta INVIK Black Edition</li>
                                    <li style="margin-bottom: 0;">Realice su primer depósito mediante transferencia SEPA</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Acceder a mi cuenta</a>
                            </div>

                            <p>Nuestro equipo está a su entera disposición para acompañarle en todos sus proyectos financieros.</p>
                            <p style="margin-top: 30px;">Hasta pronto,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Willkommen bei der INVIK BANK!",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px;">WILLKOMMEN</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-size: 18px;">Bankexzellenz beginnt hier</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>es ist uns eine Freude, Sie als neuen Kunden begrüßen zu dürfen. Ihr Konto ist nun aktiv und einsatzbereit.</p>
                            
                            <div style="background: #f8fbff; border-radius: 12px; padding: 30px; margin: 30px 0; border: 1px solid #e1e8f0;">
                                <h3 style="margin-top: 0; color: #003366; font-size: 16px;">Ihre ersten Schritte bei INVIK:</h3>
                                <ul style="padding-left: 20px; margin-bottom: 0;">
                                    <li style="margin-bottom: 10px;">Vervollständigen Sie Ihr Profil und verifizieren Sie Ihre Identität</li>
                                    <li style="margin-bottom: 10px;">Bestellen Sie Ihre INVIK Black Edition Karte</li>
                                    <li style="margin-bottom: 0;">Tätigen Sie Ihre erste Einzahlung per SEPA-Überweisung</li>
                                </ul>
                            </div>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/login" style="display: inline-block; padding: 15px 35px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; box-shadow: 0 4px 12px rgba(0,51,102,0.2);">Zugang zu meinem Konto</a>
                            </div>

                            <p>Unser Team steht Ihnen jederzeit gerne zur Verfügung, um Sie bei all Ihren Finanzprojekten zu unterstützen.</p>
                            <p style="margin-top: 30px;">Bis bald,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            }
        },
        // SEPA Transfer Sent (To Sender)
        transferSent: {
            fr: {
                subject: "Virement SEPA effectué - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Confirmation de virement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">C'est fait, ${data.name} !</h2>
                            <p>Votre virement vers <strong>${data.beneficiary}</strong> a été traité avec succès.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Date :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('fr-FR')}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Les fonds seront disponibles sur le compte du destinataire dans les délais interbancaires habituels.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "SEPA Transfer Sent - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Transfer Confirmation</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">It's done, ${data.name}!</h2>
                            <p>Your transfer to <strong>${data.beneficiary}</strong> has been successfully processed.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">€${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiary:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Date:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('en-US')}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Funds will be available in the recipient's account within the usual interbank processing times.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Transferência SEPA enviada - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Confirmação de Transferência</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Está feito, ${data.name}!</h2>
                            <p>A sua transferência para <strong>${data.beneficiary}</strong> foi processada com sucesso.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiário:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Data:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('pt-PT')}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos estarão disponíveis na conta do destinatário dentro dos prazos interbancários habituais.</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Bonifico SEPA inviato - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Conferma di Bonifico</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">È fatto, ${data.name}!</h2>
                            <p>Il tuo bonifico verso <strong>${data.beneficiary}</strong> è stato elaborato con successo.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Data:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('it-IT')}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi saranno disponibili sul conto del destinatario entro i normali tempi interbancari.</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Transferencia SEPA enviada - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Confirmación de Transferencia</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">¡Hecho, ${data.name}!</h2>
                            <p>Su transferencia a <strong>${data.beneficiary}</strong> ha sido procesada con éxito.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Fecha:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('es-ES')}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos estarán disponibles en la cuenta del destinatario dentro de los plazos interbancarios habituales.</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "SEPA-Überweisung gesendet - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Überweisungsbestätigung</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Erledigt, ${data.name}!</h2>
                            <p>Ihre Überweisung an <strong>${data.beneficiary}</strong> wurde erfolgreich bearbeitet.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Empfänger:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Datum:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${new Date().toLocaleDateString('de-DE')}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Der Betrag wird dem Empfängerkonto innerhalb der üblichen Banklaufzeiten gutgeschrieben.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // SEPA Transfer Received (To Recipient)
        transferReceived: {
            fr: {
                subject: "Virement SEPA reçu - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Nouveau virement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonne nouvelle, ${data.name} !</h2>
                            <p>Vous avez reçu un virement sur votre compte INVIK BANK.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #27ae60;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant crédité :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expéditeur :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60;">Disponible</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Les fonds sont immédiatement disponibles sur votre solde.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "SEPA Transfer Received - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">New Transfer</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Good news, ${data.name}!</h2>
                            <p>You have received a transfer to your INVIK BANK account.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #27ae60;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount credited:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60; font-size: 18px;">+ €${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Sender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60;">Available</td>
                                    </tr>
                                </table>
                            </div>
                            <p>The funds are immediately available in your balance.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Transferência SEPA recebida - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Nova transferência</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Boas notícias, ${data.name}!</h2>
                            <p>Recebeu uma transferência na sua conta INVIK BANK.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #27ae60;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante creditado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remetente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60;">Disponível</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos estão imediatamente disponíveis no seu saldo.</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Bonifico SEPA ricevuto - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Nuovo bonifico</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buone notizie, ${data.name}!</h2>
                            <p>Hai ricevuto un bonifico sul tuo conto INVIK BANK.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #27ae60;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo accreditato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Mittente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60;">Disponibile</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi sono immediatamente disponibili sul tuo saldo.</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Transferencia SEPA recibida - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Nueva transferencia</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">¡Buenas noticias, ${data.name}!</h2>
                            <p>Ha recibido una transferencia en su cuenta de INVIK BANK.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #27ae60;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto acreditado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remitente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60;">Disponible</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos están disponibles de inmediato en su saldo.</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "SEPA-Überweisung erhalten - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #27ae60 0%, #2ecc71 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Neue Überweisung</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Gute Nachrichten, ${data.name}!</h2>
                            <p>Sie haben eine Überweisung auf Ihr INVIK BANK Konto erhalten.</p>
                            <div style="background: #f0faf4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #27ae60;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Gutschrift:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Absender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #27ae60;">Verfügbar</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Der Betrag ist ab sofort in Ihrem Guthaben verfügbar.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            }
        },

        // Verification Reminder
        verificationReminder: {
            fr: {
                subject: "Action requise : Vérifiez votre identité - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Rappel de vérification</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Votre compte INVIK BANK a été créé avec succès, mais votre identité n'est pas encore vérifiée.</p>
                            <p>Pour accéder à l'ensemble de vos services bancaires et activer votre IBAN, vous devez nous transmettre vos justificatifs d'identité.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La vérification ne prend que quelques minutes.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Vérifier mon identité</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Si vous avez déjà soumis vos documents, merci de ne pas tenir compte de ce message. Notre équipe est en train de les examiner.</p>
                            <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            en: {
                subject: "Action Required: Verify your identity - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Verification Reminder</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Your INVIK BANK account has been successfully created, but your identity is not yet verified.</p>
                            <p>To access all your banking services and activate your IBAN, you must send us your identity documents.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">Verification only takes a few minutes.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verify my identity</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">If you have already submitted your documents, please ignore this message. Our team is currently reviewing them.</p>
                            <p style="margin-top: 30px;">See you soon,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            },
            pt: {
                subject: "Ação necessária: Verifique a sua identidade - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Lembrete de Verificação</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>A sua conta INVIK BANK foi criada com sucesso, mas a sua identidade ainda não está verificada.</p>
                            <p>Para aceder a todos os seus serviços bancários e ativar o seu IBAN, deve enviar-nos os seus documentos de identidade.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">A verificação demora apenas alguns minutos.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verificar a minha identidade</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Se já submeteu os seus documentos, ignore esta mensagem. A nossa equipa está a analisá-los.</p>
                            <p style="margin-top: 30px;">Até breve,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            it: {
                subject: "Azione richiesta: Verifica la tua identità - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Promemoria di Verifica</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Il tuo conto INVIK BANK è stato creato con successo, ma la tua identità non è ancora stata verificata.</p>
                            <p>Per accedere a tutti i tuoi servizi bancari e attivare il tuo IBAN, devi inviarci i tuoi documenti d'identità.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La verifica richiede solo pochi minuti.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verifica la mia identità</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Se hai già inviato i tuoi documenti, ignora questo messaggio. Il nostro team li sta esaminando.</p>
                            <p style="margin-top: 30px;">A presto,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            es: {
                subject: "Acción requerida: Verifique su identidad - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Recordatorio de Verificación</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Su cuenta de INVIK BANK se ha creado con éxito, pero su identidad aún no ha sido verificada.</p>
                            <p>Para acceder a todos sus servicios bancarios y activar su IBAN, debe enviarnos sus documentos de identidad.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La verificación solo toma unos minutos.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verificar mi identidad</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Si ya ha enviado sus documentos, ignore este mensaje. Nuestro equipo los está revisando.</p>
                            <p style="margin-top: 30px;">Hasta pronto,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div>
                `
            },
            de: {
                subject: "Aktion erforderlich: Identität verifizieren - INVIK BANK",
                html: (data) => `
                    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Verifizierungserinnerung</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Ihr INVIK BANK Konto wurde erfolgreich erstellt, aber Ihre Identität ist noch nicht verifiziert.</p>
                            <p>Um alle Bankdienstleistungen nutzen und Ihre IBAN aktivieren zu können, müssen Sie uns Ihre Identitätsdokumente zusenden.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">Die Verifizierung dauert nur wenige Minuten.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Identität verifizieren</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Falls Sie Ihre Dokumente bereits eingereicht haben, ignorieren Sie bitte diese Nachricht. Unser Team prüft sie derzeit.</p>
                            <p style="margin-top: 30px;">Bis bald,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div>
                `
            }
        }
    };

    // Get template for specified language or fallback to French
    const template = emailTemplates[templateName];
    if (!template) {
        console.error(`Template "${templateName}" not found`);
        return null;
    }

    const langTemplate = template[lang] || template['fr'];
    if (!langTemplate) {
        console.error(`Language "${lang}" not found for template "${templateName}"`);
        return null;
    }

    return {
        subject: langTemplate.subject,
        html: typeof langTemplate.html === 'function' ? langTemplate.html(data) : langTemplate.html
    };
};

const emailService = {
    triggerEmail: async (toEmail, subject, htmlContent) => {
        try {
            const response = await fetch('https://bank777inivk-fulldev.onrender.com/api/send-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ toEmail, subject, htmlContent })
            });
            if (!response.ok) throw new Error('Email sending failed');
            return await response.json();
        } catch (error) {
            console.error('Error sending email:', error);
            throw error;
        }
    },

    sendWelcomeEmailOld: async (toEmail, name) => {
        const html = `
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
        // OLD WELCOME EMAIL TEMPLATE (DEPRECATED)
        welcome: {
            fr: {
                subject: "Bienvenue chez INVIK BANK - Compte activé !",
                html: (data) => `
            < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <div style="margin-bottom: 20px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Bienvenue chez INVIK BANK</span>
                            </div>
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800;">FÉLICITATIONS !</h1>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6; background-color: #ffffff;">
                            <h2 style="color: #003366; margin-top: 0; font-size: 22px;">Bienvenue à bord, ${data.name}</h2>
                            <p style="font-size: 16px;">Votre adresse email a été validée avec succès. Nous sommes ravis de vous compter parmi nos clients privilégiés.</p>
                            
                            <div style="background: #f8fafc; border-radius: 15px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                 <h3 style="color: #003366; margin-top: 0; font-size: 18px;">Prochaines étapes :</h3>
                                 <ul style="padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;"><strong>Vérification d'identité</strong> : Complétez votre profil pour activer votre IBAN et commander votre carte physique.</li>
                                    <li style="margin-bottom: 10px;"><strong>Sécurité</strong> : Activez la double authentification pour une protection maximale.</li>
                                    <li><strong>Premier Dépôt</strong> : Alimentez votre compte pour commencer à profiter de nos services.</li>
                                 </ul>
                            </div>

                            <p>Chez INVIK BANK, nous réinventons l'expérience bancaire pour vous offrir le prestige et la flexibilité que vous méritez.</p>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 16px 35px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 51, 102, 0.2);">Accéder à mon tableau de bord</a>
                            </div>

                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 30px; text-align: center; font-size: 12px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - Le prestige sans compromis</p>
                            <p style="margin: 10px 0 0;">Ceci est un message automatique, merci de ne pas y répondre.</p>
                        </div>
                    </div >
    `
            },
            en: {
                subject: "Welcome to INVIK BANK - Account activated!",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <div style="margin-bottom: 20px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Welcome to INVIK BANK</span>
                            </div>
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800;">CONGRATULATIONS!</h1>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6; background-color: #ffffff;">
                            <h2 style="color: #003366; margin-top: 0; font-size: 22px;">Welcome aboard, ${data.name}</h2>
                            <p style="font-size: 16px;">Your email address has been successfully verified. We are delighted to have you among our valued clients.</p>
                            
                            <div style="background: #f8fafc; border-radius: 15px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                 <h3 style="color: #003366; margin-top: 0; font-size: 18px;">Next steps:</h3>
                                 <ul style="padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;"><strong>Identity verification</strong>: Complete your profile to activate your IBAN and order your physical card.</li>
                                    <li style="margin-bottom: 10px;"><strong>Security</strong>: Enable two-factor authentication for maximum protection.</li>
                                    <li><strong>First Deposit</strong>: Fund your account to start enjoying our services.</li>
                                 </ul>
                            </div>

                            <p>At INVIK BANK, we are reinventing the banking experience to offer you the prestige and flexibility you deserve.</p>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 16px 35px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 51, 102, 0.2);">Access my dashboard</a>
                            </div>

                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 30px; text-align: center; font-size: 12px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - Prestige without compromise</p>
                            <p style="margin: 10px 0 0;">This is an automated message, please do not reply.</p>
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Bem-vindo ao INVIK BANK - Conta Ativada!",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <div style="margin-bottom: 20px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Bem-vindo ao INVIK BANK</span>
                            </div>
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800;">PARABÉNS!</h1>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6; background-color: #ffffff;">
                            <h2 style="color: #003366; margin-top: 0; font-size: 22px;">Bem-vindo a bordo, ${data.name}</h2>
                            <p style="font-size: 16px;">O seu endereço de e-mail foi validado com sucesso. Estamos entusiasmados por tê-lo como um dos nossos clientes privilegiados.</p>
                            
                            <div style="background: #f8fafc; border-radius: 15px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                 <h3 style="color: #003366; margin-top: 0; font-size: 18px;">Próximos passos:</h3>
                                 <ul style="padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;"><strong>Verificação de identidade</strong>: Complete o seu perfil para ativar o seu IBAN e encomendar o seu cartão físico.</li>
                                    <li style="margin-bottom: 10px;"><strong>Segurança</strong>: Ative a autenticação de dois fatores para proteção máxima.</li>
                                    <li><strong>Primeiro Depósito</strong>: Adicione fundos à sua conta para começar a desfrutar dos nossos serviços.</li>
                                 </ul>
                            </div>

                            <p>No INVIK BANK, estamos a reinventar a experiência bancária para lhe oferecer o prestígio e a flexibilidade que merece.</p>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 16px 35px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 51, 102, 0.2);">Aceder ao meu painel</a>
                            </div>

                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 30px; text-align: center; font-size: 12px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - Prestígio sem compromisso</p>
                            <p style="margin: 10px 0 0;">Esta é uma mensagem automática, por favor não responda.</p>
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Benvenuto in INVIK BANK - Account attivato!",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <div style="margin-bottom: 20px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Benvenuto in INVIK BANK</span>
                            </div>
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800;">CONGRATULAZIONI!</h1>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6; background-color: #ffffff;">
                            <h2 style="color: #003366; margin-top: 0; font-size: 22px;">Benvenuto a bordo, ${data.name}</h2>
                            <p style="font-size: 16px;">Il tuo indirizzo email è stato verificato con successo. Siamo lieti di averti tra i nostri clienti privilegiati.</p>
                            
                            <div style="background: #f8fafc; border-radius: 15px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                 <h3 style="color: #003366; margin-top: 0; font-size: 18px;">Prossimi passi:</h3>
                                 <ul style="padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;"><strong>Verifica identità</strong>: Completa il tuo profilo per attivare il tuo IBAN e ordinare la tua carta fisica.</li>
                                    <li style="margin-bottom: 10px;"><strong>Sicurezza</strong>: Attiva l'autenticazione a due fattori per la massima protezione.</li>
                                    <li><strong>Primo Deposito</strong>: Ricarica il tuo conto per iniziare a usufruire dei nostri servizi.</li>
                                 </ul>
                            </div>

                            <p>In INVIK BANK, stiamo reinventando l'esperienza bancaria per offrirti il prestigio e la flessibilità che meriti.</p>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 16px 35px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 51, 102, 0.2);">Accedi alla mia dashboard</a>
                            </div>

                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 30px; text-align: center; font-size: 12px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - Il prestigio senza compromessi</p>
                            <p style="margin: 10px 0 0;">Questo è un messaggio automatico, si prega di non rispondere.</p>
                        </div>
                    </div >
    `
            },
            es: {
                subject: "¡Bienvenido a INVIK BANK - Cuenta activada!",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <div style="margin-bottom: 20px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Bienvenido a INVIK BANK</span>
                            </div>
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800;">¡FELICIDADES!</h1>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6; background-color: #ffffff;">
                            <h2 style="color: #003366; margin-top: 0; font-size: 22px;">Bienvenido a bordo, ${data.name}</h2>
                            <p style="font-size: 16px;">Su dirección de correo electrónico ha sido validada con éxito. Estamos encantados de contar con usted entre nuestros clientes privilegiados.</p>
                            
                            <div style="background: #f8fafc; border-radius: 15px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                 <h3 style="color: #003366; margin-top: 0; font-size: 18px;">Próximos pasos:</h3>
                                 <ul style="padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;"><strong>Verificación de identidad</strong>: Complete su perfil para activar su IBAN y solicitar su tarjeta física.</li>
                                    <li style="margin-bottom: 10px;"><strong>Seguridad</strong>: Active la autenticación de dos factores para una protección máxima.</li>
                                    <li><strong>Primer Depósito</strong>: Recargue su cuenta para empezar a disfrutar de nuestros servicios.</li>
                                 </ul>
                            </div>

                            <p>En INVIK BANK, estamos reinventando la experiencia bancaria para ofrecerle el prestigio y la flexibilidad que se merece.</p>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 16px 35px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 51, 102, 0.2);">Acceder a mi panel</a>
                            </div>

                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 30px; text-align: center; font-size: 12px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - El prestigio sin compromisos</p>
                            <p style="margin: 10px 0 0;">Este es un mensaje automático, por favor no responda.</p>
                        </div>
                    </div >
    `
            },
            de: {
                subject: "Willkommen bei der INVIK BANK - Konto aktiviert!",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px; text-align: center; color: white;">
                            <div style="margin-bottom: 20px;">
                                <span style="background: rgba(255,255,255,0.2); padding: 8px 15px; border-radius: 20px; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">Willkommen bei der INVIK BANK</span>
                            </div>
                            <h1 style="margin: 0; font-size: 28px; letter-spacing: 2px; font-weight: 800;">HERZLICHEN GLÜCKWUNSCH!</h1>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6; background-color: #ffffff;">
                            <h2 style="color: #003366; margin-top: 0; font-size: 22px;">Willkommen an Bord, ${data.name}</h2>
                            <p style="font-size: 16px;">Ihre E-Mail-Adresse wurde erfolgreich bestätigt. Wir freuen uns, Sie als einen unserer geschätzten Kunden begrüßen zu dürfen.</p>
                            
                            <div style="background: #f8fafc; border-radius: 15px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                 <h3 style="color: #003366; margin-top: 0; font-size: 18px;">Nächste Schritte:</h3>
                                 <ul style="padding-left: 20px; color: #475569;">
                                    <li style="margin-bottom: 10px;"><strong>Identitätsprüfung</strong>: Vervollständigen Sie Ihr Profil, um Ihre IBAN zu aktivieren und Ihre physische Karte zu bestellen.</li>
                                    <li style="margin-bottom: 10px;"><strong>Sicherheit</strong>: Aktivieren Sie die Zwei-Faktor-Authentifizierung für maximalen Schutz.</li>
                                    <li><strong>Erste Einzahlung</strong>: Laden Sie Ihr Konto auf, um unsere Services nutzen zu können.</li>
                                 </ul>
                            </div>

                            <p>Bei der INVIK BANK erfinden wir das Banking-Erlebnis neu, um Ihnen das Prestige und die Flexibilität zu bieten, die Sie verdienen.</p>

                            <div style="text-align: center; margin: 40px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 16px 35px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 10px 20px rgba(0, 51, 102, 0.2);">Zum Dashboard</a>
                            </div>

                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 30px; text-align: center; font-size: 12px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - Prestige ohne Kompromisse</p>
                            <p style="margin: 10px 0 0;">Dies ist eine automatisch generierte Nachricht, bitte antworten Sie nicht darauf.</p>
                        </div>
                    </div >
    `
            }
        },

        // Transfer Sent Email
        transferSent: {
            fr: {
                subject: "Confirmation de virement - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Confirmation de virement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous vous confirmons que votre virement a bien été envoyé.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)
            } €</td>
                                    </tr >
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Référence :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894;">Envoyé</td>
                                    </tr>
                                </table >
                            </div >
                            <p>Les fonds seront disponibles sur le compte du bénéficiaire selon les délais bancaires habituels.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div >
    <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
        Ce message a été envoyé automatiquement, merci de ne pas y répondre.
    </div>
                    </div >
    `
            },
            en: {
                subject: "Transfer Confirmation - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transfer Confirmation</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We confirm that your transfer has been successfully sent.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">€${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiary:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Reference:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894;">Sent</td>
                                    </tr>
                                </table>
                            </div>
                            <p>The funds will be available in the beneficiary's account according to standard banking processing times.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            This message was sent automatically, please do not reply.
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Confirmação de Transferência - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Confirmação de Transferência</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Confirmamos que a sua transferência foi enviada com sucesso.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiário:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referência:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894;">Enviado</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos estarão disponíveis na conta do beneficiário de acordo com os prazos bancários habituais.</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Esta mensagem foi enviada automaticamente, por favor não responda.
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Conferma di Bonifico - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Conferma di Bonifico</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Ti confermiamo che il tuo bonifico è stato inviato con successo.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Riferimento:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894;">Inviato</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi saranno disponibili sul conto del beneficiario secondo i tempi bancari standard.</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Questo messaggio è stato inviato automaticamente, si prega di non rispondere.
                        </div>
                    </div >
    `
            },
            es: {
                subject: "Confirmación de Transferencia - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Confirmación de Transferencia</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Le confirmamos que su transferencia ha sido enviada con éxito.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referencia:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894;">Enviado</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos estarán disponibles en la cuenta del beneficiario según los plazos bancarios habituales.</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Este mensaje ha sido enviado automáticamente, por favor no responda.
                        </div>
                    </div >
    `
            },
            de: {
                subject: "Überweisungsbestätigung - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Überweisungsbestätigung</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Wir bestätigen, dass Ihre Überweisung erfolgreich gesendet wurde.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Empfänger:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referenz:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894;">Gesendet</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Der Betrag wird dem Empfängerkonto gemäß den üblichen Banklaufzeiten gutgeschrieben.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Dies ist eine automatisch generierte Nachricht, bitte antworten Sie nicht darauf.
                        </div>
                    </div >
    `
            }
        },

        // Transfer Received Email
        transferReceived: {
            fr: {
                subject: "Vous avez reçu un virement - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #00b894 0%, #00d2ad 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Bonne nouvelle !</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Vous venez de recevoir un virement sur votre compte INVIK BANK.</p>
                            <div style="background: #f0fff4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #00b894;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant reçu :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">De la part de :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Votre nouveau solde est disponible dès maintenant sur votre application.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                        </div>
                    </div >
    `
            },
            en: {
                subject: "You received a transfer - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #00b894 0%, #00d2ad 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Good news!</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>You just received a transfer to your INVIK BANK account.</p>
                            <div style="background: #f0fff4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #00b894;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount received:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894; font-size: 18px;">+ €${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">From:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Your new balance is now available in your app.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            This message was sent automatically, please do not reply.
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Recebeu uma transferência - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #00b894 0%, #00d2ad 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Boas notícias!</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Acabou de receber uma transferência na sua conta INVIK BANK.</p>
                            <div style="background: #f0fff4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #00b894;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante recebido:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">De:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>O seu novo saldo já está disponível na sua aplicação.</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Esta mensagem foi enviada automaticamente, por favor não responda.
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Hai ricevuto un bonifico - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #00b894 0%, #00d2ad 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Buone notizie!</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Hai appena ricevuto un bonifico sul tuo conto INVIK BANK.</p>
                            <div style="background: #f0fff4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #00b894;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo ricevuto:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Da parte di:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Il tuo nuovo saldo è disponibile da ora sulla tua applicazione.</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Questo messaggio è stato inviato automaticamente, si prega di non rispondere.
                        </div>
                    </div >
    `
            },
            es: {
                subject: "Ha recibido una transferencia - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #00b894 0%, #00d2ad 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">¡Buenas noticias!</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Acaba de recibir una transferencia en su cuenta INVIK BANK.</p>
                            <div style="background: #f0fff4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #00b894;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto recibido:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">De parte de:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Su nuevo saldo ya está disponible en su aplicación.</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Este mensaje ha sido enviado automáticamente, por favor no responda.
                        </div>
                    </div >
    `
            },
            de: {
                subject: "Sie haben eine Überweisung erhalten - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #00b894 0%, #00d2ad 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Gute Nachrichten!</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Sie haben soeben eine Überweisung auf Ihr INVIK BANK Konto erhalten.</p>
                            <div style="background: #f0fff4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #00b894;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Erhaltener Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894; font-size: 18px;">+ ${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Von:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Ihr neuer Kontostand ist ab sofort in Ihrer App verfügbar.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Dies ist eine automatisch generierte Nachricht, bitte antworten Sie nicht darauf.
                        </div>
                    </div >
    `
            }
        },

        // KYC Verification Reminder
        verificationReminder: {
            fr: {
                subject: "Action requise : Vérifiez votre identité - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Rappel de vérification</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Votre compte INVIK BANK a été créé avec succès, mais votre identité n'est pas encore vérifiée.</p>
                            <p>Pour accéder à l'ensemble de vos services bancaires et activer votre IBAN, vous devez nous transmettre vos justificatifs d'identité.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La vérification ne prend que quelques minutes.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Vérifier mon identité</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Si vous avez déjà soumis vos documents, merci de ne pas tenir compte de ce message. Notre équipe est en train de les examiner.</p>
                            <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                            <p style="margin: 0;">Conformément à la réglementation bancaire, la vérification d'identité est obligatoire.</p>
                        </div>
                    </div >
    `
            },
            en: {
                subject: "Action required: Verify your identity - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Verification Reminder</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Your INVIK BANK account has been successfully created, but your identity is not yet verified.</p>
                            <p>To access all banking services and activate your IBAN, you must submit your identity documents.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">Verification takes only a few minutes.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800;font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verify my identity</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">If you have already submitted your documents, please disregard this message. Our team is reviewing them.</p>
                            <p style="margin-top: 30px;">See you soon,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                            <p style="margin: 0;">In accordance with banking regulations, identity verification is mandatory.</p>
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Ação necessária: Verifique a sua identidade - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Lembrete de Verificação</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>A sua conta INVIK BANK foi criada com sucesso, mas a sua identidade ainda não foi verificada.</p>
                            <p>Para aceder a todos os serviços bancários e ativar o seu IBAN, deve submeter os seus documentos de identidade.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">A verificação demora apenas alguns minutos.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800;font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verificar identidade</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Se já submeteu os seus documentos, por favor ignore esta mensagem. A nossa equipa está a analisá-los.</p>
                            <p style="margin-top: 30px;">Até breve,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                            <p style="margin: 0;">De acordo com os regulamentos bancários, a verificação de identidade é obrigatória.</p>
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Azione richiesta: Verifica la tua identità - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Promemoria Verifica</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Il tuo conto INVIK BANK è stato creato con successo, ma la tua identità non è ancora stata verificata.</p>
                            <p>Per accedere a tutti i servizi bancari e attivare il tuo IBAN, devi inviare i tuoi documenti d'identità.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La verifica richiede solo pochi minuti.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800;font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verifica identità</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Se hai già inviato i tuoi documenti, ti preghiamo di ignorare questo messaggio. Il nostro team li sta esaminando.</p>
                            <p style="margin-top: 30px;">A presto,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                            <p style="margin: 0;">In conformità con le normative bancarie, la verifica dell'identità è obbligatoria.</p>
                        </div>
                    </div >
    `
            },
            es: {
                subject: "Acción requerida: Verifique su identidad - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Recordatorio de Verificación</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Su cuenta INVIK BANK se ha creado con éxito, pero su identidad aún no ha sido verificada.</p>
                            <p>Para acceder a todos los servicios bancarios y activar su IBAN, debe enviar sus documentos de identidad.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">La verificación solo toma unos minutos.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800;font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Verificar mi identidad</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Si ya ha enviado sus documentos, ignore este mensaje. Nuestro equipo los está revisando.</p>
                            <p style="margin-top: 30px;">Hasta pronto,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                            <p style="margin: 0;">De acuerdo con las regulaciones bancarias, la verificación de identidad es obligatoria.</p>
                        </div>
                    </div >
    `
            },
            de: {
                subject: "Aktion erforderlich: Verifizieren Sie Ihre Identität - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Verifizierungserinnerung</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Ihr INVIK BANK Konto wurde erfolgreich erstellt, aber Ihre Identität ist noch nicht verifiziert.</p>
                            <p>Um Zugriff auf alle Bankdienstleistungen zu erhalten und Ihre IBAN zu aktivieren, müssen Sie Ihre Identitätsdokumente einreichen.</p>
                            <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                                <p style="margin: 0; font-weight: 600; color: #d35400;">Die Verifizierung dauert nur wenige Minuten.</p>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800;font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Identität verifizieren</a>
                            </div>
                            <p style="font-size: 14px; color: #666;">Falls Sie Ihre Dokumente bereits eingereicht haben, ignorieren Sie bitte diese Nachricht. Unser Team prüft sie gerade.</p>
                            <p style="margin-top: 30px;">Bis bald,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                            <p style="margin: 0;">Gemäß den Bankvorschriften ist eine Identitätsverifizierung obligatorisch.</p>
                        </div>
                    </div >
    `
            }
        },

        // KYC Verification In Progress
        verificationInProgress: {
            fr: {
                subject: "Nous avons reçu votre dossier de vérification - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Dossier reçu</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Merci ${data.name},</h2>
                            <p>Nous avons bien reçu vos documents de vérification d'identité.</p>
                            <p>Notre équipe de conformité procède actuellement à l'examen de votre dossier. Ce processus prend généralement moins de 24 heures.</p>
                            <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                                <p style="margin: 0; font-weight: 600; color: #1e40af;">Statut actuel : Examen en cours</p>
                            </div>
                            <p>Vous recevrez un email dès que votre compte sera activé. En attendant, vous pouvez naviguer sur votre espace client et préparer vos futurs projets.</p>
                            <p style="margin-top: 30px;">Merci de votre patience,<br><strong>L'équipe Conformité INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            en: {
                subject: "We received your verification documents - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Documents Received</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Thank you ${data.name},</h2>
                            <p>We have successfully received your identity verification documents.</p>
                            <p>Our compliance team is currently reviewing your file. This process typically takes less than 24 hours.</p>
                            <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                                <p style="margin: 0; font-weight: 600; color: #1e40af;">Current status: Under review</p>
                            </div>
                            <p>You will receive an email as soon as your account is activated. In the meantime, you can browse your client area and plan your future projects.</p>
                            <p style="margin-top: 30px;">Thank you for your patience,<br><strong>The INVIK BANK Compliance Team</strong></p>
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Recebemos os seus documentos de verificação - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Documentos Recebidos</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Obrigada ${data.name},</h2>
                            <p>Recebemos com sucesso os seus documentos de verificação de identidade.</p>
                            <p>A nossa equipa de conformidade está atualmente a analisar o seu processo. Este processo demora normalmente menos de 24 horas.</p>
                            <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                                <p style="margin: 0; font-weight: 600; color: #1e40af;">Estado atual: Em análise</p>
                            </div>
                            <p>Irá receber um e-mail assim que a sua conta for ativada. Entretanto, pode navegar na sua área de cliente e preparar os seus projetos futuros.</p>
                            <p style="margin-top: 30px;">Obrigada pela sua paciência,<br><strong>A Equipa de Conformidade INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Abbiamo ricevuto i tuoi documenti di verifica - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Documenti Ricevuti</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Grazie ${data.name},</h2>
                            <p>Abbiamo ricevuto con successo i tuoi documenti di verifica dell'identità.</p>
                            <p>Il nostro team di conformità sta attualmente esaminando la tua pratica. Questo processo richiede solitamente meno di 24 ore.</p>
                            <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                                <p style="margin: 0; font-weight: 600; color: #1e40af;">Stato attuale: In corso di revisione</p>
                            </div>
                            <p>Riceverai un'email non appena il tuo account sarà attivato. Nel frattempo, puoi navigare nella tua area clienti e pianificare i tuoi progetti futuri.</p>
                            <p style="margin-top: 30px;">Grazie per la tua pazienza,<br><strong>Il Team Conformità INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            es: {
                subject: "Hemos recibido sus documentos de verificación - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Documentos Recibidos</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Gracias ${data.name},</h2>
                            <p>Hemos recibido correctamente sus documentos de verificación de identidad.</p>
                            <p>Nuestro equipo de cumplimiento está revisando actualmente su expediente. Este proceso suele tardar menos de 24 horas.</p>
                            <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                                <p style="margin: 0; font-weight: 600; color: #1e40af;">Estado actual: En revisión</p>
                            </div>
                            <p>Recibirá un correo electrónico tan pronto como su cuenta sea activada. Mientras tanto, puede navegar por su área de cliente y planificar sus futuros proyectos.</p>
                            <p style="margin-top: 30px;">Gracias por su paciência,<br><strong>El equipo de Cumplimiento de INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            }
        },

        // SEPA Transfer Initiated (Sender)
        transferInitiated: {
            fr: {
                subject: "Virement SEPA en cours de traitement - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Virement SEPA initié</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Votre demande de virement vers un compte externe a été enregistrée et est en cours de traitement par nos services.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">En attente de validation</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Référence :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Conformément aux délais interbancaires SEPA, les fonds seront transférés après validation de notre service de sécurité (habituellement sous 24h à 48h ouvrées).</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            en: {
                subject: "SEPA Transfer Processing - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">SEPA Transfer Initiated</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Your transfer request to an external account has been registered and is being processed by our services.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">€${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiary:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Pending validation</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Reference:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>According to SEPA interbank processing times, funds will be transferred after validation by our security service (usually within 24-48 business hours).</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Transferência SEPA em Processamento - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferência SEPA Iniciada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>O seu pedido de transferência para uma conta externa foi registado e está a ser processado pelos nossos serviços.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiário:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">A aguardar validação</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referência:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>De acordo com os prazos interbancários SEPA, os fundos serão transferidos após a validação pelo nosso serviço de segurança (normalmente entre 24h a 48h úteis).</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Bonifico SEPA in Fase di Elaborazione - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Bonifico SEPA Iniziato</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>La tua richiesta di bonifico verso un conto esterno è stata registrata ed è in fase di elaborazione dai nostri servizi.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">In attesa di convalida</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Riferimento:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>In conformità con i tempi interbancari SEPA, i fondi saranno trasferiti dopo la convalida dal nostro servizio di sicurezza (solitamente entro 24-48 ore lavorative).</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            es: {
                subject: "Procesamiento de Transferencia SEPA - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferencia SEPA Iniciada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Su solicitud de transferencia a una cuenta externa ha sido registrada y está siendo procesada por nuestros servicios.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Pendiente de validación</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referencia:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>De acuerdo con los plazos interbancarios SEPA, los fondos se transferirán después de la validación por nuestro servicio de seguridad (normalmente en un plazo de 24 a 48 horas hábiles).</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            de: {
                subject: "SEPA-Überweisung in Bearbeitung - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">SEPA-Überweisung initiiert</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Ihre Überweisungsanfrage auf ein externes Konto wurde registriert und wird von unseren Diensten bearbeitet.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Empfänger:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Wartet auf Validierung</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referenz:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Gemäß den SEPA-Interbankenlaufzeiten wird der Betrag nach der Validierung durch unser Sicherheitsteam (in der Regel innerhalb von 24-48 Geschäftsstunden) überwiesen.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div >
    `
            }
        },

        // SEPA Transfer Pending (Recipient)
        transferPending: {
            fr: {
                subject: "Un virement est en attente - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Information de virement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Ceci est un message pour vous informer qu'un virement de la part de <strong>${data.sender}</strong> est actuellement en cours de traitement vers votre compte.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant attendu :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expéditeur :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut actuel :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Virement SEPA en cours</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Les fonds seront crédités sur votre compte dès réception de la validation finale du réseau SEPA (habituellement sous 24h à 48h).</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            en: {
                subject: "Incoming transfer - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Transfer Information</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>This is to inform you that a transfer from <strong>${data.sender}</strong> is currently being processed to your account.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expected amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">€${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Sender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Current status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">SEPA transfer in progress</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Funds will be credited to your account upon final validation from the SEPA network (usually within 24-48 hours).</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Uma transferência está pendente - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Informação de Transferência</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Esta é uma mensagem para o informar de que uma transferência de <strong>${data.sender}</strong> está atualmente a ser processada para a sua conta.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante esperado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remetente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado atual:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Transferência SEPA em curso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos serão creditados na sua conta após a validação final da rede SEPA (normalmente entre 24h a 48h).</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Un bonifico è in sospeso - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Informazioni sul Bonifico</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Ti informiamo che un bonifico da parte di <strong>${data.sender}</strong> è attualmente in fase di elaborazione verso il tuo conto.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo atteso:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Mittente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato attuale:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Bonifico SEPA in corso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi saranno accreditati sul tuo conto al ricevimento della convalida finale della rete SEPA (solitamente entro 24-48 ore).</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            es: {
                subject: "Una transferencia está pendiente - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Información de Transferencia</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Este es un mensaje para informarle que una transferencia de <strong>${data.sender}</strong> está actualmente en proceso hacia su cuenta.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto esperado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remitente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado actual:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Transferencia SEPA en curso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos se acreditarán en su cuenta tras la validación final de la red SEPA (normalmente en un plazo de 24 a 48 horas).</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            de: {
                subject: "Eingehende Überweisung - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Überweisungsinformation</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>wir möchten Sie darüber informieren, dass eine Überweisung von <strong>${data.sender}</strong> derzeit auf Ihr Konto bearbeitet wird.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Erwarteter Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Absender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Aktueller Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">SEPA-Überweisung läuft</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Der Betrag wird Ihrem Konto nach der endgültigen Bestätigung des SEPA-Netzwerks (in der Regel innerhalb von 24-48 Stunden) gutgeschrieben.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div >
    `
            }
        },
        pt: {
            subject: "Uma transferência está pendente - INVIK BANK",
            html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Informação de Transferência</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>Esta é uma mensagem para o informar de que uma transferência de <strong>${data.sender}</strong> está atualmente a ser processada para a sua conta.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante esperado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remetente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado atual:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Transferência SEPA em curso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Os fundos serão creditados na sua conta após a validação final da rede SEPA (normalmente entre 24h a 48h).</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div >
    `
        },
        it: {
            subject: "Un bonifico è in sospeso - INVIK BANK",
            html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Informazioni sul Bonifico</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>Ti informiamo che un bonifico da parte di <strong>${data.sender}</strong> è attualmente in fase di elaborazione verso il tuo conto.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo atteso:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Mittente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato attuale:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Bonifico SEPA in corso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>I fondi saranno accreditati sul tuo conto al ricevimento della convalida finale della rete SEPA (solitamente entro 24-48 ore).</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div >
    `
        },
        es: {
            subject: "Una transferencia está pendiente - INVIK BANK",
            html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Información de Transferencia</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Este es un mensaje para informarle que una transferencia de <strong>${data.sender}</strong> está actualmente en proceso hacia su cuenta.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto esperado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Remitente:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado actual:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Transferencia SEPA en curso</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Los fondos se acreditarán en su cuenta tras la validación final de la red SEPA (normalmente en un plazo de 24 a 48 horas).</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div >
    `
        },
        de: {
            subject: "Eingehende Überweisung - INVIK BANK",
            html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Überweisungsinformation</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>wir möchten Sie darüber informieren, dass eine Überweisung von <strong>${data.sender}</strong> derzeit auf Ihr Konto bearbeitet wird.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Erwarteter Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Absender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Aktueller Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">SEPA-Überweisung läuft</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Der Betrag wird Ihrem Konto nach der endgültigen Bestätigung des SEPA-Netzwerks (in der Regel innerhalb von 24-48 Stunden) gutgeschrieben.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div >
    `
        }
    },


        // SEPA Transfer Initiated (Sender)
        transferInitiated: {
            fr: {
                subject: "Virement SEPA en cours de traitement - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Virement SEPA initié</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Votre demande de virement vers un compte externe a été enregistrée et est en cours de traitement par nos services.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)
            } €</td>
                                    </tr >
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">En attente de validation</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Référence :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table >
                            </div >
                            <p>Conformément aux délais interbancaires SEPA, les fonds seront transférés après validation de notre service de sécurité (habituellement sous 24h à 48h ouvrées).</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div >
                    </div >
    `
            },
            en: {
                subject: "SEPA Transfer Processing - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">SEPA Transfer Initiated</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>Your transfer request to an external account has been registered and is being processed by our services.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">€${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiary:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Pending validation</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Reference:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>According to SEPA interbank processing times, funds will be transferred after validation by our security service (usually within 24-48 business hours).</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                    </div >
    `
            },
            pt: {
                subject: "Transferência SEPA em Processamento - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferência SEPA Iniciada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Olá ${data.name},</h2>
                            <p>O seu pedido de transferência para uma conta externa foi registado e está a ser processado pelos nossos serviços.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montante:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiário:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">A aguardar validação</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referência:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>De acordo com os prazos interbancários SEPA, os fundos serão transferidos após a validação pelo nosso serviço de segurança (normalmente entre 24h a 48h úteis).</p>
                            <p style="margin-top: 30px;">Obrigado pela sua confiança,<br><strong>A Equipa INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            it: {
                subject: "Bonifico SEPA in Fase di Elaborazione - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Bonifico SEPA Iniziato</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Buongiorno ${data.name},</h2>
                            <p>La tua richiesta di bonifico verso un conto esterno è stata registrata ed è in fase di elaborazione dai nostri servizi.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Importo:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Stato:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">In attesa di convalida</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Riferimento:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>In conformità con i tempi interbancari SEPA, i fondi saranno trasferiti dopo la convalida dal nostro servizio di sicurezza (solitamente entro 24-48 ore lavorative).</p>
                            <p style="margin-top: 30px;">Grazie per la tua fiducia,<br><strong>Il Team INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            es: {
                subject: "Procesamiento de Transferencia SEPA - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Transferencia SEPA Iniciada</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hola ${data.name},</h2>
                            <p>Su solicitud de transferencia a una cuenta externa ha sido registrada y está siendo procesada por nuestros servicios.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Monto:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Beneficiario:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Estado:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Pendiente de validación</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referencia:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>De acuerdo con los plazos interbancarios SEPA, los fondos se transferirán después de la validación por nuestro servicio de seguridad (normalmente en un plazo de 24 a 48 horas hábiles).</p>
                            <p style="margin-top: 30px;">Gracias por su confianza,<br><strong>El equipo de INVIK BANK</strong></p>
                        </div>
                    </div >
    `
            },
            de: {
                subject: "SEPA-Überweisung in Bearbeitung - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">SEPA-Überweisung initiiert</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Guten Tag ${data.name},</h2>
                            <p>Ihre Überweisungsanfrage auf ein externes Konto wurde registriert und wird von unseren Diensten bearbeitet.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Betrag:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Empfänger:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.beneficiary}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Wartet auf Validierung</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Referenz:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${data.ref.substring(0, 8)}</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Gemäß den SEPA-Interbankenlaufzeiten wird der Betrag nach der Validierung durch unser Sicherheitsteam (in der Regel innerhalb von 24-48 Geschäftsstunden) überwiesen.</p>
                            <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen,<br><strong>Ihr INVIK BANK Team</strong></p>
                        </div>
                    </div >
    `
            }
        },

        // SEPA Transfer Pending (Recipient)
        transferPending: {
            fr: {
                subject: "Un virement est en attente - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Information de virement</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Ceci est un message pour vous informer qu'un virement de la part de <strong>${data.sender}</strong> est actuellement en cours de traitement vers votre compte.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Montant attendu :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(data.amount).toFixed(2)} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expéditeur :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Statut actuel :</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Virement SEPA en cours</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Les fonds seront crédités sur votre compte dès réception de la validation finale du réseau SEPA (habituellement sous 24h à 48h).</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                        </div>
                    </div >
    `
            },
            en: {
                subject: "Incoming transfer - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Transfer Information</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>This is to inform you that a transfer from <strong>${data.sender}</strong> is currently being processed to your account.</p>
                            <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Expected amount:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">€${parseFloat(data.amount).toFixed(2)}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Sender:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right;">${data.sender}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #666;">Current status:</td>
                                        <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">SEPA transfer in progress</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Funds will be credited to your account upon final validation from the SEPA network (usually within 24-48 hours).</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            This message was sent automatically, please do not reply.
                        </div>
                    </div >
    `
            }
        },

        // Card Order Confirmation
        cardOrder: {
            fr: {
                subject: "Confirmation de commande de carte - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">L'élégance à votre portée</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous avons bien reçu votre commande pour votre nouvelle carte <strong>INVIK ${data.cardType}</strong>.</p>
                            <p>Nos équipes préparent actuellement l'expédition de votre précieux sésame. Vous recevrez une notification dès que votre colis aura été confié à notre transporteur.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Modèle commandé</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Adresse de livraison</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Délai estimé</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 à 5 jours ouvrés</span>
                                </div>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/cards" style="display: inline-block; padding: 12px 25px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(0,51,102,0.2);">Suivre ma commande</a>
                            </div>
                            <p>En attendant, vous pouvez commencer à utiliser vos services bancaires directement depuis votre application mobile.</p>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 25px; text-align: center; font-size: 11px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - Service Relation Client</p>
                            <p style="margin: 5px 0;">Ce message est automatique, merci de ne pas y répondre.</p>
                        </div>
                    </div >
    `
            },
            en: {
                subject: "Card Order Confirmation - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">Elegance at your fingertips</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We have received your order for your new <strong>INVIK ${data.cardType}</strong> card.</p>
                            <p>Our teams are currently preparing the shipment of your precious card. You will receive a notification once your package has been handed over to our carrier.</p>
                            <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0;">
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Ordered model</span>
                                    <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                                </div>
                                <div style="margin-bottom: 20px;">
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Delivery address</span>
                                    <span style="font-size: 15px; color: #1e293b;">${data.deliveryAddress}</span>
                                </div>
                                <div>
                                    <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Estimated delivery</span>
                                    <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 to 5 business days</span>
                                </div>
                            </div>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/cards" style="display: inline-block; padding: 12px 25px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(0,51,102,0.2);">Track my order</a>
                            </div>
                            <p>In the meantime, you can start using your banking services directly from your mobile app.</p>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #1a1a1a; padding: 25px; text-align: center; font-size: 11px; color: #777;">
                            <p style="margin: 0;">INVIK BANK SA - Customer Relations Service</p>
                            <p style="margin: 5px 0;">This is an automated message, please do not reply.</p>
                        </div>
                    </div >
    `
            }
        },

        // Loan Request Confirmation (Authenticated Users)
        loanRequest: {
            fr: {
                subject: "Confirmation de votre demande de crédit - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Votre projet, notre priorité</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous vous confirmons la bonne réception de votre demande de financement pour votre projet : <strong>${data.type}</strong>.</p>
                            <p>Un conseiller spécialisé de l'équipe INVIK BANK va étudier votre dossier. Vous recevrez une réponse de principe sous 24 à 48 heures ouvrées.</p>
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant demandé :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(data.montant || data.amount).toLocaleString('fr-FR')} €</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durée :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} mois</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualité estimée :</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('fr-FR')} €/mois</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut actuel :</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Étude en cours</td>
                                    </tr>
                                </table>
                            </div>
                            <p>Vous pouvez suivre l'avancement de votre dossier à tout moment depuis votre espace client, rubrique <strong>Crédits</strong>.</p>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Accéder à mon espace</a>
                            </div>
                            <p>Merci de votre confiance,<br><strong>L'équipe Crédit INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                            <p style="margin: 0;">Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</p>
                            <p style="margin: 10px 0 0;">Ce message est automatique, merci de ne pas y répondre.</p>
                        </div>
                    </div >
    `
            },
            en: {
                subject: "Your loan request confirmation - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.9;">Your project, our priority</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We confirm receipt of your financing request for your project: <strong>${data.type}</strong>.</p>
                            <p>A specialized advisor from the INVIK BANK team will review your application. You will receive a preliminary response within 24 to 48 business hours.</p>
                            <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Requested amount:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">€${parseFloat(data.montant || data.amount).toLocaleString('en-US')}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Duration:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${data.duree || data.duration} months</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Estimated monthly payment:</td>
                                        <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">€${parseFloat(data.mensualite || data.monthlyPayment).toLocaleString('en-US')}/month</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Current status:</td>
                                        <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Under review</td>
                                    </tr>
                                </table>
                            </div>
                            <p>You can track the progress of your application at any time from your client area, <strong>Loans</strong> section.</p>
                            <div style="text-align: center; margin: 35px 0;">
                                <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Access my account</a>
                            </div>
                            <p>Thank you for your trust,<br><strong>The INVIK BANK Credit Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                            <p style="margin: 0;">A loan commits you and must be repaid. Check your repayment capacity before committing.</p>
                            <p style="margin: 10px 0 0;">This is an automated message, please do not reply.</p>
                        </div>
                    </div >
    `
            }
        },

        // Contact Form Confirmation
        contactConfirmation: {
            fr: {
                subject: "Nous avons bien reçu votre message - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Message reçu</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Bonjour ${data.name},</h2>
                            <p>Nous avons bien reçu votre message via notre formulaire de contact.</p>
                            <p>Notre équipe vous répondra dans les plus brefs délais, généralement sous 24 heures ouvrées.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Votre demande concerne :</strong> ${data.subject || 'Demande générale'}</p>
                            </div>
                            <p>Si votre demande est urgente, vous pouvez également nous joindre :</p>
                            <ul style="color: #666;">
                                <li>Par email : <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>Par téléphone : +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                        </div>
                    </div >
    `
            },
            en: {
                subject: "We received your message - INVIK BANK",
                html: (data) => `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                        <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                            <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                            <p style="margin-top: 10px; opacity: 0.8;">Message received</p>
                        </div>
                        <div style="padding: 40px; color: #333; line-height: 1.6;">
                            <h2 style="color: #003366; margin-top: 0;">Hello ${data.name},</h2>
                            <p>We have received your message via our contact form.</p>
                            <p>Our team will respond as soon as possible, typically within 24 business hours.</p>
                            <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                                <p style="margin: 0; font-size: 14px; color: #666;"><strong>Your request concerns:</strong> ${data.subject || 'General inquiry'}</p>
                            </div>
                            <p>If your request is urgent, you can also reach us:</p>
                            <ul style="color: #666;">
                                <li>By email: <a href="mailto:contact@inviksa.com" style="color: #003366;">contact@inviksa.com</a></li>
                                <li>By phone: +33 1 XX XX XX XX</li>
                            </ul>
                            <p style="margin-top: 30px;">Thank you for your trust,<br><strong>The INVIK BANK Team</strong></p>
                        </div>
                        <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                            This message was sent automatically, please do not reply.
                        </div>
                    </div >
    `
            }
        }
    };

    // Get template for specified language, fallback to French if not found
    const template = emailTemplates[templateName]?.[lang] || emailTemplates[templateName]?.['fr'];

    if (!template) {
        console.error(`Email template "${templateName}" not found for language "${lang}"`);
        return { subject: '', html: '' };
    }

    return {
        subject: template.subject,
        html: template.html(data)
    };
};

export const emailService = {
    /**
     * Sends a POST request to the Vercel serverless function
     */
    triggerEmail: async (to, subject, html) => {
        try {
            const response = await fetch('/api/send-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ to, subject, html }),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to send email');
            return data;
        } catch (error) {
            console.error('Email trigger error:', error);
            // We don't throw here to avoid blocking the transaction if email fails
            return { success: false, error: error.message };
        }
    },

    /**
     * Template for Transfer Sent
     */
    sendTransferSentEmail: async (toEmail, name, amount, beneficiary, ref) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.8;">Confirmation de virement</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Bonjour ${name},</h2>
                    <p>Nous vous confirmons que votre virement a bien été envoyé.</p>
                    
                    <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #003366;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Montant :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(amount).toFixed(2)} €</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">${beneficiary}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Référence :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${ref.substring(0, 8)}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p>Les fonds seront disponibles sur le compte du bénéficiaire selon les délais bancaires habituels.</p>
                    <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Confirmation de virement - INVIK BANK", html);
    },

    /**
     * Template for Transfer Received
     */
    sendTransferReceivedEmail: async (toEmail, name, amount, sender) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #00b894 0%, #00d2ad 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.9;">Bonne nouvelle !</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Bonjour ${name},</h2>
                    <p>Vous venez de recevoir un virement sur votre compte INVIK BANK.</p>
                    
                    <div style="background: #f0fff4; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #00b894;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Montant reçu :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #00b894; font-size: 18px;">+ ${parseFloat(amount).toFixed(2)} €</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">De la part de :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">${sender}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p>Votre nouveau solde est disponible dès maintenant sur votre application.</p>
                    <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Vous avez reçu un virement - INVIK BANK", html);
    },

    /**
     * Template for SEPA Transfer Initiated (For Sender)
     */
    sendTransferInitiatedEmail: async (toEmail, name, amount, beneficiary, ref) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.8;">Virement SEPA initié</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Bonjour ${name},</h2>
                    <p>Votre demande de virement vers un compte externe a été enregistrée et est en cours de traitement par nos services.</p>
                    
                    <div style="background: #f8fbff; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Montant :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">${parseFloat(amount).toFixed(2)} €</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Bénéficiaire :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">${beneficiary}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Statut :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">En attente de validation</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Référence :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #888;">#${ref.substring(0, 8)}</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p>Conformément aux délais interbancaires SEPA, les fonds seront transférés après validation de notre service de sécurité (habituellement sous 24h à 48h ouvrées).</p>
                    <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Virement SEPA en cours de traitement - INVIK BANK", html);
    },

    /**
     * Template for SEPA Transfer Pending (For Recipient)
     */
    sendTransferPendingEmail: async (toEmail, name, amount, sender) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #f39c12 0%, #f1c40f 100%); padding: 30px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 24px; letter-spacing: 1px;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.9;">Information de virement</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Bonjour ${name},</h2>
                    <p>Ceci est un message pour vous informer qu'un virement de la part de <strong>${sender}</strong> est actuellement en cours de traitement vers votre compte.</p>
                    
                    <div style="background: #fff9eb; border-radius: 8px; padding: 20px; margin: 25px 0; border-left: 4px solid #f39c12;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Montant attendu :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #e67e22; font-size: 18px;">${parseFloat(amount).toFixed(2)} €</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Expéditeur :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right;">${sender}</td>
                            </tr>
                            <tr>
                                <td style="padding: 5px 0; color: #666;">Statut actuel :</td>
                                <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #f39c12;">Virement SEPA en cours</td>
                            </tr>
                        </table>
                    </div>
                    
                    <p>Les fonds seront crédités sur votre compte dès réception de la validation finale du réseau SEPA (habituellement sous 24h à 48h).</p>
                    <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 20px; text-align: center; font-size: 12px; color: #999;">
                    Ce message a été envoyé automatiquement, merci de ne pas y répondre.
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Un virement est en attente - INVIK BANK", html);
    },

    /**
     * Template for Card Order Confirmation
     */
    sendCardOrderEmail: async (toEmail, name, cardType, deliveryAddress) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #2c3e50 0%, #000000 100%); padding: 35px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.9; font-style: italic;">L'élégance à votre portée</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Bonjour ${name},</h2>
                    <p>Nous avons bien reçu votre commande pour votre nouvelle carte <strong>INVIK ${cardType}</strong>.</p>
                    
                    <p>Nos équipes préparent actuellement l'expédition de votre précieux sésame. Vous recevrez une notification dès que votre colis aura été confié à notre transporteur.</p>

                    <div style="background: #f8fafc; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #e2e8f0; position: relative;">
                        <div style="margin-bottom: 20px;">
                            <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Modèle commandé</span>
                            <span style="font-size: 18px; color: #1e293b; font-weight: 700;">INVIK BLACK EDITION</span>
                        </div>
                        <div style="margin-bottom: 20px;">
                            <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Adresse de livraison</span>
                            <span style="font-size: 15px; color: #1e293b;">${deliveryAddress}</span>
                        </div>
                        <div>
                            <span style="display: block; font-size: 12px; color: #64748b; text-transform: uppercase; font-weight: bold; letter-spacing: 1px;">Délai estimé</span>
                            <span style="font-size: 15px; color: #27ae60; font-weight: 600;">3 à 5 jours ouvrés</span>
                        </div>
                    </div>

                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://www.inviksa.com/cards" style="display: inline-block; padding: 12px 25px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(0,51,102,0.2);">Suivre ma commande</a>
                    </div>
                    
                    <p>En attendant, vous pouvez commencer à utiliser vos services bancaires directement depuis votre application mobile.</p>
                    <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #1a1a1a; padding: 25px; text-align: center; font-size: 11px; color: #777;">
                    <p style="margin: 0;">INVIK BANK SA - Service Relation Client</p>
                    <p style="margin: 5px 0;">Ce message est automatique, merci de ne pas y répondre.</p>
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Confirmation de commande de carte - INVIK BANK", html);
    },

    /**
     * Template for Loan Request Confirmation
     */
    sendLoanRequestEmail: async (toEmail, name, loanDetails) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.9;">Votre projet, notre priorité</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Bonjour ${name},</h2>
                    <p>Nous vous confirmons la bonne réception de votre demande de financement pour votre projet : <strong>${loanDetails.type}</strong>.</p>
                    
                    <p>Un conseiller spécialisé de l'équipe INVIK BANK va étudier votre dossier. Vous recevrez une réponse de principe sous 24 à 48 heures ouvrées.</p>

                    <div style="background: #f8fbff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #003366; boxShadow: 0 4px 6px rgba(0,0,0,0.02);">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant demandé :</td>
                                <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(loanDetails.montant || loanDetails.amount).toLocaleString('fr-FR')} €</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durée :</td>
                                <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${loanDetails.duree || loanDetails.duration} mois</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualité estimée :</td>
                                <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(loanDetails.mensualite || loanDetails.monthlyPayment).toLocaleString('fr-FR')} €/mois</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut actuel :</td>
                                <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Étude en cours</td>
                            </tr>
                        </table>
                    </div>

                    <p>Vous pouvez suivre l'avancement de votre dossier à tout moment depuis votre espace client, rubrique <strong>Crédits</strong>.</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://www.inviksa.com/dashboard" style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Accéder à mon espace</a>
                    </div>

                    <p>Merci de votre confiance,<br><strong>L'équipe Crédit INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                    <p style="margin: 0;">Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</p>
                    <p style="margin: 10px 0 0;">Ce message est automatique, merci de ne pas y répondre.</p>
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Confirmation de votre demande de crédit - INVIK BANK", html);
    },

    /**
     * Admin Notification for New Card Order
     */
    sendAdminCardOrderNotification: async (userData, cardData) => {
        const html = `
    < div style = "font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;" >
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">🚨 NOUVELLE COMMANDE DE CARTE</h2>
            <p>Une nouvelle demande de carte physique a été soumise.</p>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Détails du Client</h3>
                <p><strong>Nom :</strong> ${userData.firstName} ${userData.lastName}</p>
                <p><strong>Email :</strong> ${userData.email}</p>
                <p><strong>ID Utilisateur :</strong> ${userData.id || 'N/A'}</p>

                <h3 style="margin-top: 20px;">Détails de la Carte</h3>
                <p><strong>Type :</strong> ${cardData.cardType || 'Black Edition'}</p>
                <p><strong>Adresse de livraison :</strong> ${cardData.deliveryAddress || 'Adresse par défaut'}</p>
                <p><strong>Date :</strong> ${new Date().toLocaleString('fr-FR')}</p>
            </div>

            <p style="color: #666; font-size: 12px;">Veuillez traiter cette demande dans le panneau d'administration.</p>
        </div>
            </div >
    `;
        return emailService.triggerEmail(ADMIN_EMAIL, `[ADMIN] Nouvelle commande de carte - ${ userData.lastName } `, html);
    },

    /**
     * Admin Notification for New Loan Request
     */
    sendAdminLoanRequestNotification: async (userData, loanData) => {
        const html = `
    < div style = "font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;" >
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">🏦 NOUVELLE DEMANDE DE CRÉDIT</h2>
            <p>Une nouvelle demande officielle de crédit a été déposée.</p>

            <div style="background-color: #fffaf0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Détails du Client</h3>
                <p><strong>Nom :</strong> ${userData.firstName} ${userData.lastName}</p>
                <p><strong>Email :</strong> ${userData.email}</p>

                <h3 style="margin-top: 20px;">Détails du Financement</h3>
                <p><strong>Projet :</strong> ${loanData.type}</p>
                <p><strong>Montant :</strong> ${parseFloat(loanData.montant || loanData.amount).toLocaleString('fr-FR')} €</p>
                <p><strong>Durée :</strong> ${loanData.duree || loanData.duration} mois</p>
                <p><strong>Mensualité :</strong> ${parseFloat(loanData.mensualite || loanData.monthlyPayment).toLocaleString('fr-FR')} €/mois</p>
                ${(loanData.taux || loanData.interestRate) ? `<p><strong>Taux (TAEG) :</strong> ${loanData.taux || loanData.interestRate}%</p>` : ''}

                <h3 style="margin-top: 20px;">Description du projet</h3>
                <p style="background: #fff; padding: 10px; border: 1px solid #eee; border-radius: 5px;">${loanData.description}</p>
            </div>

            <p style="color: #666; font-size: 12px;">Une étude de solvabilité doit être effectuée sous 24h.</p>
        </div>
            </div >
    `;
        return emailService.triggerEmail(ADMIN_EMAIL, `[ADMIN] Nouvelle demande de crédit - ${ userData.lastName } `, html);
    },

    /**
     * KYC Reminder Email (24h)
     */
    sendVerificationReminderEmail: async (toEmail, name) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.9;">Rappel de vérification</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Bonjour ${name},</h2>
                    <p>Votre compte INVIK BANK a été créé avec succès, mais votre identité n'est pas encore vérifiée.</p>
                    
                    <p>Pour accéder à l'ensemble de vos services bancaires et activer votre IBAN, vous devez nous transmettre vos justificatifs d'identité.</p>

                    <div style="background: #fff8f1; border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #ffe8cc; text-align: center;">
                        <i className="fas fa-shield-alt" style="font-size: 40px; color: #e67e22; margin-bottom: 15px;"></i>
                        <p style="margin: 0; font-weight: 600; color: #d35400;">La vérification ne prend que quelques minutes.</p>
                    </div>

                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://www.inviksa.com/verification" style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Vérifier mon identité</a>
                    </div>

                    <p style="font-size: 14px; color: #666;">Si vous avez déjà soumis vos documents, merci de ne pas tenir compte de ce message. Notre équipe est en train de les examiner.</p>
                    <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                    <p style="margin: 0;">Conformément à la réglementation bancaire, la vérification d'identité est obligatoire.</p>
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Action requise : Vérifiez votre identité - INVIK BANK", html);
    },

    /**
     * KYC Submission Confirmation (User)
     */
    sendVerificationInProgressEmail: async (toEmail, name) => {
        const html = `
    < div style = "font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;" >
                <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 35px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; letter-spacing: 2px; font-weight: 800;">INVIK BANK</h1>
                    <p style="margin-top: 10px; opacity: 0.9;">Dossier reçu</p>
                </div>
                <div style="padding: 40px; color: #333; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Merci ${name},</h2>
                    <p>Nous avons bien reçu vos documents de vérification d'identité.</p>
                    
                    <p>Notre équipe de conformité procède actuellement à l'examen de votre dossier. Ce processus prend généralement moins de 24 heures.</p>

                    <div style="background: #f0f7ff; border-radius: 12px; padding: 25px; margin: 30px 0; border-left: 4px solid #3b82f6;">
                        <p style="margin: 0; font-weight: 600; color: #1e40af;">
                            <i className="fas fa-clock" style="margin-right: 8px;"></i>
                            Statut actuel : Examen en cours
                        </p>
                    </div>

                    <p>Vous recevrez un email dès que votre compte sera activé. En attendant, vous pouvez naviguer sur votre espace client et préparer vos futurs projets.</p>
                    
                    <p style="margin-top: 30px;">Merci de votre patience,<br><strong>L'équipe Conformité INVIK BANK</strong></p>
                </div>
            </div >
    `;
        return emailService.triggerEmail(toEmail, "Nous avons reçu votre dossier de vérification - INVIK BANK", html);
    },

    /**
     * Admin Notification for KYC Submission
     */
    sendAdminKycSubmittedNotification: async (userData) => {
        const html = `
    < div style = "font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;" >
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #27ae60; border-bottom: 2px solid #27ae60; padding-bottom: 10px;">📋 NOUVEAU DOSSIER KYC</h2>
            <p>Un utilisateur vient de soumettre ses documents pour vérification.</p>

            <div style="background-color: #f0faf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Détails de l'Utilisateur</h3>
                <p><strong>Nom :</strong> ${userData.firstName} ${userData.lastName}</p>
                <p><strong>Email :</strong> ${userData.email}</p>
                <p><strong>ID Utilisateur :</strong> ${userData.uid || userData.id}</p>
                <p><strong>Date de soumission :</strong> ${new Date().toLocaleString('fr-FR')}</p>
            </div>

            <div style="text-align: center; margin-top: 30px;">
                <a href="https://invik-admin.vercel.app/users/${userData.uid || userData.id}" style="display: inline-block; padding: 12px 25px; background: #27ae60; color: white; border-radius: 5px; text-decoration: none; font-weight: bold;">Voir le dossier dans l'Admin</a>
            </div>
        </div>
            </div >
    `;
        return emailService.triggerEmail(ADMIN_EMAIL, `[URGENT KYC] Nouveau dossier soumis - ${ userData.lastName } `, html);
    },

    /**
     * Welcome Email after Email Verification
     */
    sendWelcomeEmail: async (toEmail, name, lang = 'fr') => {
        const template = getEmailTemplate('welcome', lang, { name });
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    /**
     * Template for Public Loan Lead Confirmation (Prospect)
     */
    sendPublicLeadConfirmationEmail: async (toEmail, name, leadData) => {
        const lang = leadData.language || 'fr'; // Get language from leadData
        const template = getEmailTemplate('publicLeadConfirmation', lang, { name, ...leadData });
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    /**
     * Admin Notification for New Public Lead
     */
    sendAdminPublicLeadNotification: async (leadData) => {
        const html = `
    < div style = "font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;" >
        <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
            <h2 style="color: #003366; border-bottom: 2px solid #003366; padding-bottom: 10px;">🌟 NOUVEAU LEAD CRÉDIT (COMPLET)</h2>
            <p>Un utilisateur a complété le formulaire de demande de crédit.</p>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px;">📊 Projet de Financement</h3>
                <p><strong>Type :</strong> ${leadData.typeCredit || 'Simulation'}</p>
                <p><strong>Montant :</strong> ${parseFloat(leadData.montant).toLocaleString('fr-FR')} €</p>
                <p><strong>Durée :</strong> ${leadData.duree} mois</p>
                <p><strong>Taux (TAEG) :</strong> ${leadData.taux || leadData.interestRate}%</p>
                <p><strong>Mensualité :</strong> ${parseFloat(leadData.mensualite || leadData.monthlyPayment).toLocaleString('fr-FR')} €</p>
                <p><strong>Objet :</strong> ${leadData.objet || 'Non renseigné'}</p>
                <p><strong>Score auto :</strong> <span style="font-weight: bold; color: ${leadData.score === 'GREEN' ? '#27ae60' : leadData.score === 'RED' ? '#c0392b' : '#f39c12'}">${leadData.score || 'N/A'}</span></p>

                <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">👤 Identité & Contact</h3>
                <p><strong>Nom complet :</strong> ${leadData.civilite || ''} ${leadData.prenom || ''} ${leadData.nom || 'Prospect'}</p>
                <p><strong>Email :</strong> ${leadData.email}</p>
                <p><strong>Téléphone :</strong> ${leadData.telephone || 'Non renseigné'}</p>
                <p><strong>Naissance :</strong> ${leadData.dateNaissance || 'N/A'} (${leadData.lieuNaissance || 'N/A'})</p>
                <p><strong>Nationalité :</strong> ${leadData.nationalite || 'N/A'}</p>
                <p><strong>Pièce d'identité :</strong> ${leadData.typePieceIdentite?.toUpperCase() || 'N/A'} (Exp: ${leadData.dateExpPiece || 'N/A'})</p>

                <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">🏠 Adresse & Logement</h3>
                <p><strong>Adresse :</strong> ${leadData.adresseRue || 'N/A'}, ${leadData.adresseCodePostal || ''} ${leadData.adresseVille || ''} (${leadData.adressePays || ''})</p>
                <p><strong>Situation :</strong> ${leadData.typeLogement || 'N/A'} (Depuis ${leadData.ancienneteAdresse || 0} mois)</p>
                <p><strong>Situation matrimoniale :</strong> ${leadData.situationMatrimoniale || 'N/A'} (${leadData.nbEnfants || 0} enfants)</p>

                <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">💼 Situation Professionnelle</h3>
                <p><strong>Statut :</strong> ${leadData.statutPro?.toUpperCase() || 'N/A'} (${leadData.typeContrat || 'N/A'})</p>
                <p><strong>Employeur :</strong> ${leadData.nomEmployeur || 'N/A'} (${leadData.secteurActivite || 'N/A'})</p>
                <p><strong>Poste :</strong> ${leadData.posteOccupe || 'N/A'} (Ancienneté: ${leadData.anciennetePro || 0} mois)</p>
                <p><strong>Revenus :</strong> ${parseFloat(leadData.revenusMensuels || 0).toLocaleString('fr-FR')} €/mois (+ ${parseFloat(leadData.autresRevenus || 0).toLocaleString('fr-FR')} € autres)</p>

                <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">💰 Situation Financière</h3>
                <p><strong>Charges mensuelles :</strong> ${parseFloat(leadData.chargesMensuelles || 0).toLocaleString('fr-FR')} € (dont loyer: ${leadData.loyer || 0} €)</p>
                <p><strong>Autres crédits :</strong> ${parseFloat(leadData.autresCredits || 0).toLocaleString('fr-FR')} €</p>
                <p><strong>Pensions :</strong> ${parseFloat(leadData.pensions || 0).toLocaleString('fr-FR')} €</p>
                <p><strong>Incident bancaire :</strong> <span style="color: ${leadData.incidentBancaire === 'oui' ? '#e74c3c' : '#27ae60'}">${leadData.incidentBancaire?.toUpperCase() || 'NON'}</span> ${leadData.incidentDetail ? `(${leadData.incidentDetail})` : ''}</p>

                <h3 style="color: #003366; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">🏦 Informations Bancaires</h3>
                <p><strong>Banque actuelle :</strong> ${leadData.banqueActuelle || 'N/A'} ${leadData.autreBanqueNom ? `(${leadData.autreBanqueNom})` : ''}</p>
                <p><strong>IBAN :</strong> ${leadData.iban || 'Non communiqué'}</p>
                <p><strong>Ancienneté compte :</strong> ${leadData.ancienneteCompte || 0} mois</p>
            </div>

            <p style="color: #666; font-size: 12px;">Dossier complet visible dans la section "Leads" de votre panneau d'administration.</p>
        </div>
            </div >
    `;
        return emailService.triggerEmail(ADMIN_EMAIL, `[LEAD COMPLET] Nouvelle demande crédit - ${ leadData.nom || leadData.email } `, html);
    }
};
export default emailService;
