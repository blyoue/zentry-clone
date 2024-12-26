import { useState, useRef, useEffect } from "react";
import Button from "./Button";
import { TiLocationArrow } from "react-icons/ti";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/all";

gsap.registerPlugin(ScrollTrigger)

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(1);
  const [hasClicked, setHasClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedVideos, setLoadedVideos] = useState(0);
  const [bgIndex, setBgIndex] = useState(1)

  const totalVideos = 4 ;
  
  const nextVideoRef = useRef(null);
  const bgVideoRef = useRef(null);

  const handleVideoLoad = () => {
    setLoadedVideos((prev) => prev + 1);
  }

  const upcomingVideoIndex = (currentIndex % totalVideos) + 1

  const handleMiniVdClick = () => {
    setHasClicked(true);
    setCurrentIndex(upcomingVideoIndex);
  }

  useEffect(() => {
    if(loadedVideos === totalVideos - 1) {
      setIsLoading(false);
    }
  }, [loadedVideos])
  

  useGSAP(() => {
    if(hasClicked) {
      gsap.set('#next-video', { visibility: 'visible' });
      gsap.to('#next-video', {
        transformOrigin: 'center center',
        scale: 1,
        width: '100%',
        height: '100%',
        duration: 1,
        ease: 'power2.out',
        onStart: () => {
          nextVideoRef.current.play();
        },
        onComplete: () => {
          setTimeout(() => {
            setBgIndex(currentIndex);
            requestAnimationFrame(() => {
              if (bgVideoRef.current) {
                bgVideoRef.current.currentTime = 1.1;
              }
            });
          }, 50)
        }
      })

      gsap.from('#current-video', {
        transformOrigin: 'center center',
        scale: 0,
        duration: 1.5,
        ease: 'power2.out',
      })
    }

  }, {dependencies: [currentIndex], revertOnUpdate: true})

  useGSAP(() => {
    gsap.set('#video-frame', {
      clipPath: 'polygon(26% 0%, 66% 0%, 91% 91%, 0% 78%, 0% 65%)',
      borderRadius: "10% 10% 10% 10%",
    })

    gsap.from('#video-frame', {
      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 67%)',
      borderRadius: "0% 0% 0% 0%",
      ease: 'power1.out',
      scrollTrigger: {
        trigger: '#video-frame',
        start: 'center center',
        end: '150% center',
        scrub: true,
      }
    })
  })

  const getVideoSrc = (index) => `videos/hero-${index}.mp4`;

  return (
    <div className="relative h-dvh w-screen overflow-x-hidden">
      {isLoading && (
        <div className="flex-center absolute z-[100] h-dvh w-screen overflow-hidden bg-violet-50-">
          <div className="three-body">
            <div className="three-body__dot" />
            <div className="three-body__dot" />
            <div className="three-body__dot" />
          </div>
        </div>
      )}
        <div id="video-frame" className="relative z-10 h-dvh w-screen overflow-hidden rounded-lg bg-blue-75">
            <div>
                <div className="mask-clip-path absolute-center absolute z-50 size-64 cursor-pointer overflow-hidden rounded-lg">
                  <div onClick={handleMiniVdClick} className="origin-center scale-50 opacity-0 transition-all duration-500 ease-out hover:scale-100 hover:opacity-100 ">
                    <video 
                    ref={nextVideoRef}
                    src={getVideoSrc(upcomingVideoIndex)}
                    loop
                    muted
                    id="current-video"
                    className="size-64 origin-center scale-150 object-cover object-center"
                    onLoadedData={handleVideoLoad}
                    />
                  </div>
                </div>
                <video 
                  ref={nextVideoRef}
                  src={getVideoSrc(currentIndex)}
                  loop
                  muted
                  id="next-video"
                  className="absolute-center invisible absolute z-20 size-64 object-cover object-center rounded-lg"
                  onLoadedData={handleVideoLoad}
                />
                <video 
                  ref={bgVideoRef}
                  src={getVideoSrc(bgIndex)} 
                  autoPlay
                  loop
                  muted
                  className="absolute top-0 left-0 size-full object-cover object-center"
                  onLoadedData={handleVideoLoad}
                />

            </div>
            <h1 className="special-font hero-heading absolute bottom-5 right-5 z-40 text-blue-75">
              G<b>a</b>ming
            </h1>
            <div className="absolute left-0 top-0 z-40 size-full">
              <div className="mt-24 px-5 sm:px-10">
                <h1 className="special-font hero-heading text-blue-100">redefi<b>n</b>e</h1>
                <p className="mb-5 max-w-64 font-robert-regular text-blue-100">Enter the Metagame Layer <br /> Unleash the Play Economy</p>
                <Button id="watch-trailer" title="Watch Trailer" leftIcon={<TiLocationArrow />} containerClass="!bg-yellow-300 flex-center gap-1"/>
              </div>
            </div>
        </div>
        <h1 className="special-font hero-heading absolute bottom-5 right-5 text-black">
          G<b>a</b>ming
        </h1>
    </div>
  )
}

export default Hero