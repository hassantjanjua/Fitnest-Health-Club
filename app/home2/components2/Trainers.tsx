'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { Clock, ArrowRight, X, Award, Users, Calendar, Mail, Phone } from 'lucide-react'

const trainers = [
  {
    name: 'Ahmed Raza', role: 'Head Strength Coach', initials: 'AR', specialty: 'Powerlifting & Hypertrophy',
    certs: 'NASM-CPT, CSCS', experience: '10 Years',
    image: 'https://images.pexels.com/photos/5327496/pexels-photo-5327496.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
    bio: 'Ahmed has been transforming lives through strength training for over a decade. A certified NASM Personal Trainer and CSCS, he specializes in powerlifting and hypertrophy programs.',
    stats: { clients: 200, sessions: 5000, rating: 4.9 },
    email: 'ahmed@fitnest.pk', phone: '+92 300 111 2233',
    achievements: ['Pakistan Powerlifting Champion 2019', 'NASM Master Trainer', 'Over 200 body transformations'],
  },
  {
    name: 'Sara Malik', role: 'Cardio & HIIT Specialist', initials: 'SM', specialty: 'HIIT, Functional Fitness',
    certs: 'ACE Certified, CrossFit L2', experience: '7 Years',
    image: 'https://images.pexels.com/photos/3858300/pexels-photo-3858300.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
    bio: 'Sara brings infectious energy to every session. Her HIIT and functional fitness classes are the most popular at Fitnest, known for delivering results fast.',
    stats: { clients: 150, sessions: 3500, rating: 4.8 },
    email: 'sara@fitnest.pk', phone: '+92 300 222 3344',
    achievements: ['ACE Group Fitness Instructor of the Year', 'CrossFit L2 Certified', '150+ successful transformations'],
  },
  {
    name: 'Bilal Khan', role: 'Personal Training Lead', initials: 'BK', specialty: 'Body Transformation',
    certs: 'ISSA-CPT, Precision Nutrition', experience: '9 Years',
    image: 'https://images.pexels.com/photos/3838700/pexels-photo-3838700.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
    bio: 'Bilal is our body transformation expert. Combining training with nutrition science, he has helped hundreds achieve physiques they never thought possible.',
    stats: { clients: 180, sessions: 4500, rating: 4.9 },
    email: 'bilal@fitnest.pk', phone: '+92 300 333 4455',
    achievements: ['Precision Nutrition Level 2', '180+ complete body transformations', 'Featured in Health Weekly Pakistan'],
  },
  {
    name: 'Zara Ahmed', role: 'Yoga & Mobility Coach', initials: 'ZA', specialty: 'Yoga, Stretching, Recovery',
    certs: 'RYT-500, FMS Certified', experience: '6 Years',
    image: 'https://images.pexels.com/photos/3838705/pexels-photo-3838705.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=500&w=400',
    bio: 'Zara focuses on recovery and mobility — the often-neglected aspects of fitness. Her yoga classes help members prevent injury and improve overall performance.',
    stats: { clients: 120, sessions: 2800, rating: 5.0 },
    email: 'zara@fitnest.pk', phone: '+92 300 444 5566',
    achievements: ['RYT-500 Certified', 'FMS Movement Specialist', 'Top-rated instructor 3 years running'],
  },
]

