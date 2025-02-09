
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { SMTPClient } from "https://deno.land/x/denomailer@1.6.0/mod.ts";

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
    const { name, email, message }: ContactFormData = await req.json();

    console.log("Attempting to create SMTP client with credentials");
    
    const client = new SMTPClient({
      connection: {
        hostname: "amplified.info",
        port: 587,
        tls: false, // Start with plain connection
        auth: {
          username: "mark@amplified.info",
          password: Deno.env.get("SMTP_PASSWORD")
        }
      }
    });

    console.log("SMTP client created, attempting to send email");

    // Send email
    try {
      const emailResult = await client.send({
        from: "mark@amplified.info",
        to: "mark@amplified.info",
        subject: "New Contact Form Submission",
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <p>${message}</p>
        `,
      });

      console.log("Email send attempt completed:", emailResult);
    } catch (emailError) {
      console.error("Error sending email:", emailError);
      throw emailError;
    }

    return new Response(
      JSON.stringify({
        message: "Form submission received successfully",
        data: { name, email, message }
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
    console.error("Error processing form submission:", error);
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }

    return new Response(
      JSON.stringify({ 
        error: "Failed to process form submission",
        details: error instanceof Error ? error.message : String(error)
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
