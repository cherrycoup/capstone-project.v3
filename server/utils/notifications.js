import { sendEmail } from "./mailer.js";

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-PH", {
        style: "currency",
        currency: "PHP",
    }).format(Number(amount || 0));

const formatDate = (value) => {
    if (!value) {
        return "TBD";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
        return "TBD";
    }

    return date.toLocaleDateString("en-PH", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
};

const escapeHtml = (value) =>
    String(value || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");

const wrapHtml = (title, body) => `
    <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="margin-bottom: 12px;">${escapeHtml(title)}</h2>
        ${body}
    </div>
`;

const sendNotification = async (payload) => {
    try {
        return await sendEmail(payload);
    } catch (error) {
        console.error("Failed to send email notification:", error.message);
        return false;
    }
};

const getAppointmentRecipient = (appointment) =>
    appointment?.contactInfo?.email || appointment?.customerId?.contactInfo?.email || "";

const getOrderRecipient = (order) =>
    order?.email || order?.customerId?.contactInfo?.email || "";

const getOrderStatusMessage = (status) => {
    const messages = {
        Pending: "We received your order and it is now pending review.",
        Confirmed: "Your order has been confirmed and is now being prepared.",
        Completed: "Your order is ready.",
        Cancelled: "Your order has been cancelled.",
    };

    return messages[status] || `Your order status is now ${status}.`;
};

const getAppointmentStatusMessage = (status) => {
    const messages = {
        Scheduled: "We received your appointment request.",
        Confirmed: "Your appointment has been confirmed.",
        Completed: "Your appointment has been marked as completed.",
        Cancelled: "Your appointment has been cancelled.",
    };

    return messages[status] || `Your appointment status is now ${status}.`;
};

export const sendOrderCreatedEmail = async (order) => {
    const to = getOrderRecipient(order);
    if (!to) {
        return false;
    }

    const subject = `Order received: ${order.referenceNumber}`;
    const text = [
        `Hello ${order.fullName},`,
        "",
        "Your order has been received.",
        `Reference number: ${order.referenceNumber}`,
        `Total: ${formatCurrency(order.total)}`,
        `Payment method: ${order.paymentMethod}`,
        "",
        "We will email you again when your order is confirmed or ready.",
    ].join("\n");

    const html = wrapHtml(
        "Your order has been received",
        `
            <p>Hello ${escapeHtml(order.fullName)},</p>
            <p>Your order has been received.</p>
            <p><strong>Reference number:</strong> ${escapeHtml(order.referenceNumber)}</p>
            <p><strong>Total:</strong> ${escapeHtml(formatCurrency(order.total))}</p>
            <p><strong>Payment method:</strong> ${escapeHtml(order.paymentMethod)}</p>
            <p>We will email you again when your order is confirmed or ready.</p>
        `
    );

    return sendNotification({ to, subject, text, html });
};

export const sendOrderStatusEmail = async (order) => {
    const to = getOrderRecipient(order);
    if (!to) {
        return false;
    }

    const statusMessage = getOrderStatusMessage(order.status);
    const subject = order.status === "Completed"
        ? `Your order is ready: ${order.referenceNumber}`
        : `Order update: ${order.referenceNumber}`;
    const text = [
        `Hello ${order.fullName},`,
        "",
        statusMessage,
        `Current status: ${order.status}`,
        `Reference number: ${order.referenceNumber}`,
        "",
        "Thank you for ordering with us.",
    ].join("\n");

    const html = wrapHtml(
        "Order status update",
        `
            <p>Hello ${escapeHtml(order.fullName)},</p>
            <p>${escapeHtml(statusMessage)}</p>
            <p><strong>Current status:</strong> ${escapeHtml(order.status)}</p>
            <p><strong>Reference number:</strong> ${escapeHtml(order.referenceNumber)}</p>
            <p>Thank you for ordering with us.</p>
        `
    );

    return sendNotification({ to, subject, text, html });
};

export const sendAppointmentCreatedEmail = async (appointment) => {
    const to = getAppointmentRecipient(appointment);
    if (!to) {
        return false;
    }

    const customerName = appointment?.contactInfo?.name || appointment?.customerId?.name || "Customer";
    const subject = "Appointment request received";
    const text = [
        `Hello ${customerName},`,
        "",
        "Your appointment request has been received.",
        `Service: ${appointment.service}`,
        `Date: ${formatDate(appointment.date)}`,
        `Time: ${appointment.timeSlot}`,
        "",
        "We will email you again once the appointment is confirmed or updated.",
    ].join("\n");

    const html = wrapHtml(
        "Your appointment request has been received",
        `
            <p>Hello ${escapeHtml(customerName)},</p>
            <p>Your appointment request has been received.</p>
            <p><strong>Service:</strong> ${escapeHtml(appointment.service)}</p>
            <p><strong>Date:</strong> ${escapeHtml(formatDate(appointment.date))}</p>
            <p><strong>Time:</strong> ${escapeHtml(appointment.timeSlot)}</p>
            <p>We will email you again once the appointment is confirmed or updated.</p>
        `
    );

    return sendNotification({ to, subject, text, html });
};

export const sendAppointmentStatusEmail = async (appointment) => {
    const to = getAppointmentRecipient(appointment);
    if (!to) {
        return false;
    }

    const customerName = appointment?.contactInfo?.name || appointment?.customerId?.name || "Customer";
    const statusMessage = getAppointmentStatusMessage(appointment.status);
    const subject = appointment.status === "Confirmed"
        ? "Your appointment is confirmed"
        : `Appointment update: ${appointment.status}`;
    const text = [
        `Hello ${customerName},`,
        "",
        statusMessage,
        `Current status: ${appointment.status}`,
        `Service: ${appointment.service}`,
        `Date: ${formatDate(appointment.date)}`,
        `Time: ${appointment.timeSlot}`,
    ].join("\n");

    const html = wrapHtml(
        "Appointment status update",
        `
            <p>Hello ${escapeHtml(customerName)},</p>
            <p>${escapeHtml(statusMessage)}</p>
            <p><strong>Current status:</strong> ${escapeHtml(appointment.status)}</p>
            <p><strong>Service:</strong> ${escapeHtml(appointment.service)}</p>
            <p><strong>Date:</strong> ${escapeHtml(formatDate(appointment.date))}</p>
            <p><strong>Time:</strong> ${escapeHtml(appointment.timeSlot)}</p>
        `
    );

    return sendNotification({ to, subject, text, html });
};
