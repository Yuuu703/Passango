// src/pages/Profile.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Popup';

function Profile() {
  const [buttonswitch,setbuttonswitch]=useState(false);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user');
        }

        setUser(data);
        setEmail(data.email);
      } catch (err) {
        console.error('Fetch user error:', err);
        setError(err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const requestData = { email };
    if (password) {
      requestData.password = password;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setSuccess(data.message);
      setUser({ ...user, email: data.user.email });
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
    }
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  
  return (
    <div className="container_profile">
      <Header />
      <main>
        <div className="profile_header">
          <h2>User Profile</h2>
          <img src='public/images/music 2.jpg' classname='profile_logo'></img>
        </div>
        <div className='user_content'>
          <h2>ACCOUNT</h2>
          <div className='edit_profile'>
            <img src='public/images/pen_icon.png' className='img_profile'></img>
            <p>Edit profile</p>
          </div>
          <div className='Playlists_profile'>
            <img src='public/images/list_icon.png' className='img_profile'></img>
            <p>Recent playlists</p>
          </div>
          <div className='reset_profile' onClick={()=>setbuttonswitch(true)}>
            <img src='public/images/unlock_icon.png' className='img_profile'></img>
            <p>Reset password</p>
          </div>
          <div>
          <Modal trigger={buttonswitch} setTrigger={setbuttonswitch}>
            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
            {success && <p style={{ color: 'green', textAlign: 'center' }}>{success}</p>}
            <form onSubmit={handleSubmit}>
              {/*adding below div for styling*/ }
              <div className='profile_email'> 
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Entering your email"
                />
              </div>
              {/*adding below div for styling*/ }
              <div className='profile_newpass'>
                <label htmlFor="password">New Password</label> <p>(leave blank to keep current)</p>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                />

              {/* The below button classname is wrong*/}
                <button type="submit" className="btn btn-login">
                  Update Profile
                </button>
              </div>
            </form>
          </Modal>
          </div>
        </div>

      </main>
       <Footer /> 
    </div>
  );
}

export default Profile;