import type { Context } from "@netlify/functions";
import { neon } from "@netlify/neon";

// POST /api/contact — save a contact form submission
export default async (request: Request, _context: Context) => {
  // Only allow POST
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  if (request.method !== "POST") {
    return Response.json({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Validate
    if (!name || !email || !message) {
      return Response.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    if (typeof name !== "string" || name.length > 200) {
      return Response.json({ error: "Invalid name" }, { status: 400 });
    }

    if (typeof email !== "string" || !email.includes("@") || email.length > 320) {
      return Response.json({ error: "Invalid email" }, { status: 400 });
    }

    if (typeof message !== "string" || message.length > 5000) {
      return Response.json(
        { error: "Message too long (max 5000 characters)" },
        { status: 400 }
      );
    }

    const sql = neon();

    // Create table if it doesn't exist
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(200) NOT NULL,
        email VARCHAR(320) NOT NULL,
        message TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      )
    `;

    // Insert submission
    await sql`
      INSERT INTO contact_submissions (name, email, message)
      VALUES (${name.trim()}, ${email.trim()}, ${message.trim()})
    `;

    return Response.json(
      { success: true, message: "Message sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return Response.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
};
