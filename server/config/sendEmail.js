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
        subject: "⏰ Task Reminder — AssignMate",

        htmlContent: `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#0b0d17;font-family:Inter,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="padding:60px 16px;">
    <tr>
      <td align="center">

        <table width="100%" style="max-width:500px;">

          <!-- Brand -->
          <tr>
            <td align="center" style="padding-bottom:30px;">
              <span style="
                font-size:18px;
                font-weight:700;
                letter-spacing:0.5px;
                background:linear-gradient(135deg,#fbbf24,#f97316);
                -webkit-background-clip:text;
                -webkit-text-fill-color:transparent;">
                AssignMate
              </span>
            </td>
          </tr>

          <!-- Card -->
          <tr>
            <td style="
              background:#111422;
              border-radius:20px;
              border:1px solid rgba(255,255,255,0.06);
              padding:36px 28px;
              text-align:left;
            ">

              <!-- Small Tag -->
              <div style="
                font-size:11px;
                letter-spacing:2px;
                text-transform:uppercase;
                color:#fbbf24;
                margin-bottom:16px;
              ">
                Reminder
              </div>

              <!-- Title -->
              <h2 style="
                margin:0 0 20px;
                font-size:26px;
                color:#f8fafc;
                font-weight:700;
                letter-spacing:-0.02em;
              ">
                Don’t miss this.
              </h2>

              <!-- Task -->
              <div style="
                background:#0b0d17;
                border-radius:14px;
                padding:18px;
                border:1px solid rgba(255,255,255,0.05);
                margin-bottom:22px;
              ">
                <p style="
                  margin:0;
                  font-size:16px;
                  color:#e2e8f0;
                  line-height:1.5;
                  font-weight:500;
                ">
                  ${taskText}
                </p>
              </div>

              <!-- Subtext -->
              <p style="
                margin:0 0 26px;
                font-size:14px;
                color:#94a3b8;
                line-height:1.6;
              ">
                Small steps done consistently lead to big results. Stay on track 🚀
              </p>

              <!-- CTA -->
              <a href="https://assign-mate-one.vercel.app/home"
                style="
                  display:inline-block;
                  padding:12px 26px;
                  border-radius:999px;
                  background:linear-gradient(135deg,#fbbf24,#f97316);
                  color:#0b0d17;
                  font-weight:700;
                  font-size:14px;
                  text-decoration:none;
                  letter-spacing:0.02em;
                ">
                View Tasks →
              </a>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding-top:28px;">
              <p style="
                font-size:12px;
                color:#475569;
                line-height:1.6;
              ">
                © ${new Date().getFullYear()} AssignMate<br/>
Built for focus. Designed for clarity.<br/>
<span style="color:#94a3b8;">Crafted by Kundan Dubey</span>
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
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
