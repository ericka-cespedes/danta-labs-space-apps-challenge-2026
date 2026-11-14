import { useEffect, useState } from 'react'
import './App.css'

type RouteId = 'project' | 'play' | 'team'

const routes: { id: RouteId; label: string }[] = [
  { id: 'project', label: 'The Project' },
  { id: 'play', label: 'Gameplay Preview' },
  { id: 'team', label: 'The Team' },
]

function useActiveRoute() {
  const [activeRoute, setActiveRoute] = useState<RouteId>('project')

  useEffect(() => {
    const sections = routes
      .map(({ id }) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null)
    let animationFrame = 0
    let activeIndex = -1

    const updateActiveRoute = () => {
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

      if (closestIndex === activeIndex) return

      activeIndex = closestIndex
      setActiveRoute(routes[closestIndex].id)
    }

    const scheduleMapUpdate = () => {
      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updateActiveRoute)
      }
    }

    window.addEventListener('scroll', scheduleMapUpdate, { passive: true })
    window.addEventListener('resize', scheduleMapUpdate)
    scheduleMapUpdate()

    return () => {
      window.removeEventListener('scroll', scheduleMapUpdate)
      window.removeEventListener('resize', scheduleMapUpdate)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return activeRoute
}

function useNebulaParallax() {
  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const updatePosition = () => {
      animationFrame = 0

      if (reducedMotion.matches) {
        root.style.removeProperty('--nebula-parallax-y')
        return
      }

      const scrollRange = document.documentElement.scrollHeight - window.innerHeight
      const progress =
        scrollRange > 0
          ? Math.min(Math.max(window.scrollY / scrollRange, 0), 1)
          : 0
      const maxOffset = Math.min(window.innerHeight * 0.12, 144)

      root.style.setProperty(
        '--nebula-parallax-y',
        `${-Math.round(maxOffset * progress)}px`,
      )
    }

    const schedulePositionUpdate = () => {
      if (reducedMotion.matches) {
        root.style.removeProperty('--nebula-parallax-y')
        return
      }

      if (animationFrame === 0) {
        animationFrame = window.requestAnimationFrame(updatePosition)
      }
    }

    window.addEventListener('scroll', schedulePositionUpdate, { passive: true })
    window.addEventListener('resize', schedulePositionUpdate)
    reducedMotion.addEventListener('change', schedulePositionUpdate)
    schedulePositionUpdate()

    return () => {
      window.removeEventListener('scroll', schedulePositionUpdate)
      window.removeEventListener('resize', schedulePositionUpdate)
      reducedMotion.removeEventListener('change', schedulePositionUpdate)
      window.cancelAnimationFrame(animationFrame)
      root.style.removeProperty('--nebula-parallax-y')
    }
  }, [])
}

function App() {
  const activeRoute = useActiveRoute()
  useNebulaParallax()

  return (
    <div className="site-shell" id="top">
      <div aria-hidden="true" className="nebula-backdrop" />
      <a className="skip-link" href="#main">
        Skip to Content
      </a>

      <header className="site-header">
        <a aria-label="Danta Labs home" className="brand" href="#top">
          <img
            alt=""
            className="brand__mark"
            src={`${import.meta.env.BASE_URL}favicon-64.png?v=2`}
          />
          <span>Danta Labs</span>
        </a>

        <nav aria-label="Page Sections" className="route-nav">
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
                See the Gameplay Preview
              </a>
              <a className="action-link" href="#team">
                Meet the Team
              </a>
            </div>
          </div>

          <div className="project-story">
            <div className="project-story__lead">
              <h2>Space Equipment Has Stories Beyond Its Mission.</h2>
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
              <ul aria-label="Exploration Settings" className="destination-list">
                <li className="destination destination--moon">Moon</li>
                <li className="destination destination--mars">Mars</li>
                <li className="destination destination--deep-space">Deep Space</li>
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
            <h2 id="play-title">How to Play</h2>
            <span className="status-pill status-pill--preview">
              Rules in Development
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
              <span>Celeste Alpizar</span>
              <span className="team-list__role">Team Leader</span>
            </li>
            <li><span>Ericka Cespedes</span></li>
            <li><span>Jorge Sobalvarro</span></li>
            <li><span>Luis Chaverri</span></li>
            <li><span>Pedro Santana</span></li>
            <li><span>Sally Sanchez</span></li>
          </ul>
        </section>
      </main>

      <footer className="site-footer">
        <a className="brand brand--footer" href="#top">
          <img
            alt=""
            className="brand__mark"
            src={`${import.meta.env.BASE_URL}favicon-64.png?v=2`}
          />
          <span>Danta Labs</span>
        </a>
        <p>Artifacts of the Past · Project in Progress</p>
        <a className="back-to-top" href="#top">
          Back to the Start
        </a>
        <p className="image-credit">
          Orion Nebula image:{' '}
          <a href="https://science.nasa.gov/image-detail/orion-nebula-xlarge_web/">
            NASA, ESA, M. Robberto (Space Telescope Science Institute/ESA), and
            the Hubble Space Telescope Orion Treasury Project Team
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
