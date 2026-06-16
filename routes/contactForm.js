const express = require('express');
const ContactMessage = require('../models/ContactMessage');
const sendMail = require('../config/mail');

const router = express.Router();

router.post('/send', async (req, res) => {
  try {
    const { name, email, phone, project, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'Name, email, and message are required' });
    }

    const contactMessage = await ContactMessage.create({
      name,
      email,
      phone: phone || '',
      project: project || '',
      subject: subject || '',
      message,
      submittedAt: new Date(),
    });

    const submittedTime = new Date(contactMessage.submittedAt).toLocaleString();

    const ownerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
        <h2 style="color:#2563eb;border-bottom:2px solid #2563eb;padding-bottom:10px">New Portfolio Contact Message</h2>
        <table style="border-collapse:collapse;width:100%;margin-top:16px">
          <tr><td style="padding:10px;border:1px solid #ddd;background:#f8fafc;font-weight:bold;width:120px">Name</td><td style="padding:10px;border:1px solid #ddd">${name}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background:#f8fafc;font-weight:bold">Email</td><td style="padding:10px;border:1px solid #ddd"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background:#f8fafc;font-weight:bold">Phone</td><td style="padding:10px;border:1px solid #ddd">${phone || 'N/A'}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background:#f8fafc;font-weight:bold">Project</td><td style="padding:10px;border:1px solid #ddd">${project || 'N/A'}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background:#f8fafc;font-weight:bold">Subject</td><td style="padding:10px;border:1px solid #ddd">${subject || 'N/A'}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background:#f8fafc;font-weight:bold;vertical-align:top">Message</td><td style="padding:10px;border:1px solid #ddd">${message}</td></tr>
          <tr><td style="padding:10px;border:1px solid #ddd;background:#f8fafc;font-weight:bold">Submitted At</td><td style="padding:10px;border:1px solid #ddd">${submittedTime}</td></tr>
        </table>
      </div>
    `;

    const thankYouHtml = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#333">
        <div style="background:linear-gradient(135deg,#2563eb,#1d4ed8);padding:30px;text-align:center;border-radius:8px 8px 0 0">
          <h1 style="color:#fff;margin:0;font-size:24px">Thank You for Reaching Out!</h1>
        </div>
        <div style="padding:30px;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px">
          <p style="font-size:16px;line-height:1.6">Hi <strong>${name}</strong>,</p>
          <p style="font-size:16px;line-height:1.6">Thank you for contacting me. I have received your message and will get back to you as soon as possible.</p>
          <div style="background:#f8fafc;padding:16px;border-radius:6px;margin:20px 0">
            <h3 style="margin:0 0 10px;color:#2563eb">Your Message Summary</h3>
            <p style="margin:4px 0"><strong>Subject:</strong> ${subject || 'N/A'}</p>
            <p style="margin:4px 0"><strong>Message:</strong> ${message}</p>
          </div>
          <p style="font-size:16px;line-height:1.6">If you have any urgent questions, feel free to reach me directly at <a href="mailto:${process.env.CONTACT_RECEIVER_EMAIL}" style="color:#2563eb">${process.env.CONTACT_RECEIVER_EMAIL}</a>.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0">
          <p style="font-size:14px;color:#666">Best regards,<br><strong>Vinay B</strong><br>Software Engineer</p>
        </div>
      </div>
    `;

    const mailErrors = [];

    try {
      await sendMail({
        to: process.env.CONTACT_RECEIVER_EMAIL,
        subject: `Portfolio Contact: ${subject || 'New Message'} from ${name}`,
        html: ownerHtml,
      });
    } catch (err) {
      mailErrors.push('Owner notification: ' + err.message);
    }

    try {
      await sendMail({
        to: email,
        subject: 'Thank you for contacting Vinay B',
        html: thankYouHtml,
      });
    } catch (err) {
      mailErrors.push('Auto-reply: ' + err.message);
    }

    res.status(201).json({
      message: 'Message sent successfully',
      data: contactMessage,
      ...(mailErrors.length && { mailErrors }),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ submittedAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
