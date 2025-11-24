document.getElementById("apptForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const form = e.target;
    const status = document.getElementById("status");
    status.textContent = "";
    status.style.color = "black";

    // Convert form to an object
    const data = Object.fromEntries(new FormData(form).entries());

    // ---------- VALIDATION ----------

    // SCAC = exactly 4 letters
    const scacRegex = /^[A-Za-z]{4}$/;
    if (!scacRegex.test(data.scac)) {
        status.textContent = "SCAC must be exactly 4 letters.";
        status.style.color = "red";
        return;
    }

    // Quantity > 0
    if (Number(data.qty) < 1) {
        status.textContent = "Quantity must be at least 1.";
        status.style.color = "red";
        return;
    }

    // Delivery date cannot be in the past
    const today = new Date();
    today.setHours(0,0,0,0);
    const reqDate = new Date(data.date);
    if (reqDate < today) {
        status.textContent = "Delivery date cannot be in the past.";
        status.style.color = "red";
        return;
    }

    // Email validation is handled by "type=email"

    // ---------- SEND TO SERVER ----------
    const res = await fetch("/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        status.textContent = "Request submitted and confirmation email sent.";
        status.style.color = "green";
        form.reset();
    } else {
        status.textContent = "Error sending request.";
        status.style.color = "red";
    }
});
