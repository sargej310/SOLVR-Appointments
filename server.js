const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
app.use(express.static("."));
app.use(bodyParser.json());

// ---------------- EMAIL SETUP ----------------
// Replace these with your actual email + app password
const transporter = nodemailer.createTransport({
    service: "gmail", // or use SMTP for Office365/Exchange
    auth: {
        user: "YOUR_EMAIL@gmail.com",
        pass: "YOUR_APP_PASSWORD"
    }
});

// ---------------- API ROUTE ----------------
app.post("/send-email", async (req, res) => {
    const data = req.body;

    const opsMessage = `
SOLVR Warehouse Delivery Appointment Request (Texas)

Carrier SCAC: ${data.scac}
Carrier Email: ${data.carrierEmail}
Origin: ${data.origin}
Purchase Order #: ${data.po}

Requested Delivery:
- Date: ${data.date}
- Time: ${data.time}

Item Description: ${data.description}
Quantity: ${data.qty}
`;

    const carrierMessage = `
Your delivery appointment request has been submitted to SOLVR.

Below is a copy for your records:

Carrier SCAC: ${data.scac}
Origin: ${data.origin}
Purchase Order #: ${data.po}

Requested Delivery:
- Date: ${data.date}
- Time: ${data.time}

Item: ${data.description}
Quantity: ${data.qty}

SOLVR Operations will contact you if any additional information is needed.
`;

    try {
        // --- Email to SOLVR Ops ---
        await transporter.sendMail({
            from: "Delivery Appointments <YOUR_EMAIL@gmail.com>",
            to: "operations@solvr.com", // change to your real ops email
            subject: `Delivery Request - PO ${data.po} - SCAC ${data.scac}`,
            text: opsMessage
        });

        // --- Confirmation email to carrier ---
        await transporter.sendMail({
            from: "SOLVR Delivery Confirmation <YOUR_EMAIL@gmail.com>",
            to: data.carrierEmail,
            subject: `Confirmation: Delivery Request for PO ${data.po}`,
            text: carrierMessage
        });

        res.status(200).send("Email sent");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error sending email");
    }
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));
