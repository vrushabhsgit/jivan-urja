import Link from 'next/link';
import { Leaf, Phone, ShieldCheck } from 'lucide-react';
import DepthSurface from './depth-surface';

export default function PatientHero() {
  return <section className="hero patient-hero">
    <div className="patient-hero-photo"><img src="/assets/patient-consultation.webp" width={1672} height={941} alt="Illustrative consultation showing an Ayurvedic clinician examining an adult patient's knee" fetchPriority="high" /></div>
    <div className="patient-hero-wash" />
    <div className="container patient-hero-content">
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-line" />JIVAN URJA CHIKITSALAYA · PUNE</span>
        <h1>Natural knee<br />discomfort relief.<br /><em>Rooted in Ayurveda.</em></h1>
        <p className="hero-subtitle">Ayurvedic support for knee comfort</p>
        <p className="hero-description">Experience non-surgical Chikitsalay treatments designed to improve mobility and joint health. Rooted in tradition, backed by care.</p>
        <div className="hero-actions">
          <Link href="/request-consultation" className="button">Book your consultation</Link>
          <a href="tel:+918805777500" className="call-link"><span><Phone size={18} /></span>Call us free</a>
        </div>
        <div className="hero-proof"><ShieldCheck size={19} /><span>BAMS qualified doctors</span><span className="proof-divider" /><span>12+ years of experience</span></div>
      </div>
      <DepthSurface className="hero-note-depth" tilt={4}>
        <div className="hero-note"><span className="note-icon"><Leaf size={28} strokeWidth={1.4} /></span><div><strong>Traditional wisdom.<br />Personalized care.</strong><span>Specialized Ayurvedic care since 2012</span></div></div>
      </DepthSurface>
    </div>
  </section>;
}
