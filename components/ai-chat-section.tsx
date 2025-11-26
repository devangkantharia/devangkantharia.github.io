"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

import { motion, useInView, useAnimation } from "framer-motion"
import { Send, Bot, User, RefreshCw } from "lucide-react"

// Predefined chat messages
const initialMessages = [
  {
    role: "assistant",
    content: "👋 Hi there! I'm AI, your virtual assistant. Ask me about Devang's work, experience or skills!",
  },
]

const experienceResponses = [
  {
    role: "assistant",
    content: `Devang brings more than 10 years of hands on experience across immersive technologies, creative engineering and real time interactive development.
    
<strong>Snap — Technical Producer</strong>
<ul>
<li>Led end to end delivery for interactive and immersive features in commercial projects </li> 
<li>Coordinated cross functional teams including designers, engineers and producers to meet release milestones </li> 
<li>Built and validated production ready prototypes that bridged creative concepts and engineering constraints </li> 
<li>Managed stakeholder communication, rollout schedules and post launch support and analytics</li>
</ul>

<strong>Leeds Beckett University — AI Digital Platform and Immersive Technologist</strong>
<ul>
<li>Contributed to an Innovate UK research project on generative AI and mixed reality data capture (QS-GAI) </li> 
<li>Designed RAG architectures and mixed reality workflows for interim valuations and data driven insights </li> 
<li>Built prototypes integrating MR capture, embeddings and automation for construction related workflows </li> 
<li>Mentored students and collaborated with academic and industry partners to validate research outcomes</li>
</ul>

<strong>Freelance — Creative Technologist & Researcher</strong>
<ul>
<li>Delivered bespoke prototypes and workshop facilitation for museums, brands and experience centres </li> 
<li>Rapidly iterated on ideas combining WebGL, Unity, TouchDesigner and sensor driven hardware </li> 
<li>Provided consultancy on content mapping, UX flows and KPI definition for interactive projects </li> 
<li>Implemented robust deployments and handover documentation for long term production support</li>
</ul>

<strong>ImmersionX Technologies LLP — Creative Technologist</strong>
<ul>
<li>Developed interactive installations using Unity, React and real time graphics for experience spaces </li> 
<li>Built orchestration systems that connected tablets, server and Unity clients for synchronized shows </li> 
<li>Implemented gesture and sensor based interactions using Kinect and TouchDesigner integration </li> 
<li>Focused on production stability, calibration persistence and reliable field performance</li>
</ul>

<strong>Xenium Digital Pvt. Ltd. — Creative Strategist</strong>
<ul>
<li>Led creative strategy and concept development for brand activations and live events </li> 
<li>Mapped user journeys, content flows and KPI frameworks for experiential campaigns </li> 
<li>Collaborated with production teams to translate creative direction into technical requirements </li> 
<li>Conducted client workshops and produced technical proposals and experiential briefs</li>
</ul>

<strong>Studio IF — Senior Interactive Developer</strong>
<ul>
<li>Built responsive interactive installations and microsites with a focus on performance and reliability </li> 
<li>Implemented WebGL experiences and optimized graphics for gallery and public deployments </li> 
<li>Integrated hardware inputs, touchscreens and multi display setups for installations </li> 
<li>Owned integration testing, QA and production handover for exhibition rollouts</li>
</ul>

<strong>TCS — Business Process Lead</strong>
<ul>
<li>Managed process improvement initiatives and cross team collaboration for digital delivery </li> 
<li>Standardised handoff procedures between design, dev and operations to reduce rework </li> 
<li>Tracked KPIs and performance metrics to improve delivery timelines and quality </li> 
<li>Produced operational documentation and training material for ongoing team use</li>
</ul>

<strong>TabsBi — UI/UX Designer</strong>
<ul>
<li>Designed user interfaces and interaction flows for web and kiosk applications </li> 
<li>Created wireframes, high fidelity mocks and prototypes to validate user journeys </li> 
<li>Worked closely with frontend engineers during implementation to ensure fidelity to design </li> 
<li>Performed usability testing and iterated designs based on qualitative feedback</li>
</ul>

<strong>Investis — Web Producer</strong>
<ul>
<li>Managed content updates, CMS workflows and digital publishing schedules for client sites </li> 
<li>Coordinated with designers, developers and SEO specialists to maintain site performance </li> 
<li>Implemented accessibility and SEO best practices across campaign and corporate pages </li> 
<li>Delivered analytics driven recommendations to improve content engagement and conversions</li>
</ul>
`
  },
]

