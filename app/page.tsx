"use client";
import { Happy_Monkey } from 'next/font/google'
import Image from "next/image";
import Link from "next/link";

import { motion, MotionConfig } from 'motion/react';

import DKAvatar from './images/dk.png';

import DKNavbar from '@/components/dknavbar';
import { ThemeToggle } from "@/components/theme-toggle";
import { CardBody, CardContainer, CardItem } from "@/components/ui/shadcn-io/3d-card";
import MagneticBorderBottom from "@/components/utility/MagneticBorderBottom";
import { ContainerStagger } from '@/registry/blocks/container-stagger';
import { TextStagger } from "@/registry/blocks/text-stagger";
import { Navbar } from "@/registry/demo/navbar";
import { ANIMATION_VARIANTS } from '@/registry/utils/animation-variants';
import { TRANSITIONS } from '@/registry/utils/transitions';

const happy_monkey = Happy_Monkey({
  subsets: ['latin'],
  variable: '--font-happy_monkey',
  weight: ['400'],
})

export default function Home() {
  const animationVariants = ANIMATION_VARIANTS.blur;

  return (
    <div className="relative text-sm lg:text-lg leading-9 ">
      <DKNavbar />
      <div className="bottom-2 right-2 fixed z-50">
        <MagneticBorderBottom
          // borderClassName="bg-[#19adfd] dark:bg-yellow-300"
          // borderColorDark="#60a5fa"
          borderHeight={0}
          magneticStrength={0.2}
          transitionDuration={400}
          className="text-[#19adfd] dark:text-yellow-300"
        ><ThemeToggle />
        </MagneticBorderBottom>
      </div>

      {/* Main Content */}
      <div className="relative">
        <ContainerStagger className="contStag">
          <MotionConfig transition={TRANSITIONS.filter}>
            <section id='home' className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 md:pt-5 mx-auto '><Navbar /></section>

            {/* Intro Section */}
            <section className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 md:pt-5 mx-auto '>
              <section className="heroSection grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] items-center md:min-h-screen gap-8 relative">
                <div className="heroText">
                  <motion.div variants={animationVariants} className="lg:leading-14 dark:text-gray-200 text-lg sm:mt-10 md:mt-0 lg:text-2xl mb-10 ">
                    I'm Devang Kantharia, a <span className={`${happy_monkey.className} antialiased`}>
                      <TextStagger>designer</TextStagger>
                    </span> / <span className={`${happy_monkey.className} antialiased`}><TextStagger>researcher</TextStagger></span> / <span className={`${happy_monkey.className} antialiased`}><TextStagger>technologist</TextStagger></span> currently based in London, UK.
                    I build functional proof-of-concept prototypes, design interactions, bespoke digital tools and experiences.
                  </motion.div>
                  <motion.blockquote variants={animationVariants} className="border-l-4 border-gray-300 dark:border-gray-700 p-4 pl-5 ">
                    My medium for work includes softwares, electronics, robotics, audio, visual and AI, or whatever else required{" "}
                    <Link
                      href="#projectWork"
                      data-no-blobity
                      onClick={(e) => {
                        e.preventDefault();
                        const el = document.getElementById("projectWork");
                        if (el) {
                          el.scrollIntoView({ behavior: "smooth" });
                        }
                      }}
                    >
                      <MagneticBorderBottom
                        borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                        // borderColorDark="#60a5fa"
                        borderHeight={2}
                        magneticStrength={0.2}
                        transitionDuration={400}
                        className="text-[#19adfd] dark:text-yellow-300"
                      >
                        to make people feel special.
                      </MagneticBorderBottom>
                    </Link>
                  </motion.blockquote>
                </div>
                <div className="heroAvatar relative">
                  <div className="max-w-96 md:max-w-72 mx-auto lg:my-6 md:my-0 order-2 md:order-0 md:self-start">
                    <div className="relative top-0 md:top-14 lg:top-4">
                      <motion.div variants={animationVariants}>
                        <CardContainer className="inter-var md:-top-10" containerClassName="py-0">
                          <CardBody className="pt-15 pb-15 relative group/card hover:shadow-3xl/35 hover:shadow-blue-900 dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 w-auto sm:w-[20rem] rounded-xl ">
                            <CardItem
                              as="div"
                              translateZ="90"
                              className="absolute text-neutral-900 text-sm max-w-sm mt-2 dark:text-neutral-300 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 transition-all duration-500 scale-100 [@media(hover:hover)]:scale-95 [@media(hover:hover)]:group-hover/card:scale-100 pl-4 pr-4 w-full text-center top-5"
                            >
                              My AI Avatar made using ComfyUi
                            </CardItem>
                            <CardItem translateZ="50" className="w-full pl-4 pr-4">

                              <Image
                                className="w-full m-auto object-cover rounded-xl group-hover/card:shadow-xl md:max-w-64 lg:max-w-72"
                                src={DKAvatar}
                                alt="Devang Kantharia ComfyUI AI Avatar"
                              />

                            </CardItem>
                            {/* <div className="flex justify-between items-center mt-3"> */}
                            <CardItem
                              as="div"
                              translateZ="90"
                              className="absolute text-neutral-900 text-sm max-w-sm mt-2 dark:text-neutral-300 opacity-100 [@media(hover:hover)]:opacity-0 [@media(hover:hover)]:group-hover/card:opacity-100 transition-all duration-500 scale-100 [@media(hover:hover)]:scale-95 [@media(hover:hover)]:group-hover/card:scale-100 pl-4 pr-4"
                            >
                              ComfyUi Workflow comprises of 30 nodes and uses custom LORA.
                            </CardItem>
                            {/* </div> */}
                          </CardBody>
                        </CardContainer>
                      </motion.div>
                    </div>
                  </div>
                </div>
                {/* <div className="bg-[#19adfd] dark:bg-yellow-300 h-0.5 w-14 absolute bottom-0" > {" "} </div> */}
              </section>
            </section>

            {/* <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_2fr] gap-0 md:gap-8 lg:gap-12"> */}
            <section className='bg-[#35353524] md:min-h-screen'>
              <div className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 md:pt-5 mx-auto '>
                <div className="grid grid-cols-1 ">
                  <div className="space-y-6 contents md:block md:space-y-0">
                    {/* Project Work Section */}
                    <section id="projectWork" className="md:pt-8 order-1 mb-6 md:mb-15 ">
                      <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl text-gray-900 dark:text-gray-100 mb-2`}>Project Work:</motion.h2>
                      <motion.p variants={animationVariants} className="dark:text-gray-300 mb-3 pr-11 text-justify">
                        Most of the projects are signed under non-disclosure agreement (NDA), a glimpse of few projects can be seen here -
                      </motion.p>


                      {/* <Project List /> */}
                      {/* <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-0 lg:gap-x-20 gap-y-6 list-disc list-inside dark:text-gray-300"> */}
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-20 lg:gap-x-40 gap-y-12 list-disc list-inside lg:list-outside dark:text-gray-300 md:w-fit mx-auto">
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <Link
                            href="https://devangkantharia.github.io/others/explorations/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-no-blobity
                          >
                            <MagneticBorderBottom
                              borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                              borderHeight={2}
                              magneticStrength={0.3}
                              transitionDuration={300}
                              className="text-[#19adfd] dark:text-yellow-300"
                            >
                              AI / ML Projects
                            </MagneticBorderBottom>
                          </Link>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <Link
                            href="https://devangkantharia.github.io/others/arvrmr/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-no-blobity
                          >
                            <MagneticBorderBottom
                              borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                              borderHeight={2}
                              magneticStrength={0.3}
                              transitionDuration={300}
                              className="text-[#19adfd] dark:text-yellow-300"
                            >
                              AR / VR / MR Projects
                            </MagneticBorderBottom>
                          </Link>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <Link
                            href="https://devangkantharia.github.io/others/experience-centers/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-no-blobity
                          >
                            <MagneticBorderBottom
                              borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                              borderHeight={2}
                              magneticStrength={0.3}
                              transitionDuration={300}
                              className="text-[#19adfd] dark:text-yellow-300"
                            >
                              Experience Centers
                            </MagneticBorderBottom></Link>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <Link
                            href="https://devangkantharia.github.io/others/freelance/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-no-blobity
                          >
                            <MagneticBorderBottom
                              borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                              borderHeight={2}
                              magneticStrength={0.3}
                              transitionDuration={300}
                              className="text-[#19adfd] dark:text-yellow-300"
                            >
                              Freelance Projects
                            </MagneticBorderBottom></Link>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <Link
                            href="https://devangkantharia.github.io/others/phygital/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-no-blobity
                          >
                            <MagneticBorderBottom
                              borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                              borderHeight={2}
                              magneticStrength={0.3}
                              transitionDuration={300}
                              className="text-[#19adfd] dark:text-yellow-300"
                            >
                              Phygital Simulations
                            </MagneticBorderBottom></Link>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <Link
                            href="https://devangkantharia.github.io/others/touch/"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-no-blobity
                          >
                            <MagneticBorderBottom
                              borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                              borderHeight={2}
                              magneticStrength={0.3}
                              transitionDuration={300}
                              className="text-[#19adfd] dark:text-yellow-300"
                            >
                              TouchScreen Solutions
                            </MagneticBorderBottom></Link>
                        </motion.li>
                      </ul>
                    </section>

                    {/* What I am doing now */}
                    <section className="relative order-3 mb-6 md:mb-15 ">
                      <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl text-gray-900 dark:text-gray-100 mb-2`}>What I am doing now:</motion.h2>
                      <ul className="list-disc list-inside space-y-1  dark:text-gray-300">
                        <motion.li variants={animationVariants}>Pursuing AWS Cloud Certification,</motion.li>
                        <motion.li variants={animationVariants}>Exploring Next.js,</motion.li>
                        <motion.li variants={animationVariants}>Prompt Engineering</motion.li>
                      </ul>
                    </section>

                    {/* Worked on Projects With */}
                    <section className="order-4 mb-6 md:mb-15 ">
                      <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl text-gray-900 dark:text-gray-100 mb-2`}>Worked on Projects with:</motion.h2>
                      <motion.p variants={animationVariants} className="dark:text-gray-300  ">
                        Snap Inc. (Snapchat), Leeds Beckett University, Accenture, Capegemini, JSW, TCS, Fitch,
                        L&T, NID, Kanakia Builders, Khetri Museum, Siemens, and more.
                      </motion.p>
                    </section>
                  </div>
                  {/* Right Column */}
                </div></div>
            </section>


            {/* Tools Section */}
            <section id='tools' className='bg-[#35353524] md:min-h-screen'>
              <section className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 md:pt-5 mx-auto '>
                <section className="relative mb-6 md:mb-10 ">
                  <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl text-gray-900 dark:text-gray-100`}>Tools:</motion.h2>
                  <motion.p variants={animationVariants} className="text-lg text-gray-900 dark:text-gray-100 mb-2 ">In order to turn an idea into a concrete project, I draw on my areas of expertise, all the while exploring new fields with boundless curiosity.</motion.p>


                  <div className="space-y-2  dark:text-gray-300">
                    <motion.h3 className={`${happy_monkey.className} antialiased text-2xl mt-6 md:mt-10 `} variants={animationVariants}>Development:</motion.h3>
                    <motion.li variants={animationVariants}>
                      <p>AI Tools:</p>
                      <p><span>ComfyUI, Stable Diffusion, VSCode</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>Web Development:</p>
                      <p><span>React.js, Next.js, React-Three-Fiber, Three.js, HTML, CSS, SCSS</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>Programming Languages:</p>
                      <p><span>JavaScript, TypeScript, C#, Python</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>Team/Project Management:</p>
                      <p><span>Jira, Confluence, GitHub</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>Creative Tools:</p>
                      <p><span>TouchDesigner,MadMapper</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>Game/App Programming:</p>
                      <p><span>Unity, Three.js, WebXR, OpenXR</span></p>
                    </motion.li>


                    <motion.h3 className={`${happy_monkey.className} antialiased text-2xl mt-6 md:mt-10 `} variants={animationVariants}>Design:</motion.h3>
                    <motion.li variants={animationVariants}>
                      <p>UI/Wireframing/Prototyping:</p>
                      <p><span>Figma, Adobe XD</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>3D Designing:</p>
                      <p><span>Blender, SketchUp</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>2D Designing:</p>
                      <p><span>Photoshop, Illustrator, After Effects</span></p>
                    </motion.li>


                    <motion.h3 className={`${happy_monkey.className} antialiased text-2xl mt-6 md:mt-10 `} variants={animationVariants}>Hardware and Electronics:</motion.h3>
                    <motion.li variants={animationVariants}>
                      <p>Electronics/Physical Computing:</p>
                      <p><span>Arduino, Raspberry Pi, NodeMCU</span></p>
                    </motion.li>

                    <motion.li variants={animationVariants}>
                      <p>Hardware:</p>
                      <p><span>Kinect, Leap Motion, Intel RealSense, HTC Vive, Oculus Quest 2, Looking Glass, DMXcontroller</span></p>
                    </motion.li>
                  </div>
                </section>
              </section>
            </section>

            {/* Footer */}

            <section id='socialcontact' className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-5 mx-auto'>
              <motion.footer variants={animationVariants} className="text-center">
                <div className="space-x-4 ">
                  <Link title="Connect me on LinkedIn"
                    href="https://www.linkedin.com/in/devangkantharia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    data-no-blobity
                  >
                    <MagneticBorderBottom
                      borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                      // borderColorDark="#60a5fa"
                      borderHeight={2}
                      magneticStrength={0.2}
                      transitionDuration={400}
                      className="text-[#19adfd] dark:text-yellow-300"
                    >
                      LinkedIn
                    </MagneticBorderBottom>
                  </Link>
                </div>
              </motion.footer></section>
          </MotionConfig>
        </ContainerStagger>
      </div>
    </div>
  );
}
