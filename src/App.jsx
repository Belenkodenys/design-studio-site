import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
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
import AdminLogin from './admin/AdminLogin'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import PostList from './admin/PostList'
import PostEditor from './admin/PostEditor'
import SEO from './components/SEO'
import './App.css'

function HomePage() {
  return (
    <>
      <SEO
        title="Belenko Design Studio — Restaurant & Bar Interior Design"
        description="Award-winning interior design studio specializing in restaurants, bars, cafes and hospitality spaces. 30+ projects in Ukraine, Turkey, Spain, Azerbaijan. Transform your space with Belenko."
        url="/"
      />
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
    <HelmetProvider>
      <LanguageProvider>
        <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<AllProjects />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/career" element={<CareerPage />} />
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="posts" element={<PostList />} />
              <Route path="posts/:id" element={<PostEditor />} />
            </Route>
          </Routes>
          <SocialFloat />
        </div>
        </BrowserRouter>
      </LanguageProvider>
    </HelmetProvider>
  )
}

export default App
