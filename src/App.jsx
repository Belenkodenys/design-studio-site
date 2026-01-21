import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './i18n/LanguageContext'
import Header from './components/Header'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Portfolio from './components/Portfolio'
import CTA from './components/CTA'
import Contact from './components/Contact'
import Footer from './components/Footer'
import SocialFloat from './components/SocialFloat'
import ProjectDetail from './pages/ProjectDetail'
import AllProjects from './pages/AllProjects'
import BlogPage from './pages/BlogPage'
import CareerPage from './pages/CareerPage'
import './App.css'

function HomePage() {
  return (
    <>
      <Header />
      <Hero />
      <div className="section-divider" />
      <About />
      <div className="section-divider" />
      <Services />
      <div className="section-divider" />
      <Portfolio />
      <div className="section-divider" />
      <CTA />
      <div className="section-divider" />
      <Contact />
      <div className="section-divider" />
      <Footer />
    </>
  )
}

function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/career" element={<CareerPage />} />
          </Routes>
          <SocialFloat />
        </div>
      </BrowserRouter>
    </LanguageProvider>
  )
}

export default App
