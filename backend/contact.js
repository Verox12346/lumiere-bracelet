const express = require('express');
const router = express.Router();
const { Resend } = require('resend');
const supabase = require('../lib/supabase');

const resend = new Resend(process.env.RESEND_API_KEY);

// POST /api/contact
// Saves message to Supabase + sends email notification to shop owner
router.post('/', async (req, res) => {
  const { name, email, message } = req.body;

  // --- Validation ---
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Invalid email address.' });
  }

  if (message.length > 2000) {
    return res.status(400).json({ error: 'Message is too long (max 2000 characters).' });
  }

  try {
    // 1. Save to Supabase database
    const { error: dbError } = await supabase
      .from('contact_messages')
      .insert([{ name, email, message, created_at: new Date().toISOString() }]);

    if (dbError) {
      console.error('Supabase error:', dbError);
      return res.status(500).json({ error: 'Failed to save message. Please try again.' });
    }

    // 2. Send email notification to shop owner
    await resend.emails.send({
      from: 'Lumiere Bracelet <noreply@yourdomain.com>', // update after verifying domain
      to: process.env.OWNER_EMAIL,
      subject: `📩 New message from ${name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">New Contact Message — Lumiere Bracelet</h2>
          <hr style="border-color: #d4af37;">
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          <p><strong>Message:</strong></p>
          <blockquote style="border-left: 4px solid #d4af37; padding-left: 1rem; color: #555;">
            ${message.replace(/\n/g, '<br>')}
          </blockquote>
          <hr style="border-color: #eee;">
          <p style="color: #999; font-size: 0.85rem;">Received via Lumiere Bracelet website contact form</p>
        </div>
      `
    });

    // 3. Send confirmation email to the customer
    await resend.emails.send({
      from: 'Lumiere Bracelet <noreply@yourdomain.com>',
      to: email,
      subject: 'We received your message! ✨',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Thank you, ${name}!</h2>
          <p>We received your message and will get back to you as soon as possible.</p>
          <p>You can also reach us directly:</p>
          <ul>
            <li>📱 WhatsApp: <a href="https://wa.me/${process.env.WHATSAPP_NUMBER}">Click to chat</a></li>
            <li>📧 Email: ${process.env.OWNER_EMAIL}</li>
          </ul>
          <p style="color: #d4af37; font-weight: bold;">— Lumiere Bracelet Team ✨</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: 'Message sent successfully!' });

  } catch (err) {
    console.error('Contact route error:', err);
    return res.status(500).json({ error: 'Server error. Please try again later.' });
  }
});

// GET /api/contact — fetch all messages (admin use)
router.get('/', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_SECRET_KEY) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { data, error } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  return res.json(data);
});

module.exports = router;
