'use client'
import Image from "next/image";
import {Connect, Hero, SlidingCards, Footer, Toolkit, Bottom, CoCircles, Marquee, BubbleMarquee, Header, HomePage, Plans, RevealText} from "../components";
export default function Home() {
  return (
    <div className="">
        <Hero />
      <div className="mt-[-0px] relative z-10"> 
        <Connect />
      </div>      
      <RevealText text="Where creative minds converge" />
      <SlidingCards />
      <Toolkit />      
      <Marquee />
      <Plans />
      <BubbleMarquee />
      <Bottom />
      <Footer />
    </div>
  );

}