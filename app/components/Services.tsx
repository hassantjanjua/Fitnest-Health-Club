'use client'
import { useEffect, useRef, useState } from 'react'
import { Dumbbell, Heart, Zap, Users, Apple, Flame, ChevronRight, X, Clock, Target, Award, CheckCircle2 } from 'lucide-react'

const services = [
  {
    icon: Dumbbell,
    title: 'Weight Training',
    tag: 'Strength',
    desc: 'Progressive overload programs built around compound lifts and muscle hypertrophy. Suitable for all levels.',
    features: ['Personalized programs', 'Form coaching', 'Progressive tracking'],
    featured: false,
    fullDetails: {
      overview: 'Our Weight Training program is designed to help you build lean muscle mass, increase strength, and transform your physique through scientifically-backed progressive overload techniques. Whether you are a beginner learning the basics or an advanced lifter pushing for new PRs, our certified trainers will guide you every step of the way.',
      benefits: [
        'Increased muscle mass and definition',
        'Improved metabolic rate and fat burning',
        'Enhanced bone density and joint health',
        'Better posture and functional strength',
        'Boosted confidence and mental resilience'
      ],
      schedule: '6 days per week | 45-60 min sessions',
      level: 'Beginner to Advanced',
      equipment: 'Full gym access with premium equipment',
      pricing: 'Starting from PKR 15,000/month',
      trainers: '8 certified strength coaches',
      testimonial: {
        text: '"I gained 12kg of lean muscle in 6 months. The trainers here truly understand progressive overload and proper form."',
        author: 'Ahmed Khan, 28'
      }
    }
  },
  {
    icon: Heart,
    title: 'Cardio Training',
    tag: 'Endurance',
    desc: 'HIIT, steady-state, and sport-specific cardio designed to maximize fat burn and cardiovascular health.',
    features: ['Heart rate zones', 'Custom intervals', 'Endurance building'],
    featured: false,
    fullDetails: {
      overview: 'Transform your cardiovascular fitness with our comprehensive Cardio Training program. We combine cutting-edge heart rate monitoring with varied training modalities to ensure optimal fat burning and endurance development. From treadmill sprints to rowing sessions, every workout is designed to push your limits safely.',
      benefits: [
        'Accelerated fat loss and weight management',
        'Improved heart health and blood pressure',
        'Increased stamina and energy levels',
        'Better sleep quality and stress reduction',
        'Enhanced athletic performance'
      ],
      schedule: '5 days per week | 30-45 min sessions',
      level: 'All Fitness Levels',
      equipment: 'Treadmills, bikes, rowers, stair climbers',
      pricing: 'Starting from PKR 12,000/month',
      trainers: '6 cardio specialists',
      testimonial: {
        text: '"Lost 20kg in 4 months! The heart rate zone training made all the difference. I have never felt more energetic."',
        author: 'Sara Malik, 34'
      }
    }
  },
  {
    icon: Zap,
    title: 'Personal Training',
    tag: 'One-on-One',
    desc: "1-on-1 sessions with Pakistan's top certified trainers. Fastest route to your specific goals.",
    features: ['Goal assessment', 'Tailored workouts', 'Weekly check-ins'],
    featured: true,
    fullDetails: {
      overview: 'Experience the ultimate in personalized fitness with our exclusive 1-on-1 Personal Training program. Your dedicated trainer will design a completely customized program based on your unique goals, body type, lifestyle, and preferences. This is the fastest and most effective path to achieving your dream physique.',
      benefits: [
        '100% customized workout programs',
        'Undivided attention and real-time form correction',
        'Flexible scheduling to fit your lifestyle',
        'Nutrition guidance included',
        'Weekly progress assessments and adjustments',
        'Direct messaging with your trainer'
      ],
      schedule: 'Flexible scheduling | 60 min sessions',
      level: 'Customized to Your Level',
      equipment: 'Full gym + private training area access',
      pricing: 'Starting from PKR 35,000/month',
      trainers: '12 elite certified personal trainers',
      testimonial: {
        text: '"My trainer understood my busy schedule and designed workouts I could stick to. Down 15kg and stronger than ever!"',
        author: 'Bilal Ahmed, CEO, 42'
      }
    }
  },
  {
    icon: Users,
    title: 'Group Classes',
    tag: 'Community',
    desc: 'High-energy group sessions that blend accountability with fun. 20+ class types every week.',
    features: ['Bootcamp', 'Circuit training', 'Core & mobility'],
    featured: false,
    fullDetails: {
      overview: 'Join our vibrant fitness community with over 20 different group class formats every week. From high-intensity bootcamps to relaxing yoga sessions, there is something for everyone. The energy of training together pushes you further while making fitness fun and social.',
      benefits: [
        'Motivation from group energy and accountability',
        'Variety keeps workouts exciting',
        'Social connections with like-minded people',
        'Expert instruction in every class',
        'All equipment and space provided',
        'Flexible drop-in scheduling'
      ],
      schedule: '25+ classes per week | 45-60 min each',
      level: 'Mixed Levels (modifications available)',
      equipment: 'All equipment provided',
      pricing: 'Starting from PKR 10,000/month',
      trainers: '15 group fitness instructors',
      testimonial: {
        text: '"The bootcamp classes changed my life. I have made amazing friends and lost 8kg while having fun every session!"',
        author: 'Fatima Hassan, 29'
      }
    }
  },
  {
    icon: Apple,
    title: 'Nutrition Coaching',
    tag: 'Diet & Health',
    desc: 'Personalized meal plans and macro guidance from certified nutritionists aligned with your training.',
    features: ['Macro planning', 'Meal prep guides', 'Supplement advice'],
    featured: false,
    fullDetails: {
      overview: 'Nutrition is 80% of your results. Our certified nutritionists will create a personalized eating plan that complements your training goals, whether that is muscle gain, fat loss, or overall health. No extreme diets—just sustainable, delicious eating habits that deliver results.',
      benefits: [
        'Customized macro and calorie targets',
        'Weekly meal plans with local food options',
        'Grocery shopping lists and meal prep guides',
        'Supplement recommendations (if needed)',
        'Regular check-ins and plan adjustments',
        'Understanding food for lifelong health'
      ],
      schedule: 'Weekly consultations | Ongoing support',
      level: 'All dietary needs accommodated',
      equipment: 'MyFitnessPal integration + custom app',
      pricing: 'Starting from PKR 8,000/month',
      trainers: '4 certified nutritionists',
      testimonial: {
        text: '"Finally learned how to eat properly! No more crash diets. I am eating more than ever and still losing fat."',
        author: 'Usman Ali, 31'
      }
    }
  },
  {
    icon: Flame,
    title: 'CrossFit & HIIT',
    tag: 'Performance',
    desc: 'Functional movements at high intensity. Build strength, agility, and mental toughness simultaneously.',
    features: ['WOD programming', 'Olympic lifting', 'Functional fitness'],
    featured: false,
    fullDetails: {
      overview: 'Push your limits with our CrossFit and HIIT program. Combining functional movements, Olympic lifting, and high-intensity conditioning, this program builds complete athletes. Every session is different, keeping your body guessing and results coming. Expect to be challenged mentally and physically.',
      benefits: [
        'Total body conditioning and strength',
        'Improved agility, speed, and power',
        'Mental toughness and discipline',
        'Olympic lifting technique mastery',
        'Community of dedicated athletes',
        'Competition prep available'
      ],
      schedule: '6 days per week | 60 min WODs',
      level: 'Intermediate to Advanced',
      equipment: 'Full CrossFit box with Olympic platforms',
      pricing: 'Starting from PKR 18,000/month',
      trainers: '5 CrossFit L2 certified coaches',
      testimonial: {
        text: '"CrossFit at Fitnest took me from couch potato to competing in local competitions. The coaching is world-class."',
        author: 'Hamza Sheikh, 26'
      }
    }
  },
]

