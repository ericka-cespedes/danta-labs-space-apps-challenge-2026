import { useEffect, useRef, useState } from 'react'
import './App.css'

type RouteId = 'project' | 'play' | 'team'

const routes: { id: RouteId; label: string }[] = [
  { id: 'project', label: 'The project' },
  { id: 'play', label: 'Gameplay preview' },
  { id: 'team', label: 'The team' },
]

const desktopCoastlines = [
  [71, 84, 72, 81, 92, 54, 87, 30, 82, 19, 70, 77],
  [69, 84, 55, 75, 88, 52, 83, 28, 79, 19, 62, 72],
  [74, 91, 77, 88, 94, 58, 89, 32, 75, 11, 80, 84],
]

const mobileCoastlines = [
  [72, 83, 18, 59, 34, 73, 91, 65, 53, 78, 70],
  [66, 77, 28, 57, 43, 69, 83, 63, 47, 74, 65],
  [74, 84, 21, 64, 32, 77, 93, 70, 57, 85, 72],
]

function interpolateFrame(progress: number, frames: number[][]) {
  const scaledProgress = Math.max(0, Math.min(1, progress)) * (frames.length - 1)
  const startIndex = Math.floor(scaledProgress)
  const endIndex = Math.min(startIndex + 1, frames.length - 1)
  const amount = scaledProgress - startIndex

  return frames[startIndex].map(
    (value, index) => value + (frames[endIndex][index] - value) * amount,
  )
}

function coastlinePath(progress: number, mobile: boolean) {
  const frame = interpolateFrame(
    progress,
    mobile ? mobileCoastlines : desktopCoastlines,
  )

  if (mobile) {
    return `M0 0 H${frame[0]} C${frame[1]} ${frame[2]} ${frame[3]} ${frame[4]} ${frame[5]} 50 C${frame[6]} ${frame[7]} ${frame[8]} ${frame[9]} ${frame[10]} 100 H0 Z`
  }

  return `M0 0 H100 V${frame[0]} C${frame[1]} ${frame[2]} ${frame[3]} ${frame[4]} ${frame[5]} ${frame[6]} C${frame[7]} ${frame[8]} ${frame[9]} ${frame[10]} 0 ${frame[11]} Z`
}

function useGuideMap() {
  const landRef = useRef<SVGPathElement>(null)
  const [activeRoute, setActiveRoute] = useState<RouteId>('project')

  useEffect(() => {
    const sections = routes
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0
    let activeIndex = 0

    const updateMap = () => {
      animationFrame = 0
      const viewportCenter = window.innerHeight * 0.48
      let closestIndex = 0
      let closestDistance = Number.POSITIVE_INFINITY

      sections.forEach((section, index) => {
        const bounds = section.getBoundingClientRect()
        const distance = Math.abs(bounds.top + bounds.height / 2 - viewportCenter)

        if (distance < closestDistance) {
          closestDistance = distance
          closestIndex = index
        }
      })

      if (closestIndex !== activeIndex) {
        activeIndex = closestIndex
        setActiveRoute(routes[closestIndex].id)
      }

      const scrollRange = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight,
      )
      const pageProgress = window.scrollY / scrollRange
      const mapProgress = reducedMotion.matches
        ? activeIndex / (routes.length - 1)
        : pageProgress
      const isMobile = window.matchMedia('(max-width: 760px)').matches

      landRef.current?.setAttribute('d', coastlinePath(mapProgress, isMobile))
    }

    const scheduleMapUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateMap)
      }
    }

    window.addEventListener('scroll', scheduleMapUpdate, { passive: true })
    window.addEventListener('resize', scheduleMapUpdate)
    reducedMotion.addEventListener('change', scheduleMapUpdate)
    scheduleMapUpdate()

    return () => {
      window.removeEventListener('scroll', scheduleMapUpdate)
      window.removeEventListener('resize', scheduleMapUpdate)
      reducedMotion.removeEventListener('change', scheduleMapUpdate)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return { landRef, activeRoute }
}

