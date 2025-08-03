'use client'
import { ConnectExplore, Hero, Footer, Toolkit, Bottom, Marquee, BubbleMarquee, Plans, RevealText, ParallaxCardsContainer } from "../components";

export default function Home() {
  return (
    <div className="relative overflow-x-hidden">
      <Hero />
      <ConnectExplore />  
      <RevealText text="Where creative minds converge" />
      <ParallaxCardsContainer />
      
      <Toolkit />      
      <Marquee />
      <Plans />
      <BubbleMarquee />
      <Bottom />
      <Footer />
    </div>
  );
}
