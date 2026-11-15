import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, Route, Routes, useLocation } from 'react-router'
import artifactPlaceholder from './assets/artifact-placeholder.svg'
import './App.css'

type RouteId = 'project' | 'play' | 'team'

const exampleArtifactPath = '/artifacts/apollo-11-lunar-module'

const artifactCategories = ['All', 'Moon', 'Mars', 'Deep Space']
type Artifact = {
  id: string
  name: string
  category: string
  label: string
  path?: string
  image: string
  story: string
  reference: string
}

const artifacts: Artifact[] = [
  {
    id: 'apollo-11-lunar-module',
    name: 'Apollo 11 Lunar Module',
    category: 'Moon',
    label: 'Example entry',
    path: exampleArtifactPath,
    image: artifactPlaceholder,
    story: 'Placeholder text. The team will add the artifact’s story after the content is approved.',
    reference: 'Source to be provided by the team.',
  },
  ...Array.from({ length: 41 }, (_, index) => {
    const category = index < 13 ? 'Moon' : index < 27 ? 'Mars' : 'Deep Space'
    const number = index < 13 ? index + 1 : index < 27 ? index - 12 : index - 26

    return {
      id: `placeholder-${index + 1}`,
      name: `${category} placeholder ${String(number).padStart(2, '0')}`,
      category,
      label: 'Placeholder entry',
      image: artifactPlaceholder,
      story: 'Placeholder text. The team will add the artifact’s story after the content is approved.',
      reference: 'Source to be provided by the team.',
    }
  }),
]

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

function ArtifactImage({ src = artifactPlaceholder }: { src?: string }) {
  return (
    <figure className="artifact-image">
      <img alt="" src={src} />
      <figcaption>Placeholder image · Not a historical photograph</figcaption>
    </figure>
  )
}

function ArtifactsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [selectedId, setSelectedId] = useState('apollo-11-lunar-module')
  const search = query.trim().toLocaleLowerCase()
  const matchingArtifacts = artifacts.filter((artifact) =>
    (category === 'All' || artifact.category === category) &&
    artifact.name.toLocaleLowerCase().includes(search),
  )
  const selectedArtifact = matchingArtifacts.find((artifact) => artifact.id === selectedId)
    ?? matchingArtifacts[0]

  return (
    <section className="artifacts-page artifacts-browser" aria-labelledby="page-title">
      <div className="artifacts-page__intro">
        <h1 id="page-title">Artifact Encyclopedia</h1>
        <p>
          Explore the stories behind space exploration equipment. The artifact
          collection and its sources are still being prepared.
        </p>
        <p className="artifact-preview-note">The list includes placeholder entries to preview the collection.</p>
        <span className="status-pill">Preview · Content in Development</span>
      </div>
      <section className="artifact-collection" aria-label="Artifact collection">
        <div className="artifact-browser__layout">
          <div className="artifact-browser__sidebar">
            <div className="artifact-filters">
              <div>
                <label htmlFor="artifact-search">Search artifacts</label>
                <input
                  id="artifact-search"
                  type="search"
                  placeholder="Search by name"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="artifact-category">Category</label>
                <select
                  id="artifact-category"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  {artifactCategories.map((option) => (
                    <option key={option} value={option}>{option === 'All' ? 'All Categories' : option}</option>
                  ))}
                </select>
              </div>
            </div>
            <p className="artifact-results" role="status">
              {matchingArtifacts.length} {matchingArtifacts.length === 1 ? 'preview entry' : 'preview entries'} found
            </p>
            {matchingArtifacts.length > 0 ? (
              <ul className="artifact-list" aria-label="Matching artifacts">
                {matchingArtifacts.map((artifact) => (
                  <li key={artifact.id}>
                    <button
                      type="button"
                      className="artifact-list__item"
                      aria-pressed={selectedArtifact?.id === artifact.id}
                      onClick={() => setSelectedId(artifact.id)}
                    >
                      <span>{artifact.name}</span>
                      <span>{artifact.category} · {artifact.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="artifact-empty">No preview entries match your search and category. Try a different search or category.</p>
            )}
          </div>
          {selectedArtifact ? (
            <article className="artifact-showcase" aria-labelledby="selected-artifact-title">
              <ArtifactImage src={selectedArtifact.image} />
              <div className="artifact-showcase__content">
                <h2 id="selected-artifact-title">{selectedArtifact.name}</h2>
                <p className="artifact-showcase__meta">{selectedArtifact.category} · {selectedArtifact.label} · Not yet approved</p>
                <p>This is a design preview. Its image, description, and reference are placeholders.</p>
                <section aria-labelledby="selected-artifact-story">
                  <h3 id="selected-artifact-story">The Story</h3>
                  <p>{selectedArtifact.story}</p>
                </section>
                <section aria-labelledby="selected-artifact-reference">
                  <h3 id="selected-artifact-reference">Reference</h3>
                  <p>{selectedArtifact.reference}</p>
                </section>
                {selectedArtifact.path && (
                  <Link className="artifact-showcase__link" to={selectedArtifact.path}>Open direct page <span aria-hidden="true">→</span></Link>
                )}
              </div>
            </article>
          ) : (
            <div className="artifact-showcase artifact-showcase--empty">
              <p>Choose a preview entry to see its image, story, and reference here.</p>
            </div>
          )}
        </div>
      </section>
    </section>
  )
}

function ExampleArtifactPage() {
  return (
    <article className="artifacts-page artifact-detail" aria-labelledby="page-title">
      <Link className="action-link" to="/artifacts">Back to the Artifact Encyclopedia</Link>
      <div className="artifact-detail__layout">
        <ArtifactImage />
        <div className="artifact-detail__content">
          <div className="artifact-detail__heading">
            <h1 id="page-title">Apollo 11 Lunar Module</h1>
            <p className="artifact-eyebrow">Moon · Example entry · Not yet approved</p>
            <p>This page is a design preview. Its image, description, and reference are placeholders.</p>
          </div>
          <section aria-labelledby="artifact-story">
            <h2 id="artifact-story">The Story</h2>
            <p>Placeholder text. The team will add the artifact’s story after the content is approved.</p>
          </section>
          <section aria-labelledby="artifact-reference">
            <h2 id="artifact-reference">Reference</h2>
            <p>Source to be provided by the team.</p>
          </section>
        </div>
      </div>
    </article>
  )
}

function ContactPage() {
  return (
    <section className="contact-page" aria-labelledby="page-title">
      <div className="contact-page__intro">
        <h1 id="page-title">Contact Danta Labs</h1>
        <p>Have a question about Artifacts of the Past? Our contact form is still in development.</p>
        <p className="contact-page__notice" role="status">
          We are not accepting submissions yet. Please check back later.
        </p>
        <p className="contact-page__placeholder">
          Recipient placeholder: contact@example.com (not an active contact address)
        </p>
      </div>
      <form className="contact-form" aria-label="Contact form preview">
        <fieldset disabled aria-describedby="contact-form-note">
          <legend>Message the Team</legend>
          <p id="contact-form-note">The form will be available once message delivery is set up.</p>
          <label htmlFor="contact-name">Name</label>
          <input id="contact-name" name="name" autoComplete="name" required />
          <label htmlFor="contact-email">Email</label>
          <input id="contact-email" name="email" type="email" autoComplete="email" required />
          <label htmlFor="contact-message">Message</label>
          <textarea id="contact-message" name="message" rows={6} required />
          <button className="action-pill action-pill--primary" type="submit">Send Message</button>
        </fieldset>
      </form>
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
    document.title = pathname === exampleArtifactPath
      ? 'Apollo 11 Lunar Module Preview | Danta Labs'
      : page && pathname !== '/'
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
          <Route path="/artifacts" element={<ArtifactsPage />} />
          <Route path={exampleArtifactPath} element={<ExampleArtifactPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
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
