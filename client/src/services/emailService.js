const ADMIN_EMAIL = 'contact@inviksa.com';

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
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Confirmation de virement - INVIK BANK", html);
    },

    /**
     * Template for Transfer Received
     */
    sendTransferReceivedEmail: async (toEmail, name, amount, sender) => {
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Vous avez reçu un virement - INVIK BANK", html);
    },

    /**
     * Template for SEPA Transfer Initiated (For Sender)
     */
    sendTransferInitiatedEmail: async (toEmail, name, amount, beneficiary, ref) => {
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Virement SEPA en cours de traitement - INVIK BANK", html);
    },

    /**
     * Template for SEPA Transfer Pending (For Recipient)
     */
    sendTransferPendingEmail: async (toEmail, name, amount, sender) => {
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Un virement est en attente - INVIK BANK", html);
    },

    /**
     * Template for Card Order Confirmation
     */
    sendCardOrderEmail: async (toEmail, name, cardType, deliveryAddress) => {
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
                        <span style="display: inline-block; padding: 12px 25px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: bold; font-size: 14px; box-shadow: 0 4px 15px rgba(0,51,102,0.2);">Suivre ma commande</span>
                    </div>
                    
                    <p>En attendant, vous pouvez commencer à utiliser vos services bancaires directement depuis votre application mobile.</p>
                    <p style="margin-top: 30px;">Merci de votre confiance,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #1a1a1a; padding: 25px; text-align: center; font-size: 11px; color: #777;">
                    <p style="margin: 0;">INVIK BANK SA - Service Relation Client</p>
                    <p style="margin: 5px 0;">Ce message est automatique, merci de ne pas y répondre.</p>
                </div>
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Confirmation de commande de carte - INVIK BANK", html);
    },

    /**
     * Template for Loan Request Confirmation
     */
    sendLoanRequestEmail: async (toEmail, name, loanDetails) => {
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
                                <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #1e293b; font-size: 16px;">${parseFloat(loanDetails.amount).toLocaleString('fr-FR')} €</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Durée :</td>
                                <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${loanDetails.duration} mois</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Mensualité estimée :</td>
                                <td style="padding: 8px 0; font-weight: 600; text-align: right; color: #1e293b;">${parseFloat(loanDetails.monthlyPayment).toLocaleString('fr-FR')} €/mois</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Statut actuel :</td>
                                <td style="padding: 8px 0; font-weight: 700; text-align: right; color: #e67e22;">Étude en cours</td>
                            </tr>
                        </table>
                    </div>

                    <p>Vous pouvez suivre l'avancement de votre dossier à tout moment depuis votre espace client, rubrique <strong>Crédits</strong>.</p>
                    
                    <div style="text-align: center; margin: 35px 0;">
                        <span style="display: inline-block; padding: 12px 30px; background: #003366; color: white; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">Accéder à mon espace</span>
                    </div>

                    <p>Merci de votre confiance,<br><strong>L'équipe Crédit INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee;">
                    <p style="margin: 0;">Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.</p>
                    <p style="margin: 10px 0 0;">Ce message est automatique, merci de ne pas y répondre.</p>
                </div>
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Confirmation de votre demande de crédit - INVIK BANK", html);
    },

    /**
     * Admin Notification for New Card Order
     */
    sendAdminCardOrderNotification: async (userData, cardData) => {
        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
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
            </div>
        `;
        return emailService.triggerEmail(ADMIN_EMAIL, `[ADMIN] Nouvelle commande de carte - ${userData.lastName}`, html);
    },

    /**
     * Admin Notification for New Loan Request
     */
    sendAdminLoanRequestNotification: async (userData, loanData) => {
        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
                <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; border: 1px solid #ddd;">
                    <h2 style="color: #e67e22; border-bottom: 2px solid #e67e22; padding-bottom: 10px;">🏦 NOUVELLE DEMANDE DE CRÉDIT</h2>
                    <p>Une nouvelle demande officielle de crédit a été déposée.</p>
                    
                    <div style="background-color: #fffaf0; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="margin-top: 0;">Détails du Client</h3>
                        <p><strong>Nom :</strong> ${userData.firstName} ${userData.lastName}</p>
                        <p><strong>Email :</strong> ${userData.email}</p>
                        
                        <h3 style="margin-top: 20px;">Détails du Financement</h3>
                        <p><strong>Projet :</strong> ${loanData.type}</p>
                        <p><strong>Montant :</strong> ${parseFloat(loanData.amount).toLocaleString('fr-FR')} €</p>
                        <p><strong>Durée :</strong> ${loanData.duration} mois</p>
                        <p><strong>Mensualité :</strong> ${parseFloat(loanData.monthlyPayment).toLocaleString('fr-FR')} €/mois</p>
                        
                        <h3 style="margin-top: 20px;">Description du projet</h3>
                        <p style="background: #fff; padding: 10px; border: 1px solid #eee; border-radius: 5px;">${loanData.description}</p>
                    </div>
                    
                    <p style="color: #666; font-size: 12px;">Une étude de solvabilité doit être effectuée sous 24h.</p>
                </div>
            </div>
        `;
        return emailService.triggerEmail(ADMIN_EMAIL, `[ADMIN] Nouvelle demande de crédit - ${userData.lastName}`, html);
    },

    /**
     * KYC Reminder Email (24h)
     */
    sendVerificationReminderEmail: async (toEmail, name) => {
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
                        <span style="display: inline-block; padding: 15px 40px; background: #003366; color: white; border-radius: 50px; text-decoration: none; font-weight: 800; font-size: 16px; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">Vérifier mon identité</span>
                    </div>

                    <p style="font-size: 14px; color: #666;">Si vous avez déjà soumis vos documents, merci de ne pas tenir compte de ce message. Notre équipe est en train de les examiner.</p>
                    <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe INVIK BANK</strong></p>
                </div>
                <div style="background: #f4f7f6; padding: 25px; text-align: center; font-size: 11px; color: #999;">
                    <p style="margin: 0;">Conformément à la réglementation bancaire, la vérification d'identité est obligatoire.</p>
                </div>
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Action requise : Vérifiez votre identité - INVIK BANK", html);
    },

    /**
     * KYC Submission Confirmation (User)
     */
    sendVerificationInProgressEmail: async (toEmail, name) => {
        const html = `
            <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden;">
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
            </div>
        `;
        return emailService.triggerEmail(toEmail, "Nous avons reçu votre dossier de vérification - INVIK BANK", html);
    },

    /**
     * Admin Notification for KYC Submission
     */
    sendAdminKycSubmittedNotification: async (userData) => {
        const html = `
            <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px;">
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
            </div>
        `;
        return emailService.triggerEmail(ADMIN_EMAIL, `[URGENT KYC] Nouveau dossier soumis - ${userData.lastName}`, html);
    }
};
