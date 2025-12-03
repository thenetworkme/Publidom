const supabase = require('../config/supabase');

console.log("Auth Controller Loaded - Version 2 (Fix Applied)");

const register = async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body;

    if (!email || !password || !firstName || !lastName || !username) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Generate default avatar (First letter of username in uppercase)
        // We can use a simple text representation or a placeholder URL if needed.
        // The user asked for "only the first letter of the username in uppercase".
        // Since avatar_url is usually a URL, we might want to store just the letter if the frontend handles it,
        // OR generate a UI-ready URL (like ui-avatars.com).
        // However, the frontend `PersonalInfo.tsx` logic currently does: {user.first_name?.[0]}{user.last_name?.[0]}
        // It seems the frontend expects to render initials if no image.
        // But the user specifically asked: "como foto default (avatar) de cada user solo pon la primera letra del username en mayuscula"
        // I will store the letter in `avatar_url`? No, that's confusing.
        // I will store `null` or a specific string, but wait.
        // If I store the letter in `avatar_url`, the frontend `<Avatar>` component might try to load it as an image.
        // Let's look at `SettingsPage.tsx`:
        // <AvatarFallback>{user?.first_name?.[0]}{user?.last_name?.[0]}</AvatarFallback>
        // It uses Fallback.
        // If I want to "set" it, maybe I don't need to do anything if the fallback logic is what they want?
        // BUT they said "first letter of the *username*". Currently it uses First Name + Last Name initials.
        // So I should probably update the Frontend to use the username initial if avatar is missing?
        // OR, I can generate an image URL using a service like ui-avatars.com?
        // "https://ui-avatars.com/api/?name=Username&background=random"
        // This is a common best practice.
        // Let's use ui-avatars.com or similar to generate a real image URL, which satisfies "foto default".

        const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&font-size=0.5&length=1&uppercase=true`;

        // 1. Create Auth User
        // We pass profile data in `options.data`. The `handle_new_user` trigger (which runs as SECURITY DEFINER)
        // will pick this up and insert it into the `profiles` table, bypassing RLS.
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    avatar_url: defaultAvatarUrl
                }
            }
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        if (!authData.user) {
            return res.status(400).json({ error: 'Registration failed' });
        }

        // 2. Profile Creation
        // We rely on the database trigger `handle_new_user` to create the profile.
        // We do NOT perform a manual insert here because:
        // a) It causes RLS errors if we don't have the Service Role Key or a valid session.
        // b) The trigger is the robust, atomic way to ensure profile creation on signup.

        // Check if email confirmation is required
        if (authData.user && !authData.session) {
            return res.status(200).json({
                message: 'Registration successful! Please check your email to confirm your account.',
                user: authData.user,
                requireEmailConfirmation: true
            });
        }

        res.status(201).json({ message: 'User registered successfully', user: authData.user });

    } catch (err) {
        console.error('Registration error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            if (error.message === 'Email not confirmed') {
                return res.status(401).json({
                    error: 'Email not confirmed',
                    message: 'Por favor verifica tu correo electrónico para iniciar sesión.'
                });
            }
            return res.status(401).json({ error: error.message });
        }

        res.json({ session: data.session, user: data.user });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login };
