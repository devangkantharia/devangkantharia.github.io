"use client";

import React from 'react';

import { Happy_Monkey } from 'next/font/google';
import Image from 'next/image';
import Link from 'next/link';

import { motion, MotionConfig } from 'motion/react';

import DKAvatar from './images/dk.jpg';

import { DKEyes } from '@/components/dkeyes';
import DKNavbar from '@/components/dknavbar';
// import HeroMorphingParticles from '@/components/HeroMorphingParticles';
import MyTools2 from '@/components/mytools2';
import { ThemeToggle } from '@/components/theme-toggle';
import { CardBody, CardContainer, CardItem } from '@/components/ui/shadcn-io/3d-card';
import CursorFollowImage from '@/components/utility/CursorFollowImage';
import MagneticBorderBottom from '@/components/utility/MagneticBorderBottom';
import MagneticBorderBottomWithWobble from '@/components/utility/MagneticBorderBottomWithWobble';
import { TextStagger } from '@/registry/blocks/text-stagger';
import { Navbar } from '@/registry/demo/navbar';
import { ANIMATION_VARIANTS } from '@/registry/utils/animation-variants';
import { TRANSITIONS } from '@/registry/utils/transitions';

const happy_monkey = Happy_Monkey({
  subsets: ['latin'],
  variable: '--font-happy_monkey',
  weight: ['400'],
})
// const IMAGES = [
//   'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1494&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1617869763329-8e8160d32adb?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1705675742522-b0bdc228f2ed?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//   'https://images.unsplash.com/photo-1705615791178-d32cc2cdcd9c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
// ];
export default function Home() {
  const animationVariants = ANIMATION_VARIANTS.blur;
  // const [heroShape, setHeroShape] = React.useState(0); // 0 hash,1 asterisk,2 angle

  return (
    <div className="relative text-sm lg:text-lg leading-9 ">
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
        <div className='invisible lg:visible'>
          <DKNavbar />
          <DKEyes />
        </div>
        {/* <ContainerStagger className="contStag"> */}
        <MotionConfig transition={TRANSITIONS.filter}>
          <section id='home' className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 md:pt-5 mx-auto relative z-50'><Navbar /></section>
          {/* Intro Section */}
          <section id="heroSection" className='max-w-2xl md:max-w-4xl lg:max-w-6xl pl-10 pr-10 mx-auto relative md:-top-16'>
            {/* <HeroMorphingParticles shapeIndex={heroShape} /> */}
            <section className="heroSection grid grid-cols-1 md:grid-cols-[2fr_1fr] lg:grid-cols-[3fr_1fr] items-center md:min-h-screen gap-8 relative z-10">
              <div className="heroText">
                <motion.div variants={animationVariants} className="lg:leading-14 dark:text-gray-200 text-lg lg:text-2xl mb-10 ">
                  I'm Devang Kantharia, a <span
                    className={`${happy_monkey.className} antialiased`}
                  // onMouseEnter={() => setHeroShape(0)}
                  >
                    <TextStagger>designer</TextStagger>
                  </span> / <span
                    className={`${happy_monkey.className} antialiased`}
                  // onMouseEnter={() => setHeroShape(1)}
                  ><TextStagger>researcher</TextStagger></span> / <span
                    className={`${happy_monkey.className} antialiased`}
                  // onMouseEnter={() => setHeroShape(2)}
                  ><TextStagger>technologist</TextStagger></span> currently based in London, UK.
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
                              alt="AI-generated avatar of Devang Kantharia"
                              priority
                              fetchPriority="high"
                              loading="eager"
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
          {/* Canvas-only cursor blocks demo */}
          {/* <section className='bg-black text-white'>
            <div className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 pt-12 mx-auto'>
              <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl mb-4`}>Canvas Cursor Blocks (Demo)</motion.h2>
              <motion.p variants={animationVariants} className="mb-4 opacity-80">Hover the canvas below to see the effect. It is scoped to this element only.</motion.p>
              <LocalCursorBlocksCanvas
                height={800}
                tileSize={50}
                blobSize={15}
                glyphColor="#fff"
                blendMode="source-over"
                shrinkDuration={280}
                tileLinger={180}
                iconMorphIntervalMs={5}
                appearScale={false}
                appearDuration={180}
                followLerp={0.32}
                plusBias={0.7}
                bigBlockChance={0.1}
                removalJitterMs={500}
                earlyRemovalMs={180}
              />
            </div>
          </section> */}

          {/* <ImagePlayer
            images={IMAGES}
            interval={200}
            renderImage={(src) => (
              <Image
                src={src}
                width={400}
                height={300}
                className="size-full h-auto max-h-full max-w-xl object-cover inline-block align-middle"
                alt="showcalse"
              />
            )}
          /> */}

          {/* Existing content */}
          <section className='bg-[#35353534] md:min-h-screen'>
            <div className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 pt-0 mx-auto'>
              <div className="grid grid-cols-1 ">
                <div className="space-y-6 contents md:block md:space-y-0">
                  {/* Project Work Section */}
                  <section id="projectWork" className="pt-15 md:pl-0 order-1 mb-6 md:mb-15 ">
                    <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl mb-2`}>Project Work:</motion.h2>
                    <motion.p variants={animationVariants} className="dark:text-gray-300 mb-3 pr-11 text-justify">
                      Most of the projects are signed under non-disclosure agreement (NDA), a glimpse of few projects can be seen here -
                    </motion.p>


                    {/* <Project List /> */}
                    <div className="relative">
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-20 lg:gap-x-40 md:gap-y-16 list-disc list-inside lg:list-outside dark:text-gray-300 md:w-fit mx-auto">
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <CursorFollowImage
                            images={['/images/explorations/1.jpg', '/images/explorations/2.jpg', '/images/explorations/3.jpg', '/images/explorations/4.jpg', '/images/explorations/5.jpg', '/images/explorations/6.jpg', '/images/explorations/7.jpg', '/images/explorations/8.jpg', '/images/explorations/9.jpg', '/images/explorations/10.jpg']}
                            imageWidth={280}
                            imageHeight={280}
                          >
                            <Link
                              href="https://devangkantharia.github.io/others/explorations/"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              data-no-blobity
                            >
                              <MagneticBorderBottomWithWobble
                                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                                borderHeight={2}
                                magneticStrength={0.3}
                                transitionDuration={300}
                                className="text-[#19adfd] dark:text-yellow-300"
                              >
                                AI / ML Projects
                              </MagneticBorderBottomWithWobble>
                            </Link>
                          </CursorFollowImage>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <CursorFollowImage
                            images={['/images/arvrmr/1.jpg', '/images/arvrmr/2.jpg', '/images/arvrmr/3.jpg', '/images/arvrmr/4.jpg', '/images/arvrmr/5.jpg', '/images/arvrmr/6.jpg', '/images/arvrmr/7.jpg', '/images/arvrmr/8.jpg', '/images/arvrmr/9.jpg', '/images/arvrmr/10.jpg']}
                            imageWidth={280}
                            imageHeight={200}
                          >
                            <Link
                              href="https://devangkantharia.github.io/others/arvrmr/"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              data-no-blobity
                            >
                              <MagneticBorderBottomWithWobble
                                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                                borderHeight={2}
                                magneticStrength={0.3}
                                transitionDuration={300}
                                className="text-[#19adfd] dark:text-yellow-300"
                              >
                                AR / VR / MR Projects
                              </MagneticBorderBottomWithWobble>
                            </Link>
                          </CursorFollowImage>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <CursorFollowImage
                            images={['/images/experience-centers/1.jpg', '/images/experience-centers/2.jpg', '/images/experience-centers/3.jpg', '/images/experience-centers/4.jpg', '/images/experience-centers/5.jpg', '/images/experience-centers/6.jpg', '/images/experience-centers/7.jpg', '/images/experience-centers/8.jpg', '/images/experience-centers/9.jpg', '/images/experience-centers/10.jpg', '/images/experience-centers/11.jpg', '/images/experience-centers/12.jpg']}
                            imageWidth={280}
                            imageHeight={200}
                          >
                            <Link
                              href="https://devangkantharia.github.io/others/experience-centers/"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              data-no-blobity
                            >
                              <MagneticBorderBottomWithWobble
                                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                                borderHeight={2}
                                magneticStrength={0.3}
                                transitionDuration={300}
                                className="text-[#19adfd] dark:text-yellow-300"
                              >
                                Experience Centers
                              </MagneticBorderBottomWithWobble>
                            </Link>
                          </CursorFollowImage>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <CursorFollowImage
                            images={['/images/freelance/1.jpg', '/images/freelance/2.jpg']}
                            imageWidth={280}
                            imageHeight={280}
                          >
                            <Link
                              href="https://devangkantharia.github.io/others/freelance/"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              data-no-blobity
                            >
                              <MagneticBorderBottomWithWobble
                                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                                borderHeight={2}
                                magneticStrength={0.3}
                                transitionDuration={300}
                                className="text-[#19adfd] dark:text-yellow-300"
                              >
                                Freelance Projects
                              </MagneticBorderBottomWithWobble>
                            </Link>
                          </CursorFollowImage>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <CursorFollowImage
                            images={['/images/phygital/1.jpg', '/images/phygital/2.jpg', '/images/phygital/3.jpg', '/images/phygital/4.jpg', '/images/phygital/5.jpg', '/images/phygital/6.jpg', '/images/phygital/7.jpg', '/images/phygital/8.jpg']}
                            imageWidth={280}
                            imageHeight={200}
                          >
                            <Link
                              href="https://devangkantharia.github.io/others/phygital/"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              data-no-blobity
                            >
                              <MagneticBorderBottomWithWobble
                                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                                borderHeight={2}
                                magneticStrength={0.3}
                                transitionDuration={300}
                                className="text-[#19adfd] dark:text-yellow-300"
                              >
                                Phygital Simulations
                              </MagneticBorderBottomWithWobble>
                            </Link>
                          </CursorFollowImage>
                        </motion.li>
                        <motion.li variants={animationVariants} className="whitespace-nowrap">
                          <CursorFollowImage
                            images={['/images/touch/1.jpg', '/images/touch/2.jpg', '/images/touch/3.jpg']}
                            imageWidth={280}
                            imageHeight={200}
                          >
                            <Link
                              href="https://devangkantharia.github.io/others/touch/"
                              target="_blank"
                              rel="noopener noreferrer"
                              prefetch={false}
                              data-no-blobity
                            >
                              <MagneticBorderBottomWithWobble
                                borderClassName="bg-[#19adfd] dark:bg-yellow-300"
                                borderHeight={2}
                                magneticStrength={0.3}
                                transitionDuration={300}
                                className="text-[#19adfd] dark:text-yellow-300"
                              >
                                TouchScreen Solutions
                              </MagneticBorderBottomWithWobble>
                            </Link>
                          </CursorFollowImage>
                        </motion.li>
                      </ul>
                    </div>
                  </section>

                  {/* What I am doing now */}
                  <section className="relative order-3 mb-6 md:mb-15 ">
                    <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl mb-2`}>What I am doing now:</motion.h2>
                    <ul className="list-disc list-inside space-y-1  dark:text-gray-300">
                      <motion.li variants={animationVariants}>Pursuing AWS Cloud Certification,</motion.li>
                      <motion.li variants={animationVariants}>Exploring Next.js,</motion.li>
                      <motion.li variants={animationVariants}>Prompt Engineering</motion.li>
                    </ul>
                  </section>

                  {/* Worked on Projects With */}
                  <section className="order-4 mb-6 md:mb-15 ">
                    <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl mb-2`}>Worked on Projects with:</motion.h2>
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
          <section className='bg-[#35353534] md:min-h-screen'>
            <div className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-10 pt-0 mx-auto'>
              <section id='tools' className="pt-15 md:pl-0 order-1 mb-6 md:mb-15 ">
                <motion.h2 variants={animationVariants} className={`${happy_monkey.className} antialiased text-2xl mb-2`}>Tools:</motion.h2>
                <motion.p variants={animationVariants} className="text-lg mb-15 ">In order to turn an idea into a concrete project, I draw on my areas of expertise, all the while exploring new fields with boundless curiosity.</motion.p>
                <MyTools2 enableTilt={false} clickEffect={true} enableMagnetism={false} enableSpotlight={true} />
              </section>
            </div>
          </section>

          {/* Footer */}

          <section id='socialcontact' className='max-w-2xl md:max-w-4xl lg:max-w-6xl p-5 mx-auto'>
            <motion.footer variants={animationVariants} className="text-center">
              <div className="space-x-4 ">
                <Link title="Connect me on LinkedIn"
                  href="https://www.linkedin.com/in/devangkantharia/"
                  target="_blank"
                  rel="noopener noreferrer"
                  prefetch={false}
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
        {/* </ContainerStagger> */}
      </div>
    </div>
  );
}
