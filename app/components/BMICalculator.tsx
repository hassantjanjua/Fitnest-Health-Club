'use client'

import { useEffect, useRef, useState } from 'react'
import { User, TrendingDown, TrendingUp, Activity, Target, Flame, Calculator } from 'lucide-react'

export default function BMICalculator() {
  const [visible, setVisible] = useState(false)
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [activity, setActivity] = useState('1.2')
  const [goal, setGoal] = useState('loss')
  const [result, setResult] = useState<{ bmi: number; category: string; calories: number; target: number } | null>(null)
  const [focusedInput, setFocusedInput] = useState<string | null>(null)
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
    transform: visible ? 'translateY(0)' : 'translateY(36px)',
    transition: `opacity 0.9s ease ${delay}s, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}s`,
  })

  function calculate() {
    const h = parseFloat(height) / 100
    const w = parseFloat(weight)
    const a = parseFloat(age)
    if (!h || !w || !a) return

    const bmi = w / (h * h)
    let category = ''
    if (bmi < 18.5) category = 'Underweight'
    else if (bmi < 25) category = 'Normal'
    else if (bmi < 30) category = 'Overweight'
    else category = 'Obese'

    const bmr = gender === 'male'
      ? 88.36 + 13.4 * w + 4.8 * (h * 100) - 5.7 * a
      : 447.6 + 9.2 * w + 3.1 * (h * 100) - 4.3 * a

    const tdee = bmr * parseFloat(activity)
    const target = goal === 'loss' ? tdee - 500 : tdee + 300

    setResult({ bmi: Math.round(bmi * 10) / 10, category, calories: Math.round(tdee), target: Math.round(target) })
  }

  const bmiColor = result
    ? result.bmi < 18.5 ? '#3b82f6'
      : result.bmi < 25 ? '#22c55e'
      : result.bmi < 30 ? '#eab308'
      : '#ef4444'
    : 'var(--accent-orange)'

  return (
    <section id="bmi" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 140px) 0',
      background: '#080808',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Radial Gradients - matching Hero */}
      <div style={{
        position: 'absolute', top: '-15%', right: '-20%',
        width: '80vw', height: '80vw',
        maxWidth: 900, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', bottom: '-20%', left: '-15%',
        width: '70vw', height: '70vw',
        maxWidth: 800, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(255,107,0,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* Diagonal Lines - matching Hero */}
      <div className="bmi-diagonals" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        {[...Array(6)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute', top: '-50%',
            right: `${i * 140 - 80}px`,
            width: '1px', height: '200%',
            background: 'rgba(255,107,0,0.035)',
            transform: 'rotate(-20deg)',
          }} />
        ))}
      </div>

      <div style={{
        maxWidth: 1400,
        margin: '0 auto',
        padding: '0 48px',
        position: 'relative',
        zIndex: 1,
      }} className="bmi-container">

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 68 }}>
          <div style={{
            ...fade(0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 20,
          }}>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'var(--accent-orange)',
            }}>
              Health Assessment
            </span>
            <div style={{ width: 44, height: 2, background: 'var(--accent-orange)', flexShrink: 0 }} />
          </div>
          <h2 style={{
            ...fade(0.18),
            fontFamily: 'Bebas Neue',
            fontSize: 'clamp(52px, 8vw, 96px)',
            lineHeight: 0.88,
            color: '#fff',
            margin: 0,
            letterSpacing: '0.01em',
          }}>
            BMI <span style={{ color: 'var(--accent-orange)' }}>CALCULATOR</span>
          </h2>
          <p style={{
            ...fade(0.26),
            fontSize: 17,
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.8,
            marginTop: 20,
            maxWidth: 600,
            margin: '20px auto 0',
          }}>
            Calculate your Body Mass Index and get personalized calorie recommendations for your fitness goals.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 48,
          alignItems: 'start',
        }} className="bmi-grid">

          {/* Form */}
          <div style={{
            ...fade(0.34),
            border: '1px solid rgba(255,107,0,0.2)',
            background: 'rgba(14,14,14,0.95)',
            backdropFilter: 'blur(20px)',
            position: 'relative',
            overflow: 'hidden',
            clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
          }}>
            <div style={{
              height: 3,
              background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
            }} />

            <div style={{ padding: '40px 36px 44px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                marginBottom: 32,
              }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(255,107,0,0.12)',
                  border: '1px solid rgba(255,107,0,0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <Calculator size={18} color="var(--accent-orange)" />
                </div>
                <div>
                  <div style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: 'var(--accent-orange)',
                  }}>
                    Your Details
                  </div>
                  <div style={{
                    fontSize: 12,
                    color: 'rgba(255,255,255,0.4)',
                  }}>
                    Fill in the form below
                  </div>
                </div>
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginBottom: 16,
              }}>
                <InputField
                  label="Height (cm)"
                  type="number"
                  placeholder="175"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  focused={focusedInput === 'height'}
                  onFocus={() => setFocusedInput('height')}
                  onBlur={() => setFocusedInput(null)}
                  icon={<Activity size={14} />}
                />
                <InputField
                  label="Weight (kg)"
                  type="number"
                  placeholder="70"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  focused={focusedInput === 'weight'}
                  onFocus={() => setFocusedInput('weight')}
                  onBlur={() => setFocusedInput(null)}
                  icon={<Target size={14} />}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <InputField
                  label="Age"
                  type="number"
                  placeholder="25"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  focused={focusedInput === 'age'}
                  onFocus={() => setFocusedInput('age')}
                  onBlur={() => setFocusedInput(null)}
                  icon={<User size={14} />}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 10,
                }}>
                  Gender
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { val: 'male', label: 'Male', icon: '♂' },
                    { val: 'female', label: 'Female', icon: '♀' },
                  ].map(g => (
                    <GenderButton
                      key={g.val}
                      selected={gender === g.val}
                      onClick={() => setGender(g.val)}
                      label={g.label}
                      icon={g.icon}
                    />
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{
                  display: 'block',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 10,
                }}>
                  Activity Level
                </label>
                <select
                  value={activity}
                  onChange={e => setActivity(e.target.value)}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff',
                    padding: '14px 16px',
                    fontSize: 13,
                    borderRadius: 4,
                    outline: 'none',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,107,0,0.4)'
                    e.currentTarget.style.background = 'rgba(255,107,0,0.04)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                  }}
                >
                  <option value="1.2">Little or no exercise</option>
                  <option value="1.375">Light exercise (1-3x/week)</option>
                  <option value="1.55">Moderate exercise (3-5x/week)</option>
                  <option value="1.725">Heavy exercise (6-7x/week)</option>
                  <option value="1.9">Very heavy / physical job</option>
                </select>
              </div>

              <div style={{ marginBottom: 32 }}>
                <label style={{
                  display: 'block',
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  marginBottom: 10,
                }}>
                  My Goal
                </label>
                <div style={{ display: 'flex', gap: 12 }}>
                  {[
                    { val: 'loss', label: 'Weight Loss', icon: <TrendingDown size={16} /> },
                    { val: 'gain', label: 'Weight Gain', icon: <TrendingUp size={16} /> },
                  ].map(g => (
                    <GoalButton
                      key={g.val}
                      selected={goal === g.val}
                      onClick={() => setGoal(g.val)}
                      label={g.label}
                      icon={g.icon}
                    />
                  ))}
                </div>
              </div>

              <button
                className="btn-primary"
                onClick={calculate}
                disabled={!height || !weight || !age}
                style={{
                  width: '100%',
                  padding: '18px',
                  fontSize: 11,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 10,
                  opacity: (!height || !weight || !age) ? 0.5 : 1,
                  cursor: (!height || !weight || !age) ? 'not-allowed' : 'pointer',
                }}
              >
                <Calculator size={16} />
                Calculate My BMI
              </button>
            </div>
          </div>

          {/* Result */}
          <div style={{ ...fade(0.42) }}>
            {!result ? (
              <EmptyState />
            ) : (
              <ResultCard
                result={result}
                bmiColor={bmiColor}
                goal={goal}
              />
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 1024px) {
          .bmi-container { padding: 0 32px !important; }
          .bmi-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .bmi-container { padding: 0 20px !important; }
        }
      `}</style>
    </section>
  )
}

// Input Field Component
function InputField({
  label,
  type,
  placeholder,
  value,
  onChange,
  focused,
  onFocus,
  onBlur,
  icon,
}: {
  label: string
  type: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  focused: boolean
  onFocus: () => void
  onBlur: () => void
  icon: React.ReactNode
}) {
  return (
    <div>
      <label style={{
        display: 'block',
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 10,
      }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <div style={{
          position: 'absolute',
          left: 14,
          top: '50%',
          transform: 'translateY(-50%)',
          color: focused ? 'var(--accent-orange)' : 'rgba(255,255,255,0.25)',
          transition: 'color 0.3s ease',
          display: 'flex',
          alignItems: 'center',
        }}>
          {icon}
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          style={{
            width: '100%',
            background: focused ? 'rgba(255,107,0,0.04)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${focused ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
            color: '#fff',
            padding: '14px 16px 14px 42px',
            fontSize: 13,
            borderRadius: 4,
            outline: 'none',
            boxSizing: 'border-box',
            transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
    </div>
  )
}

// Gender Button Component
function GenderButton({
  selected,
  onClick,
  label,
  icon,
}: {
  selected: boolean
  onClick: () => void
  label: string
  icon: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '14px 16px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        border: `1px solid ${selected ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
        background: selected ? 'rgba(255,107,0,0.12)' : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        color: selected ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)',
        borderRadius: 4,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <span style={{ fontSize: 16 }}>{icon}</span>
      {label}
    </button>
  )
}

