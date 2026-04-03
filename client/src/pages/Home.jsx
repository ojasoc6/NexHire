import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

function Home() {
  const statsRef = useRef(null);

  useEffect(() => {
    // Intersection observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-reveal').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'all 0.6s ease';
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div>
      {/* ── HERO ── */}
      <div className="animated-gradient" style={{ minHeight: '92vh', position: 'relative', overflow: 'hidden' }}>

        {/* Floating background circles */}
        <div style={{
          position: 'absolute', width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(233,69,96,0.08)', top: -100, right: -100
        }} className="float-animation" />
        <div style={{
          position: 'absolute', width: 300, height: 300, borderRadius: '50%',
          background: 'rgba(15,52,96,0.3)', bottom: -50, left: -50
        }} className="float-animation-delay" />
        <div style={{
          position: 'absolute', width: 200, height: 200, borderRadius: '50%',
          background: 'rgba(233,69,96,0.05)', top: '40%', left: '20%'
        }} className="float-animation" />

        <div className="container d-flex align-items-center justify-content-center text-white"
          style={{ minHeight: '92vh', position: 'relative', zIndex: 1 }}>
          <div className="text-center" style={{ animation: 'fadeInUp 0.8s ease forwards' }}>

            {/* Badge */}
            <div className="d-inline-flex align-items-center gap-2 mb-4 px-4 py-2 glass">
              <span style={{ width: 8, height: 8, backgroundColor: '#e94560', borderRadius: '50%', animation: 'pulse 2s infinite', display: 'inline-block' }}></span>
              <span className="small">Now live — Find your next hire today</span>
            </div>

            <h1 className="fw-bold mb-4" style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', lineHeight: 1.1 }}>
              Connect with Top<br />
              <span className="gradient-text">Freelance Talent</span>
            </h1>

            <p className="mb-5 opacity-75" style={{ fontSize: '1.2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
              Browse structured portfolios, filter by skills and budget, track inquiries in real time — all in one place.
            </p>

            <div className="d-flex gap-3 justify-content-center flex-wrap mb-5">
              <Link to="/browse" className="btn btn-lg px-5 py-3 fw-bold btn-glow"
                style={{ backgroundColor: '#e94560', border: 'none', borderRadius: '50px', color: 'white', fontSize: '1rem' }}>
                Browse Freelancers →
              </Link>
              <Link to="/login" className="btn btn-lg px-5 py-3 fw-bold"
                style={{ border: '2px solid rgba(255,255,255,0.3)', borderRadius: '50px', color: 'white', backgroundColor: 'transparent', fontSize: '1rem', transition: 'all 0.3s' }}
                onMouseEnter={e => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.target.style.backgroundColor = 'transparent'}>
                Join as Freelancer
              </Link>
            </div>

            {/* Stats */}
            <div className="d-flex gap-5 justify-content-center flex-wrap" ref={statsRef}>
              {[['50+', 'Freelancers'], ['100+', 'Projects'], ['4.8★', 'Rating'], ['24hr', 'Response']].map(([num, label]) => (
                <div key={label} className="text-center">
                  <div className="fw-bold mb-0" style={{ fontSize: '2rem', color: '#e94560' }}>{num}</div>
                  <div className="small opacity-75">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 30, left: '50%', transform: 'translateX(-50%)', animation: 'float 2s ease-in-out infinite' }}>
          <div style={{ width: 30, height: 50, border: '2px solid rgba(255,255,255,0.3)', borderRadius: 15, display: 'flex', justifyContent: 'center', paddingTop: 8 }}>
            <div style={{ width: 4, height: 8, backgroundColor: 'white', borderRadius: 2, animation: 'float 2s ease-in-out infinite' }}></div>
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div className="container py-5 my-3">
        <div className="text-center mb-5 scroll-reveal">
          <span className="badge px-3 py-2 mb-3" style={{ backgroundColor: '#e8f0fe', color: '#0f3460', borderRadius: '20px' }}>How it works</span>
          <h2 className="fw-bold" style={{ fontSize: '2.5rem' }}>Simple. Fast. Effective.</h2>
        </div>
        <div className="row g-4">
          {[
            { step: '01', icon: '🔍', title: 'Browse Profiles', desc: 'Explore freelancer portfolios with detailed case studies, tech stacks, and real outcomes', color: '#e8f0fe' },
            { step: '02', icon: '⚡', title: 'Filter & Compare', desc: 'Filter by skills, experience, availability and rate. Compare two freelancers side by side', color: '#fce4ec' },
            { step: '03', icon: '🚀', title: 'Send Inquiry', desc: 'Contact freelancers directly and track your inquiry from sent to accepted in real time', color: '#e8f5e9' },
          ].map(({ step, icon, title, desc, color }, i) => (
            <div key={step} className="col-md-4 scroll-reveal" style={{ transitionDelay: `${i * 0.2}s` }}>
              <div className="card-hover p-4 rounded-4 h-100 text-center" style={{ backgroundColor: color, border: 'none' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{icon}</div>
                <div className="fw-bold mb-2" style={{ color: '#0f3460', opacity: 0.3, fontSize: '1.2rem' }}>{step}</div>
                <h5 className="fw-bold mb-2">{title}</h5>
                <p className="text-muted mb-0 small">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FEATURES ── */}
      <div style={{ backgroundColor: '#1a1a2e' }} className="py-5">
        <div className="container py-3">
          <div className="text-center mb-5 scroll-reveal">
            <span className="badge px-3 py-2 mb-3" style={{ backgroundColor: 'rgba(233,69,96,0.2)', color: '#e94560', borderRadius: '20px' }}>Features</span>
            <h2 className="fw-bold text-white" style={{ fontSize: '2.5rem' }}>Everything you need</h2>
          </div>
          <div className="row g-4">
            {[
              { icon: '📁', title: 'Case Study Portfolios', desc: 'Every project has description, tech stack, role, challenges and outcome — not just images' },
              { icon: '🔎', title: 'Advanced Filtering', desc: 'Filter by experience range, availability, budget and tech stack combinations' },
              { icon: '📊', title: 'Inquiry Tracking', desc: 'Track every inquiry from sent to viewed to responded to accepted' },
              { icon: '⚡', title: 'Real-time Search', desc: 'Live search powered by jQuery AJAX — results update as you type' },
              { icon: '🔒', title: 'Secure Auth', desc: 'Session-based authentication with bcrypt password hashing' },
              { icon: '📧', title: 'Email Notifications', desc: 'Automatic email confirmation when inquiries are sent' },
            ].map(({ icon, title, desc }, i) => (
              <div key={title} className="col-md-4 scroll-reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div className="glass p-4 rounded-4 h-100 card-hover">
                  <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{icon}</div>
                  <h6 className="fw-bold text-white mb-2">{title}</h6>
                  <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.6)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA ── */}
      <div className="animated-gradient py-5">
        <div className="container text-center py-4 scroll-reveal">
          <h2 className="fw-bold text-white mb-3" style={{ fontSize: '2.5rem' }}>
            Ready to find your next <span className="gradient-text">freelancer?</span>
          </h2>
          <p className="text-white opacity-75 mb-4">Join hundreds of clients and freelancers on NexHire</p>
          <Link to="/browse" className="btn btn-lg px-5 py-3 fw-bold btn-glow"
            style={{ backgroundColor: '#e94560', border: 'none', borderRadius: '50px', color: 'white' }}>
            Get Started Now →
          </Link>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <footer style={{ backgroundColor: '#0f3460' }} className="py-4">
        <div className="container text-center">
          <span className="fw-bold text-white fs-5">NexHire</span>
          <p className="text-white opacity-50 small mt-1 mb-0">Freelance Portfolio Marketplace — BITE304L Web Technologies</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;