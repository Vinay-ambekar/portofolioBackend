const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Home = require('../models/Home');
const About = require('../models/About');
const Contact = require('../models/Contact');
const Education = require('../models/Education');
const Experience = require('../models/Experience');
const Project = require('../models/Project');
const Service = require('../models/Service');
const PdfTemplate = require('../models/PdfTemplate');
const User = require('../models/User');

const defaultData = {
  home: {
    image: '/img/header-img.jpg',
    title: 'Software Engineer',
    description: 'Frontend Developer with 4.8 years of experience building scalable, role-based web applications using React.js, Redux Toolkit, and JavaScript (ES6+). Proven expertise in developing complex multi-step forms, interactive dashboards, and workflow-driven UIs across ERP, e-commerce, and logistics domains.',
    contactInfo: [
      { icon: 'fas fa-map-marker-alt', text: 'Bangalore, India' },
      { icon: 'fas fa-envelope', text: 'vinayamberk.b@gmail.com' },
      { icon: 'fa fa-phone-alt', text: '+91 6361325812' },
      { icon: 'fab fa-github', text: 'github.com/vinay-ambekar' },
    ],
    socialLinks: [
      { icon: 'fab fa-github', url: 'https://github.com/vinay-ambekar' },
      { icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com/in/vinay-b-ambekar' },
    ],
  },
  about: {
    image: '/img/about.jpg',
    sidebarTitle: 'Software Engineer Based in Bangalore',
    greeting: "Hello, I'm Vinay, Based in Bangalore, India",
    description: 'Frontend Developer with 4.8 years of experience building scalable, role-based web applications using React.js, Redux Toolkit, and JavaScript (ES6+). Proven expertise in developing complex multi-step forms, interactive dashboards, and workflow-driven UIs across ERP, e-commerce, and logistics domains.',
    info: [
      { label: 'Phone', value: '+91 6361325812' },
      { label: 'Email', value: 'vinayamberk.b@gmail.com' },
      { label: 'Address', value: 'Bangalore, India' },
      { label: 'Freelancer', value: 'Available' },
    ],
    socialLinks: [
      { icon: 'fab fa-github', url: 'https://github.com/vinay-ambekar' },
      { icon: 'fab fa-linkedin-in', url: 'https://www.linkedin.com/in/vinay-b-ambekar' },
    ],
  },
  contact: {
    sidebarTitle: "Let's Start A New Project",
    items: [
      { icon: 'fas fa-map-marker-alt', label: 'Address', value: 'Bangalore, India' },
      { icon: 'fas fa-envelope', label: 'Mail Us', value: 'vinayamberk.b@gmail.com' },
      { icon: 'fa fa-phone-alt', label: 'Telephone', value: '+91 6361325812' },
    ],
    mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.767418794263!2d77.594566!3d12.971598!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44c4d%3A0xf8b3e6c1f8b3e6c1!2sBangalore!5e0!3m2!1sen!2sin!4v1',
  },
  education: {
    sidebarTitle: 'My Education Qualification',
    items: [
      {
        school: 'Visvesvaraya Technology University',
        year: '05/2013 - 06/2018',
        degree: 'Bachelor of Engineering (ECE)',
        desc: 'Completed Bachelor of Engineering in Electronics & Communication Engineering, building a strong foundation in problem-solving and technical analysis.',
      },
      {
        school: 'Department of Pre-University',
        year: '03/2012 - 05/2013',
        degree: '12th P.U.C',
        desc: 'Completed Pre-University Course with a focus on core academic disciplines, preparing for higher education in engineering.',
      },
      {
        school: 'Karnataka Secondary Education Examination',
        year: '04/2010 - 04/2011',
        degree: 'S.S.L.C',
        desc: 'Completed Secondary School Leaving Certificate with distinction, establishing a strong academic foundation.',
      },
    ],
  },
  experience: {
    sidebarTitle: 'My Work Experience',
    items: [
      {
        company: 'Aatral Technology Pvt Ltd',
        year: 'Sep 2024 — Present',
        role: 'Associate Software Engineer',
        desc: 'Developed 20+ feature modules across procurement, logistics, finance, and sales domains within a multi-tenant SaaS ERP platform. Built role-based UI rendering for 5+ user roles with workflow-driven access controls. Engineered complex multi-step forms with real-time IGST/CGST/SGST tax calculations and role-based pricing approvals. Developed end-to-end procurement workflow covering Indent, RFQ, Quotation, Purchase Order, and Quality Check. Built interactive dashboards with downloadable Excel and PDF exports for Rent/Sale ERP reports.',
      },
      {
        company: 'Cipherswift Solutions Pvt Ltd',
        year: 'Aug 2021 — Aug 2024',
        role: 'Software Engineer',
        desc: 'Led the full migration of a large-scale e-commerce platform from Angular.js to React, delivering improved performance and long-term maintainability. Architected a reusable React component library enabling a smooth transition with zero feature regression. Built a responsive React application for product browsing, account management, and order history tracking. Conducted regular code reviews to enforce React best practices throughout the 3-year migration cycle.',
      },
    ],
  },
  project: {
    sidebarTitle: 'My Works',
    items: [
      {
        category: 'ERP Platform',
        title: 'ATILA SaaS ERP - Module Development',
        description: 'Developed 20+ feature modules across procurement, logistics, finance, and sales domains within a multi-tenant SaaS ERP platform.',
        details: [
          'Built role-based UI rendering for 5+ user roles with workflow-driven access controls and multi-level approval logs',
          'Engineered complex multi-step forms with real-time IGST/CGST/SGST tax calculations and role-based pricing approvals',
          'Developed end-to-end procurement workflow covering Indent, RFQ, Quotation, Purchase Order, Service Entry Sheets, Quality Check, and Gate Entry',
          'Built interactive dashboards with downloadable Excel and PDF exports for Rent/Sale ERP reports',
          'Delivered finance modules including Invoice Generation, Credit Policy management, Ledger, and Costing Sheet',
          'Implemented multi-level Approval Workflow with audit logs supporting Sales Manager, Support Team, and Director sign-offs',
        ],
        images: [
          'https://picsum.photos/seed/erp1/600/400',
          'https://picsum.photos/seed/erp2/600/400',
          'https://picsum.photos/seed/erp3/600/400',
        ],
      },
      {
        category: 'Migration',
        title: 'E-commerce Platform - Angular to React Migration',
        description: 'Led the full migration of a large-scale e-commerce platform from Angular.js to React, delivering improved performance and maintainability.',
        details: [
          'Architected a reusable React component library to replace Angular.js components with zero feature regression',
          'Built a responsive React application supporting product browsing, account management, and order history tracking',
          'Conducted regular code reviews to enforce React best practices throughout the 3-year migration cycle',
          'Collaborated with UX/UI designers, QA, and stakeholders to prioritize features and resolve migration bugs',
          'Maintained technical documentation covering software design, development, and testing processes',
        ],
        images: [
          'https://picsum.photos/seed/ecom1/600/400',
          'https://picsum.photos/seed/ecom2/600/400',
          'https://picsum.photos/seed/ecom3/600/400',
        ],
      },
      {
        category: 'Dashboard',
        title: 'Interactive Reporting & Dashboard Interface',
        description: 'Built interactive dashboards and reporting interfaces to visualize process stage intervals with downloadable exports.',
        details: [
          'Visualized process stage intervals from creation to dispatch for operational insights',
          'Implemented downloadable Excel and PDF exports for comprehensive Rent/Sale ERP reports',
          'Integrated real-time business logic with data visualization for informed decision-making',
          'Supported multi-tenant data isolation and role-based views across departments',
        ],
        images: [
          'https://picsum.photos/seed/dash1/600/400',
          'https://picsum.photos/seed/dash2/600/400',
          'https://picsum.photos/seed/dash3/600/400',
        ],
      },
    ],
  },
  service: {
    sidebarTitle: 'What I Do For You',
    items: [
      {
        icon: 'fab fa-react',
        title: 'Frontend Development',
        desc: 'Building scalable, role-based web applications using React.js, Redux Toolkit, and JavaScript (ES6+). Expertise in complex multi-step forms, interactive dashboards, and responsive UI with Bootstrap.',
        tags: ['React.js', 'Redux Toolkit', 'Bootstrap', 'JavaScript ES6+'],
      },
      {
        icon: 'fas fa-server',
        title: 'Backend & API',
        desc: 'Developing REST APIs and backend services using Node.js and Express.js. Experience integrating third-party services and building scalable server-side solutions with MongoDB.',
        tags: ['Node.js', 'Express.js', 'REST API', 'MongoDB'],
      },
      {
        icon: 'fas fa-layer-group',
        title: 'Full Stack Solutions',
        desc: 'Delivering end-to-end frontend solutions across ERP, e-commerce, and logistics domains. Proficient in API integration, role-based authentication, and performance optimization.',
        tags: ['API Integration', 'Role-based Auth', 'Performance', 'Agile/Scrum'],
      },
    ],
  },
  pdfTemplate: {
    name: 'VINAY B',
    title: 'Software Engineer',
    location: 'Bangalore, India',
    phone: '+91 6361325812',
    email: 'vinayamberk.b@gmail.com',
    github: 'https://github.com/vinay-ambekar',
    linkedin: 'www.linkedin.com/in/vinay-b-ambekar',
    profileSummary: 'Frontend Developer with 4.8 years of experience building scalable, role-based web applications using React.js, Redux Toolkit, and JavaScript (ES6+). Proven expertise in developing complex multi-step forms, interactive dashboards, workflow-driven UIs, and CRUD-based master data modules. Experienced in REST API integration, role-based authentication, and delivering end-to-end frontend solutions across ERP, e-commerce, and logistics domains. Successfully led an Angular.js-to-React migration for a large-scale e-commerce platform. Strong collaborator in cross-functional Agile teams with a consistent record of on-time delivery.',
    technicalSkills: {
      frontend: 'React.js, Redux Toolkit, React Hooks, HTML5, CSS3, Bootstrap',
      backend: 'Node.js, Express.js, REST API',
      database: 'MongoDB',
      tools: 'Git, GitHub, Postman, VSCode',
      programming: 'JavaScript (ES6+)',
      concepts: 'API integration, Role based authentication, Performance optimization, Agile/Scrum',
    },
    experience: [
      {
        company: 'Aatral Technology Pvt, ltd',
        role: 'Associate Software Engineer',
        product: 'Product - ATILA SaaS Product',
        startDate: 'Sep 2024',
        endDate: 'Present',
        location: 'Bangalore, India',
        highlights: [
          'Developed 20+ feature modules across procurement, logistics, finance, and sales domains within a multi-tenant SaaS ERP platform used across medical equipment rental and pre-engineered building verticals.',
          'Built role-based UI rendering for 5+ user roles (Sales, Store Manager, Dispatch Manager, FI Executive, Patient Counselor) with workflow-driven access controls (Create, Modify, Delete) and multi-level approval logs.',
          'Engineered complex multi-step forms with real-time business logic including IGST/CGST/SGST tax calculations, role-based pricing approvals, and Rent vs. Sale item handling.',
          'Developed end-to-end procurement workflow covering Indent, RFQ, Quotation, Purchase Order, Service Entry Sheets, Quality Check, and Gate Entry reducing manual handoff steps across teams.',
          'Built interactive dashboards and reporting interfaces to visualize process stage intervals (creation to dispatch), with downloadable Excel and PDF exports for Rent/Sale ERF reports.',
          'Implemented a barcode assignment interface that triggers automated status updates ("Ready to Dispatch"), streamlining store manager operations.',
          'Delivered finance modules including Invoice Generation (PDF download), Credit Policy management, Ledger (Stock, Customer, Tax), Costing Sheet with auto-calculations, and KYC/Credit Approval with document attachments.',
          'Built logistics management modules covering Transporter, Gate Entry (Inward/Outward), Vehicle, Driver, and Fuel management with full CRUD and bulk Excel upload support.',
          'Implemented a multi-level Approval Workflow supporting Sales Manager, Support Team, and Director sign-offs with audit logs.',
        ],
      },
      {
        company: 'Cipherswift Solutions Pvt, Ltd',
        role: 'Software Engineer',
        product: 'Project - E-commerce website - React (Migration)',
        startDate: 'Aug 2021',
        endDate: 'Aug 2024',
        location: 'Bangalore, India',
        highlights: [
          'Led the full migration of a large-scale e-commerce platform from Angular.js to React, delivering improved performance and long-term maintainability across the entire codebase.',
          'Architected a reusable React component library to replace Angular.js components, enabling a smooth transition with zero feature regression for end users.',
          'Built a responsive React application supporting product browsing, account management, and order history tracking for a large customer base.',
          'Conducted regular code reviews to enforce React best practices and maintain consistent code quality throughout the 3-year migration cycle.',
          'Collaborated with UX/UI designers, QA, and stakeholders to prioritize features, resolve migration bugs, and deliver a consistent, improved user interface pre-release.',
          'Maintained technical documentation covering software design, development, and testing processes for the migration project.',
        ],
      },
    ],
    education: [
      { degree: 'Bachelor of Engineering (ECE)', institution: 'Visvesvaraya Technology University', startDate: '05/2013', endDate: '06/2018' },
      { degree: '12th P.U.C', institution: 'Department of Pre-University', startDate: '03/2012', endDate: '05/2013' },
      { degree: 'S.S.L.C', institution: 'Karnataka Secondary Education Examination', startDate: '04/2010', endDate: '04/2011' },
    ],
  },
};

const seed = async () => {
  try {
    await connectDB();

    const models = [
      { model: Home, key: 'home' },
      { model: About, key: 'about' },
      { model: Contact, key: 'contact' },
      { model: Education, key: 'education' },
      { model: Experience, key: 'experience' },
      { model: Project, key: 'project' },
      { model: Service, key: 'service' },
      { model: PdfTemplate, key: 'pdfTemplate' },
    ];

    for (const { model, key } of models) {
      const exists = await model.findOne();
      if (!exists) {
        await model.create(defaultData[key]);
        console.log(`${key} data seeded`);
      } else {
        console.log(`${key} data already exists, skipping`);
      }
    }

    const userExists = await User.findOne({ email: 'admin@vinay.com' });
    if (!userExists) {
      await User.create({ email: 'admin@vinay.com', password: 'admin123' });
      console.log('Default user created (admin@vinay.com / admin123)');
    } else {
      console.log('Default user already exists, skipping');
    }

    console.log('Seed completed');
  } catch (error) {
    console.error('Seed error:', error.message);
    throw error;
  }
};

if (require.main === module) {
  seed().then(() => process.exit(0)).catch(() => process.exit(1));
}

module.exports = seed;
