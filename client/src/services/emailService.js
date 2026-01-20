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
    }
};
