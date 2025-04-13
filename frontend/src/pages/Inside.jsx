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
        <div className='top_inside'>
          <div className='quote_inside'>
            <h2>Welcome to PassanGo: Your Ultimate Music Companion</h2>
            <p>Discover PassanGo, the music app that brings songs to life for musicians and enthusiasts alike. With powerful chord recognition, lyrics detection, and a simple, intuitive design, we make it easy to analyze, learn, and create music. Upload a song, uncover its chords and lyrics in real-time, and explore your creativity—all in one place. Powered by cutting-edge technology and a passion for music, PassanGo is here to inspire your musical journey.</p>
          </div>
          <div className='img_inside'> 
              <img src='public/images/radio.jpg' alt="RANDOM stuffs" />
          </div>
        </div>
        <Featured onDiscoverClick={() => window.location.href = '/create'} />
      </main>
      <Footer />
    </section>
  );
}

export default Inside;