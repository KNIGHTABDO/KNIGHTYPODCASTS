import React from 'react';
import { Layout } from '../components/layout/Layout';
import { BookOpen, Video, Users, Heart, Mail, Tv, Shield, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { useLanguageStore } from '../store/languageStore';

export const AboutPage: React.FC = () => {
  const { translate } = useLanguageStore();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-knighty-bg via-transparent to-knighty-bg z-0" />
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-knighty-accent text-black text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
            Our Mission
          </span>
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
            {translate('about.title')}
          </h1>
          <p className="text-xl md:text-2xl text-knighty-muted max-w-3xl mx-auto leading-relaxed">
            {translate('about.mission')}
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-24 bg-knighty-card/20 border-y border-knighty-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="w-12 h-1 bg-knighty-accent rounded-full block"></span>
                {translate('about.story.title')}
              </h2>
              <p className="text-lg text-knighty-muted leading-relaxed">
                {translate('about.story.text1')}
              </p>
              <p className="text-lg text-knighty-muted leading-relaxed">
                {translate('about.story.text2')}
              </p>
              
              <div className="grid grid-cols-2 gap-6 mt-8">
                <div className="bg-knighty-card border border-knighty-border p-4 rounded-xl">
                  <div className="text-3xl font-bold text-white mb-1">500+</div>
                  <div className="text-sm text-knighty-muted uppercase tracking-wide">Videos</div>
                </div>
                <div className="bg-knighty-card border border-knighty-border p-4 rounded-xl">
                  <div className="text-3xl font-bold text-white mb-1">10k+</div>
                  <div className="text-sm text-knighty-muted uppercase tracking-wide">Community</div>
                </div>
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-knighty-accent/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative rounded-2xl overflow-hidden border border-knighty-border shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=2070&auto=format&fit=crop" 
                  alt="Starry Night Knowledge" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-knighty-bg via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{translate('about.values.title')}</h2>
            <p className="text-knighty-muted max-w-2xl mx-auto">The core principles that drive everything we do at KnightyTV.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: 'Authenticity', desc: 'Committed to verified, reliable sources.' },
              { icon: Tv, title: 'Quality', desc: 'Cinematic production and clear audio.' },
              { icon: Globe, title: 'Inclusivity', desc: 'Content accessible to everyone, everywhere.' },
              { icon: Heart, title: 'Community', desc: 'Growing together in faith and knowledge.' },
            ].map((value, index) => (
              <div key={index} className="group bg-knighty-card border border-knighty-border p-8 rounded-xl text-center hover:border-knighty-accent/30 transition-all duration-300">
                <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-knighty-hover text-white mb-6 group-hover:bg-knighty-accent group-hover:text-black transition-colors">
                  <value.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                <p className="text-knighty-muted text-sm leading-relaxed">
                  {value.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-24 border-t border-knighty-border/50 bg-knighty-card/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-16 text-center">{translate('about.team.title')}</h2>
          
          <div className="flex justify-center">
            <div className="group bg-knighty-card border border-knighty-border rounded-xl overflow-hidden hover:border-knighty-accent/50 transition-all duration-300 max-w-sm w-full">
              <div className="aspect-[4/5] overflow-hidden relative">
                <img 
                  src="https://cdn.talkie-ai.com/talkie-user-img/82979249090716/122750949904503-2.jpeg" 
                  alt="Team member" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-knighty-card to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-2xl font-bold text-white mb-1">KNIGHT</h3>
                  <p className="text-knighty-accent font-bold text-sm tracking-widest uppercase">Owner & Founder</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-knighty-muted text-sm leading-relaxed">
                  Lead Developer and visionary behind KnightyTV. Dedicated to merging technology with authentic knowledge sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 border-t border-knighty-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{translate('about.contact.title')}</h2>
            <p className="text-lg text-knighty-muted max-w-3xl mx-auto">
              {translate('about.contact.subtitle')}
            </p>
          </div>
          
          <div className="max-w-2xl mx-auto bg-knighty-card border border-knighty-border rounded-2xl p-8 md:p-10 shadow-2xl">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white ml-1">
                    {translate('about.contact.name')}
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-4 py-3 text-white placeholder-knighty-muted focus:border-knighty-accent focus:ring-1 focus:ring-knighty-accent outline-none transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-white ml-1">
                    {translate('about.contact.email')}
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-4 py-3 text-white placeholder-knighty-muted focus:border-knighty-accent focus:ring-1 focus:ring-knighty-accent outline-none transition-all"
                    placeholder="name@example.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-white ml-1">
                  {translate('about.contact.subject')}
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-4 py-3 text-white placeholder-knighty-muted focus:border-knighty-accent focus:ring-1 focus:ring-knighty-accent outline-none transition-all"
                  placeholder="How can we help?"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium text-white ml-1">
                  {translate('about.contact.message')}
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full bg-knighty-bg border border-knighty-border rounded-lg px-4 py-3 text-white placeholder-knighty-muted focus:border-knighty-accent focus:ring-1 focus:ring-knighty-accent outline-none transition-all resize-none"
                  placeholder="Your message..."
                />
              </div>
              <div className="pt-4">
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth
                  className="bg-white text-black hover:bg-gray-200 font-bold py-4"
                  leftIcon={<Mail className="h-5 w-5 fill-black" />}
                >
                  {translate('about.contact.send')}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};
