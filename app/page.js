'use client'
import Image from "next/image";
import {Hero, SlidingCards, Footer, Toolkit, Bottom, CoCircles, Marquee, BubbleMarquee, Header, HomePage, Plans, ConnectExplore, MiddleText} from "../components";
export default function Home() {
  return (
    <div className="">
      <Hero />
      <ConnectExplore />
      <MiddleText />
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
