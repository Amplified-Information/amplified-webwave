
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

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
      const ownerEmailResponse = await resend.emails.send({
        from: "Amplified Information <contact@amplified.info>",
        to: "mark@amplified.info",
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h1>New Contact Form Submission</h1>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });
      
      console.log("Owner email sent successfully:", ownerEmailResponse);

      // Send confirmation email to user
      console.log("Sending confirmation email to user...");
      const userEmailResponse = await resend.emails.send({
        from: "Amplified Information <contact@amplified.info>",
        to: email,
        subject: "We've received your message!",
        html: `
          <h1>Thank you for contacting us, ${name}!</h1>
          <p>We have received your message and will get back to you as soon as possible.</p>
          <p>Best regards,<br>The Amplified Information Team</p>
        `,
      });
      
      console.log("User confirmation email sent successfully:", userEmailResponse);

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
