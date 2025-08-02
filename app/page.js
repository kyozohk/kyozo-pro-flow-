'use client'
import {Connect, Hero, SlidingCards, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans} from "../components";
import { CardExamples } from "../components/cards/CardExample";
export default function Home() {
  return (
    <div className="">
      <CardExamples />
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
