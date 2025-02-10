
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
                .logo { width: 200px; height: auto; display: block; margin: 10px 0; }
                .content { max-width: 600px; margin: 20px 0; }
                .footer { margin-top: 30px; color: #666; }
                .footer p { margin: 3px 0; font-size: 8pt; }
                .name { color: #000000; font-weight: bold; font-size: 12pt !important; }
                .title { font-weight: normal; }
                a { color: #666; text-decoration: none; }
              </style>
            </head>
            <body>
              <div class="content">
                <p>Hello ${name},</p>
                <p>We have received your message and will get back to you as soon as possible.</p>
                <div class="footer">
                  <p class="name"><strong>Mark Gratton</strong>, <span class="title">CBIP</span></p>
                  <img src="data:image/png;base64,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