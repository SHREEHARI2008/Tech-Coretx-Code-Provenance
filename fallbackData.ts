import { User, Event, Project, Opportunity, Resource, Announcement } from './types';

export const FALLBACK_MEMBERS: User[] = [
  {
    id: 'usr_demo',
    username: 'Venkat NS',
    email: 'venkatns2008@gmail.com',
    phone: '+91 98765 43210',
    gender: 'Male',
    dob: '2004-05-15',
    city: 'Chennai',
    institution: 'IET Student Chapter - SRM Institute of Science and Technology',
    role: 'lead',
    bio: 'Full Stack Engineer & Tech Enthusiast passionate about building impactful community platforms and AI systems.',
    skills: ['React', 'TypeScript', 'Node.js', 'Python', 'Tailwind CSS', 'Docker'],
    interests: ['AI Research', 'Open Source', 'Embedded Systems', 'IoT'],
    githubUrl: 'https://github.com',
    linkedinUrl: 'https://linkedin.com',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    points: 450,
    joinedAt: '2025-01-10'
  },
  {
    id: 'usr_sarah',
    username: 'Sarah Chen',
    email: 'sarah.chen@iet.org',
    phone: '+91 91234 56789',
    gender: 'Female',
    dob: '2003-09-21',
    city: 'Bangalore',
    institution: 'IET Student Chapter - RV College of Engineering',
    role: 'member',
    bio: 'IoT Developer & Robotics enthusiast working on autonomous rover projects.',
    skills: ['Arduino', 'C++', 'Python', 'ROS', 'Circuit Design'],
    interests: ['Robotics', 'Space Tech', 'Autonomous Systems'],
    githubUrl: 'https://github.com',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    points: 320,
    joinedAt: '2025-02-01'
  }
];

export const FALLBACK_EVENTS: Event[] = [
  {
    id: 'evt_ongoing_1',
    title: '24-Hour Embedded IoT & AI Edge Design Sprint',
    description: 'Happening now! Teams are building real-time edge inference systems using Raspberry Pi 5 and ESP32 with live mentor feedback and sensor kits provided.',
    category: 'Hackathon',
    date: '2026-08-01',
    time: '08:00 AM - 08:00 AM (+1 Day)',
    location: 'IET Innovation Hall 101 & Virtual Stream',
    isVirtual: false,
    speaker: 'Dr. Anita Roy',
    speakerRole: 'Head of Edge AI Lab, Texas Instruments',
    organizer: 'IET Student Chapter Committee',
    bannerUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80',
    maxCapacity: 120,
    registeredUserIds: ['usr_demo', 'usr_sarah'],
    tags: ['IoT', 'Edge AI', 'Live Hackathon', 'Hardware'],
    status: 'ongoing',
    timeline: 'present'
  },
  {
    id: 'evt_1',
    title: 'IET National Hackathon 2026: AI for Social Good',
    description: 'A 36-hour nationwide hackathon bringing together students and engineers to tackle pressing challenges in healthcare, clean energy, and smart cities.',
    category: 'Hackathon',
    date: '2026-08-15',
    time: '09:00 AM - 09:00 PM',
    location: 'Auditorium A, Tech Campus & Online',
    isVirtual: false,
    speaker: 'Dr. Aris Thorne',
    speakerRole: 'Chief Innovation Officer, IET Global',
    organizer: 'IET Student Chapter Committee',
    bannerUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=80',
    maxCapacity: 250,
    registeredUserIds: ['usr_demo', 'usr_sarah'],
    tags: ['AI/ML', 'Hackathon', 'Prizes', 'Networking'],
    status: 'upcoming',
    timeline: 'future'
  },
  {
    id: 'evt_2',
    title: 'Masterclass: Cloud Native Architecture & Microservices',
    description: 'Learn modern DevOps pipelines, Kubernetes orchestration, and scalable microservices patterns hands-on from industry architects.',
    category: 'Workshop',
    date: '2026-08-22',
    time: '02:00 PM - 05:00 PM',
    location: 'Zoom Virtual Hall 1',
    isVirtual: true,
    virtualLink: 'https://zoom.us/j/iet-connect-masterclass',
    speaker: 'Priya Sundaram',
    speakerRole: 'Principal Cloud Architect, AWS Tech Solutions',
    organizer: 'IET Technical Special Interest Group',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    maxCapacity: 150,
    registeredUserIds: ['usr_demo'],
    tags: ['Cloud', 'DevOps', 'Kubernetes', 'Backend'],
    status: 'upcoming',
    timeline: 'future'
  }
];