function TrainerModal({ trainer, onClose }: { trainer: typeof trainers[0]; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const handleEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEsc)
    return () => { document.body.style.overflow = 'auto'; document.removeEventListener('keydown', handleEsc) }
  }, [onClose])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', backdropFilter: 'blur(10px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.3s ease',
    }} onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <div style={{
        background: '#fff', maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto',
        animation: 'scaleIn 0.4s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 24px) 0, 100% 24px, 100% 100%, 24px 100%, 0 calc(100% - 24px))',
      }}>
        <div style={{ height: 4, background: 'var(--accent-orange)' }} />
        <button onClick={onClose} style={{
          position: 'absolute', top: 24, right: 24, width: 44, height: 44, background: 'rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10,
          clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
        }}>
          <X size={20} color="#fff" />
        </button>

        <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: 0 }} className="about-grid">
          {/* Image */}
          <div style={{ height: '100%', minHeight: 300 }}>
            <img src={trainer.image} alt={trainer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          {/* Content */}
          <div style={{ padding: '32px' }}>
            <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
              {trainer.role}
            </span>
            <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 36, color: '#111', margin: '6px 0 16px', letterSpacing: '0.02em' }}>
              {trainer.name}
            </h3>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(0,0,0,0.5)', marginBottom: 24 }}>{trainer.bio}</p>

            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
              <StatBox icon={Users} value={`${trainer.stats.clients}+`} label="Clients" />
              <StatBox icon={Calendar} value={`${trainer.stats.sessions}+`} label="Sessions" />
              <StatBox icon={Award} value={trainer.stats.rating.toString()} label="Rating" />
            </div>

            {/* Achievements */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)', marginBottom: 12 }}>
                Achievements
              </h4>
              {trainer.achievements.map((a, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <div style={{ width: 6, height: 6, background: 'var(--accent-orange)', transform: 'rotate(45deg)', flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: 'rgba(0,0,0,0.6)' }}>{a}</span>
                </div>
              ))}
            </div>

            {/* Contact */}
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <ContactButton icon={Mail} text={trainer.email} href={`mailto:${trainer.email}`} />
              <ContactButton icon={Phone} text="Call Now" href={`tel:${trainer.phone}`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatBox({ icon: Icon, value, label }: { icon: React.ElementType; value: string; label: string }) {
  return (
    <div style={{
      background: 'rgba(255,107,0,0.04)', border: '1px solid rgba(255,107,0,0.1)', padding: '14px 12px', textAlign: 'center',
      clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
    }}>
      <Icon size={16} color="var(--accent-orange)" style={{ marginBottom: 6 }} />
      <div style={{ fontFamily: 'Bebas Neue', fontSize: 22, color: '#111' }}>{value}</div>
      <div style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>{label}</div>
    </div>
  )
}

function ContactButton({ icon: Icon, text, href }: { icon: React.ElementType; text: string; href: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', textDecoration: 'none',
        background: hovered ? 'var(--accent-orange)' : 'transparent',
        border: `1px solid ${hovered ? 'var(--accent-orange)' : 'rgba(0,0,0,0.1)'}`,
        color: hovered ? '#fff' : '#111', fontSize: 11, fontWeight: 600,
        transition: 'all 0.3s ease',
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <Icon size={14} /> {text}
    </a>
  )
}

function TrainerCard({ trainer, index, onOpenProfile }: { trainer: typeof trainers[0]; index: number; onOpenProfile: () => void }) {
  const [visible, setVisible] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.15 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * -6, y: x * 6 })
  }, [])

  const handleMouseLeave = () => { setTilt({ x: 0, y: 0 }); setIsHovered(false) }

  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(40px)',
      transition: `opacity 0.7s ease ${index * 0.12}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${index * 0.12}s`,
      perspective: 800,
    }}>
      <div ref={cardRef} onMouseMove={handleMouseMove} onMouseEnter={() => setIsHovered(true)} onMouseLeave={handleMouseLeave}
        style={{
          background: '#fff', border: `1px solid ${isHovered ? 'rgba(255,107,0,0.2)' : 'rgba(0,0,0,0.06)'}`,
          overflow: 'hidden', cursor: 'pointer',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: isHovered ? 'border-color 0.3s ease' : 'all 0.5s ease',
          boxShadow: isHovered ? '0 20px 60px rgba(0,0,0,0.08)' : '0 4px 20px rgba(0,0,0,0.03)',
          clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
        }}
        onClick={onOpenProfile}
      >
        <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
          <img src={trainer.image} alt={trainer.name} style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: isHovered ? 'scale(1.1)' : 'scale(1)',
            transition: 'transform 0.7s cubic-bezier(0.16,1,0.3,1)',
            filter: isHovered ? 'brightness(1.05)' : 'brightness(0.92)',
          }} loading="lazy" />
          <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(to top, rgba(0,0,0,${isHovered ? 0.6 : 0.4}) 0%, transparent 60%)`, transition: 'background 0.4s ease' }} />
          <div style={{
            position: 'absolute', top: 12, right: 12, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)',
            padding: '5px 10px', display: 'flex', alignItems: 'center', gap: 5,
            clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
          }}>
            <Clock size={10} color="var(--accent-orange)" />
            <span style={{ fontSize: 9, fontWeight: 800, color: '#111' }}>{trainer.experience}</span>
          </div>
          <div style={{ position: 'absolute', bottom: 10, left: 14, fontFamily: 'Bebas Neue', fontSize: 48, color: 'rgba(255,255,255,0.15)', lineHeight: 1 }}>0{index + 1}</div>
          
          {/* View Profile button on hover */}
          <div style={{
            position: 'absolute', bottom: 14, right: 14, opacity: isHovered ? 1 : 0, transform: isHovered ? 'translateY(0)' : 'translateY(10px)',
            transition: 'all 0.4s ease',
          }}>
            <div style={{
              background: 'var(--accent-orange)', color: '#fff', padding: '8px 14px',
              fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
              clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
            }}>View Profile</div>
          </div>
        </div>

        <div style={{ padding: '20px 20px 24px' }}>
          <h3 style={{ fontFamily: 'Bebas Neue', fontSize: 22, letterSpacing: '0.02em', color: '#111', marginBottom: 4 }}>{trainer.name}</h3>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent-orange)', marginBottom: 14 }}>{trainer.role}</p>
          <div style={{ borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: 14 }}>
            <div style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>Specialty</span>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginTop: 2 }}>{trainer.specialty}</p>
            </div>
            <div>
              <span style={{ fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(0,0,0,0.3)' }}>Certifications</span>
              <p style={{ fontSize: 11, fontWeight: 600, color: 'rgba(0,0,0,0.6)', marginTop: 2 }}>{trainer.certs}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Trainers() {
  const [visible, setVisible] = useState(false)
  const [selectedTrainer, setSelectedTrainer] = useState<typeof trainers[0] | null>(null)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true)
    }, { threshold: 0.1 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="trainers" style={{ padding: '100px 0', background: '#fafafa', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', top: '10%', left: '-3%', fontFamily: 'Bebas Neue', fontSize: 'clamp(80px, 14vw, 200px)',
        color: 'rgba(0,0,0,0.015)', whiteSpace: 'nowrap', pointerEvents: 'none',
      }}>TRAINERS</div>

      <div ref={ref} style={{ maxWidth: 1400, margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        <div style={{
          textAlign: 'center', marginBottom: 60, opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(30px)',
          transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>Expert Trainers</span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)' }} />
          </div>
          <h2 style={{ fontFamily: 'Bebas Neue', fontSize: 'clamp(40px, 7vw, 80px)', lineHeight: 0.95, letterSpacing: '0.02em', color: '#111' }}>
            MEET YOUR <span style={{ color: 'var(--accent-orange)' }}>COACHES</span>
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginTop: 14, maxWidth: 480, margin: '14px auto 0' }}>
            Certified professionals dedicated to helping you achieve your fitness goals.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }} className="trainers-grid">
          {trainers.map((trainer, i) => <TrainerCard key={i} trainer={trainer} index={i} onOpenProfile={() => setSelectedTrainer(trainer)} />)}
        </div>

        <div style={{ marginTop: 50, textAlign: 'center' }}>
          <p style={{ fontSize: 14, color: 'rgba(0,0,0,0.4)', marginBottom: 16 }}>Want to join our elite team of trainers?</p>
          <CTAButton href="#contact">Apply Now <ArrowRight size={14} /></CTAButton>
        </div>
      </div>

      {selectedTrainer && <TrainerModal trainer={selectedTrainer} onClose={() => setSelectedTrainer(null)} />}
    </section>
  )
}

function CTAButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovered, setHovered] = useState(false)
  return (
    <a href={href} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10, padding: '16px 36px',
        fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none',
        background: hovered ? 'var(--accent-orange)' : 'transparent',
        border: `1px solid ${hovered ? 'var(--accent-orange)' : 'rgba(0,0,0,0.1)'}`,
        color: hovered ? '#fff' : '#111',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(255,107,0,0.2)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
    >{children}</a>
  )
}
