const supabase = require('../services/supabaseService');

const jwt = require('jsonwebtoken');

// Signup
const signup = async (req, res) => {
  try {
    const { email, password, fullName, phone, country, city, bio } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signUp({ 
      email, 
      password,
      options: {
        data: {
          full_name: fullName || ''
        }
      }
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Create user profile in custom users table
    if (data.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert({
          id: data.user.id,
          email: data.user.email,
          full_name: fullName || '',
          phone: phone || null,
          country: country || null,
          city: city || null,
          bio: bio || null
        });

      if (profileError) {
        console.error('Error creating user profile:', profileError);
        // Don't fail the signup if profile creation fails
      }
    }

    res.status(201).json({ 
      user: data.user, 
      message: 'Signup successful. Check your email for confirmation.' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: data.user.id, 
        email: data.user.email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({ 
      user: data.user, 
      session: data.session,
      token: token,
      message: 'Login successful' 
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Logout
const logout = async (req, res) => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user profile (protected)
const profile = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);

    if (authError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    // Get user profile from custom users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (userError) {
      console.error('Error fetching user profile:', userError);
      // Return basic auth data if profile not found
      return res.json({ 
        user: authData.user,
        profile: null,
        message: 'Profile not found in database'
      });
    }

    res.json({ 
      user: authData.user,
      profile: userData
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Password reset request
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.CLIENT_URL || 'http://localhost:3000'}/reset-password`,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Password reset email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update password
const updatePassword = async (req, res) => {
  try {
    const { password } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const { data, error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Verify email
const verifyEmail = async (req, res) => {
  try {
    const { token, type } = req.query;
    
    if (!token || !type) {
      return res.status(400).json({ error: 'Token and type are required' });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: token,
      type: type
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Email verified successfully', user: data.user });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update user profile (protected)
const updateProfile = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { fullName, phone, country, city, bio, website, twitterHandle, githubUsername } = req.body;

    const { data, error } = await supabase
      .from('users')
      .update({
        full_name: fullName,
        phone: phone,
        country: country,
        city: city,
        bio: bio,
        website: website,
        twitter_handle: twitterHandle,
        github_username: githubUsername,
        updated_at: new Date().toISOString()
      })
      .eq('id', authData.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Profile updated successfully',
      profile: data
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get user favorites (protected)
const getFavorites = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .select('*')
      .eq('user_id', authData.user.id)
      .order('added_at', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ favorites: data });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add coin to favorites (protected)
const addToFavorites = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { coinId, coinName, coinSymbol } = req.body;
    
    if (!coinId) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }

    const { data, error } = await supabase
      .from('user_favorites')
      .insert({
        user_id: authData.user.id,
        coin_id: coinId,
        coin_name: coinName || '',
        coin_symbol: coinSymbol || ''
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') { // Unique constraint violation
        return res.status(400).json({ error: 'Coin already in favorites' });
      }
      return res.status(400).json({ error: error.message });
    }

    res.json({ 
      message: 'Coin added to favorites',
      favorite: data
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove coin from favorites (protected)
const removeFromFavorites = async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'Missing token' });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    const { coinId } = req.params;
    
    if (!coinId) {
      return res.status(400).json({ error: 'Coin ID is required' });
    }

    const { error } = await supabase
      .from('user_favorites')
      .delete()
      .eq('user_id', authData.user.id)
      .eq('coin_id', coinId);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({ message: 'Coin removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { 
  signup, 
  login, 
  logout, 
  profile, 
  updateProfile,
  getFavorites,
  addToFavorites,
  removeFromFavorites,
  requestPasswordReset, 
  updatePassword, 
  verifyEmail 
};