const skillsResponses = [
  {
    role: "assistant",
    content: `Devang specialises in crafting immersive, AI powered and creatively engineered solutions.

<strong>Core Skills</strong>
<ul>
<li>Interactive development using React, Next.js, Three.js and TouchDesigner</li>
<li>Real time graphics for museums and experience centers</li>
<li>Mixed reality and sensor based interactions including Kinect v2</li>
<li>AI driven workflows using RAG, generative AI and cloud deployment</li>
<li>Full stack prototyping with Node.js, MongoDB and Python</li>
<li>System design for IOT, multi device orchestration and physical computing</li>
</ul>

<strong>Toolset</strong>
<ul>
<li>Unity, TouchDesigner, Kinect SDK, WebGL and React Three Fiber</li>
<li>OpenAI, AWS, Azure and custom model integration</li>
<li>Content mapping, personas, KPIs and UX strategy</li>
</ul>`
  }
]

const projectResponses = [
  {
    role: "assistant",
    content: `Devang has built several innovative projects:

**TaskFlow** - Productivity app with gamification
**OneSoft** - All-in-one business platform
**HabitFlow** - Wellness and habit tracking app
**Film Fan Finder** - AI movie recommendation system
**AI Automation Consultant** - Intelligent workflow automation

Each project demonstrates his expertise in creating user-friendly, AI-powered solutions.`,
  },
]

const aiDevelopmentResponses = [
  {
    role: "assistant",
    content: `Excellent choice! Devang's AI development services include:

**Machine Learning Models** - Custom ML solutions for your specific needs
**Neural Networks** - Deep learning implementations for complex problems
**Computer Vision** - Image and video analysis capabilities
**Natural Language Processing** - Text analysis and language understanding
**Predictive Analytics** - Forecasting and trend analysis systems

**Technologies Used:**
• Python, TensorFlow, PyTorch
• OpenAI GPT, Google Gemini
• AWS SageMaker, Azure ML
• Custom model training and deployment

Would you like to discuss a specific AI project for your business?`,
  },
]

const processAutomationResponses = [
  {
    role: "assistant",
    content: `Perfect! Devang's process automation solutions cover:

**RPA Implementation** - Robotic Process Automation for repetitive tasks
**Workflow Optimization** - Streamlined business processes
**API Integration** - Connecting different systems seamlessly
**Task Automation** - Automated scheduling and execution
**Business Intelligence** - Automated reporting and analytics

**Tools & Platforms:**
• N8N for workflow automation
• Zapier and Make.com integrations
• Custom Python automation scripts
• Cloud-based automation solutions

What specific processes are you looking to automate?`,
  },
]

const dataAnalyticsResponses = [
  {
    role: "assistant",
    content: `Great choice! Devang's data analytics services include:

**Predictive Analytics** - Forecasting future trends and outcomes
**Data Visualization** - Interactive dashboards and reports
**Business Intelligence** - Strategic insights from your data
**Performance Metrics** - KPI tracking and optimization
**Real-time Analytics** - Live data processing and monitoring

**Technologies:**
• Python (Pandas, NumPy, Scikit-learn)
• Tableau, Power BI for visualization
• SQL databases and data warehouses
• Apache Spark for big data processing

What kind of data insights are you looking to gain?`,
  },
]

const chatbotResponses = [
  {
    role: "assistant",
    content: `Great choice! Devang's chatbot development services include:

**Natural Language Processing** - Advanced NLP for human-like conversations
**Multi-platform Integration** - Deploy across web, mobile, and messaging platforms
**Voice Integration** - Voice-enabled chatbots with speech recognition
**Custom Training** - Tailored to your business knowledge and tone
**Analytics Dashboard** - Track conversations and optimize performance

**Features:**
• 24/7 customer support automation
• Lead generation and qualification
• FAQ automation and knowledge base
• Integration with CRM and business systems

Would you like to discuss a specific chatbot project for your business?`,
  },
]

