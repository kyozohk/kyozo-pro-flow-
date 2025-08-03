'use client'
import { ConnectExplore, Hero, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans, RevealText, ParallaxCardsContainer } from "../components";
import Exclusive from "../components/cards/Exclusive";
import Engage from "../components/cards/Engage";
import Grow from "../components/cards/Grow";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <ConnectExplore />  
      <Exclusive />
      <Engage />
      <Grow />
      {/* <RevealText text="Where creative minds converge" /> */}
      {/* <ParallaxCardsContainer />       */}
      <Toolkit />      
      <Marquee />
      <Plans />
      <BubbleMarquee />
      <Bottom />
      <Footer />
    </div>
  );
}
