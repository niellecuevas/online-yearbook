'use client'

import React, { useEffect, useRef, useState, useCallback } from 'react'

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

interface VideoBannerProps {
  videoId: string;
  nextSectionId?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  showControls?: boolean;
  overlayContent?: React.ReactNode;
}

const VideoBanner: React.FC<VideoBannerProps> = ({
  videoId,
  nextSectionId = 'next-section',
  autoPlay = true,
  muted = false,
  loop = false,
  showControls = true,
  overlayContent
}) => {
  const playerRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const autoplayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const checkPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [isMuted, setIsMuted] = useState<boolean>(false)
  const [isPlayerReady, setIsPlayerReady] = useState<boolean>(false)
  const [isAPILoaded, setIsAPILoaded] = useState<boolean>(false)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // Detect mobile device and screen orientation
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    const handleOrientationChange = () => {
      // Small delay to allow for orientation change to complete
      setTimeout(() => {
        if (document.fullscreenElement) {
          setIsFullscreen(true)
        } else {
          setIsFullscreen(false)
        }
      }, 100)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    window.addEventListener('orientationchange', handleOrientationChange)
    document.addEventListener('fullscreenchange', () => {
      setIsFullscreen(!!document.fullscreenElement)
    })

    return () => {
      window.removeEventListener('resize', checkMobile)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  // Clean up timeouts
  const clearTimeouts = useCallback(() => {
    if (autoplayTimeoutRef.current) {
      clearTimeout(autoplayTimeoutRef.current)
      autoplayTimeoutRef.current = null
    }
    if (checkPlayTimeoutRef.current) {
      clearTimeout(checkPlayTimeoutRef.current)
      checkPlayTimeoutRef.current = null
    }
  }, [])

  // Load YouTube API
  useEffect(() => {
    const loadYouTubeAPI = () => {
      if (typeof window === 'undefined') return

      // Check if API is already loaded
      if (window.YT && window.YT.Player) {
        setIsAPILoaded(true)
        return
      }

      // Check if script is already loading
      if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        window.onYouTubeIframeAPIReady = () => setIsAPILoaded(true)
        return
      }

      // Load the API script
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      tag.async = true
      tag.onerror = () => console.error('Failed to load YouTube API')
      
      const firstScriptTag = document.getElementsByTagName('script')[0]
      if (firstScriptTag?.parentNode) {
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
      }

      window.onYouTubeIframeAPIReady = () => setIsAPILoaded(true)
    }

    loadYouTubeAPI()
  }, [])

  // Player event handlers
  const onPlayerReady = useCallback((event: any) => {
    setIsPlayerReady(true)
    
    if (autoPlay) {
      autoplayTimeoutRef.current = setTimeout(() => {
        try {
          event.target.playVideo()
          
          checkPlayTimeoutRef.current = setTimeout(() => {
            if (event.target.getPlayerState() !== window.YT.PlayerState.PLAYING) {
              event.target.mute()
              setIsMuted(true)
              event.target.playVideo()
            }
          }, 500)
        } catch (error) {
          console.error('Error during autoplay:', error)
        }
      }, 1500)
    }
  }, [autoPlay])

  const onPlayerStateChange = useCallback((event: any) => {
    if (!window.YT) return

    const { YT } = window
    
    switch (event.data) {
      case YT.PlayerState.PLAYING:
        setIsPlaying(true)
        break
      case YT.PlayerState.PAUSED:
        setIsPlaying(false)
        break
      case YT.PlayerState.ENDED:
        setIsPlaying(false)
        if (!loop) {
          scrollToNextSection()
        }
        break
    }
  }, [loop])

  // Initialize player when API is loaded
  useEffect(() => {
    if (!isAPILoaded || !containerRef.current || !videoId) return

    // Clean up existing player
    if (playerRef.current) {
      try {
        playerRef.current.destroy()
      } catch (error) {
        console.error('Error destroying player:', error)
      }
      playerRef.current = null
    }

    try {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '100%',
        width: '100%',
        videoId: videoId,
        playerVars: {
          autoplay: 0, // Handle autoplay manually
          mute: 0,
          controls: 0,
          showinfo: 0,
          rel: 0,
          loop: loop ? 1 : 0,
          playlist: loop ? videoId : undefined,
          modestbranding: 1,
          iv_load_policy: 3,
          disablekb: 1,
          playsinline: 1,
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange,
        },
      })
    } catch (error) {
      console.error('Error creating YouTube player:', error)
    }

    // Cleanup function
    return () => {
      clearTimeouts()
      if (playerRef.current) {
        try {
          playerRef.current.destroy()
        } catch (error) {
          console.error('Error destroying player on cleanup:', error)
        }
        playerRef.current = null
      }
    }
  }, [isAPILoaded, videoId, loop, onPlayerReady, onPlayerStateChange, clearTimeouts])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeouts()
    }
  }, [clearTimeouts])

  const scrollToNextSection = useCallback(() => {
    const nextSection = document.getElementById(nextSectionId)
    if (nextSection) {
      nextSection.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [nextSectionId])

  const togglePlayPause = useCallback(() => {
    if (!playerRef.current || !isPlayerReady) return

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo()
      } else {
        playerRef.current.playVideo()
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error)
    }
  }, [isPlaying, isPlayerReady])

  const handleMute = useCallback(() => {
    if (!playerRef.current || !isPlayerReady) return

    try {
      if (isMuted) {
        playerRef.current.unMute()
        setIsMuted(false)
      } else {
        playerRef.current.mute()
        setIsMuted(true)
      }
    } catch (error) {
      console.error('Error toggling mute:', error)
    }
  }, [isMuted, isPlayerReady])

  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return

    try {
      if (!document.fullscreenElement) {
        await containerRef.current.requestFullscreen()
        // Lock orientation to landscape on mobile
        if ('screen' in window && 'orientation' in window.screen) {
          try {
            await (window.screen.orientation as any).lock('landscape')
          } catch (error) {
            console.log('Orientation lock not supported or failed:', error)
          }
        }
      } else {
        await document.exitFullscreen()
        // Unlock orientation
        if ('screen' in window && 'orientation' in window.screen) {
          try {
            (window.screen.orientation as any).unlock()
          } catch (error) {
            console.log('Orientation unlock not supported or failed:', error)
          }
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error)
    }
  }, [])

  return (
    <div 
      id="top" 
      ref={containerRef}
      className={`relative overflow-hidden bg-black ${
        isFullscreen ? 'w-screen h-screen' : 'min-h-screen w-full'
      }`}
    >
      {/* YouTube Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <div 
          id="youtube-player"
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
            isMobile && !isFullscreen 
              ? 'w-full h-full' 
              : 'w-[177.78vh] h-[56.25vw] min-h-full min-w-full'
          }`}
        />
      </div>

      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/30 z-10" />

      {/* Content Overlay */}
      <div className={`relative z-20 flex flex-col justify-center items-center min-h-screen text-white px-4 transition-opacity duration-1000 ${
        isPlaying ? 'opacity-0' : 'opacity-100'
      }`}>
        {overlayContent || (
          <h1 className="text-2xl sm:text-4xl md:text-6xl lg:text-9xl font-bold text-center drop-shadow-lg">
            Video Banner
          </h1>
        )}
      </div>

      {/* Custom Controls */}
      {showControls && (
        <div className={`absolute z-30 flex space-x-2 sm:space-x-4 ${
          isMobile 
            ? 'bottom-4 left-4 right-4 justify-center flex-wrap gap-2' 
            : 'bottom-8 left-8'
        }`}>
          <button
            onClick={togglePlayPause}
            className="bg-black/50 backdrop-blur-sm border border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200 rounded-full p-2 sm:p-3 text-white"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? (
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleMute}
            className="bg-black/50 backdrop-blur-sm border border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200 rounded-full p-2 sm:p-3 text-white"
            aria-label={isMuted ? 'Unmute video' : 'Mute video'}
          >
            {isMuted ? (
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
              </svg>
            ) : (
              <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
              </svg>
            )}
          </button>

          {/* Fullscreen Button (primarily for mobile) */}
          {isMobile && (
            <button
              onClick={toggleFullscreen}
              className="bg-black/50 backdrop-blur-sm border border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200 rounded-full p-2 sm:p-3 text-white"
              aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
            >
              {isFullscreen ? (
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5m11 5.5V4.5M15 9h4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5m11-5.5v4.5m0-4.5h4.5m-4.5 0l5.5 5.5" />
                </svg>
              ) : (
                <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5.5 5.5M20 8V4m0 0h-4m4 0l-5.5 5.5M4 16v4m0 0h4m-4 0l5.5-5.5M20 16v4m0 0h-4m4 0l-5.5-5.5" />
                </svg>
              )}
            </button>
          )}
        </div>
      )}

      {/* Scroll indicator - hidden in fullscreen */}
      {!isFullscreen && (
        <div className={`absolute z-30 ${isMobile ? 'bottom-4 right-4' : 'bottom-8 right-8'}`}>
          <button
            onClick={scrollToNextSection}
            className="bg-black/50 backdrop-blur-sm border border-white/50 hover:border-white hover:bg-white/10 transition-all duration-200 rounded-full p-2 sm:p-3 text-white animate-bounce"
            aria-label="Scroll to next section"
          >
            <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        </div>
      )}

      {/* Mobile Fullscreen Instructions */}
      {isMobile && isFullscreen && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-40 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm">
          Rotate device for best experience
        </div>
      )}
    </div>
  )
}

export default VideoBanner