const customSoftwareResponses = [
  {
    role: "assistant",
    content: `Excellent! Devang's custom software development services include:

**Full-stack Development** - Complete web and mobile applications
**API Development** - RESTful and GraphQL API creation
**System Integration** - Connecting existing systems and platforms
**Cloud Solutions** - Scalable cloud-native applications
**Database Design** - Efficient data architecture and management

**Technologies:**
• Frontend: React, Next.js, Vue.js, Flutter
• Backend: Node.js, Python, PostgreSQL, MongoDB
• Cloud: AWS, Azure, Google Cloud Platform
• DevOps: Docker, Kubernetes, CI/CD pipelines

What type of custom software solution are you looking to build?`,
  },
]

const dataManagementResponses = [
  {
    role: "assistant",
    content: `Excellent! Devang's data management solutions cover:

**Database Architecture** - Scalable and efficient database design
**Data Pipeline Automation** - Streamlined data processing workflows
**Real-time Analytics** - Live data processing and insights
**Data Security** - Enterprise-grade security and compliance
**Cloud Integration** - AWS, Azure, and GCP data solutions
**Migration Services** - Seamless data migration and modernization

**Capabilities:**
• ETL/ELT pipeline development
• Data warehouse design and optimization
• Real-time streaming data processing
• Data governance and quality assurance

What specific data challenges are you looking to solve?`,
  },
]

// Rich text formatting function
const formatMessage = (content: string) => {
  // Convert **text** to bold
  let formatted = content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")

  // Convert bullet points to proper list items
  formatted = formatted.replace(/^• (.*)$/gm, "<li>$1</li>")

  // Wrap consecutive list items in ul tags
  formatted = formatted.replace(/(<li>[\s\S]*?<\/li>\s*)+/g, "<ul>$&</ul>")

  // Convert line breaks to proper spacing
  formatted = formatted.replace(/\n\n/g, "<br><br>")
  formatted = formatted.replace(/\n/g, "<br>")

  return formatted
}

