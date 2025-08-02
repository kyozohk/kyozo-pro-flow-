'use client'
import {ConnectExplore, Hero, SlidingCards, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans, MiddleText} from "../components";

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
