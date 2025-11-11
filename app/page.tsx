"use client";
import Image from "next/image";
import Link from "next/link";

import DKAvatar from './images/dk.png';

import { Navbar } from "@/components/blocks/navbar";
import { ThemeToggle } from "@/components/theme-toggle";
import { CardBody, CardContainer, CardItem } from "@/components/ui/shadcn-io/3d-card";

export default function Home() {
  return (
    <div className="relative mx-2.5 mt-2.5 lg:mx-4">
      <div className="top-0 right-0 absolute">
        <ThemeToggle />
      </div>

      {/* Main Content */}
      <div className="max-w-2xl md:max-w-4xl lg:max-w-5xl p-10 md:p-10 xl:p-5 md:pt-5 mx-auto">

        <Navbar />

        {/* Intro Section */}
        <section className="mb-8 mt-5">
          <p className="leading-12 dark:text-gray-200 text-2xl mb-3">
            I'm Devang Kantharia, a designer / researcher / technologist currently based in London, UK.
            I build functional proof-of-concept prototypes, design interactions, bespoke digital tools and experiences.
          </p>
          <blockquote className="border-l-4 border-gray-200 mt-8 mb-8 p-4 pl-5 dark:text-gray-400 text-md ">
            My medium for work includes softwares, electronics, robotics, audio, visual and AI, or whatever else required {" "}
            <span className="inline-block pb-1.5 relative after:absolute after:bg-gray-400 after:bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-400 after:ease-out  hover:text-shadow-xs">to make people feel special</span>.
          </blockquote>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_2fr] gap-8 lg:gap-12">
          <div className="space-y-6">
            {/* Project Work Section */}
            <section id="projectWork">
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-2 ">Project Work:</h2>
              <p className="dark:text-gray-300  mb-3 ">
                Most of the projects are signed under non-disclosure agreement (NDA), a glimpse of few projects can be seen here -
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 ">
                <ul className="space-y-6 list-disc list-inside dark:text-gray-300 mb-3 sm:mb-0">
                  <li>
                    <Link
                      href="https://devangkantharia.github.io/others/explorations/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
                    >
                      AI / ML Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://devangkantharia.github.io/others/arvrmr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs">
                      AR / VR / MR Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://devangkantharia.github.io/others/experience-centers/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
                    >
                      Experience Centers
                    </Link>
                  </li>
                </ul>
                <ul className="space-y-6 list-disc list-inside dark:text-gray-300">
                  <li>
                    <Link
                      href="https://devangkantharia.github.io/others/freelance/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
                    >
                      Freelance Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://devangkantharia.github.io/others/phygital/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
                    >
                      Phygital Simulations
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="https://devangkantharia.github.io/others/touch/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
                    >
                      TouchScreen Solutions
                    </Link>
                  </li>
                </ul>
              </div>
            </section>

            {/* Worked on Projects With */}
            <section>
              <h2 className="font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-2 ">Worked on Projects with:</h2>
              <p className="dark:text-gray-300  ">
                Snap Inc. (Snapchat), Leeds Beckett University, Accenture, Capegemini, JSW, TCS, Fitch,
                L&T, NID, Kanakia Builders, Khetri Museum, Siemens, and more.
              </p>
            </section>

            {/* Tools Section */}
            <section>
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2 ">Tools:</h2>
              <ul className="space-y-2  dark:text-gray-300">
                <li>
                  <strong>AI Tools:</strong><br />
                  ComfyUI,
                  Stable Diffusion,
                  MidJourney, n8n
                </li>
                <li>
                  <strong>Web Development:</strong><br />
                  React.js, Next.js,
                  React-Three-Fiber, Three.js, HTML, CSS, SCSS
                </li>
                <li>
                  <strong>Programming Languages:</strong><br />
                  JavaScript, TypeScript, C#, Python
                </li>
                <li>
                  <strong>Team/Project Management:</strong><br />
                  Jira, Confluence, GitHub
                </li>
                <li>
                  <strong>Creative Tools:</strong><br />
                  TouchDesigner,
                  MadMapper
                </li>
                <li>
                  <strong>Game/App Programming:</strong><br />
                  Unity, Three.js, WebXR, OpenXR
                </li>
                <li>
                  <strong>UI/Wireframing/Prototyping:</strong><br />
                  Figma, Adobe XD
                </li>
                <li>
                  <strong>3D Designing:</strong><br />
                  Blender, SketchUp
                </li>
                <li>
                  <strong>2D Designing:</strong><br />
                  Photoshop, Illustrator, After Effects
                </li>
                <li>
                  <strong>Electronics/Physical Computing:</strong><br />
                  Arduino, Raspberry Pi, NodeMCU
                </li>
                <li>
                  <strong>Hardware:</strong><br />
                  Kinect, Leap Motion, Intel RealSense, HTC Vive, Oculus Quest 2, Looking Glass, DMX controller
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column */}
          <div className="max-w-80">
            {/* Avatar Image */}
            <div className="relative">
              <CardContainer className="inter-var md:-top-10" containerClassName="py-0">
                <CardBody className=" relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/10 dark:bg-black dark:border-white/20 border-black/10 w-auto sm:w-[24rem] h-auto rounded-xl p-4 ">
                  <CardItem
                    translateZ="40"
                    className="text-base text-center w-full font-bold text-neutral-600 dark:text-white opacity-0 group-hover/card:opacity-100 transition-all duration-500 scale-95 group-hover/card:scale-100 mt-5"
                  >
                    My AI Avatar made using ComfyUi
                  </CardItem>
                  <CardItem translateZ="50" className="w-full mt-4">
                    <Image
                      className="w-full m-auto object-cover rounded-xl group-hover/card:shadow-xl md:max-w-60 lg:max-w-max"
                      src={DKAvatar}
                      alt="Devang Kantharia ComfyUI AI Avatar"
                    />
                  </CardItem>
                  <div className="flex justify-between items-center mt-3">
                    <CardItem
                      as="p"
                      translateZ="40"
                      className="text-neutral-900 text-sm max-w-sm mt-2 dark:text-neutral-300 opacity-0 group-hover/card:opacity-100 transition-all duration-500 scale-95 group-hover/card:scale-100"
                    >
                      ComfyUi Workflow comprises of 30 nodes and uses custom LORA.
                    </CardItem>
                    {/* <CardItem
                      as="a"
                      href=""
                      target="__blank"
                      translateZ="40"
                      className="text-neutral-900 text-sm max-w-sm mt-2 dark:text-neutral-300 opacity-0 group-hover/card:opacity-100 transition-all duration-500 scale-95 group-hover/card:scale-100"
                    >
                      Check it →
                    </CardItem> */}
                  </div>
                </CardBody>
              </CardContainer>
            </div>

            {/* What I am doing now */}
            <section className="mt-6 relative md:-top-13 ">
              <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-2 ">What I am doing now:</h2>
              <ul className="list-disc list-inside space-y-1  dark:text-gray-300">
                <li>Pursuing AWS Cloud Certification,</li>
                <li>Exploring Next.js,</li>
                <li>Prompt Engineering</li>
              </ul>
            </section>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 text-center">
          <div className="space-x-4 ">
            <a
              href="https://www.linkedin.com/in/devangkantharia/"
              target="_blank"
              rel="noopener noreferrer"
              className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
            >
              LinkedIn
            </a>
            <a
              href="https://twitter.com/devangkantharia"
              target="_blank"
              rel="noopener noreferrer"
              className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
            >
              Twitter
            </a>
            <a
              href="https://www.instagram.com/devangkantharia/"
              target="_blank"
              rel="noopener noreferrer"
              className="pb-1.5 relative after:absolute after:bg-gray-400 after:-bottom-1 after:left-0 after:h-0.5 after:w-0 hover:after:w-full after:transition-all after:duration-300 after:ease-out text-[#19adfd] dark:text-blue-400 hover:text-shadow-xs"
            >
              Instagram
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
