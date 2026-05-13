    import nodemailer from "nodemailer";

const parseBoolean = (value) => String(value || "").trim().toLowerCase() === "true";

let transporterPromise = null;
let missingConfigLogged = false;

const hasMailerConfig = () =>
    Boolean(process.env.SMTP_USER && process.env.SMTP_PASS) &&
    Boolean(
        process.env.SMTP_SERVICE ||
        (process.env.SMTP_HOST && process.env.SMTP_PORT)
    );

const createTransporter = async () => {
    if (!hasMailerConfig()) {
        if (!missingConfigLogged) {
            missingConfigLogged = true;
            console.warn("Email notifications are disabled. SMTP configuration is missing.");
        }

        return null;
    }

    if (process.env.SMTP_SERVICE) {
        return nodemailer.createTransport({
            service: process.env.SMTP_SERVICE,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    const port = Number(process.env.SMTP_PORT || 587);

    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port,
        secure: parseBoolean(process.env.SMTP_SECURE) || port === 465,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

const getTransporter = async () => {
    if (!transporterPromise) {
        transporterPromise = createTransporter();
    }

    return transporterPromise;
};

export const sendEmail = async ({ to, subject, text, html }) => {
    if (!to) {
        return false;
    }

    const transporter = await getTransporter();
    if (!transporter) {
        return false;
    }

    const from = process.env.MAIL_FROM || process.env.SMTP_USER;

    await transporter.sendMail({
        from,
        to,
        subject,
        text,
        html,
    });

    return true;
};
