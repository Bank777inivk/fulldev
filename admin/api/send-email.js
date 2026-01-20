import nodemailer from 'nodemailer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const smtpPort = parseInt(process.env.SMTP_PORT || '465');
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.hostinger.com',
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        timeout: 10000,
    });

    try {
        const info = await transporter.sendMail({
            from: `"INVIK BANK" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        });

        return res.status(200).json({ success: true, messageId: info.messageId });
    } catch (error) {
        console.error('Nodemailer error:', error);
        return res.status(500).json({
            error: 'Failed to send email',
            details: error.message
        });
    }
}
