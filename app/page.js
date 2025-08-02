'use client'
import {ConnectExplore, Hero, SlidingCards, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans, MiddleText} from "../components";
import TestScroll from "../components/TestsScroll";

export default function Home() {
  return (
    <div className="relative">
      <Hero />
      <div className="relative z-10">
        <TestScroll />
        {/* <ConnectExplore /> */}
        <MiddleText />
        {/* <SlidingCards /> */}
        <Toolkit />      
        <Marquee />
        <Plans />
        <BubbleMarquee />
        <Bottom />
        <Footer />
      </div>
    </div>
  );
}
