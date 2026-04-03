import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

const FEATURES = [
  { icon: '💻', title: 'Digital Tasks', desc: 'Research, writing, data entry, code reviews, virtual assistance — delivered fast.', tag: 'Remote' },
  { icon: '📍', title: 'Physical Tasks', desc: 'On-ground execution, local deliveries, verification, field research across India.', tag: 'On-ground' },
  { icon: '⚡', title: 'Fast Execution', desc: 'Most tasks confirmed within 2 hours and completed in under 48 hours.', tag: 'Speed' },
  { icon: '🔁', title: 'Simple Workflow', desc: 'Post → Accept → Done. No complex bidding. No endless negotiation.', tag: 'Simple' },
];

const SAMPLE_TASKS = [
  '"Scrape 500 LinkedIn profiles into a CSV"',
  '"Verify this Bangalore address exists"',
  '"Translate 3 pages Hindi → English"',
  '"Buy and ship a product from a local store"',
  '"Fill out this government form"',
];

export default function Home() {
  const navigate = useNavigate();
  const [sampleIdx, setSampleIdx] = useState(0);

  useEffect(() => {
    const iv = setInterval(() => setSampleIdx(i => (i + 1) % SAMPLE_TASKS.length), 2400);
    return () => clearInterval(iv);
  }, []);

  return (
    <div>
      {/* Hero */}
      <section style={{
        minHeight: '100vh', padding: '100px 40px 80px',
        background: 'linear-gradient(158deg,#0C52A0 0%,#1568BF 15%,#2680D4 32%,#2E8CE8 46%,#5AAEF5 66%,#B8D9FA 82%,#EBF5FF 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 75% 60% at 50% 38%,rgba(255,255,255,.16) 0%,transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -1, left: 0, right: 0, height: 80, background: 'linear-gradient(to bottom,transparent,var(--sky-tint))', pointerEvents: 'none' }} />

        {/* Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 9, background: 'rgba(255,255,255,.18)', border: '1px solid rgba(255,255,255,.3)', borderRadius: 100, padding: '5px 16px 5px 11px', marginBottom: 28, fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.95)', letterSpacing: '.08em', textTransform: 'uppercase', backdropFilter: 'blur(10px)' }}>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#7EFFC0', flexShrink: 0, animation: 'pdot 2.2s ease-in-out infinite', display: 'inline-block' }} />
          AI-Powered Task Marketplace
        </div>

        <h1 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(42px,6.5vw,76px)', fontWeight: 800, color: '#fff', lineHeight: 1.04, letterSpacing: '-.04em', marginBottom: 20, maxWidth: 800 }}>
          <span style={{ color: 'rgba(255,255,255,.65)', fontWeight: 700 }}>From AI to reality —</span>
          <br />tasks executed.
        </h1>

        <p style={{ fontSize: 'clamp(15px,2vw,18px)', fontWeight: 400, color: 'rgba(255,255,255,.8)', maxWidth: 500, lineHeight: 1.7, marginBottom: 12 }}>
          Post any task. Get matched with skilled people across India. Digital or on-ground, remote or local.
        </p>

        <div style={{ fontSize: 12.5, color: 'rgba(255,255,255,.46)', marginBottom: 40, fontFamily: 'var(--fm)', letterSpacing: '.01em', maxWidth: 580, lineHeight: 1.9, minHeight: 22, transition: 'opacity .4s' }}>
          {SAMPLE_TASKS[sampleIdx]}
        </div>

        {/* Activity pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 28 }}>
          {['127 tasks live', '342 workers online', '98% completion rate'].map(t => (
            <div key={t} style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: 'rgba(0,0,0,.22)', border: '1px solid rgba(255,255,255,.14)', borderRadius: 100, padding: '5px 13px', fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,.78)', backdropFilter: 'blur(8px)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#22C55E', flexShrink: 0, boxShadow: '0 0 6px rgba(34,197,94,.8)', animation: 'pdot 1.8s ease-in-out infinite', display: 'inline-block' }} />
              {t}
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link to="/create-task" className="btn-primary" style={{ textDecoration: 'none', fontSize: 15.5, padding: '15px 34px', borderRadius: 12, boxShadow: '0 4px 24px rgba(245,108,29,.48)' }}>
            Post a Task →
          </Link>
          <Link to="/tasks" style={{ fontFamily: 'var(--fb)', fontSize: 15.5, fontWeight: 600, color: 'rgba(255,255,255,.95)', background: 'rgba(255,255,255,.14)', border: '2px solid rgba(255,255,255,.38)', cursor: 'pointer', padding: '15px 34px', borderRadius: 12, transition: 'all .22s', backdropFilter: 'blur(8px)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
            Browse Tasks
          </Link>
        </div>
      </section>

      {/* Trust strip */}
      <div style={{ background: 'var(--sky-stripe)', borderBottom: '1px solid var(--border-sky)', padding: '14px 40px', display: 'flex', justifyContent: 'center', gap: 52, flexWrap: 'wrap' }}>
        {[
          { icon: '✓', text: 'No hidden fees' },
          { icon: '⚡', text: 'Confirmed in 2 hrs' },
          { icon: '🔒', text: 'Secure payments' },
          { icon: '⭐', text: '4.9 avg rating' },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(46,140,232,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11 }}>{icon}</div>
            {text}
          </div>
        ))}
      </div>

      {/* Features */}
      <section style={{ background: '#fff', padding: '96px 40px' }}>
        <div style={{ maxWidth: 1120, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-label">How it works</div>
            <h2 className="section-title">Everything you need to get tasks done</h2>
            <p className="section-sub" style={{ margin: '0 auto', maxWidth: 520 }}>From AI-generated task lists to real-world execution — we bridge the gap between digital automation and physical action.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
            {FEATURES.map(f => (
              <div key={f.title} style={{ background: '#fff', border: '1.5px solid var(--border)', borderRadius: 'var(--rl)', padding: '28px 22px', transition: 'all .24s', cursor: 'default' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--sky)'; e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = 'var(--sh-sky)'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
              >
                <div style={{ width: 50, height: 50, borderRadius: 14, background: 'linear-gradient(135deg,#EEF6FF,#CCDDF7)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontFamily: 'var(--fd)', fontSize: 16, fontWeight: 700, color: 'var(--ink)', marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--ink3)', lineHeight: 1.65, marginBottom: 14 }}>{f.desc}</p>
                <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', padding: '3px 9px', borderRadius: 100, background: 'rgba(46,140,232,.08)', color: 'var(--sky-d)' }}>{f.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'linear-gradient(140deg,#0D52A0 0%,#1568BF 35%,var(--sky) 100%)', padding: '96px 40px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 68% 80% at 50% 50%,rgba(255,255,255,.09) 0%,transparent 68%)' }} />
        <div style={{ position: 'relative' }}>
          <h2 style={{ fontFamily: 'var(--fd)', fontSize: 'clamp(30px,4vw,52px)', fontWeight: 800, color: '#fff', letterSpacing: '-.035em', marginBottom: 16 }}>
            Ready to get things done?
          </h2>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,.68)', marginBottom: 44, fontWeight: 300 }}>
            Join thousands using rentanindian.ai to execute tasks at scale.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/auth?mode=register" className="btn-primary" style={{ textDecoration: 'none', fontSize: 15, padding: '13px 28px' }}>
              Get started free →
            </Link>
            <Link to="/tasks" style={{ fontFamily: 'var(--fb)', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,.9)', background: 'rgba(255,255,255,.12)', border: '2px solid rgba(255,255,255,.3)', padding: '13px 28px', borderRadius: 11, textDecoration: 'none', transition: 'all .2s', display: 'inline-flex', alignItems: 'center' }}>
              Browse Tasks
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
