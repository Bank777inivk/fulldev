const ADMIN_EMAIL = 'contact@inviksa.com';

/**
 * Get email template in specified language
 * @param {string} templateName - Name of the template
 * @param {string} lang - Language code (fr, en, pt, it, es, de)
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

    /**
     * Welcome Email after Email Verification
     */
    sendWelcomeEmail: async (toEmail, name, lang = 'fr') => {
        const template = getEmailTemplate('welcome', lang, { name });
        if (!template) throw new Error('Welcome template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    },

    /**
     * Template for Public Loan Lead Confirmation (Prospect)
     */
    sendPublicLeadConfirmationEmail: async (toEmail, name, leadData) => {
        const lang = leadData.language || 'fr';
        const template = getEmailTemplate('publicLeadConfirmation', lang, { name, ...leadData });
        if (!template) throw new Error('Public lead confirmation template not found');
        return emailService.triggerEmail(toEmail, template.subject, template.html);
    }
};

export default emailService;