interface ServiceModalProps {
  service: typeof services[0] | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigatePricing: () => void;
}

function ServiceModal({ service, isOpen, onClose, onNavigatePricing }: ServiceModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !service) return null;
  
  const Icon = service.icon;
  const details = service.fullDetails;

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        backdropFilter: 'blur(10px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        animation: 'fadeIn 0.3s ease',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div 
        ref={modalRef}
        className="modal-content"
        style={{
          background: 'linear-gradient(180deg, #0d0d0d 0%, #080808 100%)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '4px',
          maxWidth: '900px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative',
          animation: 'scaleIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            zIndex: 10,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 107, 0, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(255, 107, 0, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
          }}
        >
          <X size={20} color="#fff" />
        </button>

        {/* Header */}
        <div style={{
          padding: 'clamp(30px, 5vw, 50px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.08) 0%, transparent 50%)',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{
              width: 80,
              height: 80,
              background: 'rgba(255, 107, 0, 0.12)',
              border: '1px solid rgba(255, 107, 0, 0.25)',
              clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              <Icon size={36} color="var(--accent-orange)" />
            </div>
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: 'var(--accent-orange)',
                marginBottom: 8,
              }}>
                {service.tag}
              </div>
              <h2 style={{
                fontFamily: 'Bebas Neue',
                fontSize: 'clamp(36px, 5vw, 56px)',
                color: '#fff',
                margin: 0,
                lineHeight: 1,
                letterSpacing: '0.02em',
              }}>
                {service.title}
              </h2>
              {service.featured && (
                <span style={{
                  display: 'inline-block',
                  marginTop: 12,
                  background: 'var(--accent-orange)',
                  color: '#fff',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.14em',
                  padding: '6px 14px',
                  textTransform: 'uppercase',
                }}>
                  Most Popular
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 'clamp(30px, 5vw, 50px)' }}>
          {/* Overview */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{
              fontFamily: 'Bebas Neue',
              fontSize: 24,
              color: '#fff',
              letterSpacing: '0.05em',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <Target size={20} color="var(--accent-orange)" />
              Overview
            </h3>
            <p style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: 'rgba(255, 255, 255, 0.6)',
            }}>
              {details.overview}
            </p>
          </div>

          {/* Quick Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            marginBottom: 40,
          }}>
            {[
              { icon: Clock, label: 'Schedule', value: details.schedule },
              { icon: Target, label: 'Level', value: details.level },
              { icon: Award, label: 'Trainers', value: details.trainers },
            ].map((item) => (
              <div key={item.label} style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '20px',
                borderRadius: '2px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                  <item.icon size={16} color="var(--accent-orange)" />
                  <span style={{
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.4)',
                  }}>
                    {item.label}
                  </span>
                </div>
                <p style={{
                  fontSize: 14,
                  color: '#fff',
                  margin: 0,
                  fontWeight: 500,
                }}>
                  {item.value}
                </p>
              </div>
            ))}
          </div>

          {/* Benefits */}
          <div style={{ marginBottom: 40 }}>
            <h3 style={{
              fontFamily: 'Bebas Neue',
              fontSize: 24,
              color: '#fff',
              letterSpacing: '0.05em',
              marginBottom: 20,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <CheckCircle2 size={20} color="var(--accent-orange)" />
              Benefits
            </h3>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 12,
            }}>
              {details.benefits.map((benefit, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 18px',
                  background: 'rgba(255, 107, 0, 0.04)',
                  border: '1px solid rgba(255, 107, 0, 0.1)',
                  borderRadius: '2px',
                }}>
                  <div style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: 'var(--accent-orange)',
                    flexShrink: 0,
                  }} />
                  <span style={{
                    fontSize: 14,
                    color: 'rgba(255, 255, 255, 0.7)',
                  }}>
                    {benefit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Testimonial */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(255, 107, 0, 0.08) 0%, rgba(255, 107, 0, 0.02) 100%)',
            border: '1px solid rgba(255, 107, 0, 0.15)',
            padding: 'clamp(24px, 4vw, 36px)',
            marginBottom: 40,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: -10,
              left: 30,
              fontFamily: 'Bebas Neue',
              fontSize: 80,
              color: 'rgba(255, 107, 0, 0.15)',
              lineHeight: 1,
            }}>
              
            </div>
            <p style={{
              fontSize: 16,
              fontStyle: 'italic',
              color: 'rgba(255, 255, 255, 0.7)',
              lineHeight: 1.7,
              marginBottom: 16,
              position: 'relative',
              zIndex: 1,
            }}>
              {details.testimonial.text}
            </p>
            <p style={{
              fontSize: 13,
              color: 'var(--accent-orange)',
              fontWeight: 600,
              margin: 0,
            }}>
              — {details.testimonial.author}
            </p>
          </div>

          {/* Pricing & CTA */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 20,
            padding: '30px',
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}>
            <div>
              <p style={{
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.4)',
                marginBottom: 4,
              }}>
                Investment
              </p>
              <p style={{
                fontFamily: 'Bebas Neue',
                fontSize: 28,
                color: '#fff',
                margin: 0,
              }}>
                {details.pricing}
              </p>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <button
                className="btn-primary"
                onClick={onNavigatePricing}
                style={{
                  padding: '16px 32px',
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                }}
              >
                Start Now <ChevronRight size={14} />
              </button>
              <button
                onClick={onNavigatePricing}
                style={{
                  padding: '16px 32px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#fff',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-orange)';
                  e.currentTarget.style.color = 'var(--accent-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.currentTarget.style.color = '#fff';
                }}
              >
                Book Free Trial
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Services() {
  const [visible, setVisible] = useState(false)
  const [activeService, setActiveService] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<typeof services[0] | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.05 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const fade = (delay: number): React.CSSProperties => ({
    opacity: visible ? 1 : 0,
    transform: visible ? 'translateY(0)' : 'translateY(40px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  const openModal = (service: typeof services[0]) => {
    setSelectedService(service);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedService(null), 300);
  };

  const navigateToContact = () => {
    closeModal();
    setTimeout(() => {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 350);
  };

  const handleGetConsultation = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <section id="services" ref={ref} style={{
        padding: 'clamp(60px, 10vw, 120px) 0',
        background: 'linear-gradient(180deg, #080808 0%, #0d0d0d 100%)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: '30%', left: '-15%',
          width: 700, height: 700, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 1400, margin: '0 auto', padding: '0 48px' }} className="services-container">

          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'end', marginBottom: 'clamp(40px, 6vw, 72px)' }} className="services-header">
            <div>
              <div style={{ ...fade(0.1), display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
                <div style={{ width: 40, height: 2, background: 'var(--accent-orange)' }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--accent-orange)' }}>
                  What We Offer
                </span>
              </div>
              <h2 style={{
                ...fade(0.18),
                fontFamily: 'Bebas Neue', fontSize: 'clamp(48px, 7vw, 100px)',
                lineHeight: 0.9, color: '#fff', margin: 0,
              }}>
                PROGRAMS<br />
                <span style={{ color: 'transparent', WebkitTextStroke: '2px rgba(255,255,255,0.15)' }}>BUILT FOR</span><br />
                <span style={{ color: 'var(--accent-orange)' }}>RESULTS.</span>
              </h2>
            </div>
            <div style={fade(0.26)}>
              <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.45)', lineHeight: 1.8, margin: 0, marginBottom: 24 }}>
                Every program at Fitnest is engineered by certified professionals.
                Whether you&apos;re a first-timer or a seasoned athlete, we have a track for you.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                {['20+ Programs', 'All Levels', 'Certified Trainers'].map(tag => (
                  <span key={tag} style={{
                    padding: '7px 16px', fontSize: 11, fontWeight: 700,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    border: '1px solid rgba(255,107,0,0.3)',
                    color: 'var(--accent-orange)', borderRadius: 2,
                    background: 'rgba(255,107,0,0.06)',
                  }}>{tag}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Services grid */}
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
          }} className="services-grid">
            {services.map((service, i) => (
              <ServiceCard
                key={service.title}
                service={service}
                index={i}
                isActive={activeService === i}
                onHover={() => setActiveService(i)}
                onLeave={() => setActiveService(null)}
                onLearnMore={() => openModal(service)}
                fadeStyle={fade(0.1 + i * 0.07)}
              />
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ ...fade(0.5), textAlign: 'center', marginTop: 'clamp(40px, 5vw, 64px)' }}>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.4)', marginBottom: 24 }}>
              Not sure which program is right for you?
            </p>
            <button 
              onClick={handleGetConsultation}
              className="btn-primary" 
              style={{
                padding: '16px 44px', fontSize: 12,
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}
            >
              Get a Free Consultation <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      <ServiceModal 
        service={selectedService} 
        isOpen={isModalOpen} 
        onClose={closeModal}
        onNavigatePricing={navigateToContact}
      />
    </>
  )
}

