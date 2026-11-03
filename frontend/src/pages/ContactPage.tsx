import React, { useState } from 'react'
import {
  Mail,
  Clock,
  MessageCircle,
  ChevronDown,
  ChevronUp,
  Send,
  Truck,
} from 'lucide-react'
import { FAQS } from '../data/mockData'
import { useToast } from '../context/ToastContext'

export const ContactPage: React.FC = () => {
  const { showToast } = useToast()

  // FAQ accordion state
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Contact form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [topic, setTopic] = useState('Order & Shipping')
  const [message, setMessage] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !email.trim() || !message.trim()) return

    setSubmitted(true)
    showToast('Message sent', "We've received your note and will reply shortly.", 'success')
    setName('')
    setEmail('')
    setMessage('')
  }

  const toggleFaq = (idx: number) => {
    setOpenFaqIndex(openFaqIndex === idx ? null : idx)
  }

  return (
    <main className="page-content contact-page-root">
      <div className="page-heading">
        <div>
          <p className="eyebrow">Customer Care & Concierge</p>
          <h1>
            We are here to <em>assist.</em>
          </h1>
        </div>
        <p>
          Whether you have a sizing question, need delivery updates, or want material advice, our studio team is on hand.
        </p>
      </div>

      <div className="contact-layout">
        {/* Contact Form */}
        <div className="contact-form-column">
          <div className="form-card-wrap">
            <h2>Send a message</h2>
            <p className="form-sub">
              Our concierge team usually responds within 2–4 business hours.
            </p>

            {submitted ? (
              <div className="contact-success-banner">
                <MessageCircle size={28} />
                <h3>Thank you for reaching out</h3>
                <p>
                  Your message has been assigned to our care team. We will email you at your address as soon as possible.
                </p>
                <button
                  className="outline-button"
                  onClick={() => setSubmitted(false)}
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="contact-form">
                <div className="form-row">
                  <label>Your Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Alex Morgan"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="alex@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label>Topic of Inquiry</label>
                  <select
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="styled-select"
                  >
                    <option value="Order & Shipping">Order & Shipping Status</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Product Sizing & Materials">Product Sizing & Materials</option>
                    <option value="Press & Collaborations">Press & Collaborations</option>
                    <option value="General Question">General Question</option>
                  </select>
                </div>

                <div className="form-row">
                  <label>Message *</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How can we help you today?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <button type="submit" className="primary-button submit-btn">
                  Send Message <Send size={15} />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Contact Info & Channels */}
        <aside className="contact-info-column">
          <div className="channel-cards">
            <div className="channel-card">
              <Mail size={20} />
              <div>
                <strong>Direct Email Concierge</strong>
                <p>care@shopsphere.io</p>
                <small>Mon–Fri, 9am–6pm EST</small>
              </div>
            </div>

            <div className="channel-card">
              <Clock size={20} />
              <div>
                <strong>Response Window</strong>
                <p>Average reply: 2.5 hours</p>
                <small>Weekend queries handled Monday morning</small>
              </div>
            </div>

            <div className="channel-card">
              <Truck size={20} />
              <div>
                <strong>Fulfillment Studio</strong>
                <p>Porto Atelier & San Francisco Hub</p>
                <small>Orders ship within 24 hours</small>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Frequently Asked Questions Section */}
      <section className="faq-section" id="faq">
        <div className="faq-heading">
          <span className="eyebrow">Quick Answers</span>
          <h2>Frequently Asked Questions</h2>
        </div>

        <div className="faq-accordion">
          {FAQS.map((faq, index) => {
            const isOpen = openFaqIndex === index
            return (
              <div
                key={index}
                className={`faq-item ${isOpen ? 'open' : ''}`}
                onClick={() => toggleFaq(index)}
              >
                <div className="faq-question-row">
                  <h3>{faq.question}</h3>
                  <button className="faq-toggle-icon" aria-label="Toggle answer">
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>
                {isOpen && <p className="faq-answer">{faq.answer}</p>}
              </div>
            )
          })}
        </div>
      </section>
    </main>
  )
}
