import React, { useState, useEffect, useRef } from 'react';
import { Mail, MapPin, Send, CheckCircle2, Copy, Check, Mic, MicOff, Phone, MessageCircle, AlertCircle, ExternalLink, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PortfolioData } from '../types';
import { createSpeechRecognizer } from '../utils/voice';

interface ContactProps {
  data: PortfolioData;
}

export const Contact: React.FC<ContactProps> = ({ data }) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [lastSubmittedMessage, setLastSubmittedMessage] = useState<typeof formData | null>(null);

  // Voice Typing States
  const [isListening, setIsListening] = useState(false);
  const [voiceSupported, setVoiceSupported] = useState(true);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const recipientEmail = data.email || 'soumadipd43@gmail.com';
  const rawPhoneNumber = data.phone.replace(/[^+\d]/g, '') || '+917547949426';
  const whatsappNumber = rawPhoneNumber.replace('+', ''); // e.g. 917547949426

  useEffect(() => {
    // Check if SpeechRecognition is available in window
    if (typeof window !== 'undefined') {
      const hasSpeech = 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
      setVoiceSupported(hasSpeech);
    }
  }, []);

  const handleCopyEmail = () => {
    if (!recipientEmail) return;
    navigator.clipboard.writeText(recipientEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText(data.phone || '+91-7547949426');
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const toggleVoiceTyping = () => {
    setVoiceError(null);

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    const recognizer = createSpeechRecognizer(
      (transcript) => {
        setFormData((prev) => ({
          ...prev,
          message: prev.message ? `${prev.message} ${transcript}`.trim() : transcript.trim(),
        }));
      },
      (error) => {
        setVoiceError(`Voice typing: ${error}. Check mic permissions.`);
        setIsListening(false);
      },
      () => {
        setIsListening(false);
      }
    );

    if (!recognizer) {
      setVoiceSupported(false);
      setVoiceError('Voice typing is not supported in this browser. You can type normally.');
      return;
    }

    recognitionRef.current = recognizer;
    try {
      recognizer.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Failed to start speech recognition', e);
      setIsListening(false);
    }
  };

  // Generate WhatsApp Direct URL
  const getWhatsAppUrl = (customMsg?: string) => {
    const textToEncode = customMsg || 
      `Hi Soumadip, I am reaching out from your portfolio website.\n\n` +
      `*Name:* ${formData.name || 'Visitor'}\n` +
      `*Email:* ${formData.email || 'Not provided'}\n` +
      (formData.subject ? `*Subject:* ${formData.subject}\n` : '') +
      `*Message:* ${formData.message || 'I would like to connect with you regarding an opportunity.'}`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textToEncode)}`;
  };

  // Generate Mailto URL
  const getMailtoUrl = () => {
    const subject = encodeURIComponent(formData.subject ? `[Portfolio] ${formData.subject}` : `[Portfolio Inquiry] From ${formData.name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
    );
    return `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Real submission using FormSubmit AJAX API to soumadipd43@gmail.com
      const endpoint = `https://formsubmit.co/ajax/${recipientEmail}`;
      const payload = {
        name: formData.name,
        email: formData.email,
        _subject: `[Portfolio Inquiry from ${formData.name}] ${formData.subject || 'Project / Opportunity'}`,
        message: formData.message,
        _replyto: formData.email,
        _template: 'table',
        _captcha: 'false',
      };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }

      const result = await response.json();
      if (result.success === 'false' || result.success === false) {
        throw new Error(result.message || 'Failed to deliver message');
      }

      setLastSubmittedMessage({ ...formData });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      console.warn('FormSubmit AJAX dispatch notice:', err);
      // Even if network or CORS prevents the AJAX call, save current message and provide immediate direct options
      setLastSubmittedMessage({ ...formData });
      // If network fails (e.g. adblocker), notify and open direct fallback
      setSubmitError(
        'Direct server delivery was delayed or intercepted by network rules. You can deliver this note directly via WhatsApp or your Email client below with 1 click!'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setSubmitError(null);
  };

  return (
    <section id="contact" className="py-20 px-4 sm:px-6 border-t border-stone-200/80 bg-white">
      <div className="max-w-5xl mx-auto">
        {/* Section Heading */}
        <div className="mb-12">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md">
            05 // Connect
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight mt-2">
            Let's Build Something Together
          </h2>
          <p className="text-sm text-stone-600 mt-1.5 max-w-xl">
            Have a project in mind, an engineering role, or a collaboration? Type below or use the <strong>Voice Typing</strong> feature to dictate your message!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* WhatsApp Direct Card (Highest priority for instant messaging) */}
            <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-emerald-600 text-white shadow-xs">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-800">
                    Instant WhatsApp Chat
                  </span>
                  <a
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-bold text-stone-900 hover:text-emerald-700 block mt-0.5"
                  >
                    +91 7547949426
                  </a>
                  <p className="text-xs text-stone-600 mt-0.5">
                    Fastest response for urgent inquiries & projects.
                  </p>
                </div>
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs shrink-0 inline-flex items-center gap-1"
              >
                <span>Chat</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Email Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-200/90 text-stone-800">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-stone-400">Direct Email</span>
                  <a
                    href={`mailto:${recipientEmail}`}
                    className="text-sm font-bold text-stone-900 hover:text-emerald-700 block mt-0.5 break-all"
                  >
                    {recipientEmail}
                  </a>
                  <p className="text-xs text-stone-500 mt-0.5">
                    For proposals, formal inquiries & documentation.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyEmail}
                  className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-white rounded-xl transition-colors cursor-pointer border border-stone-200"
                  title="Copy Email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Phone Number Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs flex items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl bg-stone-200/90 text-stone-800">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-mono text-stone-400">Direct Phone</span>
                  <a
                    href={`tel:${rawPhoneNumber}`}
                    className="text-sm font-bold text-stone-900 hover:text-emerald-700 block mt-0.5"
                  >
                    {data.phone || '+91-7547949426'}
                  </a>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Available for scheduled audio calls & interviews.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handleCopyPhone}
                  className="p-2 text-stone-500 hover:text-emerald-700 hover:bg-white rounded-xl transition-colors cursor-pointer border border-stone-200"
                  title="Copy Phone number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={`tel:${rawPhoneNumber}`}
                  className="px-3 py-1.5 text-xs font-semibold text-stone-700 bg-white border border-stone-200 hover:border-emerald-300 rounded-xl transition-colors cursor-pointer"
                >
                  Call
                </a>
              </div>
            </div>

            {/* Location Card */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200/90 shadow-xs flex items-start gap-3.5">
              <div className="p-2.5 rounded-xl bg-stone-200/80 text-stone-700">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xs font-mono text-stone-400">Location & Timezone</span>
                <p className="text-sm font-semibold text-stone-900 mt-0.5">
                  {data.location || 'Haldia, West Bengal, India (IST / UTC+5:30)'}
                </p>
                <p className="text-xs text-stone-500 mt-0.5">
                  Open to remote roles, hybrid opportunities & global relocation.
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-900 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Response Time Guarantee</span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">
                Messages sent via this portal are dispatched directly to Soumadip Das's private inbox. You will receive an acknowledgment within 24 hours.
              </p>
            </div>
          </div>

          {/* Contact Form with Multi-Channel Delivery */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl bg-stone-50 border border-stone-200 shadow-sm">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-8 flex flex-col items-center justify-center text-center space-y-4"
                >
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-300">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-stone-900">
                      Message Dispatched to Soumadip Das!
                    </h3>
                    <p className="text-sm text-stone-600 max-w-md">
                      Your note has been transmitted to <strong>{recipientEmail}</strong>. A copy was saved and sent.
                    </p>
                  </div>

                  {lastSubmittedMessage && (
                    <div className="w-full max-w-md p-4 rounded-2xl bg-white border border-stone-200 text-left text-xs space-y-1.5 shadow-2xs">
                      <div className="text-stone-400 font-mono uppercase text-[10px]">Submitted Note Details:</div>
                      <p className="text-stone-800"><strong>From:</strong> {lastSubmittedMessage.name} ({lastSubmittedMessage.email})</p>
                      {lastSubmittedMessage.subject && (
                        <p className="text-stone-800"><strong>Subject:</strong> {lastSubmittedMessage.subject}</p>
                      )}
                      <p className="text-stone-600 italic line-clamp-3">"{lastSubmittedMessage.message}"</p>
                    </div>
                  )}

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
                    <a
                      href={getWhatsAppUrl(lastSubmittedMessage ? `Hi Soumadip, I just sent you a message through your portfolio website from ${lastSubmittedMessage.name} (${lastSubmittedMessage.email}): "${lastSubmittedMessage.message}"` : undefined)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Also Ping on WhatsApp (+91 7547949426)</span>
                    </a>

                    <button
                      onClick={resetForm}
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-stone-200 hover:border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Send Another Note</span>
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {submitError && (
                    <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-2">
                      <div className="flex items-center gap-2 font-semibold">
                        <AlertCircle className="w-4 h-4 text-amber-700 shrink-0" />
                        <span>Instant Delivery Notice</span>
                      </div>
                      <p className="text-amber-800 leading-relaxed">{submitError}</p>
                      <div className="pt-1 flex flex-wrap gap-2">
                        <a
                          href={getWhatsAppUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-xs hover:bg-emerald-700"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>Deliver via WhatsApp (1-Click)</span>
                        </a>
                        <a
                          href={getMailtoUrl()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 font-semibold text-xs hover:bg-stone-100"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Open in Email App</span>
                        </a>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-stone-500 mb-1.5">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Sarah Connor"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-stone-500 mb-1.5">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="sarah@example.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-stone-500 mb-1.5">
                      Subject / Topic
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Project Opportunity / Hackathon Collaboration / Job Offer"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-900 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-xs"
                    />
                  </div>

                  {/* Message Field with Voice Typing Feature */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-mono text-stone-500">
                        Message *
                      </label>

                      {/* Voice Typing Button */}
                      <button
                        type="button"
                        onClick={toggleVoiceTyping}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer shadow-xs ${
                          isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border border-stone-200'
                        }`}
                        title={isListening ? 'Click to stop dictation' : 'Click to voice type your message'}
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-3.5 h-3.5" />
                            <span>Listening... (Click to stop)</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Voice Type Dictation</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="relative">
                      <textarea
                        required
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder={
                          isListening
                            ? 'Speak now! Your voice is converting into text...'
                            : 'Type your message or click "Voice Type Dictation" to speak into your mic...'
                        }
                        className={`w-full px-3.5 py-2.5 rounded-xl bg-white border text-stone-900 text-sm focus:outline-none transition-all resize-y shadow-xs ${
                          isListening
                            ? 'border-emerald-500 ring-2 ring-emerald-200'
                            : 'border-stone-200 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500'
                        }`}
                      />

                      {/* Listening Wave Effect */}
                      {isListening && (
                        <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-md border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                          <span className="text-[10px] font-mono text-stone-600">Recording...</span>
                        </div>
                      )}
                    </div>

                    {voiceError && (
                      <p className="text-[11px] text-amber-700 mt-1">
                        {voiceError}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm transition-all disabled:opacity-50 cursor-pointer shadow-sm hover:shadow-emerald-200"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending directly to Soumadip...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4" />
                          <span>Send Message (Email)</span>
                        </>
                      )}
                    </button>

                    <a
                      href={getWhatsAppUrl()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold text-sm transition-all shadow-2xs"
                      title="Direct WhatsApp chat"
                    >
                      <MessageCircle className="w-4 h-4 text-emerald-600" />
                      <span>Send via WhatsApp</span>
                    </a>

                    <a
                      href={getMailtoUrl()}
                      className="hidden md:inline-flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:text-stone-900 text-xs font-medium transition-all"
                      title="Open default email application"
                    >
                      <Mail className="w-3.5 h-3.5 text-stone-400" />
                      <span>Mail App</span>
                    </a>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