export const FALLBACK_PROJECTS: Project[] = [
  {
    id: 'proj_present_1',
    title: 'Neuromorphic Audio Processing Chip Firmware',
    tagline: 'Ultra-low power acoustic anomaly detection for industrial pipeline monitoring.',
    description: 'Currently building custom firmware for spiking neural network hardware to detect early stress fractures and leaks in high-pressure conduits with sub-milliwatt power consumption.',
    domain: 'IoT & Embedded',
    authorId: 'usr_sarah',
    authorName: 'Sarah Chen',
    authorInstitution: 'RV College of Engineering',
    teamMembers: ['Sarah Chen', 'Rohan Varma', 'Dr. S. K. Bose'],
    githubUrl: 'https://github.com/iet-projects/neuromorphic-audio-firmware',
    demoUrl: 'https://neuromorphic-audio.example.com',
    likes: 52,
    likedByUserIds: ['usr_demo'],
    tags: ['Embedded', 'Neuromorphic', 'EdgeAI', 'Active Build'],
    createdAt: '2026-07-15',
    imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80',
    status: 'Active',
    timeline: 'present',
    achievements: 'Selected for IET R&D Innovation Showcase 2026'
  },
  {
    id: 'proj_1',
    title: 'Smart Solar-Powered Grid Monitor',
    tagline: 'An IoT telemetry system monitoring distributed solar panel efficiency in real-time.',
    description: 'Utilizes ESP32 microcontrollers with current sensors and MQTT protocol to stream voltage/current telemetry to a cloud dashboard with anomaly detection.',
    domain: 'IoT & Embedded',
    authorId: 'usr_sarah',
    authorName: 'Sarah Chen',
    authorInstitution: 'RV College of Engineering',
    teamMembers: ['Sarah Chen', 'Anand Kumar', 'Meera Nair'],
    githubUrl: 'https://github.com/iet-projects/smart-solar-grid',
    demoUrl: 'https://solar-monitor-demo.example.com',
    likes: 38,
    likedByUserIds: ['usr_demo'],
    tags: ['ESP32', 'MQTT', 'CleanEnergy', 'IoT'],
    createdAt: '2026-07-20',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    timeline: 'present'
  },
  {
    id: 'proj_2',
    title: 'MedAssist AI: Emergency Triaging Assistant',
    tagline: 'AI-assisted medical symptom analyzer and preliminary triage router for rural clinics.',
    description: 'Leverages Gemini multimodal vision and NLP model to assist field healthcare workers in classifying medical urgency and generating diagnostic summaries.',
    domain: 'AI / ML',
    authorId: 'usr_demo',
    authorName: 'Venkat NS',
    authorInstitution: 'SRM Institute of Science and Technology',
    teamMembers: ['Venkat NS', 'Devi Prasad'],
    githubUrl: 'https://github.com/iet-projects/medassist-ai',
    demoUrl: 'https://medassist-ai-demo.example.com',
    likes: 64,
    likedByUserIds: ['usr_demo', 'usr_sarah'],
    tags: ['Gemini AI', 'Healthcare', 'React', 'NodeJS'],
    createdAt: '2026-07-28',
    imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=80',
    status: 'Active',
    timeline: 'present'
  }
];

