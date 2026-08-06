import { ArrowDown, ArrowUpRight, Mail, MapPin } from 'lucide-react'
import { useEffect, useState } from 'react'
import { experiences, profile, projects, projectStats } from './content'
import './layout.css'

const nav = [['简介', 'about'], ['项目', 'work'], ['实习', 'internship']]

function Header() {
  const [activeSection, setActiveSection] = useState('about')

  useEffect(() => {
    const sections = nav.map(([, id]) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
      if (visible[0]) setActiveSection(visible[0].target.id)
    }, { rootMargin: '-58px 0px -55% 0px', threshold: [0, .2, .5] })
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  return <header className="header fixed-header">
    <a className="logo" href="#top" aria-label="回到首页"><b>Young</b></a>
    <nav className="nav fixed-nav">
      {nav.map(([label, id]) => <a className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'page' : undefined} key={id} href={`#${id}`}>{label}</a>)}
    </nav>
    <a className="nav-contact" href={`mailto:${profile.email}`}>联系我 <ArrowUpRight size={17}/></a>
  </header>
}

function HighlightedText({ text }) {
  const phrases = ['全新足球赛事 IP', '45 人的核心执行团队', '全链路标准化赛事 SOP']
  const pattern = new RegExp(`(${phrases.join('|')})`, 'g')
  return text.split(pattern).map((part, index) => phrases.includes(part) ? <strong key={`${part}-${index}`}>{part}</strong> : part)
}

function App() {
  useEffect(() => {
    const nodes = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(entries => entries.forEach(entry => entry.isIntersecting && entry.target.classList.add('visible')), { threshold: .1 })
    nodes.forEach(node => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const internship = experiences.find(item => item.current)

  return <main id="top">
    <Header />
    <section className="hero compact-hero">
      <div className="speed-lines"/><div className="comic-dots"/>
      <div className="hero-name" aria-hidden="true">杨东锫</div>
      <div className="hero-copy">
        <p className="eyebrow"><span/> 个人作品集 · 2026</p>
        <h1>杨东锫</h1>
        <p>多个项目的负责人<br/>项目统筹 × 团队管理 × 运营实践</p>
      </div>
      <div className="hero-character">
        <div className="character-shadow"/>
        <img src="https://images.unsplash.com/photo-1523398002811-999ca8dec234?auto=format&fit=crop&w=1100&q=90" alt="头版人物占位图"/>
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
        <div><p className="intro">{profile.intro}</p><div className="details"><a href={`mailto:${profile.email}`}><Mail/> {profile.email}</a><p><MapPin/> {profile.location}</p></div></div>
      </div>
      <div className="education-line reveal"><span>教育背景</span><strong>重庆大学 · 机器人工程本科</strong><p>2023.09 — 2027.09</p></div>
    </section>

    <section className="work section compact-section" id="work">
      <div className="section-title reveal"><span>02 / 项目</span><h2>用结果讲述项目，<br/>用画面补充细节。</h2></div>
      <div className="project-list compact-projects">{projects.map((project, projectIndex) => <article className={`project reveal ${projectIndex === 0 ? 'feature-project' : ''}`} key={project.title}>
        <div className="project-info">
          <span className="project-number" style={{color: project.color}}>{project.number}</span>
          <div><small>{project.type}</small><h3>{project.title}</h3><p>{project.description}</p></div>
        </div>
        {project.highlights && <div className="project-highlights">{project.highlights.map(([title, text]) => <div key={title}><h4>{title}</h4><p><HighlightedText text={text}/></p></div>)}</div>}
        <div className="project-gallery">{project.images.map((image, index) => <img src={image} alt={`${project.title}项目图 ${index + 1}`} key={image}/>)}</div>
        {projectIndex === 0 && <div className="project-stats">{projectStats.map(([value, label]) => <div key={label}><strong>{value}</strong><span>{label}</span></div>)}</div>}
      </article>)}</div>
    </section>

    <section className="experience section compact-section" id="internship">
      <div className="section-title reveal"><span>03 / 实习</span><h2>深入真实业务现场，<br/>积累运营与数据实践经验。</h2></div>
      {internship && <article className="internship-card reveal">
        <div><span className="current-tag">当前实习</span><p>{internship.period}</p></div>
        <div><h3>{internship.title}</h3><strong>{internship.role}</strong><p>{internship.description}</p></div>
      </article>}
    </section>

    <footer className="contact compact-contact">
      <p>保持联系</p><h2>有合适的项目，<br/>欢迎和我聊聊。</h2>
      <a href={`mailto:${profile.email}`}>{profile.email} <ArrowUpRight/></a>
      <div className="footer-line"><span>© 2026 {profile.name}</span><span>个人作品集</span><a href="#top">返回顶部 ↑</a></div>
    </footer>
  </main>
}

export default App
