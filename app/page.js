'use client'
import {ConnectExplore, Hero, SlidingCards, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans, MiddleText} from "../components";
import TestScroll from "../components/TestScroll";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <div className="relative z-10">
        <TestScroll />
        <ConnectExplore />
        <Toolkit />      
        <Marquee />
        <Plans />
        <BubbleMarquee />
        <Bottom />
        <SlidingCards />
        <Footer />
      </div>
    </div>
  );
}
