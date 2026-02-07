import React from 'react';
import { Layout } from '../components/layout/Layout';
import { BookOpen, Video, Users, Heart, Mail } from 'lucide-react';
import { Button } from '../components/ui/Button';

export const AboutPage: React.FC = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative py-20 border-b border-vercel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-white mb-4">About KnightyTV</h1>
          <p className="text-lg text-vercel-muted max-w-3xl mx-auto">
            Our mission is to spread authentic knowledge through engaging videos and content, making it accessible to everyone worldwide.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-white mb-6">Our Story</h2>
              <p className="text-gray-400 mb-4">
                KnightyTV was founded in 2025 with a simple goal: to make authentic knowledge accessible to everyone. We recognized the need for high-quality, engaging content that presents teachings in a way that resonates with modern audiences.
              </p>
              <p className="text-gray-400 mb-4">
                What started as a small project has grown into a platform that reaches thousands of viewers worldwide. Our team consists of dedicated individuals who are passionate about creating content that is both educational and inspiring.
              </p>
              <p className="text-gray-400">
                We collaborate with scholars and educators to ensure that our content is accurate and authentic. Our videos cover a wide range of topics, from educational content to spiritual development.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden border border-vercel-border">
              <img 
                src="https://images.unsplash.com/photo-1585036156171-384164a8c675?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1280&q=80" 
                alt="Islamic architecture" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-20 border-t border-vercel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-vercel-card border border-vercel-border p-6 rounded-lg text-center transition-all duration-200 hover:border-gray-500">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white text-black mb-4">
                <BookOpen className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Authenticity</h3>
              <p className="text-vercel-muted text-sm">
                We are committed to presenting authentic knowledge based on verified sources.
              </p>
            </div>

            <div className="bg-vercel-card border border-vercel-border p-6 rounded-lg text-center transition-all duration-200 hover:border-gray-500">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white text-black mb-4">
                <Video className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Quality</h3>
              <p className="text-vercel-muted text-sm">
                We strive for excellence in content and production, ensuring our videos are engaging and informative.
              </p>
            </div>

            <div className="bg-vercel-card border border-vercel-border p-6 rounded-lg text-center transition-all duration-200 hover:border-gray-500">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white text-black mb-4">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Inclusivity</h3>
              <p className="text-vercel-muted text-sm">
                We create content that is accessible to everyone of all backgrounds and levels of knowledge.
              </p>
            </div>

            <div className="bg-vercel-card border border-vercel-border p-6 rounded-lg text-center transition-all duration-200 hover:border-gray-500">
              <div className="mx-auto w-12 h-12 flex items-center justify-center rounded-full bg-white text-black mb-4">
                <Heart className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Community</h3>
              <p className="text-vercel-muted text-sm">
                We foster a supportive community where people can learn and grow together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 border-t border-vercel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-12 text-center">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-vercel-card border border-vercel-border rounded-lg overflow-hidden transition-all duration-200 hover:border-gray-500">
              <img 
                src="https://cdn.talkie-ai.com/talkie-user-img/82979249090716/122750949904503-2.jpeg" 
                alt="Team member" 
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-1">KNIGHT</h3>
                <p className="text-white font-medium text-sm mb-3">OWNER</p>
                <p className="text-vercel-muted text-sm">
                  WEB DEVELOPPER
                </p>
              </div>
            </div>
            
       
           
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 border-t border-vercel-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Get in Touch</h2>
            <p className="text-lg text-vercel-muted max-w-3xl mx-auto">
              Have questions or suggestions? We'd love to hear from you!
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-vercel-card border border-vercel-border rounded-lg p-8">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    className="w-full rounded-lg border border-vercel-border bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-gray-500 transition-colors duration-200"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="w-full rounded-lg border border-vercel-border bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-gray-500 transition-colors duration-200"
                    placeholder="Your email"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  className="w-full rounded-lg border border-vercel-border bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-gray-500 transition-colors duration-200"
                  placeholder="Subject"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-lg border border-vercel-border bg-black px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-white/25 focus:border-gray-500 transition-colors duration-200"
                  placeholder="Your message"
                />
              </div>
              <div className="text-center">
                <Button 
                  variant="primary" 
                  size="lg" 
                  leftIcon={<Mail className="h-5 w-5" />}
                >
                  Send Message
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </Layout>
  );
};