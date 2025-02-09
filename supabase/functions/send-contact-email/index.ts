
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
    const resend = new Resend(Deno.env.get("RESEND_API_KEY"));
    const { name, email, message }: ContactFormData = await req.json();

    console.log("Sending emails for contact form submission:", { name, email });

    // Send notification email to site owner
    const ownerEmailResponse = await resend.emails.send({
      from: "Contact Form <mark@amplified.info>",
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

    console.log("Owner notification email response:", ownerEmailResponse);

    // Send confirmation email to the sender
    const senderEmailResponse = await resend.emails.send({
      from: "Amplified Information <mark@amplified.info>",
      to: [email],
      subject: "We've received your message",
      html: `
        <h2>Thank you for contacting us, ${name}!</h2>
        <p>We have received your message and will get back to you as soon as possible.</p>
        <p>For reference, here's what you sent us:</p>
        <p>${message}</p>
        <br>
        <p>Best regards,<br>Amplified Information Team</p>
      `,
    });

    console.log("Sender confirmation email response:", senderEmailResponse);

    return new Response(
      JSON.stringify({ 
        message: "Emails sent successfully",
        ownerEmail: ownerEmailResponse,
        senderEmail: senderEmailResponse
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
