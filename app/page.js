'use client'
import {ConnectExplore, Hero, SlidingCards, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans} from "../components";
export default function Home() {
  return (
    <div className="">
      <Hero />
      <ConnectExplore />
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
