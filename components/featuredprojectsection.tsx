"use client"

import { useRef, useState, useEffect, useMemo } from "react"

import { Happy_Monkey } from 'next/font/google';
import Image from "next/image"

import { motion, useInView, useAnimation } from "framer-motion"

// import { ChevronLeft, ChevronRight, Smartphone, Globe, Target, Film, Bot } from "lucide-react"
import { ANIMATION_VARIANTS } from "@/registry/utils/animation-variants"

const happy_monkey = Happy_Monkey({
  subsets: ['latin'],
  variable: '--font-happy_monkey',
  weight: ['400'],
})

const projects = [
  {
    title: "XR - Interim Valuation project",
    description: "An Innovate UK funded feasibility stud,y, to create a database for interim valuations in quantity surveying using mixed-reality data capture.",
    longDescription: "The QS-GAI project aims to develop a system that uses mixed-reality to capture data for interim valuations in the construction industry. This data will be used to create a database that can generate automated payment notices for contractors through generative AI. The goal is to reduce administrative tasks and improve productivity and project performance. The project will run from October 2024 to March 2025. A web application, ValuePay.ai, demonstrates this by allowing users to upload a Bill of Quantities to trigger an automated report, harnessing augmented reality and generative AI for real-time valuation reports.",
    tags: ["Gen AI", "AWS Cloud", "Mixed Reality", "Construction Tech", "Fintech"],
    image: "/images/references/4.png",
    links: {
      demo: "https://www.valuepay.ai/",
      details: "#",
    },
    features: ["Task Automation", "AI-driven Insights", "Predictive AI", "Workflow Automation"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Centralized Digital Toolkit",
    description: "A modular and customizable toolkit application designed to communicate with and control all installations within an experience center.",
    longDescription: "This toolkit application acts as a central command center for an entire experience center. It can connect to a centralized server or directly to individual installations using dedicated IP addresses. A key feature is its dual-mode functionality: an 'admin mode' allows presenters to configure and change content on-the-go, and a 'viewer mode' is used to showcase the selected content on the various installations. Its highly modular and customizable nature allows it to be adapted for different experience centers and requirements.",
    tags: ["Digital Toolkit", "Content Management", "Interactive Control", "SaaS"],
    image: "/images/references/4.png",
    links: {
      demo: "https://www.2.ai/",
      details: "#",
    },
    features: ["Centralized Control", "IP Connectivity", "On-the-go Configuration", "Modular Design"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  // {
  //   title: "SaaS AI CRM",
  //   description: "A Software as a Service (SaaS) Customer Relationship Management (CRM) tool that leverages Artificial Intelligence.",
  //   longDescription: "AI-powered CRMs are designed to enhance efficiency and productivity in sales and customer service operations. By automating tasks like emails, call notes, and customer research, sales representatives can dedicate more time to building customer relationships. These platforms can provide quick insights into customer needs, generate call summaries, and offer personalized recommendations for next steps. The goal of such a system is to manage customer data, track leads, and analyze customer insights to improve business processes.",
  //   tags: ["SaaS", "AI", "CRM", "Machine Learning", "Next.js", "OpenAI", "Exa Search", "LangFuse"],
  //   image: "/images/references/4.png",
  //   links: {
  //     demo: "https://ai-crm-project.vercel.app/",
  //     details: "https://github.com/devangkantharia/AiLeadGenCRM",
  //   },
  //   features: ["Task Automation", "AI-driven Insights", "Predictive AI", "Workflow Automation"],
  //   color: "from-purple-500/20 to-pink-500/20",
  // },
  {
    title: "Three Sided Immersive Cave",
    description: "A three-sided, immersive virtual reality environment for visualization and simulation.",
    longDescription: "A three-sided CAVE (Cave Automatic Virtual Environment) is a virtual reality setup that uses projectors to display images on three walls, creating an immersive experience. These systems are used in various fields like engineering, design, and education to allow users to interact with 3D models in a 1:1 scale. The setup often includes stereoscopic 3D projection, head tracking, and interaction capabilities to enhance the feeling of presence in the virtual world. It's a powerful tool for design reviews, training simulations, and research.",
    tags: ["Virtual Reality", "Immersive Technology", "3D Visualization", "Simulation"],
    image: "/images/references/4.png",
    links: {
      demo: "https://www.3.ai/",
      details: "#",
    },
    features: ["Immersive VR", "3D Stereoscopic", "Motion Tracking", "Real-time Rendering"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Interactive Sketch Aquarium",
    description: "An interactive digital art installation where children's drawings of sea creatures come to life in a virtual aquarium.",
    longDescription: "The Sketch Aquarium is an interactive exhibit where participants color drawings of sea creatures. These drawings are then scanned and projected onto a large virtual aquarium, where they animate and swim with other creations. Users can interact with their creations by touching the screen to make them swim away or by touching a virtual food bag to feed them. This project, created by the art collective teamLab, aims to show the power of creative imagination.",
    tags: ["Interactive Art", "Creative Technology", "Projection Mapping", "Edutainment"],
    image: "/images/references/4.png",
    links: {
      demo: "https://www.4.ai/",
      details: "#",
    },
    features: ["Drawing Digitization", "Live Animation", "Touch Interaction", "Projection Mapping"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Training using Virtual Reality",
    description: "Utilizing Virtual Reality to create safe, efficient, and cost-effective training simulations for various industries.",
    longDescription: "Virtual Reality training provides a risk-free environment for trainees to practice complex or hazardous tasks. It is used in fields like healthcare for surgical practice, in high-risk professions like firefighting and military, and for corporate training in areas like safety procedures and customer service. VR training can improve retention and recall by providing engaging and memorable experiences. Companies like Walmart and Bank of America have adopted VR for employee training.",
    tags: ["Virtual Reality", "Simulation", "Corporate Training", "EdTech"],
    image: "/images/references/4.png",
    links: {
      demo: "https://www.5.ai/",
      details: "#",
    },
    features: ["Risk-free Environment", "Personalized Learning", "Knowledge Retention", "Cost-effective"],
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    title: "Interconnected Wall",
    description: "An interactive multi-touch wall where kids' colored fish drawings come to life within a digital aquarium.",
    longDescription: "This project is an 18-foot long, multi-touch interactive wall. Children are given line art of fish to color. Once colored, the drawings are scanned, and a custom application uses QR codes to identify the fish model. The application then projects the fish onto the large interactive wall, animated with the colors filled in by the child. Multiple kids can interact with their creations simultaneously by touching the wall, thanks to a TUIO sensor grid that replaced the initial Kinect and IR overlay prototypes.",
    tags: ["Interactive Wall", "Multi-touch", "Computer Vision", "Unity"],
    image: "/images/references/4.png",
    links: {
      demo: "https://www.6.ai/",
      details: "#",
    },
    features: ["Multi-user Interaction", "QR Code Detection", "TUIO Sensor", "Real-time Animation"],
    color: "from-purple-500/20 to-pink-500/20",
  },
]

export default function FeaturedProjectsSection() {
  const animationVariants = ANIMATION_VARIANTS.blur;
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: false, amount: 0.1 })
  const controls = useAnimation()
  const [activeIndex, setActiveIndex] = useState(0)
  // const [isExpanded, setIsExpanded] = useState(false)
  const projectsRef = useRef<HTMLDivElement>(null)
  // const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 })
  const [slideDirection, setSlideDirection] = useState(0) // 0: no slide, 1: next, -1: prev

  const displayedProjects = useMemo(() => {
    const otherProjects = projects.filter((_, idx) => idx !== activeIndex)
    const display = []
    for (let i = 0; i < 3; i++) {
      display.push(otherProjects[(activeIndex + i) % otherProjects.length])
    }
    return display
  }, [activeIndex])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    }
  }, [isInView, controls])

  useEffect(() => {
    const autoSlide = setInterval(() => {
      nextProject()
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(autoSlide) // Clear interval on component unmount
  }, [activeIndex]) // Reset the interval when the active slide changes

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  },
    cardVariants = {
      hidden: (direction: number) => ({ x: direction > 0 ? 100 : -100, opacity: 0 }),
      visible: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeOut" as const },
      },
    }
  // ,itemVariants = {
  //   hidden: { opacity: 0, y: 20 },
  //   visible: {
  //     opacity: 1,
  //     y: 0,
  //     transition: { duration: 0.5, ease: "easeOut" as const },
  //   },
  // }

  const nextProject = () => {
    setSlideDirection(1)
    setActiveIndex((prev) => (prev + 1) % projects.length)
  }

  // const prevProject = () => {
  //   setSlideDirection(-1)
  //   setActiveIndex((prev) => (prev - 1 + projects.length) % projects.length)
  // }

  // const handleDragEnd = (event: any, info: PanInfo) => {
  //   const threshold = 50
  //   if (info.offset.x > threshold) {
  //     prevProject()
  //   } else if (info.offset.x < -threshold) {
  //     nextProject()
  //   }
  // }

  return (

    <div className="mx-auto relative z-10 w-full">

      <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl mb-2`}>Featured Project:</motion.h2>
      <motion.p variants={animationVariants} className="dark:text-gray-300 mb-10 md:pr-11">
        Real-world applications showcasing my expertise in AI, automation, and full-stack development
      </motion.p>

      <div ref={projectsRef}>
        {/* Desktop Navigation Arrows */}
        {/* <div className="hidden lg:flex absolute top-1/2 -left-12 transform -translate-y-1/2 z-20">
            <motion.button
              onClick={prevProject}
              className="p-3 rounded-full glass hover:bg-card/50 transition-colors"
              whileHover={{ scale: 1.1, x: -5 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Previous project"
            >
              <ChevronLeft size={24} />
            </motion.button>
          </div>

          <div className="hidden lg:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20">
            <motion.button
              onClick={nextProject}
              className="p-3 rounded-full glass hover:bg-card/50 transition-colors"
              whileHover={{ scale: 1.1, x: 5 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Next project"
            >
              <ChevronRight size={24} />
            </motion.button>
          </div> */}

        {/* Mobile Swipe Hint */}
        {/* <div className="lg:hidden text-center mt-4">
            <p className="text-sm">Swipe left or right to navigate projects</p>
          </div> */}
      </div>

      {/* Mobile Navigation Buttons - Positioned Higher */}
      {/* <div className="lg:hidden flex justify-center mt-6 gap-4">
          <motion.button
            onClick={prevProject}
            className="p-3 rounded-full glass hover:bg-card/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Previous project"
          >
            <ChevronLeft size={20} />
          </motion.button>
          <motion.button
            onClick={nextProject}
            className="p-3 rounded-full glass hover:bg-card/50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Next project"
          >
            <ChevronRight size={20} />
          </motion.button>
        </div> */}

      {/* Additional projects preview */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        // initial="hidden"
        animate="visible"
        variants={containerVariants}
      >

        {displayedProjects.map((project, idx) => (
          <motion.div
            key={idx}
            className="glass rounded-xl dark:hover:bg-card/30 hover:bg-gray-500/20 transition-all duration-200 project-card md:p-5"
            variants={cardVariants}
            whileHover={{ y: -5, scale: 1.02 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            // onClick={() => setActiveIndex(projects.findIndex((p) => p.title === project.title))}
            custom={slideDirection}
          // initial="hidden"
          >
            <motion.a
              href={project.links.demo} title={project.title} target="_blank" className="block">
              <div className="h-40 mb-4 overflow-hidden rounded-lg">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg mb-2">{project.title}</h4>
              <p className="text-sm line-clamp-2 mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1 mb-5">
                {project.tags.map((tag) => (
                  <span key={tag} className="px-2 py-0.5 text-xs rounded-full bg-gray-400/30 dark:bg-primary/10 border border-primary/20">
                    {tag}
                  </span>
                ))}
                {project.tags.length > 8 && (
                  <span className="px-2 py-0.5 text-xs rounded-full bg-gray-700">+{project.tags.length - 2}</span>
                )}
              </div>
              {/* <div className="flex flex-col sm:flex-row gap-4 text-sm">
                  <motion.a
                    href={projects[activeIndex].links.demo}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass bg-primary/10 hover:bg-primary/20 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </motion.a>
                  <motion.a
                    href={projects[activeIndex].links.details}
                    className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg glass hover:bg-card/50 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github size={16} />
                    Source Code
                  </motion.a>
                </div> */}
            </motion.a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
