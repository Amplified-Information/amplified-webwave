
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Max-Age": "86400",
};

interface ContactEmailRequest {
  name: string;
  email: string;
  message: string;
}

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const handler = async (req: Request): Promise<Response> => {
  console.log("Contact form endpoint hit with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { 
      headers: corsHeaders
    });
  }

  try {
    console.log("Parsing request body...");
    const { name, email, message }: ContactEmailRequest = await req.json();
    console.log("Received contact form submission:", { name, email, message });

    try {
      // Send email to site owner with enhanced formatting
      console.log("Sending email to site owner...");
      await resend.emails.send({
        from: "Amplified Information <contact@amplified.info>",
        to: ["mark@amplified.info"],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background-color: #1a56db; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                .content { background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
                .field { margin-bottom: 15px; }
                .label { font-weight: bold; color: #4a5568; }
                .message { white-space: pre-wrap; background-color: white; padding: 15px; border-radius: 6px; border: 1px solid #e2e8f0; }
              </style>
            </head>
            <body>
              <div class="header">
                <h1 style="margin: 0;">New Contact Form Submission</h1>
              </div>
              <div class="content">
                <div class="field">
                  <p class="label">Name:</p>
                  <p>${name}</p>
                </div>
                <div class="field">
                  <p class="label">Email:</p>
                  <p>${email}</p>
                </div>
                <div class="field">
                  <p class="label">Message:</p>
                  <div class="message">${message}</div>
                </div>
              </div>
            </body>
          </html>
        `,
      });

      // Send confirmation email to user with enhanced formatting
      console.log("Sending confirmation email to user...");
      await resend.emails.send({
        from: "Amplified Information <contact@amplified.info>",
        to: [email],
        subject: "Thank you for contacting us",
        html: `
          <!DOCTYPE html>
          <html>
            <head>
              <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; }
                .logo { width: 150px; height: auto; margin-top: 10px; }
                .content { max-width: 600px; margin: 20px 0; }
                .footer { margin-top: 30px; color: #666; }
                .footer p { margin: 3px 0; font-size: 8pt; }
                .name { color: #000000; }
                .name-text { font-weight: bold; font-size: 12pt !important; }
                .cbip { color: #000000; font-size: 12pt !important; }
                a { color: #666; text-decoration: none; }
              </style>
            </head>
            <body>
              <div class="content">
                <p>Hello ${name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <div class="footer">
                  <p class="name"><span class="name-text">Mark Gratton</span>, <span class="cbip">CBIP</span></p>
                  <img src="https://amplified.info/lovable-uploads/f8f959e3-530e-46d3-8306-1cc3ad3cebee.png" alt="Amplified Information" class="logo">
                  <p><a href="mailto:mark@amplified.info">mark@amplified.info</a></p>
                  <p>(613) 859-3905</p>
                  <p>3473 Dove Creek Road<br>Courtenay, BC V9J 1P3</p>
                </div>
              </div>
            </body>
          </html>
        `,
      });

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

