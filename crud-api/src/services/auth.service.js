const { supabase } = require('../supabase-client');
const { ValidationError } = require('../errors');

async function signUp(email, password) {
  if (!email || !password) {
    throw new ValidationError('email and password are required');
  }

  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error) {
    throw new ValidationError(error.message);
  }

  return data.user;
}

async function logIn(email, password) {
  if (!email || !password) {
    throw new ValidationError('email and password are required');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    throw new ValidationError('Invalid login credentials');
  }

  return {
    access_token: data.session.access_token,
    refresh_token: data.session.refresh_token,
  };
}

async function verifyToken(token) {
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return null;
  }

  return data.user;
}

async function logOut() {
  await supabase.auth.signOut();
}

module.exports = { signUp, logIn, verifyToken, logOut };