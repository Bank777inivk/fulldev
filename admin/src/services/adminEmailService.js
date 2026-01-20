const ADMIN_EMAIL_API_URL = '/api/send-email';

export const adminEmailService = {
    triggerEmail: async (to, subject, html) => {
        try {
            const response = await fetch(ADMIN_EMAIL_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ to, subject, html })
            });
            return await response.json();
        } catch (error) {
            console.error('Error triggering admin email:', error);
            throw error;
        }
    },

    // --- KYC TEMPLATES ---
    sendKYCSuccessEmail: async (toEmail, name) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                <div style="background: linear-gradient(135deg, #003366 0%, #004080 100%); padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; letter-spacing: 1px; font-weight: 800; text-transform: uppercase;">Identité Vérifiée</h1>
                    <div style="margin-top: 15px; display: inline-block; background: rgba(255,255,255,0.2); padding: 5px 15px; border-radius: 20px; font-size: 13px;">INVIK BANK EXCLUSIF</div>
                </div>
                <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                    <h2 style="color: #003366; margin-top: 0;">Félicitations ${name},</h2>
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
                        <a href="https://invik-bank.vercel.app/dashboard" style="display: inline-block; background: #003366; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800; box-shadow: 0 10px 15px rgba(0, 51, 102, 0.2);">Accéder à mon tableau de bord</a>
                    </div>
                    <p>Merci pour votre patience durant ce processus de sécurité.</p>
                </div>
                <div style="background: #0f172a; padding: 30px; text-align: center; color: #94a3b8; font-size: 12px;">
                    <p style="margin: 0;">INVIK BANK SA - Sécurité & Prestige</p>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Votre identité a été validée - INVIK BANK", html);
    },

    sendKYCRejectionEmail: async (toEmail, name, reason) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                <div style="background: #ef4444; padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800;">ACTION REQUISE</h1>
                </div>
                <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                    <h2 style="color: #ef4444; margin-top: 0;">Bonjour ${name},</h2>
                    <p style="font-size: 16px;">Après examen de vos pièces justificatives, nous n'avons pas pu valider votre dossier KYC pour la raison suivante :</p>
                    <div style="background: #fffbfa; border: 1px solid #fee2e2; border-radius: 12px; padding: 25px; margin: 25px 0; color: #991b1b; font-weight: 600;">
                        "${reason || "Documents illisibles ou non conformes."}"
                    </div>
                    <p style="font-size: 16px;">Pas d'inquiétude, vous pouvez soumettre de nouveaux documents directement depuis votre espace client pour finaliser l'activation de votre compte.</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://invik-bank.vercel.app/verification" style="display: inline-block; border: 2px solid #ef4444; color: #ef4444; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Soumettre à nouveau</a>
                    </div>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Action requise sur votre dossier KYC - INVIK BANK", html);
    },

    // --- LOAN TEMPLATES ---
    sendLoanApprovedEmail: async (toEmail, name, amount, currency) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800;">PRÊT APPROUVÉ</h1>
                </div>
                <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                    <h2 style="color: #10b981; margin-top: 0;">Bonne nouvelle, ${name}</h2>
                    <p style="font-size: 16px;">Votre demande de financement a été approuvée par notre comité de crédit.</p>
                    <div style="background: #f0fdf4; border-radius: 12px; padding: 30px; text-align: center; margin: 25px 0; border: 1px solid #dcfce7;">
                        <span style="display: block; color: #065f46; font-size: 14px; font-weight: 700; text-transform: uppercase;">Montant débloqué</span>
                        <span style="display: block; color: #059669; font-size: 36px; font-weight: 900;">${amount.toLocaleString('fr-FR')} ${currency}</span>
                    </div>
                    <p style="font-size: 16px;">Les fonds seront visibles sur votre compte principal sous un délai de 24h à 48h ouvrés.</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://invik-bank.vercel.app/dashboard" style="display: inline-block; background: #10b981; color: white; padding: 15px 35px; border-radius: 50px; text-decoration: none; font-weight: 800;">Consulter mon solde</a>
                    </div>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Approbation de votre demande de prêt - INVIK BANK", html);
    },

    sendLoanRejectedEmail: async (toEmail, name, reason) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #f1f5f9;">
                <div style="background: #475569; padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800;">DÉCISION PRÊT</h1>
                </div>
                <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                    <h2 style="color: #475569; margin-top: 0;">Monsieur/Madame ${name},</h2>
                    <p style="font-size: 16px;">Nous avons étudié votre demande de financement avec la plus grande attention. Malheureusement, nous ne sommes pas en mesure d'y donner une suite favorable pour le moment.</p>
                    <p style="font-size: 14px; color: #64748b; font-style: italic;">Motif : ${reason || "Critères d'éligibilité non remplis."}</p>
                    <p style="font-size: 16px;">Cette décision est basée sur notre politique actuelle d'octroi de crédit. Nous vous invitons à renouveler votre demande dans 6 mois si votre situation évolue.</p>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Mise à jour de votre demande de financement - INVIK BANK", html);
    },

    // --- CARD TEMPLATES ---
    sendCardShippedEmail: async (toEmail, name, cardType) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #000000; padding: 40px 20px; text-align: center; color: white;">
                    <h1 style="margin: 0; font-size: 26px; font-weight: 800; letter-spacing: 2px;">VOTRE CARTE EST EN ROUTE</h1>
                </div>
                <div style="padding: 40px; color: #1e293b; line-height: 1.6;">
                    <h2 style="color: #000000; margin-top: 0;">Excellent choix, ${name}</h2>
                    <p style="font-size: 16px;">Votre carte **${cardType}** a été préparée et remise à notre transporteur partenaire.</p>
                    <div style="text-align: center; padding: 30px; background: #f8fafc; border-radius: 16px; margin: 25px 0;">
                        <i class="fas fa-truck" style="font-size: 40px; color: #003366; margin-bottom: 15px;"></i>
                        <p style="margin: 0; font-weight: 700; color: #003366;">Délai de livraison estimé : 3 à 5 jours ouvrés</p>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">Pour des raisons de sécurité, votre carte est expédiée inactive. Vous pourrez l'activer dès réception depuis votre application.</p>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Votre carte INVIK BANK a été expédiée !", html);
    },

    // --- TRANSACTION TEMPLATES ---
    sendTransactionValidatedEmail: async (toEmail, name, amount, currency, description) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #10b981; padding: 30px 20px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">Virement Transmis</h2>
                </div>
                <div style="padding: 40px; color: #1e293b;">
                    <p>Bonjour ${name},</p>
                    <p>Votre virement vers l'extérieur a été validé et transmis au réseau bancaire international.</p>
                    <div style="background: #f8fafc; padding: 20px; border-radius: 12px; margin: 20px 0;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="color: #64748b; padding-bottom: 10px;">Montant</td><td style="text-align: right; font-weight: 700;">${amount} ${currency}</td></tr>
                            <tr><td style="color: #64748b;">Description</td><td style="text-align: right; font-weight: 700;">${description}</td></tr>
                        </table>
                    </div>
                    <p style="font-size: 14px; color: #64748b;">Ce virement devrait atteindre le compte destinataire sous 24h à 72h.</p>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Confirmation de virement sortant - INVIK BANK", html);
    },

    sendTransactionInReviewEmail: async (toEmail, name, amount, currency, description) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #f59e0b; padding: 30px 20px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">Vérification de Sécurité</h2>
                </div>
                <div style="padding: 40px; color: #1e293b;">
                    <p>Bonjour ${name},</p>
                    <p>Dans le cadre de nos procédures de sécurité habituelles, votre virement de **${amount} ${currency}** est actuellement en cours de vérification approfondie.</p>
                    <p style="background: #fffbeb; border: 1px solid #fef3c7; padding: 15px; border-radius: 8px; color: #92400e; font-size: 14px;">
                        <strong>Pourquoi ?</strong> Cette étape permet de protéger votre compte contre toute activité inhabituelle. Un conseiller INVIK BANK peut vous contacter si des informations complémentaires sont nécessaires.
                    </p>
                    <p>Le virement sera libéré dès la fin de cet examen (généralement sous quelques heures).</p>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Vérification en cours sur votre transaction - INVIK BANK", html);
    },

    sendTransactionRejectedEmail: async (toEmail, name, amount, currency, reason) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #fee2e2;">
                <div style="background: #ef4444; padding: 30px 20px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">Virement Refusé</h2>
                </div>
                <div style="padding: 40px; color: #1e293b;">
                    <p>Bonjour ${name},</p>
                    <p>Votre demande de virement de **${amount} ${currency}** a été refusée par notre département de sécurité.</p>
                    <div style="background: #fef2f2; padding: 15px; border-radius: 8px; color: #991b1b; margin: 20px 0;">
                        <strong>Motif :</strong> ${reason || "Alerte de sécurité ou informations destinataire invalides."}
                    </div>
                    <p>Le montant a été intégralement replacé sur votre solde disponible.</p>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Alerte Sécurité : Virement refusé - INVIK BANK", html);
    },

    // --- SUPPORT TEMPLATE ---
    sendSupportResponseEmail: async (toEmail, name, subject) => {
        const html = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0;">
                <div style="background: #003366; padding: 30px 20px; text-align: center; color: white;">
                    <h2 style="margin: 0; font-size: 20px;">Réponse de votre conseiller</h2>
                </div>
                <div style="padding: 40px; color: #1e293b;">
                    <p>Bonjour ${name},</p>
                    <p>Un conseiller de l'équipe support a répondu à votre demande concernant : <strong>"${subject}"</strong>.</p>
                    <p>Vous pouvez consulter la réponse et poursuivre la discussion directement depuis votre messagerie sécurisée.</p>
                    <div style="text-align: center; margin: 35px 0;">
                        <a href="https://invik-bank.vercel.app/support" style="display: inline-block; background: #003366; color: white; padding: 12px 30px; border-radius: 50px; text-decoration: none; font-weight: 800;">Voir ma messagerie</a>
                    </div>
                </div>
            </div>
        `;
        return adminEmailService.triggerEmail(toEmail, "Nouvelle réponse de votre conseiller - INVIK BANK", html);
    }
};
