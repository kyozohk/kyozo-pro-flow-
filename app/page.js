'use client'
import {ConnectExplore, Hero, SlidingCards, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans, MiddleText, RevealText} from "../components";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <ConnectExplore />  
      <RevealText text="Where creative minds converge" />
      {/* <SlidingCards /> */}
      <Toolkit />      
      <Marquee />
      <Plans />
      <BubbleMarquee />
      <Bottom />
      <Footer />
    </div>
  );
}