function App() {
  const { landRef, activeRoute } = useGuideMap()

  return (
    <div className="site-shell" id="top">
      <svg
        aria-hidden="true"
        className="map-surface"
        focusable="false"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d={coastlinePath(
            0,
            typeof window !== 'undefined' && window.matchMedia('(max-width: 760px)').matches,
          )}
          fill="var(--land)"
          ref={landRef}
        />
      </svg>

      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <header className="site-header">
        <a aria-label="Danta Labs home" className="brand" href="#top">
          <svg aria-hidden="true" className="brand__mark" viewBox="0 0 40 40">
            <path d="M3 4h34v11c0 12-10 20-17 22C13 34 3 27 3 15V4Z" />
            <path d="M10 15c5-5 15-5 20 0-5 8-15 8-20 0Z" />
          </svg>
          <span>Danta Labs</span>
        </a>

        <nav aria-label="Page sections" className="route-nav">
          {routes.map(({ id, label }) => (
            <a
              aria-current={activeRoute === id ? 'location' : undefined}
              className={`route-link route-link--${id}${activeRoute === id ? ' is-active' : ''}`}
              href={`#${id}`}
              key={id}
            >
              <span className="route-link__chip" aria-hidden="true" />
              {label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main">
        <section
          aria-labelledby="project-title"
          className="project-section"
          data-map-stage
          id="project"
        >
          <div className="hero">
            <h1 id="project-title">
              Artifacts
              <br />
              of the Past
            </h1>
            <p className="hero__intro">
              A tabletop experience connecting physical play with the stories,
              discoveries, and legacy of space exploration equipment, created
              for the Abandoned and Not Forgotten challenge.
            </p>
            <div className="hero__actions">
              <a className="action-pill action-pill--primary" href="#play">
                See the gameplay preview
              </a>
              <a className="action-link" href="#team">
                Meet the team
              </a>
            </div>
            <div className="project-status">
              <span className="status-pill">In development</span>
              <span>NASA Space Apps Challenge 2026 · Costa Rica</span>
            </div>
          </div>

          <div className="project-story">
            <div className="project-story__lead">
              <h2>Space equipment has stories beyond its mission.</h2>
              <p>
                Danta Labs is creating a tabletop experience for young space
                enthusiasts to connect with the discoveries and continuing
                legacy of exploration equipment.
              </p>
            </div>

            <div className="project-story__detail">
              <p>
                The focus is scientific storytelling—not simply objects left
                behind. The experience explores stories from the Moon, Mars,
                and deep space.
              </p>
              <ul aria-label="Exploration settings" className="destination-list">
                <li className="destination destination--moon">Moon</li>
                <li className="destination destination--mars">Mars</li>
                <li className="destination destination--deep-space">Deep space</li>
              </ul>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="play-title"
          className="play-section"
          data-map-stage
          id="play"
        >
          <div className="section-heading">
            <h2 id="play-title">How to play</h2>
            <span className="status-pill status-pill--preview">
              Rules in development
            </span>
          </div>
          <div className="play-section__body">
            <p className="play-section__lead">
              The tabletop concept is taking shape, but the rules are not final
              yet.
            </p>
            <p>
              We’ll add the confirmed setup, play sequence, and goal when the
              team has decided them. For now, this is a preview of the project,
              not a set of instructions.
            </p>
          </div>
          <p className="play-section__note">
            What is confirmed: physical play will connect with stories about
            space exploration equipment and its scientific legacy.
          </p>
        </section>

        <section
          aria-labelledby="team-title"
          className="team-section"
          data-map-stage
          id="team"
        >
          <div className="team-section__intro">
            <h2 id="team-title">Meet Danta Labs</h2>
            <p>
              A six-member team from Costa Rica, building for the NASA Space
              Apps Challenge 2026.
            </p>
          </div>
          <ul className="team-list">
            <li>
              <span>Celeste</span>
              <span className="team-list__role">Team leader</span>
            </li>
            <li><span>Ericka</span></li>
            <li><span>Luis</span></li>
            <li><span>Ulises</span></li>
            <li><span>Pedro</span></li>
            <li><span>Sally</span></li>
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#top">
          <svg aria-hidden="true" className="brand__mark" viewBox="0 0 40 40">
            <path d="M3 4h34v11c0 12-10 20-17 22C13 34 3 27 3 15V4Z" />
            <path d="M10 15c5-5 15-5 20 0-5 8-15 8-20 0Z" />
          </svg>
          <span>Danta Labs</span>
        </a>
        <p>Artifacts of the Past · Project in progress</p>
        <a className="back-to-top" href="#top">
          Back to the start
        </a>
      </footer>
    </div>
  )
}

export default App
