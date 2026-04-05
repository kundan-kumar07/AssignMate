const sendEmail = async (to, taskText) => {
  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BREVO_API_KEY,
      },
      body: JSON.stringify({
        sender: {
          name: "AssignMate",
          email: process.env.EMAIL,
        },
        to: [{ email: to }],
        subject: "⏰ Task Reminder",

        // ✅ BEAUTIFUL HTML EMAIL
        htmlContent: `
          <div style="font-family: Arial, sans-serif; background:#0f172a; padding:20px;">
            
            <div style="max-width:600px; margin:auto; background:white; border-radius:12px; overflow:hidden;">
              
              <!-- Header -->
              <div style="background:#4f46e5; padding:20px; text-align:center; color:white;">
                <h1 style="margin:0;">📋 AssignMate</h1>
                <p style="margin:5px 0 0;">Task Reminder</p>
              </div>

              <!-- Body -->
              <div style="padding:20px; color:#111;">
                <h2 style="margin-top:0;">⏰ Reminder</h2>
                <p style="font-size:16px;">You have an upcoming task:</p>

                <div style="background:#f3f4f6; padding:15px; border-radius:8px; margin:15px 0;">
                  <strong>${taskText}</strong>
                </div>

                <p style="color:#555;">Stay productive and complete it on time 🚀</p>
              </div>

              <!-- Footer -->
              <div style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#888;">
                © ${new Date().getFullYear()} AssignMate • Stay organized 📌
              </div>

            </div>
          </div>
        `,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(JSON.stringify(data));
    }

    console.log("✅ Email sent to:", to);
    return true;

  } catch (err) {
    console.error("❌ Email error:", err.message);
    return false;
  }
};

export default sendEmail;