import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");

const getMailUser = () => String(process.env.EMAIL_USER || process.env.SMTP_USER || "").trim();

export const sendEmail = async ({ to, subject, text, html }) => {
    const recipients = Array.isArray(to) ? to.filter(Boolean) : String(to || "").trim();

    if (!recipients || (Array.isArray(recipients) && recipients.length === 0)) {
        console.warn("No recipients provided for email");
        return false;
    }

    const from = process.env.MAIL_FROM || process.env.EMAIL_FROM || process.env.RESEND_FROM || getMailUser();

    try {
        if (process.env.NODE_ENV !== "production") {
            console.log(`Sending email to ${recipients} with subject: ${subject}`);
        }

        await resend.emails.send({
            from,
            to: recipients,
            subject: String(subject || "JBM Electro notification").slice(0, 200),
            html: html || undefined,
            text: text || undefined,
        });

        if (process.env.NODE_ENV !== "production") {
            console.log(`Email sent successfully to ${recipients}`);
        }

        return true;
    } catch (error) {
        console.error(`Failed to send email to ${recipients}:`, error?.message || error);
        return false;
    }
};

export const resetMailerTransporter = () => {
    // noop for Resend SDK
};
