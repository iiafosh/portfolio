import { Fragment } from "react"

import { cv, type CvBullet } from "@/content/cv"

// The CV sheet, in the style Mostafa picked (index.html + style.css):
// Roboto, centered header, #0369a1 accent, ruled uppercase sections,
// date-right entries. Styles live under `.cv` in globals.css.

const ICONS: Record<string, React.ReactNode> = {
  linkedin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  github: (
    <svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  web: (
    <svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
    </svg>
  ),
  mail: (
    <svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  pin: (
    <svg xmlns="http://www.w3.org/2000/svg" width="9.5" height="9.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
}

function BulletLine({ item }: { item: CvBullet }) {
  return (
    <li>
      <strong>{item.lead}</strong>
      {item.link ? (
        <>
          {item.lead.endsWith(",") ? " " : " — "}
          <a href={item.link.href}>{item.link.label}</a>
        </>
      ) : null}
      {item.text}
      {item.date ? (
        <>
          {" "}
          <span className="date-inline">{item.date}</span>
        </>
      ) : null}
    </li>
  )
}

export function CvDocument({ id }: { id?: string }) {
  return (
    <article className="cv" id={id} aria-label={`${cv.name} — curriculum vitae`}>
      <header className="cv-header">
        <h1>{cv.name}</h1>
        <div className="headline">{cv.headline}</div>
        <div className="contact-row">
          {cv.contact.map((c, i) => (
            <Fragment key={c.label}>
              {i > 0 ? <span className="sep">|</span> : null}
              {"href" in c && c.href ? (
                <a href={c.href} className="contact-link">
                  {ICONS[c.kind]}
                  {c.label}
                </a>
              ) : (
                <span className="contact-link">
                  {ICONS[c.kind]}
                  {c.label}
                </span>
              )}
            </Fragment>
          ))}
        </div>
      </header>

      <section className="section">
        <h2>Education</h2>
        {cv.education.map((e) => (
          <div className="entry" key={e.title}>
            <div className="row-between">
              <strong>{e.title}</strong>
              <span className="date">{e.date}</span>
            </div>
            {e.sub ? <div className="sub">{e.sub}</div> : null}
          </div>
        ))}
      </section>

      <section className="section">
        <h2>Awards &amp; Competitions</h2>
        <ul className="bullets">
          {cv.awards.map((a) => (
            <BulletLine key={a.lead + a.date} item={a} />
          ))}
        </ul>
      </section>

      <section className="section">
        <h2>Featured Projects</h2>
        {cv.projects.map((p) => (
          <div className="entry" key={p.title}>
            <div className="row-between">
              <strong>
                {p.link ? <a href={p.link.href}>{p.link.label}</a> : null}
                {p.link ? " — " : null}
                {p.title}
              </strong>
              <span className="date">{p.date}</span>
            </div>
            {p.bullets ? (
              <ul className="bullets">
                {p.bullets.map((b) => (
                  <li key={b.slice(0, 40)}>{b}</li>
                ))}
              </ul>
            ) : null}
          </div>
        ))}
      </section>

      <section className="section">
        <h2>Technical Skills</h2>
        <div className="skills-list">
          {cv.skills.map((s) => (
            <p key={s.label}>
              <strong>{s.label}:</strong> {s.items}
            </p>
          ))}
        </div>
      </section>

      <section className="section">
        <h2>Leadership &amp; Community</h2>
        <ul className="bullets">
          {cv.community.map((c) => (
            <BulletLine key={c.lead} item={c} />
          ))}
        </ul>
      </section>
    </article>
  )
}
