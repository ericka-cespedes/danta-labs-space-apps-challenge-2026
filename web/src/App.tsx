import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router'
import './App.css'

type RouteId = 'project' | 'play' | 'team'

const sectionRoutes: { id: RouteId; label: string }[] = [
  { id: 'project', label: 'The Project' },
  { id: 'play', label: 'Gameplay Preview' },
  { id: 'team', label: 'The Team' },
]

const pages = [
  { path: '/', label: 'Home' },
  { path: '/game', label: 'How to Play' },
  { path: '/artifacts', label: 'Artifacts' },
  { path: '/about', label: 'About Us' },
  { path: '/contact', label: 'Contact' },
]

const team: {
  name: string
  role?: string
  work?: string | null
  education?: { degree?: string; major: string; university: string; inProgress?: boolean }[]
  interests?: string
  linkedin?: string | null
  github?: string
}[] = [
  {
    name: 'Celeste Alpizar',
    role: 'Team Leader',
    work: 'QA Engineer',
    education: [{ major: 'Quality Engineering', university: 'Hispanoamerican University', inProgress: true }],
    interests: 'Dogs, arts & crafts, anime',
    linkedin: null,
  },
  {
    name: 'Ericka Cespedes',
    work: 'Cloud Platform Engineer II at Procter & Gamble',
    education: [{ degree: 'BSc', major: 'Computer Engineering', university: 'Costa Rica Institute of Technology' }],
    interests: 'Data & AI, tennis, languages',
    linkedin: 'https://www.linkedin.com/in/ericka-cespedes-17b30620a/',
    github: 'https://github.com/ericka-cespedes',
  },
  {
    name: 'Jorge Sobalvarro',
    work: 'Product Owner',
    education: [{ major: 'Industrial Engineering', university: 'Fidelitas University', inProgress: true }],
    interests: 'Board games, video games, fencing',
    linkedin: null,
  },
  {
    name: 'Luis Chaverri',
    work: 'Professor',
    education: [
      { degree: 'BSc', major: 'Teaching of Mathematics with Technological Environments', university: 'Costa Rica Institute of Technology' },
      { degree: 'MSc', major: 'Computer Engineering', university: 'University of Costa Rica', inProgress: true },
    ],
    interests: 'Board games, video games, cats',
    linkedin: null,
  },
  {
    name: 'Pedro Santana',
    work: 'Structural Engineer at Dean Tropical Metalico',
    education: [{ degree: 'Licenciatura', major: 'Civil Engineering', university: 'University of Costa Rica' }],
    interests: 'Video games, music, literature',
    linkedin: null,
    github: 'https://github.com/spiternasz',
  },
  {
    name: 'Sally Sanchez',
    work: null,
    education: [{ major: 'Quality Engineering', university: 'Hispanoamerican University', inProgress: true }],
    interests: 'Music, cooking, nature',
    linkedin: null,
  },
]

