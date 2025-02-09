
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("RESEND_API_KEY");
    if (!apiKey) {
      throw new Error("RESEND_API_KEY environment variable is not set");
    }

    // Initialize Resend with API key
    const resend = new Resend(apiKey);
    const { name, email, message }: ContactFormData = await req.json();

    console.log("Preparing to send emails for:", { name, email });

    // Send notification email to site owner
    console.log("Attempting to send owner notification email...");
    const { data: ownerEmailData, error: ownerEmailError } = await resend.emails.send({
      from: "onboarding@resend.dev", // Using Resend's default domain for testing
      to: ["mark@amplified.info"],
      subject: `New Contact Form Message from ${name}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (ownerEmailError) {
      console.error("Owner notification email error:", ownerEmailError);
      return new Response(
        JSON.stringify({ error: ownerEmailError }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Owner notification email sent successfully:", ownerEmailData);

    // Send confirmation email to the sender
    console.log("Attempting to send confirmation email to sender...");
    const { data: senderEmailData, error: senderEmailError } = await resend.emails.send({
      from: "onboarding@resend.dev", // Using Resend's default domain for testing
      to: [email],
      subject: "We've received your message",
      html: `
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>For reference, here's what you sent us:</p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>The Team</p>
      `,
    });

    if (senderEmailError) {
      console.error("Sender confirmation email error:", senderEmailError);
      return new Response(
        JSON.stringify({ error: senderEmailError }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    console.log("Sender confirmation email sent successfully:", senderEmailData);

    return new Response(
      JSON.stringify({
        message: "Emails sent successfully",
        ownerEmail: ownerEmailData,
        senderEmail: senderEmailData
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          ...corsHeaders,
        },
      }
    );
  } catch (error) {
    console.error("Error sending emails:", error);
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
