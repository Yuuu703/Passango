// src/pages/Inside.jsx
import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Hero from '../components/Hero';
import Featured from '../components/Featured';
import Subscription from '../components/Subscription';

function Inside() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await fetch('/api/auth/me', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok) {
            setUser(data);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } catch (error) {
          console.error('Error fetching user:', error);
        }
      }
    };

    fetchUser();
  }, []);

  return (
    <section id="inside" className="page active">
      <Header />
      <main>
        {user && <p>Welcome, {user.email}!</p>}
        <Hero
          title="Create your style"
          description="Take a music video and turn its raw sound into chords and tabs in an instant. Starting from scratch, our platform decodes the notes hidden in every beat, delivering a playable blueprint for guitarists and learners. It’s your shortcut from hearing a tune to mastering it, no matter the source."
          buttonText="CREATE MUSIC"
          buttonLink="/create"
          imageSrc="/images/music-is-my-drug.png"
        />
        <Featured onDiscoverClick={() => window.location.href = '/create'} />
      </main>
      <Footer />
    </section>
  );
}

export default Inside;