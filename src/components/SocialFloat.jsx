import './SocialFloat.css'

function SocialFloat() {
  return (
    <a
      href="https://wa.me/34671825489"
      target="_blank"
      rel="noopener noreferrer"
      className="social-float-simple"
      aria-label="Chat on WhatsApp"
    >
      <span className="social-float-label">CHAT</span>
      <div className="social-float-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M21 11.5C21 16.75 16.75 21 11.5 21C9.63 21 7.89 20.47 6.4 19.56L2 21L3.44 16.6C2.53 15.11 2 13.37 2 11.5C2 6.25 6.25 2 11.5 2C16.75 2 21 6.25 21 11.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </a>
  )
}

export default SocialFloat
