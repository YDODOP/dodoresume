import { ArrowDown, ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { experiences, profile, projects, projectStats } from './content'
import './layout.css'
import SpecularButton from './SpecularButton'

const miniAppImages = ['miniapp-01.jpg', 'miniapp-02.jpg', 'miniapp-03.jpg', 'miniapp-04.jpg', 'miniapp-05.jpg', 'miniapp-06.jpg', 'miniapp-07.jpg'].map(file => `${import.meta.env.BASE_URL}images/${file}`)

const nav = [['简介', 'about'], ['项目', 'work'], ['实习', 'internship']]

function useSpecularEdges() {
  useEffect(() => {
    const selector = '.section-title, .intro-layout, .education-line, .compact-projects .project, .project-highlights, .project-stats, .internship-card, .internship-highlights > div, .carousel-photo, .miniapp-video'
    const targets = [...document.querySelectorAll(selector)]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!targets.length || reducedMotion) return undefined

    let frame = 0
    let pointerX = -1000
    let pointerY = -1000
    const render = () => {
      frame = 0
      targets.forEach(target => {
        const rect = target.getBoundingClientRect()
        const dx = Math.max(rect.left - pointerX, 0, pointerX - rect.right)
        const dy = Math.max(rect.top - pointerY, 0, pointerY - rect.bottom)
        const distance = Math.hypot(dx, dy)
        const proximity = Math.max(0, 1 - distance / 240)
        const eased = proximity * proximity * (3 - 2 * proximity)
        target.style.setProperty('--edge-x', `${pointerX - rect.left}px`)
        target.style.setProperty('--edge-y', `${pointerY - rect.top}px`)
        target.style.setProperty('--edge-alpha', `${0.2 + eased * 0.8}`)
      })
    }
    const onPointerMove = event => {
      pointerX = event.clientX
      pointerY = event.clientY
      if (!frame) frame = window.requestAnimationFrame(render)
    }
    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onPointerMove)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [])
}

function Header() {
  const [activeSection, setActiveSection] = useState('about')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const sections = nav.map(([, id]) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) setActiveSection(visible[0].target.id)
    }, { rootMargin: '-58px 0px -55% 0px', threshold: [0, .2, .5] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email)
    } catch {
      const input = document.createElement('textarea')
      input.value = profile.email
      input.style.position = 'fixed'
      input.style.opacity = '0'
      document.body.appendChild(input)
      input.select()
      document.execCommand('copy')
      input.remove()
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return <><header className="header fixed-header">
    <a className="logo" href="#top" aria-label="回到首页"><b>Young</b></a>
    <nav className="nav fixed-nav">
      {nav.map(([label, id]) => <a className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'page' : undefined} key={id} href={`#${id}`}>{label}</a>)}
    </nav>
    <span className="desktop-view-note">电脑端浏览体验更佳</span>
    <SpecularButton className="nav-contact" onClick={copyEmail} data-email={profile.email} aria-label={`复制邮箱：${profile.email}`} radius={999} tint="#d41432" tintOpacity={0.86} blur={14} lineColor="#ffffff" baseColor="#7428a8" intensity={1.45} shineSize={12} shineFade={42} thickness={1.2} proximity={220}><span className="nav-contact-text">联系我</span><ArrowUpRight size={17}/></SpecularButton>
  </header><div className={`copy-toast ${copied ? 'visible' : ''}`} role="status" aria-live="polite">已复制邮箱</div></>
}

async function copyEmailValue(email) {
  try {
    await navigator.clipboard.writeText(email)
  } catch {
    const input = document.createElement('textarea')
    input.value = email
    input.style.position = 'fixed'
    input.style.opacity = '0'
    document.body.appendChild(input)
    input.select()
    document.execCommand('copy')
    input.remove()
  }
}

function CopyEmailLink({ email, children, className = '' }) {
  const [copied, setCopied] = useState(false)
  const handleClick = async event => {
    event.preventDefault()
    await copyEmailValue(email)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }
  return <a className={`${className}${copied ? ' copied' : ''}`} href={`mailto:${email}`} onClick={handleClick} title={copied ? '已复制邮箱' : '点击复制邮箱'}>{copied ? '已复制邮箱' : children}</a>
}

function HighlightedText({ text }) {
  const phrases = ['全新足球赛事 IP', '45 人的核心执行团队', '全链路标准化赛事 SOP', '“重庆大学校园足球生态”', '“Codex 辅助”', '“独立打通”', '“社团成员的日常维护成本与实际运营难度”']
  const pattern = new RegExp(`(${phrases.join('|')})`, 'g')
  return text.split(pattern).map((part, index) => phrases.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part)
}