export default function AIChatSection() {
  const [messages, setMessages] = useState(initialMessages)
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatMessagesRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const controls = useAnimation()

  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Listen for service click events
  useEffect(() => {
    const handleServiceMessage = (event: Event) => {
      const customEvent = event as CustomEvent<{ message: string }>
      const { message } = customEvent.detail
      if (message) {
        // Add user message
        const userMessage = { role: "user", content: message }
        setMessages((prev) => [...prev, userMessage])
        setIsTyping(true)

        // Simulate AI response
        setTimeout(() => {
          let response
          const lowercaseMessage = message.toLowerCase()

          if (lowercaseMessage.includes("ai development")) {
            response = aiDevelopmentResponses[0]
          } else if (lowercaseMessage.includes("process automation")) {
            response = processAutomationResponses[0]
          } else if (lowercaseMessage.includes("data analytics")) {
            response = dataAnalyticsResponses[0]
          } else if (lowercaseMessage.includes("chatbot")) {
            response = chatbotResponses[0]
          } else if (lowercaseMessage.includes("custom software")) {
            response = customSoftwareResponses[0]
          } else if (lowercaseMessage.includes("data management")) {
            response = dataManagementResponses[0]
          } else {
            response = {
              role: "assistant",
              content:
                "Thank you for your interest! I'd be happy to discuss this service with you. What specific requirements do you have?",
            }
          }

          setMessages((prev) => [...prev, response])
          setIsTyping(false)
        }, 1500)
      }
    }

    window.addEventListener("triggerChatMessage", handleServiceMessage)
    return () => window.removeEventListener("triggerChatMessage", handleServiceMessage)
  }, [])

  const scrollToBottom = () => {
    // Only scroll within the chat container, not the entire page
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!input.trim()) return

    // Add user message
    const userMessage = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Focus back on input after submission
    setTimeout(() => {
      inputRef.current?.focus()
    }, 100)

    // Simulate AI response
    setTimeout(() => {
      let response
      const lowercaseInput = input.toLowerCase()

      if (lowercaseInput.includes("experience") || lowercaseInput.includes("work") || lowercaseInput.includes("job")) {
        response = experienceResponses[0]
      } else if (lowercaseInput.includes("skill") || lowercaseInput.includes("know") || lowercaseInput.includes("do")) {
        response = skillsResponses[0]
      } else if (lowercaseInput.includes("project") || lowercaseInput.includes("portfolio") || lowercaseInput.includes("build")) {
        response = projectResponses[0]
      } else if (lowercaseInput.includes("ai development") || lowercaseInput.includes("machine learning")) {
        response = aiDevelopmentResponses[0]
      } else if (lowercaseInput.includes("process automation") || lowercaseInput.includes("workflow")) {
        response = processAutomationResponses[0]
      } else if (lowercaseInput.includes("data analytics") || lowercaseInput.includes("analytics")) {
        response = dataAnalyticsResponses[0]
      } else if (lowercaseInput.includes("chatbot")) {
        response = chatbotResponses[0]
      } else if (lowercaseInput.includes("custom software") || lowercaseInput.includes("software development")) {
        response = customSoftwareResponses[0]
      } else if (lowercaseInput.includes("data management") || lowercaseInput.includes("database")) {
        response = dataManagementResponses[0]
      } else {
        response = {
          role: "assistant",
          content:
            "I can tell you about Devang's work experience, skills, projects, or specific services like AI development, process automation, data analytics, chatbot development, custom software, and data management. What would you like to know?",
        }
      }

      setMessages((prev) => [...prev, response])
      setIsTyping(false)
    }, 1500)
  }

  const handleQuickQuestion = (question: string) => {
    // Simulate user clicking a quick question
    const userMessage = { role: "user", content: question }
    setMessages((prev) => [...prev, userMessage])
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      let response

      const lowercaseQuestion = question.toLowerCase()

      if (lowercaseQuestion.includes("experience")) {
        response = experienceResponses[0]
      } else if (lowercaseQuestion.includes("skills")) {
        response = skillsResponses[0]
      } else if (lowercaseQuestion.includes("projects")) {
        response = projectResponses[0]
      } else if (lowercaseQuestion.includes("ai development")) {
        response = aiDevelopmentResponses[0]
      } else if (lowercaseQuestion.includes("process automation")) {
        response = processAutomationResponses[0]
      } else if (lowercaseQuestion.includes("data analytics")) {
        response = dataAnalyticsResponses[0]
      } else if (lowercaseQuestion.includes("chatbot")) {
        response = chatbotResponses[0]
      } else if (lowercaseQuestion.includes("custom software")) {
        response = customSoftwareResponses[0]
      } else if (lowercaseQuestion.includes("data management")) {
        response = dataManagementResponses[0]
      }

      if (response) {
        setMessages((prev) => [...prev, response])
      }
      setIsTyping(false)
    }, 1500)
  }

  const resetChat = () => {
    setMessages(initialMessages)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" as const },
    },
  }

  const chatElementVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" as const },
    },
  }

  return (
    <section id="experience" className="fixed right-10 bottom-0 w-2/4 h-1/2 bg-linear-to-b from-card/50 to-background">
      {/* <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
      </div> */}

      <div className="mx-auto px-4">
        <motion.div
          ref={ref}
          initial=""
          animate={controls}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-heading font-bold mb-4">
            Chat with <span className="text-gradient">AI Ibro</span>
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-300 max-w-2xl mx-auto">
            Ask about my work experience, skills, projects, or specific services
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="h-1 w-20 bg-linear-to-r from-primary to-secondary rounded-full mx-auto mt-4"
          ></motion.div>
        </motion.div>

        <div className="max-w-3xl mx-auto" ref={chatContainerRef}>
          <motion.div
            className="glass rounded-2xl overflow-hidden chat-element"
            variants={chatElementVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {/* Chat header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-card/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-medium">AI Ibro</h3>
                  <p className="text-xs text-gray-400">Virtual Assistant</p>
                </div>
              </div>
              <button
                onClick={resetChat}
                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                title="Reset chat"
                type="button"
              >
                <RefreshCw size={16} />
              </button>
            </div>

            {/* Chat messages - Fixed height container with internal scrolling */}
            <div
              ref={chatMessagesRef}
              className="h-[400px] overflow-y-auto p-4 space-y-4 scroll-smooth"
              style={{ scrollBehavior: "smooth" }}
            >
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl p-3 ${message.role === "user" ? "bg-primary/20 text-white" : "bg-card/50 text-white"
                      }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {message.role === "assistant" ? (
                        <Bot size={16} className="text-primary" />
                      ) : (
                        <User size={16} className="text-secondary" />
                      )}
                      <span className="text-xs font-medium">{message.role === "assistant" ? "AI Ibro" : "You"}</span>
                    </div>
                    <div
                      className="text-sm rich-text"
                      dangerouslySetInnerHTML={{ __html: formatMessage(message.content) }}
                    />
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  className="flex justify-start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="max-w-[80%] rounded-2xl p-3 bg-card/50 text-white">
                    <div className="flex items-center gap-2 mb-1">
                      <Bot size={16} className="text-primary" />
                      <span className="text-xs font-medium">AI Ibro</span>
                    </div>
                    <div className="flex gap-1">
                      <span
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      ></span>
                      <span
                        className="w-2 h-2 rounded-full bg-primary animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      ></span>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Invisible element to scroll to */}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick questions */}
            <div className="p-3 border-t border-white/10 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about Devang's work experience")}
                className="px-3 py-1 text-xs rounded-full bg-card/50 border border-white/10 whitespace-nowrap hover:bg-primary/20 transition-colors"
              >
                Work experience
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("What are Devang's skills?")}
                className="px-3 py-1 text-xs rounded-full bg-card/50 border border-white/10 whitespace-nowrap hover:bg-primary/20 transition-colors"
              >
                Skills
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about Devang's projects")}
                className="px-3 py-1 text-xs rounded-full bg-card/50 border border-white/10 whitespace-nowrap hover:bg-primary/20 transition-colors"
              >
                Projects
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about AI Development")}
                className="px-3 py-1 text-xs rounded-full bg-transparent border border-white/5 text-gray-400 whitespace-nowrap hover:bg-white/10 transition-colors"
              >
                AI Development
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about Process Automation")}
                className="px-3 py-1 text-xs rounded-full bg-transparent border border-white/5 text-gray-400 whitespace-nowrap hover:bg-white/10 transition-colors"
              >
                Process Automation
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about Data Analytics")}
                className="px-3 py-1 text-xs rounded-full bg-transparent border border-white/5 text-gray-400 whitespace-nowrap hover:bg-white/10 transition-colors"
              >
                Data Analytics
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about Chatbot development")}
                className="px-3 py-1 text-xs rounded-full bg-transparent border border-white/5 text-gray-400 whitespace-nowrap hover:bg-white/10 transition-colors"
              >
                Chatbot
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about Custom Software")}
                className="px-3 py-1 text-xs rounded-full bg-transparent border border-white/5 text-gray-400 whitespace-nowrap hover:bg-white/10 transition-colors"
              >
                Custom Software
              </button>
              <button
                type="button"
                onClick={() => handleQuickQuestion("Tell me about Data Management")}
                className="px-3 py-1 text-xs rounded-full bg-transparent border border-white/5 text-gray-400 whitespace-nowrap hover:bg-white/10 transition-colors"
              >
                Data Management
              </button>
            </div>

            {/* Chat input */}
            <div className="p-4 border-t border-white/10">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about my experience, skills, or projects..."
                  className="flex-1 bg-card/50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
                  autoComplete="off"
                />
                <button
                  type="submit"
                  className="p-2 rounded-full bg-linear-to-r from-primary to-secondary hover:opacity-90 transition-opacity disabled:opacity-50"
                  disabled={!input.trim()}
                >
                  <Send size={18} className="text-white" />
                </button>
              </form>
            </div>
          </motion.div>

          {/* AI Assistant image */}
          {/* <motion.div
            className="mt-8 flex justify-center chat-element"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary/30 glow-effect">
                <Image
                  src="/images/Devang-avatar.png"
                  alt="Devang Mustafa"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center">
                <Sparkles size={14} className="text-white" />
              </div>
            </div>
          </motion.div> */}
        </div>
      </div>
    </section>
  )
}
