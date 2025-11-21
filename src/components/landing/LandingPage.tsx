'use client'

import { Button } from '@/components/ui/button'

export function LandingPage() {
  return (
    <div className="bg-figma-white min-h-screen">
      {/* Navigation */}
      <nav className="relative">
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 backdrop-blur-[15px] bg-white/40 rounded-figma-lg px-6 py-5">
          <div className="flex gap-[27px] items-center">
            <button className="font-dm-sans font-bold text-link text-figma-black">Benefits</button>
            <button className="font-dm-sans font-bold text-link text-figma-black">Specifications</button>
            <button className="font-dm-sans font-bold text-link text-figma-black">How-to</button>
            <button className="font-dm-sans font-bold text-link text-figma-black">Contact Us</button>
          </div>
        </div>
        
        <div className="max-w-[1500px] mx-auto px-10 py-5">
          <div className="flex items-center justify-between h-[148px]">
            <div className="font-dm-sans font-medium text-[30px] text-figma-black tracking-[-1.5px]">
              Area
            </div>
            <Button className="bg-figma-accent-1 text-figma-white rounded-figma-lg px-[22px] py-3.5">
              <span className="font-dm-sans font-bold text-link">Learn More</span>
            </Button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="max-w-[1500px] mx-auto px-10">
        <div className="flex flex-col gap-[240px] items-start">
          <h1 className="font-crimson text-display text-figma-black text-center w-full">
            Browse everything.
          </h1>
          
          <div className="bg-figma-mid-green h-[362px] rounded-figma w-full relative">
            <div className="absolute bg-figma-black h-[644px] rounded-[24px] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[907px]">
              <div className="h-[644px] overflow-hidden relative w-[907px]">
                <div className="absolute bg-gray-200 h-[607.439px] left-1/2 rounded-[16px] top-[18.5px] transform -translate-x-1/2 w-[869.742px]" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Logo Cloud */}
      <section className="max-w-[1500px] mx-auto px-10 py-[50px]">
        <div className="flex flex-col gap-figma-xl items-center">
          <p className="font-dm-sans text-paragraph text-figma-dark-grey w-full">
            Trusted by:
          </p>
          <div className="flex flex-wrap gap-10 items-center justify-center w-full">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[84px] w-[154px] p-5">
                <div className="bg-gray-300 h-full w-full rounded" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
