const translate = require('translate-google');

// Email template subjects and key phrases to translate
const emailContent = {
    publicLeadConfirmation: {
        fr: {
            subject: "Confirmation de votre demande de simulation - INVIK BANK",
            greeting: "Bonjour",
            mainText: "Nous avons bien reçu votre demande de simulation de crédit. Un conseiller INVIK BANK va étudier vos informations pour vous proposer une solution adaptée.",
            cta: "Finaliser ma demande",
            closing: "Merci de votre confiance",
            team: "L'équipe Crédit INVIK BANK"
        }
    },
    welcome: {
        fr: {
            subject: "Bienvenue chez INVIK BANK - Compte activé !",
            title: "FÉLICITATIONS !",
            greeting: "Bienvenue à bord",
            mainText: "Votre adresse email a été validée avec succès. Nous sommes ravis de vous compter parmi nos clients privilégiés.",
            stepsTitle: "Prochaines étapes :",
            cta: "Accéder à mon tableau de bord",
            closing: "Merci de votre confiance",
            team: "L'équipe INVIK BANK"
        }
    },
    transferSent: {
        fr: {
            subject: "Confirmation de virement - INVIK BANK",
            subtitle: "Confirmation de virement",
            mainText: "Nous vous confirmons que votre virement a bien été envoyé.",
            detailsText: "Les fonds seront disponibles sur le compte du bénéficiaire selon les délais bancaires habituels.",
            amount: "Montant",
            beneficiary: "Bénéficiaire",
            reference: "Référence",
            status: "Statut",
            sent: "Envoyé"
        }
    },
    transferReceived: {
        fr: {
            subject: "Vous avez reçu un virement - INVIK BANK",
            subtitle: "Bonne nouvelle !",
            mainText: "Vous venez de recevoir un virement sur votre compte INVIK BANK.",
            detailsText: "Votre nouveau solde est disponible dès maintenant sur votre application.",
            amountReceived: "Montant reçu",
            from: "De la part de"
        }
    },
    verificationReminder: {
        fr: {
            subject: "Action requise : Vérifiez votre identité - INVIK BANK",
            subtitle: "Rappel de vérification",
            mainText: "Votre compte INVIK BANK a été créé avec succès, mais votre identité n'est pas encore vérifiée.",
            ctaText: "Vérifier mon identité",
            notice: "La vérification ne prend que quelques minutes."
        }
    },
    cardOrder: {
        fr: {
            subject: "Confirmation de commande de carte - INVIK BANK",
            tagline: "L'élégance à votre portée",
            mainText: "Nous avons bien reçu votre commande pour votre nouvelle carte INVIK",
            modelOrdered: "Modèle commandé",
            deliveryAddress: "Adresse de livraison",
            estimatedDelivery: "Délai estimé",
            deliveryTime: "3 à 5 jours ouvrés",
            cta: "Suivre ma commande"
        }
    },
    loanRequest: {
        fr: {
            subject: "Confirmation de votre demande de crédit - INVIK BANK",
            tagline: "Votre projet, notre priorité",
            mainText: "Nous vous confirmons la bonne réception de votre demande de financement pour votre projet",
            requestedAmount: "Montant demandé",
            duration: "Durée",
            monthlyPayment: "Mensualité estimée",
            currentStatus: "Statut actuel",
            underReview: "Étude en cours"
        }
    },
    contactConfirmation: {
        fr: {
            subject: "Nous avons bien reçu votre message - INVIK BANK",
            subtitle: "Message reçu",
            mainText: "Nous avons bien reçu votre message via notre formulaire de contact.",
            responseTime: "Notre équipe vous répondra dans les plus brefs délais, généralement sous 24 heures ouvrées.",
            concernsLabel: "Votre demande concerne :",
            urgentContact: "Si votre demande est urgente, vous pouvez également nous joindre :"
        }
    }
};

async function translateToLanguage(text, targetLang) {
    try {
        const result = await translate(text, { to: targetLang });
        await new Promise(resolve => setTimeout(resolve, 150)); // Rate limit
        return result;
    } catch (error) {
        console.error(`Error translating to ${targetLang}:`, error.message);
        return text;
    }
}

async function translateTemplate(templateName, targetLang) {
    console.log(`\n🌍 Translating ${templateName} to ${targetLang.toUpperCase()}...`);

    const frContent = emailContent[templateName].fr;
    const translated = {};

    for (const [key, value] of Object.entries(frContent)) {
        console.log(`  - Translating ${key}...`);
        translated[key] = await translateToLanguage(value, targetLang);
    }

    return translated;
}

async function main() {
    const targetLangs = ['pt', 'it', 'es', 'de'];
    const results = {};

    console.log('🚀 Email Template Translation Tool');
    console.log('==================================\n');

    for (const lang of targetLangs) {
        results[lang] = {};

        for (const templateName of Object.keys(emailContent)) {
            results[lang][templateName] = await translateTemplate(templateName, lang);
        }

        console.log(`\n✅ ${lang.toUpperCase()} translation complete!`);
    }

    // Write results to JSON file
    const fs = require('fs');
    const outputPath = require('path').join(__dirname, 'email-translations.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));

    console.log(`\n✨ All translations saved to: ${outputPath}`);
    console.log('\nYou can now use these translations to update getEmailTemplate() in emailService.js');
}

if (require.main === module) {
    main().catch(console.error);
}
