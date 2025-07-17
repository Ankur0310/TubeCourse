import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Brain, Clock, Users, Zap, CheckCircle } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-20 pb-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold mb-8">
            Transform YouTube Playlists into{' '}
            <span className="bg-gradient-to-r from-red-600 via-red-700 to-red-800 bg-clip-text text-transparent">
              Interactive Courses
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
            TubeCourse uses AI to convert any YouTube playlist into a structured, engaging course
            complete with modules, quizzes, and projects. Perfect for educators, trainers, and content creators.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              to="/generator"
              className="bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>Start Creating</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <button className="bg-white text-gray-700 px-8 py-4 rounded-xl font-semibold border-2 border-gray-200 hover:border-red-300 hover:bg-red-50 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                icon: Brain,
                title: 'AI-Powered Analysis',
                description: 'Advanced AI analyzes video content to create structured learning modules'
              },
              {
                icon: Clock,
                title: 'Instant Generation',
                description: 'Convert entire playlists into courses in minutes, not hours'
              },
              {
                icon: Users,
                title: 'Interactive Learning',
                description: 'Auto-generated quizzes, projects, and assessments for better engagement'
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl border border-gray-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-700 rounded-xl flex items-center justify-center mb-6 mx-auto">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6">Unlock the Power of Your Content</h2>
            <p className="text-xl text-gray-600">Seamlessly transform videos into engaging learning experiences</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-8">Smart Course Generation</h3>
              <div className="space-y-6">
                {[
                  'Automatic video clustering into logical modules',
                  'AI-generated lesson summaries and key points',
                  'Interactive quiz questions with multiple choice options',
                  'Hands-on project suggestions with code examples',
                  'Estimated duration and difficulty levels',
                  'Target audience identification'
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-100 to-red-200 p-8 rounded-2xl">
              <div className="bg-white p-6 rounded-xl shadow-lg">
                <h4 className="font-semibold mb-4">Course Generation Preview</h4>
                <div className="space-y-3">
                  <div className="h-4 bg-gradient-to-r from-red-200 to-red-300 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Content?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join creators transforming their content with TubeCourse.
          </p>
          <Link
            to="/generator"
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-800 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};