// Goal Button Component
function GoalButton({
  selected,
  onClick,
  label,
  icon,
}: {
  selected: boolean
  onClick: () => void
  label: string
  icon: React.ReactNode
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flex: 1,
        padding: '14px 16px',
        fontSize: 12,
        fontWeight: 700,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        border: `1px solid ${selected ? 'rgba(255,107,0,0.4)' : 'rgba(255,255,255,0.1)'}`,
        background: selected ? 'rgba(255,107,0,0.12)' : hovered ? 'rgba(255,255,255,0.03)' : 'transparent',
        color: selected ? 'var(--accent-orange)' : 'rgba(255,255,255,0.5)',
        borderRadius: 4,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        transform: selected ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      {icon}
      {label}
    </button>
  )
}

// Empty State Component
function EmptyState() {
  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: '1px solid rgba(255,255,255,0.05)',
      background: 'rgba(255,255,255,0.01)',
      backdropFilter: 'blur(20px)',
      borderRadius: 4,
      padding: 60,
      textAlign: 'center',
      minHeight: 500,
    }}>
      <div style={{
        width: 100,
        height: 100,
        borderRadius: '50%',
        background: 'rgba(255,107,0,0.08)',
        border: '1px solid rgba(255,107,0,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 28,
      }}>
        <Calculator size={40} color="var(--accent-orange)" />
      </div>
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 32,
        color: 'rgba(255,255,255,0.4)',
        marginBottom: 12,
        letterSpacing: '0.02em',
      }}>
        Ready to Calculate?
      </div>
      <div style={{
        fontSize: 15,
        color: 'rgba(255,255,255,0.25)',
        lineHeight: 1.7,
        maxWidth: 300,
      }}>
        Fill in your details on the left and click Calculate to see your personalized results
      </div>
    </div>
  )
}

