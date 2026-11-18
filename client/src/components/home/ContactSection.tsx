'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Taxation & Advisory',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const ctx = gsap.context(() => {
      // Left column slide
      gsap.fromTo(
        '.contact-details',
        { x: -30, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.75,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Section line expansion
      gsap.fromTo(
        '.contact-accent-line',
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
          },
        }
      );

      // Right form slide
      if (formRef.current) {
        gsap.fromTo(
          formRef.current,
          { x: 30, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.75,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
            },
          }
        );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = `Website inquiry - ${formData.service}`;
    const body = [
      `Name: ${formData.name}`,
      `Email: ${formData.email}`,
      `Service: ${formData.service}`,
      '',
      'Message:',
      formData.message,
    ].join('\n');

    const composeUrl = new URL('https://mail.google.com/mail/');
    composeUrl.search = new URLSearchParams({
      view: 'cm',
      fs: '1',
      to: 'info@qwca.pk',
      su: subject,
      body: body,
    }).toString();

    setSubmitted(true);
    window.open(composeUrl.toString(), '_blank');
  };

  return (
    <section ref={sectionRef} className="section contact" id="contact">
      <div className="container contact-grid">
        <div className="contact-details">
          <span className="eyebrow">Get In Touch</span>
          <div
            className="contact-accent-line section-accent-line"
            style={{ transformOrigin: 'left center' }}
          />
          <h2>Contact QWCA</h2>
          <p>
            Have a question or need dedicated professional advisory? Contact our Faisalabad office or send us an enquiry below.
          </p>

          <div className="contact-list">
            <div className="contact-item">
              <div className="contact-icon" aria-hidden="true">
                <Phone size={18} strokeWidth={2.2} />
              </div>
              <div className="contact-item-text">
                <strong>Phone</strong>
                <a href="tel:+92415392192">+92-41-5392192</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon" aria-hidden="true">
                <Mail size={18} strokeWidth={2.2} />
              </div>
              <div className="contact-item-text">
                <strong>Email</strong>
                <a href="mailto:info@qwca.pk">info@qwca.pk</a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon" aria-hidden="true">
                <MapPin size={18} strokeWidth={2.2} />
              </div>
              <div className="contact-item-text">
                <strong>Address</strong>
                <span>20 - J Commercial Plaza, 4th Floor, Main Boulevard, Wapda City, Faisalabad, Pakistan</span>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon" aria-hidden="true">
                <Clock size={18} strokeWidth={2.2} />
              </div>
              <div className="contact-item-text">
                <strong>Office Hours</strong>
                <span>Monday – Saturday: 9:00 AM – 5:00 PM (Closed on Sundays)</span>
              </div>
            </div>
          </div>

          <div className="contact-social-channels">
            <span className="social-channels-label">Connect with us directly:</span>
            <div className="social-pills-row">
              <a
                href="https://www.linkedin.com/in/qummar-waheed-aca-ab3b3164/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill linkedin"
                aria-label="View Managing Partner Qummar Waheed's LinkedIn profile"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.46 1.46 0 0 0-2.91 0c0 .8.65 1.45 1.46 1.45m1.37 9.74v-8.37H5.09v8.37z" />
                </svg>
                <span>Qummar Waheed · Managing Partner</span>
              </a>

              <a
                href="https://www.linkedin.com/company/qummar-waheed-chartered-accountants/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="social-pill linkedin"
                aria-label="Follow QWCA on LinkedIn"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.45 1.45 0 0 0 1.45-1.45 1.46 1.46 0 0 0-2.91 0c0 .8.65 1.45 1.46 1.45m1.37 9.74v-8.37H5.09v8.37z" />
                </svg>
                <span>LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <form ref={formRef} onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="Name"
              autoComplete="name"
              placeholder="Your Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="Email"
              type="email"
              autoComplete="email"
              placeholder="name@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="service">Service</label>
            <select
              id="service"
              name="Service"
              value={formData.service}
              onChange={(e) => setFormData({ ...formData, service: e.target.value })}
            >
              <option>Taxation &amp; Advisory</option>
              <option>Audit &amp; Assurance</option>
              <option>SECP &amp; Corporate Services</option>
              <option>SEZ Advisory</option>
              <option>Foreign / Chinese Company Registration</option>
              <option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="Message"
              placeholder="How can our practice assist your business?"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            ></textarea>
          </div>
          <button className="button" type="submit">
            <span>Send Message</span>
            <Send size={16} />
          </button>

          {submitted && (
            <p style={{ marginTop: '12px', color: '#2b8a3e', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} />
              Opening Gmail draft to send your message to info@qwca.pk!
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