function ProjectCarousel({ images, title }) {
  const [current, setCurrent] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const viewportRef = useRef(null)

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return undefined
    const updateCurrent = () => {
      const maxScroll = viewport.scrollWidth - viewport.clientWidth
      setScrollProgress(maxScroll > 0 ? (viewport.scrollLeft / maxScroll) * 100 : 0)
      const center = viewport.scrollLeft + viewport.clientWidth / 2
      const slides = [...viewport.querySelectorAll('.carousel-frame')]
      const nearest = slides.reduce((best, slide, index) => {
        const distance = Math.abs(slide.offsetLeft + slide.offsetWidth / 2 - center)
        return distance < best.distance ? { index, distance } : best
      }, { index: 0, distance: Infinity })
      setCurrent(nearest.index)
    }
    const centerFirstImage = () => {
      const first = viewport.querySelector('.carousel-frame')
      if (first) viewport.scrollLeft = first.offsetLeft - (viewport.clientWidth - first.offsetWidth) / 2
      updateCurrent()
    }
    viewport.addEventListener('scroll', updateCurrent, { passive: true })
    const imagesInTrack = [...viewport.querySelectorAll('img')]
    imagesInTrack.forEach(image => image.addEventListener('load', centerFirstImage, { once: true }))
    window.requestAnimationFrame(centerFirstImage)
    return () => {
      viewport.removeEventListener('scroll', updateCurrent)
      imagesInTrack.forEach(image => image.removeEventListener('load', centerFirstImage))
    }
  }, [images])

  const handleSliderChange = event => {
    const viewport = viewportRef.current
    if (!viewport) return
    const progress = Number(event.target.value)
    viewport.scrollLeft = (progress / 100) * (viewport.scrollWidth - viewport.clientWidth)
  }

  return <div className="project-carousel">
    <div className="carousel-gallery-head" aria-hidden="true">
      <span>PROJECT IMAGE ARCHIVE</span>
      <span>DRAG THE CONTROL BELOW</span>
    </div>
    <div className="carousel-viewport" ref={viewportRef} tabIndex="0" aria-label={`${title} 横向连续图片画廊`}>
      <span className="carousel-focus-line" aria-hidden="true"/>
      <div className="carousel-track">
        {images.map((image, index) => <figure className={`carousel-frame ${index === current ? 'is-current' : ''}`} key={image}>
          <div className="carousel-photo">
            <img src={image} alt={`${title} 项目图 ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async"/>
          </div>
          <figcaption>
            <span>FRAME</span>
            <strong>{String(index + 1).padStart(2, '0')}</strong>
          </figcaption>
        </figure>) }
      </div>
    </div>
    <div className="carousel-status">
      <label className="carousel-scrubber">
        <span className="sr-only">拖动查看项目照片</span>
        <input type="range" min="0" max="100" step="0.1" value={scrollProgress} onChange={handleSliderChange} aria-label="拖动查看项目照片" style={{'--progress': `${scrollProgress}%`}}/>
      </label>
      <p className="carousel-hint">拖动控制条浏览</p>
      <span className="carousel-count"><b>{String(current + 1).padStart(2, '0')}</b> / {String(images.length).padStart(2, '0')}</span>
    </div>
  </div>
}

function App() {
  useSpecularEdges()

  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .1 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const internships = experiences.filter(item => item.category === 'internship' || item.category === 'exchange')

  return <main id="top">
    <Header />
    <section className="hero compact-hero">
      <video className="hero-video" autoPlay muted loop playsInline preload="auto" aria-hidden="true" src={`${import.meta.env.BASE_URL}media/hero-bg.mp4`}/>
      <div className="hero-glass" aria-hidden="true"/>
      <div className="speed-lines"/><div className="comic-dots"/>
      <div className="hero-name" aria-hidden="true">杨东锫</div>
      <div className="hero-visual-stage">
      <div className="hero-copy">
        <p className="eyebrow"><span/> 个人作品集 · 2026</p>
        <h1>杨东锫</h1>
        <p>多个项目的负责人<br/>项目统筹 × 团队管理 × 运营实践</p>
      </div>
      <div className="hero-character">
        <div className="character-shadow"/>
        <img src={`${import.meta.env.BASE_URL}images/hero-young.webp`} alt="Young 的个人照片" width="1247" height="1038" fetchPriority="high" decoding="async"/>
      </div>
      </div>
      <div className="hero-resume-bar">
        <div><small>身份</small><strong>项目负责人 / 运营实习生</strong></div>
        <div><small>所在地</small><strong>重庆 / 佛山</strong></div>
        <div><small>当前状态</small><strong>实习中 · 接受创意合作</strong></div>
        <a className="round-link" href="#about" aria-label="继续浏览"><ArrowDown/></a>
      </div>
    </section>

    <section className="about section compact-section" id="about">
      <div className="section-title reveal"><span>01 / 简介</span><h2>带领团队把想法落地，<br/>在真实业务中积累经验。</h2></div>
      <div className="intro-layout reveal">
        <div><p className="intro-name">杨东锫 <small>Young</small></p><p className="intro-role">{profile.role}</p></div>
          <div><p className="intro">{profile.intro}</p><div className="details"><CopyEmailLink email={profile.email} className="email-copy"><Mail/> {profile.email}</CopyEmailLink><p><MapPin/> {profile.location}</p></div></div>
      </div>
      <div className="education-line reveal"><span>教育背景</span><strong>重庆大学 · 机器人工程本科</strong><p>2023.09 — 2027.09</p></div>
    </section>

    <section className="work section compact-section" id="work">
      <div className="section-title reveal"><span>02 / 项目</span><h2>用结果讲述项目，<br/>用画面补充细节。</h2></div>
      <div className="project-list compact-projects">{projects.map((project, projectIndex) => <article className={`project reveal ${projectIndex === 0 ? 'feature-project' : ''}`} key={project.title}>
        <div className="project-info">
          <span className="project-number" style={{color: project.color}}>{project.number}</span>
          <div><small>{project.type}</small><h3>{project.title}</h3><p><HighlightedText text={project.description}/></p></div>
        </div>
        {project.highlights && <div className="project-highlights">{project.highlights.map(([title, text]) => <div key={title}><h4>{title}</h4><p><HighlightedText text={text}/></p></div>)}</div>}
        {projectIndex === 0 ? <ProjectCarousel images={project.images} title={project.title}/> : projectIndex !== 1 && <div className="project-gallery">{project.images.map((image, index) => <img src={image} alt={`${project.title}项目图 ${index + 1}`} key={image} loading="lazy" decoding="async"/>)}</div>}
        {projectIndex === 1 && <div className="miniapp-archive"><div className="miniapp-video"><div className="miniapp-video-head"><span>05 / PRODUCT DEMO</span><b>交互演示片段</b><em>PLAY / PAUSE</em></div><div className="miniapp-video-stage"><video controls playsInline muted preload="metadata" src={`${import.meta.env.BASE_URL}media/miniapp-demo.mp4`} aria-label="足协赛事管理小程序交互演示"/></div><div className="miniapp-video-foot"><span>重庆大学学生足球协会 · 产品体验记录</span><span>WEB / MOBILE / 2025</span></div></div><div className="miniapp-archive-label"><span>06 / PRODUCT INTERFACE</span><strong>小程序产品界面档案</strong></div><ProjectCarousel images={miniAppImages} title="小程序产品界面"/></div>}
        {projectIndex === 0 && <div className="project-stats">{projectStats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>}
      </article>)}</div>
    </section>

    <section className="experience section compact-section" id="internship">
      <div className="section-title reveal"><span>03 / 实习</span><h2>深入真实业务现场，<br/>积累运营与数据实践经验。</h2></div>
      <div className="internship-list">{internships.map((internship, index) => <article className="internship-card reveal" key={`${internship.title}-${internship.period}`}>
        <div>{index === 0 && <span className="current-tag">重点经历</span>}<p>{internship.period}</p></div>
        <div><h3>{internship.title}</h3><strong>{internship.role}</strong><p>{internship.description}</p>{internship.highlights && <div className="internship-highlights">{internship.highlights.map(([title, text]) => <div key={title}><h4>{title}</h4><p>{text}</p></div>)}</div>}</div>
      </article>)}</div>
    </section>

    <footer className="contact compact-contact">
      <p>保持联系</p><h2>有合适的项目，<br/>欢迎和我聊聊。</h2>
      <CopyEmailLink email={profile.email} className="contact-email">{profile.email} <ArrowUpRight/></CopyEmailLink>
      <div className="footer-line"><span>© 2026 {profile.name}</span><span>个人作品集</span><a href="#top">返回顶部 ↑</a></div>
    </footer>
  </main>
}

export default App
