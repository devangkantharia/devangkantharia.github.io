"use client";



import MagicBento from '@/components/MagicBento';


export default function About() {

  return (
    <div className="relative text-sm lg:text-lg leading-9 ">
      <MagicBento enableTilt={false} clickEffect={true} enableMagnetism={false} />
    </div>
  );
}
