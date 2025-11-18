"use client";

import { Happy_Monkey } from 'next/font/google';

import { motion } from 'motion/react';

import { ANIMATION_VARIANTS } from '@/registry/utils/animation-variants';

const happy_monkey = Happy_Monkey({
  subsets: ['latin'],
  variable: '--font-happy_monkey',
  weight: ['400'],
})

// interface ToolLogoProps {
//   lightSvg: React.ReactNode;
//   darkSvg?: React.ReactNode;
//   alt: string;
//   className?: string;
// }

// const ToolLogo = ({ lightSvg, darkSvg, alt, className = "w-5 h-5" }: ToolLogoProps) => {
//   return (
//     <span className={`inline-flex items-center ${className}`} title={alt}>
//       {darkSvg ? (
//         <>
//           <span className="dark:hidden">{lightSvg}</span>
//           <span className="hidden dark:inline-block">{darkSvg}</span>
//         </>
//       ) : (
//         lightSvg
//       )}
//     </span>
//   );
// };

export default function MyTools() {
  const animationVariants = ANIMATION_VARIANTS.blur;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 dark:text-gray-300 max-w-7xl mx-auto">
      <div className="leftCol">
        <motion.h3 className={`${happy_monkey.className} antialiased text-2xl mb-4`} variants={animationVariants}>Development:</motion.h3>
        <ul className="space-y-6 list-disc list-inside lg:list-outside pl-0 lg:pl-5">
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">AI Tools:</h4>
            <p className="mt-1 text-base">
              n8n, ComfyUI, Stable Diffusion, VScode
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">Web Development:</h4>
            <p className="mt-1 text-base">
              React.js, Next.js, React-Three-Fiber, Three.js, HTML, CSS, SCSS
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">Programming Languages:</h4>
            <p className="mt-1 text-base">
              JavaScript, TypeScript, C#, Python
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">Team / Project Management:</h4>
            <p className="mt-1 text-base">
              Jira, Confluence, GitHub
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">Creative Tools:</h4>
            <p className="mt-1 text-base">
              TouchDesigner, MadMapper
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">Game / App Programming:</h4>
            <p className="mt-1 text-base">
              Unity, Three.js, WebXR, OpenXR
            </p>
          </motion.li>
        </ul>
      </div>

      <div className="rightCol">
        <motion.h3 className={`${happy_monkey.className} antialiased text-2xl mb-4`} variants={animationVariants}>Design:</motion.h3>
        <ul className="space-y-6 list-disc list-inside lg:list-outside pl-0 lg:pl-5 mb-8">
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">UI / Wireframing / Prototyping:</h4>
            <p className="mt-1 text-base">
              Figma, Adobe XD
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">3D Designing:</h4>
            <p className="mt-1 text-base">
              Blender, SketchUp
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">2D Designing:</h4>
            <p className="mt-1 text-base">
              Photoshop, Illustrator, After Effects
            </p>
          </motion.li>
        </ul>

        <motion.h3 className={`${happy_monkey.className} antialiased text-2xl mb-4 mt-8`} variants={animationVariants}>Hardware and Electronics:</motion.h3>
        <ul className="space-y-6 list-disc list-inside lg:list-outside pl-0 lg:pl-5">
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">Electronics / Physical Computing:</h4>
            <p className="mt-1 text-base">
              Arduino, Raspberry Pi, NodeMCU
            </p>
          </motion.li>
          <motion.li variants={animationVariants} className="mb-4">
            <h4 className="font-semibold text-lg inline">Hardware:</h4>
            <p className="mt-1 text-base">
              Kinect, Leap Motion, Intel RealSense, HTC Vive, Oculus Quest 2, Looking Glass, DMXcontroller
            </p>
          </motion.li>
        </ul>
      </div>
    </div>
  );
}
