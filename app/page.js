'use client'
import {Connect, Hero, SlidingCards, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans} from "../components";
export default function Home() {
  return (
    <div className="">
      <SlidingCards />
      <Hero />
      <Connect />
      <Toolkit />      
      <Marquee />
      <Plans />
      <BubbleMarquee />
      <Bottom />
      <Footer />
    </div>
  );
}