// Result Card Component
function ResultCard({
  result,
  bmiColor,
  goal,
}: {
  result: { bmi: number; category: string; calories: number; target: number }
  bmiColor: string
  goal: string
}) {
  return (
    <div style={{
      border: '1px solid rgba(255,107,0,0.2)',
      background: 'rgba(14,14,14,0.95)',
      backdropFilter: 'blur(20px)',
      position: 'relative',
      overflow: 'hidden',
      clipPath: 'polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))',
      animation: 'slideInRight 0.5s cubic-bezier(0.16,1,0.3,1)',
    }}>
      <div style={{
        height: 3,
        background: 'linear-gradient(90deg, var(--accent-orange), #ff9500)',
      }} />

      <div style={{ padding: '40px 36px 44px' }}>
        {/* BMI Score */}
        <div style={{
          textAlign: 'center',
          paddingBottom: 28,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: 28,
        }}>
          <div style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.4)',
            marginBottom: 16,
          }}>
            Your BMI Score
          </div>
          <div style={{
            fontFamily: 'Bebas Neue',
            fontSize: 96,
            color: bmiColor,
            lineHeight: 1,
            marginBottom: 16,
            animation: 'scaleIn 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {result.bmi}
          </div>
          <div style={{
            display: 'inline-block',
            padding: '6px 20px',
            borderRadius: 2,
            background: `${bmiColor}15`,
            border: `1px solid ${bmiColor}40`,
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: bmiColor,
          }}>
            {result.category}
          </div>

          {/* BMI Range Bar */}
          <div style={{ marginTop: 24 }}>
            <div style={{
              height: 10,
              background: 'rgba(255,255,255,0.04)',
              borderRadius: 5,
              overflow: 'hidden',
              position: 'relative',
            }}>
              <div style={{
                height: '100%',
                borderRadius: 5,
                background: 'linear-gradient(90deg, #3b82f6, #22c55e 40%, #eab308 70%, #ef4444)',
                width: '100%',
              }} />
              <div style={{
                position: 'absolute',
                top: -3,
                height: 16,
                width: 4,
                borderRadius: 2,
                background: '#fff',
                boxShadow: '0 0 12px rgba(255,255,255,0.8), 0 0 4px ' + bmiColor,
                left: `${Math.min(Math.max((result.bmi - 10) / 30 * 100, 0), 100)}%`,
                transform: 'translateX(-50%)',
                transition: 'left 0.8s cubic-bezier(0.16,1,0.3,1)',
              }} />
            </div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 8,
            }}>
              {['10', '18.5', '25', '30', '40'].map(v => (
                <span key={v} style={{
                  fontSize: 9,
                  color: 'rgba(255,255,255,0.3)',
                  fontWeight: 600,
                }}>
                  {v}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Calorie Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 24,
        }}>
          <CalorieCard
            label="Maintenance"
            value={result.calories}
            icon={<Flame size={18} />}
            color="#3b82f6"
          />
          <CalorieCard
            label="Target Goal"
            value={result.target}
            icon={<Target size={18} />}
            color="var(--accent-orange)"
          />
        </div>

        {/* Recommendation */}
        <div style={{
          padding: '20px 24px',
          background: 'rgba(255,107,0,0.06)',
          border: '1px solid rgba(255,107,0,0.2)',
          borderRadius: 4,
          marginBottom: 24,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: 'rgba(255,107,0,0.15)',
              border: '1px solid rgba(255,107,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}>
              {goal === 'loss' ? <TrendingDown size={16} color="var(--accent-orange)" /> : <TrendingUp size={16} color="var(--accent-orange)" />}
            </div>
            <div>
              <div style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--accent-orange)',
                marginBottom: 6,
              }}>
                Personalized Recommendation
              </div>
              <div style={{
                fontSize: 13,
                color: 'rgba(255,255,255,0.65)',
                lineHeight: 1.7,
              }}>
                Based on your stats, consume{' '}
                <span style={{ color: 'var(--accent-orange)', fontWeight: 700 }}>
                  {result.target} kcal/day
                </span>{' '}
                to achieve your {goal === 'loss' ? 'weight loss' : 'weight gain'} goal.
              </div>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <button
          className="btn-primary"
          onClick={() => {
            const el = document.getElementById('contact')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          style={{
            width: '100%',
            padding: '16px',
            fontSize: 11,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
          }}
        >
          Get Custom Plan from Trainers
        </button>
      </div>

      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  )
}

// Calorie Card Component
function CalorieCard({
  label,
  value,
  icon,
  color,
}: {
  label: string
  value: number
  icon: React.ReactNode
  color: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.02)',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)'}`,
        padding: '18px 20px',
        borderRadius: 4,
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        cursor: 'default',
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 10,
      }}>
        <div style={{ color: color, display: 'flex' }}>
          {icon}
        </div>
        <div style={{
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
        }}>
          {label}
        </div>
      </div>
      <div style={{
        fontFamily: 'Bebas Neue',
        fontSize: 32,
        color: color,
        lineHeight: 1,
      }}>
        {value}
        <span style={{
          fontSize: 16,
          color: 'rgba(255,255,255,0.3)',
          marginLeft: 4,
        }}>
          kcal
        </span>
      </div>
    </div>
  )
}
