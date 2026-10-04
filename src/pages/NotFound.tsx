import React from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'

export const NotFound: React.FC = () => (
  <div className="flex min-h-[60vh] items-center justify-center py-16">
    <div className="card w-full max-w-md p-8 text-center animate-fade-up">
      <img
        src="/static/images/rimuru-slime.png"
        alt=""
        width={72}
        height={72}
        className="mx-auto object-contain opacity-90"
        style={{ height: 72, width: 72 }}
      />
      <p className="eyebrow mt-4">404 // not found</p>
      <h1 className="mt-2 font-display text-2xl font-bold text-text">This page slipped away</h1>
      <p className="mt-2 text-sm text-muted">The page you're looking for doesn't exist or has moved.</p>
      <Link to="/" className="btn-primary mt-6">
        <ArrowLeft className="h-4 w-4" />
        Back home
      </Link>
    </div>
  </div>
)