function useActiveRoute() {
  const [activeRoute, setActiveRoute] = useState<RouteId>('project')

  useEffect(() => {
    const sections = sectionRoutes
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
      setActiveRoute(sectionRoutes[closestIndex].id)
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

function useNebulaParallax(pathname: string) {
  useEffect(() => {
    const root = document.documentElement
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const clearPosition = () => {
      root.style.removeProperty('--nebula-parallax-y')
      root.style.removeProperty('--nebula-parallax-rotation')
    }

    const updatePosition = () => {
      animationFrame = 0

      if (reducedMotion.matches) {
        clearPosition()
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
      root.style.setProperty('--nebula-parallax-rotation', `${progress * 4}deg`)
    }

    const schedulePositionUpdate = () => {
      if (reducedMotion.matches) {
        clearPosition()
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
      clearPosition()
    }
  }, [pathname])
}

function HomePage() {
  const activeRoute = useActiveRoute()

  return (
    <>
      <nav aria-label="Home Sections" className="route-nav section-nav">
        {sectionRoutes.map(({ id, label }) => (
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
          {team.map(({ name, role }) => (
            <li key={name}>
              <span>{name}</span>
              {role && <span className="team-list__role">{role}</span>}
            </li>
          ))}
        </ul>
      </section>
    </>
  )
}

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-intro" aria-labelledby="about-title">
        <h1 id="about-title">Meet Danta Labs</h1>
        <div className="about-intro__copy">
          <p>
            We’re a team from Costa Rica. Our name comes from the danta, or
            tapir, an animal native to Costa Rica that reflects our connection
            to nature, science, space exploration, and creativity.
          </p>
          <p>
            We love tabletop games, so for the NASA Space Apps Challenge 2026
            we chose to create Artifacts of the Past: an engaging,
            story-driven educational experience for school-age and casual
            space enthusiasts, exploring the stories of space exploration
            hardware on the Moon, Mars, and beyond.
          </p>
        </div>
      </section>

      <section className="about-team" aria-labelledby="about-team-title">
        <div className="about-team__heading">
          <h2 id="about-team-title">The People Behind the Project</h2>
          <p>Meet the team behind Artifacts of the Past.</p>
        </div>
        <ul className="about-team__list">
          {team.map(({ name, role, work, education, interests, linkedin, github }) => (
            <li className="about-member" key={name}>
              <div className="about-member__name">
                <h3>{name}</h3>
                {role && <span className="team-list__role">{role}</span>}
              </div>
              <dl className={`about-member__details${work === null ? ' about-member__details--no-work' : ''}`}>
                {[
                  ...(work === null ? [] : [{ label: 'Work', value: work }]),
                  {
                    label: 'Education',
                    value: education?.map(({ degree, major, university, inProgress }) => (
                      <span className="about-member__education" key={`${major}-${university}`}>
                        <strong>{degree ? `${degree} · ${major}` : major}</strong>
                        {inProgress && ' (in progress)'}
                        <span className="about-member__university">{university}</span>
                      </span>
                    )),
                  },
                  { label: 'Interests', value: interests },
                  ...(linkedin || github ? [{
                    label: 'Links',
                    value: (
                      <span className="about-member__links">
                        {linkedin && <a href={linkedin}>LinkedIn</a>}
                        {github && <a href={github}>GitHub</a>}
                      </span>
                    ),
                  }] : linkedin === undefined ? [{ label: 'LinkedIn', value: undefined }] : []),
                ].map(({ label, value }) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value ?? 'To be added'}</dd>
                  </div>
                ))}
              </dl>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function PendingPage({ title }: { title: string }) {
  return (
    <section className="pending-page" aria-labelledby="page-title">
      <h1 id="page-title">{title}</h1>
      <p>This page is in development.</p>
      <Link className="action-link" to="/">Return to the Home Page</Link>
    </section>
  )
}

function App() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const previousPath = useRef(pathname)
  useNebulaParallax(pathname)

  useEffect(() => {
    const page = pages.find(({ path }) => path === pathname)
    document.title = page && pathname !== '/'
      ? `${page.label} | Danta Labs`
      : pathname === '/'
        ? 'Danta Labs — Artifacts of the Past'
        : 'Page Not Found | Danta Labs'

    if (previousPath.current !== pathname && !window.location.hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('main')?.focus({ preventScroll: true })
    }
    previousPath.current = pathname
  }, [pathname])

  const returnHome = () => {
    if (isHome) window.scrollTo({ top: 0, behavior: 'auto' })
  }

  return (
    <div className="site-shell" id="top">
      <div aria-hidden="true" className="nebula-backdrop" />
      <a className="skip-link" href="#main">
        Skip to Content
      </a>

      <header className="site-header">
        <Link aria-label="Danta Labs home" className="brand" onClick={returnHome} to="/">
          <img
            alt=""
            className="brand__mark"
            src={`${import.meta.env.BASE_URL}favicon-64.png?v=2`}
          />
          <span>Danta Labs</span>
        </Link>

        <nav aria-label="Main Navigation" className="route-nav page-nav">
          {pages.map(({ path, label }) => (
            <NavLink
              className={({ isActive }) => `route-link${isActive ? ' is-active' : ''}`}
              end={path === '/'}
              key={path}
              onClick={path === '/' ? returnHome : undefined}
              to={path}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className={isHome ? 'home-page' : undefined} id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<PendingPage title="How to Play" />} />
          <Route path="/artifacts" element={<PendingPage title="Artifacts" />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<PendingPage title="Contact" />} />
          <Route path="*" element={<PendingPage title="Page Not Found" />} />
        </Routes>
      </main>

      <footer className="site-footer">
        <Link className="brand brand--footer" onClick={returnHome} to="/">
          <img
            alt=""
            className="brand__mark"
            src={`${import.meta.env.BASE_URL}favicon-64.png?v=2`}
          />
          <span>Danta Labs</span>
        </Link>
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
