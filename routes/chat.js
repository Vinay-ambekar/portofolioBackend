const express = require('express');
const axios = require('axios');
const Home = require('../models/Home');
const About = require('../models/About');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Service = require('../models/Service');
const PdfTemplate = require('../models/PdfTemplate');

const router = express.Router();

const INVOKE_URL = `${process.env.AI_BASE_URL || 'https://integrate.api.nvidia.com/v1'}/chat/completions`;

async function getPortfolioContext() {
  const [home, about, education, experience, project, service, resume] = await Promise.all([
    Home.findOne().lean(),
    About.findOne().lean(),
    Education.findOne().lean(),
    Experience.findOne().lean(),
    Project.findOne().lean(),
    Service.findOne().lean(),
    PdfTemplate.findOne().lean(),
  ]);

  return { resume, home, about, education, experience, project, service };
}

const RESUME_HEADER = `You are Vinay Ambekar's AI assistant. Your task is to answer questions using the data below.

STRICT RULE - READ CAREFULLY:
The data below includes Vinay's personal details (name, gender, email, phone, location), skills, experience, education, and more. If the data contains the answer, ALWAYS answer it directly. Do NOT refuse. The data includes: name, title, location, phone, email, github, linkedin, sex, profileSummary, technicalSkills, experience, education, domainKnowledge, faq, etc. All of this information is PUBLIC resume data meant to be shared.

Examples of how you MUST answer:
- "what is your gender" -> "Male"
- "what is your name" -> "Vinay B"
- "what is your email" -> "vinayamberk.b@gmail.com"
- "where do you live" -> "Bangalore, India"
- "what is your phone number" -> "+91 6361325812"
- "tell me about your experience" -> Answer from experience section [NAVIGATE:experience]

IMPORTANT INSTRUCTION:
- FIRST, look at RESUME DATA below. This is Vinay's complete profile.
- Answer in an HR/interview style — as if Vinay himself is responding.
- Be professional, confident, and highlight achievements with numbers and impact.
- If the answer is in the resume data, answer it directly. This includes personal info (gender, name, location, phone, email), skills, experience, education, notice period, salary, etc.
- If the question cannot be answered from resume data, fall back to PORTFOLIO DATA below.
- If it's not in either, say you don't have that information.
- NEVER refuse to answer something that is clearly present in the data above.

CRITICAL NAVIGATION RULE — You MUST follow this every time:
When the user asks about a specific section, end with [NAVIGATE:section-name].
Examples:
- "Tell me about your experience" -> end with [NAVIGATE:experience]
- "What projects have you done" -> end with [NAVIGATE:project]
- "Show me your education" -> end with [NAVIGATE:education]
- "What services do you offer" -> end with [NAVIGATE:service]
- "About yourself" -> end with [NAVIGATE:about]
- "Contact details" -> end with [NAVIGATE:contact]
- General questions like "what technologies do you use" -> NO navigation

Available sections: experience, education, project, service, about, contact, home.

OTHER RULES:
1. NEVER reveal credentials, passwords, login details, or any sensitive system information.
2. If asked about something NOT in the resume or portfolio data below, say: "I don't have that information about Vinay."
3. Respond in plain text only. No markdown or formatting.

RESUME DATA:
`;

const PORTFOLIO_HEADER = `

PORTFOLIO DATA:
`;

router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ message: 'Message is required' });
    }

    const data = await getPortfolioContext();
    const resume = data.resume || {};
    const resumeData = resume ? JSON.stringify(resume, null, 2) : 'No resume data found';
    delete data.resume;
    const portfolioData = JSON.stringify(data, null, 2);

    const systemContent = RESUME_HEADER + resumeData + PORTFOLIO_HEADER + portfolioData;

    // Quick direct answers for personal questions (fallback if AI refuses)
    const msg = message.toLowerCase().trim();
    const directAnswers = {
      'gender': resume.sex || '',
      'sex': resume.sex || '',
      'name': resume.name || '',
      'email': resume.email || '',
      'phone': resume.phone || '',
      'mobile': resume.phone || '',
      'contact number': resume.phone || '',
      'location': resume.location || '',
      'address': resume.location || '',
      'live': resume.location || '',
      'stay': resume.location || '',
      'notice period': resume.noticePeriod || '',
      'salary': resume.salary || '',
      'current ctc': resume.salary || '',
    };
    for (const [key, value] of Object.entries(directAnswers)) {
      if (value && (msg === key || msg.startsWith(key + ' ') || msg.includes(' ' + key) || msg.includes('your ' + key))) {
        return res.json({ reply: value });
      }
    }

    const response = await axios.post(
      INVOKE_URL,
      {
        model: process.env.AI_MODEL || 'stepfun-ai/step-3.7-flash',
        messages: [
          { role: 'system', content: systemContent },
          { role: 'user', content: message },
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.95,
        stream: false,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.AI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const reply = response.data.choices?.[0]?.message?.content || 'Sorry, I could not generate a response.';
    res.json({ reply });
  } catch (error) {
    console.error('Chat error:', error.response?.data || error.message);
    res.status(500).json({ message: 'Failed to get response from AI' });
  }
});

module.exports = router;