function ServiceCard({ service, index, isActive, onHover, onLeave, onLearnMore, fadeStyle }: {
  service: typeof services[0]
  index: number
  isActive: boolean
  onHover: () => void
  onLeave: () => void
  onLearnMore: () => void
  fadeStyle: React.CSSProperties
}) {
  const Icon = service.icon

  return (
    <div
      style={{
        ...fadeStyle,
        padding: 'clamp(24px, 3vw, 40px) clamp(20px, 2.5vw, 36px)',
        background: isActive ? 'rgba(255,107,0,0.07)' : '#0a0a0a',
        borderRight: (index + 1) % 3 !== 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        borderBottom: index < 3 ? '1px solid rgba(255,255,255,0.04)' : 'none',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
      }}
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
    >
      {/* Featured badge */}
      {service.featured && (
        <div style={{
          position: 'absolute', top: 16, right: 16,
          background: 'var(--accent-orange)', color: '#fff',
          fontSize: 9, fontWeight: 700, letterSpacing: '0.16em',
          padding: '4px 10px', textTransform: 'uppercase',
          clipPath: 'polygon(0 0,calc(100% - 6px) 0,100% 6px,100% 100%,6px 100%,0 calc(100% - 6px))',
          animation: 'pulseGlow 2s ease infinite',
        }}>
          Most Popular
        </div>
      )}

      {/* Bottom hover accent */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 3,
        background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
        transform: isActive ? 'scaleX(1)' : 'scaleX(0)',
        transition: 'transform 0.5s cubic-bezier(0.16,1,0.3,1)',
        transformOrigin: 'left',
      }} />

      {/* Tag */}
      <div style={{
        fontSize: 9, fontWeight: 700, letterSpacing: '0.22em',
        textTransform: 'uppercase', color: 'rgba(255,107,0,0.7)', marginBottom: 16,
      }}>
        {service.tag}
      </div>

      {/* Icon */}
      <div style={{
        width: 56, height: 56, marginBottom: 20,
        background: isActive ? 'rgba(255,107,0,0.15)' : 'rgba(255,107,0,0.08)',
        border: `1px solid ${isActive ? 'rgba(255,107,0,0.4)' : 'rgba(255,107,0,0.18)'}`,
        clipPath: 'polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        transform: isActive ? 'scale(1.1) rotate(-3deg)' : 'scale(1) rotate(0deg)',
      }}>
        <Icon size={24} color="var(--accent-orange)" />
      </div>

      <h3 style={{
        fontFamily: 'Bebas Neue', fontSize: 'clamp(22px, 2vw, 28px)', color: '#fff',
        letterSpacing: '0.05em', margin: '0 0 14px',
      }}>
        {service.title}
      </h3>

      <p style={{
        fontSize: 14, color: 'rgba(255,255,255,0.4)',
        lineHeight: 1.75, marginBottom: 20,
      }}>
        {service.desc}
      </p>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 24 }}>
        {service.features.map((f, fi) => (
          <div key={f} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            transform: isActive ? 'translateX(6px)' : 'translateX(0)',
            transition: `transform 0.35s cubic-bezier(0.16,1,0.3,1) ${fi * 0.05}s`,
          }}>
            <div style={{
              width: 5, height: 5, borderRadius: '50%',
              background: 'var(--accent-orange)', flexShrink: 0,
              transition: 'all 0.3s ease',
              transform: isActive ? 'scale(1.4)' : 'scale(1)',
            }} />
            <span style={{ fontSize: 13, color: isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.5)', transition: 'color 0.3s ease' }}>{f}</span>
          </div>
        ))}
      </div>

      <button 
        onClick={(e) => {
          e.stopPropagation();
          onLearnMore();
        }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'transparent', border: 'none',
          color: isActive ? 'var(--accent-orange)' : 'rgba(255,255,255,0.3)',
          fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
          textTransform: 'uppercase', cursor: 'pointer', padding: 0,
          transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          transform: isActive ? 'translateX(4px)' : 'translateX(0)',
        }}
      >
        Learn More
        <ChevronRight size={14} style={{
          transition: 'transform 0.3s ease',
          transform: isActive ? 'translateX(4px)' : 'translateX(0)',
        }} />
      </button>
    </div>
  )
}
