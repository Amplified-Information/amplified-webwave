
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SmtpClient } from "https://deno.land/x/smtp@v0.7.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const sendEmail = async (to: string, subject: string, html: string) => {
  const client = new SmtpClient();
  
  const smtpConfig = {
    hostname: "mail.amplified.info",
    port: 465,
    username: "contact@amplified.info",
    password: Deno.env.get("SMTP_PASSWORD")!,
  };
  
  console.log("SMTP Configuration:", {
    ...smtpConfig,
    password: "[REDACTED]" // Don't log the actual password
  });
  
  try {
    console.log("Attempting to connect to SMTP server...");
    await client.connectTLS(smtpConfig);
    console.log("Successfully connected to SMTP server");

    console.log(`Sending email to ${to}...`);
    await client.send({
      from: "contact@amplified.info",
      to,
      subject,
      html,
    });
    console.log("Email sent successfully");

    await client.close();
    console.log("SMTP connection closed");
  } catch (error) {
    console.error("Detailed error in sendEmail:", {
      error,
      errorMessage: error.message,
      errorStack: error.stack,
      smtpConfig: {
        ...smtpConfig,
        password: "[REDACTED]"
      }
    });
    throw error;
  }
};

const handler = async (req: Request): Promise<Response> => {
  console.log("Contact form endpoint hit with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing request body...");
    const { name, email, message }: ContactEmailRequest = await req.json();
    console.log("Received contact form submission:", { name, email, message });

    try {
      // Send email to site owner
      console.log("Sending email to site owner...");
      await sendEmail(
        "mark@amplified.info",
        `New Contact Form Submission from ${name}`,
        `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `
      );

      // Send confirmation email to user
      console.log("Sending confirmation email to user...");
      await sendEmail(
        email,
        "We've received your message!",
        `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>The Amplified Information Team</p>
        `
      );

      console.log("Both emails sent successfully");

      return new Response(
        JSON.stringify({ message: "Emails sent successfully" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            ...corsHeaders,
          },
        }
      );
    } catch (emailError) {
      console.error("Email sending failed:", {
        error: emailError,
        message: emailError.message,
        stack: emailError.stack
      });
      return new Response(
        JSON.stringify({ 
          error: "Failed to send email",
          details: emailError.message 
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
  } catch (error) {
    console.error("Error processing request:", {
      error,
      message: error.message,
      stack: error.stack
    });
    return new Response(
      JSON.stringify({ 
        error: "Invalid request format",
        details: error.message 
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
