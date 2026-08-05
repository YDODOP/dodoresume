import { ArrowDown, ArrowUpRight, Mail, MapPin, Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { experiences, profile, projects, stats, strengths } from './content'

const nav = [['关于', 'about'], ['项目', 'work'], ['经历', 'experience'], ['优势', 'strengths']]

function Header() {
  const [open, setOpen] = useState(false)
  return <header className="header">
    <a className="logo" href="#top" aria-label="回到首页"><b>YD</b><span>AI DESIGN<br/>PORTFOLIO</span></a>
    <nav className={open ? 'nav open' : 'nav'}>
      {nav.map(([label, id]) => <a key={id} href={`#${id}`} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-contact" href={`mailto:${profile.email}`}>联系我 <ArrowUpRight size={17}/></a>
    </nav>
    <button className="menu" onClick={() => setOpen(!open)} aria-label={open ? '关闭菜单' : '打开菜单'}>{open ? <X/> : <Menu/>}</button>
  </header>
}

function App() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(e => e.isIntersecting && e.target.classList.add('visible')), { threshold: .12 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  return <main id="top">
    <section className="hero">
      <video className="hero-video" autoPlay muted loop playsInline poster="https://images.unsplash.com/photo-1633412802994-5c058f151b66?auto=format&fit=crop&w=2200&q=90">
        <source src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_25fps.mp4" type="video/mp4" />
      </video>
      <div className="hero-shade"/><Header />
      <div className="hero-content">
        <p className="eyebrow"><span/> YANG DONGMING · 2026</p>
        <h1>IDEAS WITH<br/><i>SUPER</i> POWERS.</h1>
        <div className="hero-bottom">
          <p>AI 驱动的视觉设计、系统思维<br/>与新叙事体验。</p>
          <a className="round-link" href="#work" aria-label="查看项目"><ArrowDown/></a>
        </div>
      </div>
      <div className="hero-tag">BASED IN CHINA <span>✦</span> OPEN TO WORK</div>
    </section>

    <section className="about section" id="about">
      <div className="section-head reveal"><span>01 / ABOUT</span><p>从机器人的严谨逻辑出发<br/>设计有冲击力的视觉体验</p></div>
      <div className="about-grid">
        <div className="portrait reveal"><img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=1100&q=90" alt="个人形象占位图"/><span>PORTRAIT<br/>TO BE UPDATED</span></div>
        <div className="about-copy reveal">
          <p className="kicker">HELLO, I'M</p><h2>{profile.name}</h2><h3>{profile.role}</h3>
          <p className="intro">{profile.intro}</p>
          <div className="details"><a href={`mailto:${profile.email}`}><Mail/> {profile.email}</a><p><MapPin/> {profile.location}</p></div>
        </div>
      </div>
      <div className="stats reveal">{stats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>
    </section>

    <section className="work section" id="work">
      <div className="section-head light reveal"><span>02 / SELECTED WORK</span><h2>PROJECTS THAT<br/>MAKE SOME <i>NOISE.</i></h2></div>
      <div className="project-list">{projects.map((p, index) => <article className="project reveal" key={p.title}>
        <div className="project-image"><img src={p.image} alt={p.title}/><span style={{background:p.color}}>{p.number}</span></div>
        <div className="project-meta"><div><small>{p.type}</small><h3>{p.title}</h3></div><p>{p.description}</p><button aria-label={`查看 ${p.title}`}><ArrowUpRight/></button></div>
      </article>)}</div>
    </section>

    <section className="experience section" id="experience">
      <div className="section-head reveal"><span>03 / EXPERIENCE</span><h2>THE STORY<br/>SO <i>FAR.</i></h2></div>
      <div className="timeline">{experiences.map(item => <article className="timeline-item reveal" key={item.title}>
        <p>{item.period}</p>
        <div><h3>{item.title}{item.current && <span>NOW</span>}</h3><strong>{item.role}</strong><p>{item.description}</p></div>
        <ArrowUpRight/>
      </article>)}</div>
    </section>

    <section className="strengths section" id="strengths">
      <div className="section-head reveal"><span>04 / WHY ME</span><h2>CREATIVE<br/>BY <i>DESIGN.</i></h2></div>
      <div className="strength-grid">{strengths.map(([n, title, body]) => <article className="strength-card reveal" key={n}><span>{n}</span><h3>{title}</h3><p>{body}</p><ArrowUpRight/></article>)}</div>
    </section>

    <footer className="contact" id="contact">
      <div className="contact-burst">LET'S<br/><i>TALK!</i></div>
      <p className="eyebrow"><span/> AVAILABLE FOR CREATIVE COLLABORATION</p>
      <h2>HAVE A BOLD IDEA?<br/>LET'S MAKE IT <i>REAL.</i></h2>
      <a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight/></a>
      <div className="footer-line"><span>© 2026 {profile.name}</span><span>AI DESIGNER · PORTFOLIO</span><a href="#top">BACK TO TOP ↑</a></div>
    </footer>
  </main>
}

export default App
