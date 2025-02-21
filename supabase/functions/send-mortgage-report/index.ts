
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface SubscribeRequest {
  email: string;
  name: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("Mortgage report subscription endpoint hit with method:", req.method);
  
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log("Parsing subscription request...");
    const { email, name }: SubscribeRequest = await req.json();
    console.log("Received subscription request for:", { email, name });

    // Send confirmation email to subscriber
    await resend.emails.send({
      from: "BC Mortgage Trends <mortgage@amplified.info>",
      to: [email],
      subject: "Your BC Mortgage Trends Report",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background-color: #1a56db; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background-color: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; border-radius: 0 0 8px 8px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Thank You for Your Interest!</h1>
              </div>
              <div class="content">
                <p>Hello ${name},</p>
                <p>Thank you for requesting our BC Mortgage Trends Report. We're excited to share our insights with you!</p>
                <p>Our team will review your request and send you the latest report within the next 24 hours.</p>
                <p>The report includes:</p>
                <ul>
                  <li>Current market analysis</li>
                  <li>Rate predictions</li>
                  <li>Regional trends across British Columbia</li>
                  <li>Expert insights and recommendations</li>
                </ul>
                <p>If you have any questions in the meantime, feel free to reach out to us.</p>
                <p>Best regards,<br>The BC Mortgage Trends Team</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    // Send notification to admin
    await resend.emails.send({
      from: "BC Mortgage Trends <mortgage@amplified.info>",
      to: ["mark@amplified.info"],
      subject: "New BC Mortgage Trends Report Request",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            </style>
          </head>
          <body>
            <div class="container">
              <h2>New Report Request</h2>
              <p>A new request for the BC Mortgage Trends Report has been received.</p>
              <p><strong>Details:</strong></p>
              <ul>
                <li>Name: ${name}</li>
                <li>Email: ${email}</li>
                <li>Requested: ${new Date().toLocaleString()}</li>
              </ul>
              <p>Please send them the latest report within 24 hours.</p>
            </div>
          </body>
        </html>
      `,
    });

    console.log("Emails sent successfully");
    return new Response(
      JSON.stringify({ message: "Subscription processed successfully" }), 
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      }
    );
  } catch (error: any) {
    console.error("Error processing subscription:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
};

serve(handler);
