type EmailPayload = {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: EmailPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) return // gracefully skip when not configured

  const from = process.env.EMAIL_FROM ?? "GenHub <noreply@genhub.xyz>"

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to, subject, html }),
    })
  } catch {
    // Non-blocking — email failures must never break the main request
  }
}
