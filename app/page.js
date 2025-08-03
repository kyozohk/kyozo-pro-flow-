'use client'
import Image from "next/image";
import {Connect, Hero, SlidingCards, Footer, Toolkit, Bottom, CoCircles, Marquee, BubbleMarquee, Header, HomePage, Plans} from "../components";
export default function Home() {
  return (
    <div className="">
      <SlidingCards />
      {/* <Hero /> */}
      <Connect />
      <Toolkit />      
      <Marquee />
      <Plans />
      <BubbleMarquee />
      <Footer />
    </div>
  );
}
