'use client'
import { ConnectExplore, Hero, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans, RevealText, ParallaxCardsContainer, CreativeMinds } from "../components";
import Exclusive from "../components/cards/Exclusive";
import Engage from "../components/cards/Engage";
import Grow from "../components/cards/Grow";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <ConnectExplore />
      <CreativeMinds />
      <Exclusive />
      <Engage />
      <Grow />
      <Toolkit />
      <Marquee>
        <span className="text-3xl font-bold text-white mx-8">Create</span>
        <span className="text-3xl font-bold text-white mx-8">Connect</span>
        <span className="text-3xl font-bold text-white mx-8">Collaborate</span>
        <span className="text-3xl font-bold text-white mx-8">Inspire</span>
        <span className="text-3xl font-bold text-white mx-8">Innovate</span>
      </Marquee>
      <Plans />
      <BubbleMarquee />
      <Bottom />
      <Footer />
    </div>
  );
}
