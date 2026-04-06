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
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Task Reminder</title>
</head>
<body style="margin:0;padding:0;background-color:#0c0f1a;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#0c0f1a;padding:48px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- Logo row -->
          <tr>
            <td align="center" style="padding-bottom:28px;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:8px;">
                    <div style="width:8px;height:8px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f97316);display:inline-block;"></div>
                  </td>
                  <td>
                    <span style="font-size:18px;font-weight:800;letter-spacing:-0.02em;background:linear-gradient(135deg,#fbbf24,#f97316);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;color:#fbbf24;">AssignMate</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main card -->
          <tr>
            <td style="background:#141824;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.06);">

              <!-- Amber top bar -->
              <tr>
                <td style="height:4px;background:linear-gradient(90deg,#fbbf24,#f97316,#ec4899);display:block;line-height:4px;font-size:0;">&nbsp;</td>
              </tr>

              <!-- Header -->
              <tr>
                <td style="padding:36px 40px 28px;border-bottom:1px solid rgba(255,255,255,0.05);">
                  <table cellpadding="0" cellspacing="0" border="0" width="100%">
                    <tr>
                      <td>
                        <div style="display:inline-block;background:rgba(251,191,36,0.1);border:1px solid rgba(251,191,36,0.2);border-radius:8px;padding:6px 14px;margin-bottom:16px;">
                          <span style="font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#fbbf24;">Reminder</span>
                        </div>
                        <h1 style="margin:0;font-size:26px;font-weight:800;letter-spacing:-0.02em;color:#f1f5f9;line-height:1.2;">You have a task<br/>coming up.</h1>
                      </td>
                      <td align="right" valign="top" style="font-size:36px;opacity:0.6;">⏰</td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Task block -->
              <tr>
                <td style="padding:28px 40px;">
                  <p style="margin:0 0 16px;font-size:13px;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#475569;">Your Task</p>

                  <!-- Task card -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#0c0f1a;border-radius:14px;border:1px solid rgba(255,255,255,0.06);overflow:hidden;">
                    <tr>
                      <td style="width:3px;background:linear-gradient(180deg,#fbbf24,#f97316);padding:0;">&nbsp;</td>
                      <td style="padding:18px 20px;">
                        <p style="margin:0;font-size:16px;font-weight:600;color:#e2e8f0;line-height:1.5;">${taskText}</p>
                      </td>
                    </tr>
                  </table>

                  <!-- Motivational line -->
                  <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin-top:24px;">
                    <tr>
                      <td style="background:rgba(16,185,129,0.08);border:1px solid rgba(16,185,129,0.15);border-radius:10px;padding:14px 18px;">
                        <p style="margin:0;font-size:13px;color:#6ee7b7;line-height:1.5;">
                          🚀 &nbsp;Stay focused and complete it on time. You've got this.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- CTA -->
              <tr>
                <td style="padding:0 40px 32px;">
                  <table cellpadding="0" cellspacing="0" border="0">
                    <tr>
                      <td style="background:linear-gradient(135deg,#fbbf24,#f97316);border-radius:10px;">
                        <a href="https://assign-mate-one.vercel.app/home" style="display:inline-block;padding:13px 28px;font-size:14px;font-weight:700;color:#0c0f1a;text-decoration:none;letter-spacing:0.02em;">
                          View My Tasks →
                        </a>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="padding:28px 0 0;">
              <p style="margin:0;font-size:12px;color:#334155;line-height:1.8;">
                © ${new Date().getFullYear()} AssignMate &nbsp;·&nbsp; Stay organized, stay ahead.<br/>
                <span style="color:#1e293b;">You're receiving this because a task reminder was set.</span>
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