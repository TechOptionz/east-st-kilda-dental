  'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { business, telHref } from '@/lib/business'

type DropKey = 'services' | 'newpatients' | 'about' | 'costs' | 'more' | null

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [openDrop, setOpenDrop] = useState<DropKey>(null)
  const navRef = useRef<HTMLElement>(null)

  function toggleDrop(k: DropKey) {
    setOpenDrop(prev => prev === k ? null : k)
  }

  function close() {
    setMenuOpen(false)
    setOpenDrop(null)
  }

  useEffect(() => {
    function onOut(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpenDrop(null)
    }
    document.addEventListener('mousedown', onOut)
    return () => document.removeEventListener('mousedown', onOut)
  }, [])

  return (
    <header className="site-header" ref={navRef}>
      <div className="nav">
        <Link href="/" className="logo" aria-label="East St Kilda Dental — home">
          East St Kilda Dental<small>Gentle care since 1980</small>
        </Link>

        <nav className={`mainmenu${menuOpen ? ' open' : ''}`} aria-label="Main">
          <ul>
            {/* <li><Link href="/" className="menu-link" onClick={close}>Home</Link></li> */}

            {/* New Patients */}
            <li className={`has-dd${openDrop === 'newpatients' ? ' open' : ''}`}>
              <button className="menu-link" onClick={() => toggleDrop('newpatients')} aria-expanded={openDrop === 'newpatients'}>
                New Patients
              </button>
              <div className="dd">
                <Link href="/new-patient-comprehensive-care-visit" onClick={close}>The New Patient Comprehensive Care Visit</Link>
                <Link href="/#faq" onClick={close}>FAQ</Link>
              </div>
            </li>

            {/* Services mega-menu */}
            <li className={`has-dd has-mega${openDrop === 'services' ? ' open' : ''}`}>
              <button className="menu-link" onClick={() => toggleDrop('services')} aria-expanded={openDrop === 'services'}>
                Services
              </button>
              <div className="dd mega">
                <div className="mega-start">
                  <span className="col-title">Start here</span>
                  <Link href="/services" onClick={close}>All Services</Link>
                  <Link href="/new-patient-comprehensive-care-visit" onClick={close}>New patients</Link>
                  <Link href="/nervous-patients" onClick={close}>Nervous patients</Link>
                  <Link href="/emergency-dentist" onClick={close}>Emergency</Link>
                  <Link href="/services/check-ups" onClick={close}>Check-up</Link>
                </div>
                <div>
                  <div className="col-title">General &amp; Preventive</div>
                  <Link href="/services/check-ups" onClick={close}>Check-ups &amp; Exams</Link>
                  <Link href="/services/cleans-and-hygiene" onClick={close}>Cleans &amp; Hygiene</Link>
                  <Link href="/services/childrens-dentistry" onClick={close}>Children&apos;s Dentistry</Link>
                  <Link href="/services/mouthguards" onClick={close}>Mouthguards</Link>
                  <Link href="/services/tmj-jaw-pain" onClick={close}>TMJ &amp; Jaw Pain</Link>
                  <Link href="/nervous-patients" onClick={close}>Anxiety &amp; Gentle Care</Link>
                  <Link href="/services/myofunctional-therapy" onClick={close}>Myofunctional Therapy</Link>
                </div>
                <div>
                  <div className="col-title">Restorative</div>
                  <Link href="/services/fillings" onClick={close}>Fillings &amp; Restorations</Link>
                  <Link href="/services/crowns-and-bridges" onClick={close}>Crowns &amp; Bridges</Link>
                  <Link href="/services/root-canal" onClick={close}>Root Canal Therapy</Link>
                  <Link href="/services/onlays-and-inlays" onClick={close}>Onlays &amp; Inlays</Link>
                  <Link href="/services/dentures" onClick={close}>Dentures</Link>
                  <Link href="/services/extractions-wisdom-teeth" onClick={close}>Extractions &amp; Wisdom Teeth</Link>
                </div>
                <div>
                  <div className="col-title">Cosmetic</div>
                  <Link href="/services/smile-design" onClick={close}>Smile Design</Link>
                  <Link href="/services/veneers" onClick={close}>Veneers</Link>
                  <Link href="/services/teeth-whitening" onClick={close}>Teeth Whitening</Link>
                  <div className="col-title">Orthodontics</div>
                  <Link href="/services/invisalign" onClick={close}>Invisalign / Clear Aligners</Link>
                  <Link href="/services/braces" onClick={close}>Braces</Link>
                  <div className="col-title">Implants</div>
                  <Link href="/services/dental-implants" onClick={close}>Single Implants</Link>
                  <Link href="/services/all-on-4-implants" onClick={close}>All-on-4 / Full Arch</Link>
                  <Link href="/services/bone-grafting" onClick={close}>Bone Grafting</Link>
                  <div className="col-title">Emergency</div>
                  <Link href="/emergency-dentist" onClick={close}>Emergency Dentistry</Link>
                </div>
                <div className="mega-concern">
                  <span className="col-title">By concern</span>
                  <Link href="/learn/bleeding-gums" onClick={close}>Bleeding gums</Link>
                  <Link href="/services/check-ups" onClick={close}>Sensitive teeth</Link>
                  <Link href="/emergency-dentist" onClick={close}>Toothache</Link>
                  <Link href="/services/cleans-and-hygiene" onClick={close}>Bad breath</Link>
                  <Link href="/emergency-dentist" onClick={close}>Broken tooth</Link>
                </div>
              </div>
            </li>

            <li className="nav-extra"><Link href="/nervous-patients" className="menu-link" onClick={close}>Gentle Dentistry</Link></li>

                        {/* About */}
            <li className={`has-dd${openDrop === 'about' ? ' open' : ''}`}>
              <button className="menu-link" onClick={() => toggleDrop('about')} aria-expanded={openDrop === 'about'}>
                About
              </button>
              <div className="dd">
                <Link href="/areas-we-serve" onClick={close}>Areas We Serve</Link>
                <Link href="/about/our-story" onClick={close}>Our Story</Link>
                <Link href="/about/why-were-different" onClick={close}>Why We&apos;re Different</Link>
                <Link href="/about/our-team" onClick={close}>Meet Our Team</Link>
                <Link href="/our-work" onClick={close}>Smile Gallery</Link>
              </div>
            </li>
            
            <li className="nav-extra"><Link href="/learn" className="menu-link" onClick={close}>Dental Education</Link></li>


            {/* Costs & Support */}
            <li className={`has-dd${openDrop === 'costs' ? ' open' : ''}`}>
              <button className="menu-link" onClick={() => toggleDrop('costs')} aria-expanded={openDrop === 'costs'}>
                Costs &amp; Support
              </button>
              <div className="dd">
                <Link href="/fees" onClick={close}>Fees Guide</Link>
                <Link href="/fees#payment" onClick={close}>Payment Options</Link>
                <Link href="/fees#funds" onClick={close}>Health Funds We Accept</Link>
                <Link href="/using-your-super" onClick={close}>Using Your Super</Link>
              </div>
            </li>

            <li className="nav-extra"><Link href="/contact" className="menu-link" onClick={close}>Contact</Link></li>

            {/* More — overflow menu shown only between 900px and 1700px */}
            <li className={`has-dd nav-more${openDrop === 'more' ? ' open' : ''}`}>
              <button className="menu-link" onClick={() => toggleDrop('more')} aria-expanded={openDrop === 'more'} aria-label="More menu options">
                <span aria-hidden="true">&#x22EF;</span>
              </button>
              <div className="dd">
                <Link href="/nervous-patients" onClick={close}>Gentle Dentistry</Link>
                <Link href="/learn" onClick={close}>Dental Education</Link>
                <Link href="/contact" onClick={close}>Contact</Link>
              </div>
            </li>
          </ul>
        </nav>

        {/* Right CTAs */}
        <div className="nav-right">
          <Link href="/emergency-dentist" className="btn-emergency-nav">
            <span className="ed-dot" />
            Emergency
          </Link>
          <a href={telHref} className="phone">
            <span className="phone-full">{business.telephoneDisplay}</span>
            <span className="phone-mini">Call us</span>
          </a>
          <Link href="/online-booking" className="btn">
            Book your visit
          </Link>
          <button
            className={`menu-toggle${menuOpen ? ' active' : ''}`}
            aria-label="Toggle menu"
            onClick={() => setMenuOpen(p => !p)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>
    </header>
  )
}