export const FALLBACK_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp_1',
    title: 'AI & Edge Computing Research Fellow',
    companyOrOrg: 'IET Advanced Technologies Lab',
    type: 'Research Fellowship',
    location: 'Bangalore / Remote Hybrid',
    stipendOrSalary: '₹35,000 / month + Research Grant',
    deadline: '2026-08-30',
    description: 'Join the IET Special Interest Group on AI to co-author papers on low-latency edge inference models for autonomous robotics. Includes mentorship from senior fellows.',
    applyUrl: 'https://iet.org/fellowships/apply/2026-edge-ai',
    requirements: [
      'Enrolled in 3rd/4th year B.Tech or M.Tech in ECE/CSE',
      'Strong proficiency in Python, PyTorch, and Linux',
      'Experience with ESP32/Jetson Nano or similar edge hardware is a plus'
    ],
    tags: ['AI Research', 'Edge Computing', 'Stipend', 'Fellowship'],
    postedDate: '2026-07-28',
    logoUrl: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
    status: 'Open',
    timeline: 'present'
  },
  {
    id: 'opp_2',
    title: 'Embedded Firmware & IoT Engineering Intern',
    companyOrOrg: 'NVIDIA Edge AI Systems',
    type: 'Internship',
    location: 'Bangalore, India',
    stipendOrSalary: '₹60,000 / month',
    deadline: '2026-08-20',
    description: 'Work with the CUDA and Jetson platform engineering teams to optimize real-time sensor fusion and device drivers for industrial robotics.',
    applyUrl: 'https://nvidia.com/careers/internships/embedded-iot',
    requirements: [
      'Solid C/C++ programming skills and operating system fundamentals',
      'Familiarity with ARM architecture, RTOS, and communication protocols (SPI, I2C, UART)',
      'Active contributor to student chapter or open source projects'
    ],
    tags: ['NVIDIA', 'Embedded C++', 'RTOS', 'Robotics'],
    postedDate: '2026-07-25',
    logoUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    bannerUrl: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&auto=format&fit=crop&q=80',
    status: 'Closing Soon',
    timeline: 'present'
  }
];

export const FALLBACK_RESOURCES: Resource[] = [
  {
    id: 'res_1',
    title: 'Modern Embedded Systems with ARM Cortex-M & C++',
    description: 'Comprehensive e-book covering register-level programming, interrupt controllers, DMA, and real-time operating system (RTOS) design for ARM microcontrollers.',
    category: 'Electronics & IoT',
    type: 'E-Book',
    authorOrProvider: 'IET Technical Publications',
    url: 'https://iet.org/resources/ebooks/arm-cortex-modern-cpp',
    thumbnailUrl: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=600&auto=format&fit=crop&q=80',
    tags: ['ARM Cortex', 'C++', 'RTOS', 'Embedded'],
    level: 'Intermediate',
    featured: true,
    timeline: 'present',
    publishedYear: '2026'
  },
  {
    id: 'res_2',
    title: 'Deep Learning for Engineering Applications (PyTorch & Gemini)',
    description: '14-module interactive video course on building computer vision and sensor time-series models for preventative industrial maintenance.',
    category: 'AI & Data Science',
    type: 'Course',
    authorOrProvider: 'Dr. Aris Thorne & IET Academy',
    url: 'https://iet.org/academy/courses/deep-learning-engineering',
    thumbnailUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=600&auto=format&fit=crop&q=80',
    tags: ['AI/ML', 'PyTorch', 'Gemini AI', 'Computer Vision'],
    level: 'All Levels',
    featured: true,
    timeline: 'present',
    publishedYear: '2026'
  }
];

export const FALLBACK_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann_1',
    title: 'Registration Open for Annual IET Student Paper Contest 2026',
    content: 'Submit your original engineering research papers by August 30th. Top papers will receive publication grants and presentation opportunities at the IET International Summit.',
    category: 'Important',
    authorName: 'IET Executive Council',
    authorRole: 'Chapter Management',
    date: '2026-07-29',
    pinned: true
  },
  {
    id: 'ann_2',
    title: 'New Member Mentorship Program Launched!',
    content: 'We are thrilled to launch the 1-on-1 industry mentorship drive. Senior members and alumni can now register as mentors to guide junior students in research and careers.',
    category: 'General',
    authorName: 'Student Activities Committee',
    authorRole: 'Mentorship Lead',
    date: '2026-07-25',
    pinned: false
  }
];