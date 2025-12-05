const supabase = require('../config/supabase');

console.log("Auth Controller Loaded - Version 3 (Enhanced Error Handling)");

const register = async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body;

    // Validate required fields
    if (!email || !password || !firstName || !lastName || !username) {
        return res.status(400).json({
            error: 'MISSING_FIELDS',
            message: 'All fields are required',
            details: {
                email: !email ? 'Email is required' : null,
                password: !password ? 'Password is required' : null,
                firstName: !firstName ? 'First name is required' : null,
                lastName: !lastName ? 'Last name is required' : null,
                username: !username ? 'Username is required' : null
            }
        });
    }

    try {
        console.log(`[REGISTER] Starting registration for email: ${email}, username: ${username}`);

        // Generate default avatar using ui-avatars.com service
        const defaultAvatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=random&color=fff&size=128&font-size=0.5&length=1&uppercase=true`;

        // Create Auth User with metadata
        // The `handle_new_user` trigger (SECURITY DEFINER) will create the profile
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: firstName,
                    last_name: lastName,
                    username: username,
                    avatar_url: defaultAvatarUrl
                },
                emailRedirectTo: undefined // Disable email confirmation for now
            }
        });

        if (authError) {
            console.error('[REGISTER] Supabase auth error:', {
                message: authError.message,
                status: authError.status,
                name: authError.name,
                code: authError.code
            });

            // If auth error is about database trigger, try manual profile creation
            if (authError.message && authError.message.includes('Database error')) {
                console.log('[REGISTER] Database trigger failed, this is expected. Auth user was still created.');
                // The auth user was created, but the trigger failed
                // We'll create the profile manually below if we have the user ID
            } else {
                return res.status(400).json({
                    error: 'AUTH_ERROR',
                    message: authError.message,
                    details: authError
                });
            }
        }

        const userId = authData?.user?.id;

        if (!userId) {
            console.error('[REGISTER] Registration failed - no user ID returned');
            return res.status(400).json({
                error: 'REGISTRATION_FAILED',
                message: 'Registration failed - no user created'
            });
        }

        console.log(`[REGISTER] Auth user created - ID: ${userId}, Email: ${email}`);

        // FALLBACK: Manually create profile if trigger failed
        // This will work if you have SERVICE_ROLE_KEY configured
        try {
            console.log('[REGISTER] Attempting manual profile creation as fallback...');

            const { data: existingProfile, error: checkError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', userId)
                .single();

            if (!existingProfile) {
                // Profile doesn't exist, create it manually
                const { error: profileError } = await supabase
                    .from('profiles')
                    .insert({
                        id: userId,
                        first_name: firstName,
                        last_name: lastName,
                        username: username,
                        avatar_url: defaultAvatarUrl,
                        email: email
                    });

                if (profileError) {
                    console.error('[REGISTER] Manual profile creation failed:', profileError);
                    // CRITICAL: If profile creation fails, we MUST fail the registration
                    // to keep data consistent.
                    return res.status(500).json({
                        error: 'PROFILE_CREATION_FAILED',
                        message: 'Error creating user profile. Please try again.',
                        details: profileError
                    });
                } else {
                    console.log('[REGISTER] Manual profile created successfully');
                }
            } else {
                console.log('[REGISTER] Profile already exists (trigger succeeded)');
            }
        } catch (fallbackError) {
            console.error('[REGISTER] Fallback profile creation error:', fallbackError);
            return res.status(500).json({
                error: 'PROFILE_CREATION_FAILED',
                message: 'Unexpected error creating user profile.',
                details: fallbackError.message
            });
        }

        // Check if email confirmation is required
        if (authData.user && !authData.session) {
            console.log('[REGISTER] Email confirmation required');
            return res.status(200).json({
                message: 'Registration successful! Please check your email to confirm your account.',
                user: authData.user,
                requireEmailConfirmation: true
            });
        }

        console.log('[REGISTER] Registration completed successfully');
        res.status(201).json({
            message: 'User registered successfully',
            user: authData.user,
            session: authData.session
        });

    } catch (err) {
        console.error('[REGISTER] Unexpected error during registration:', {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        res.status(500).json({
            error: 'INTERNAL_ERROR',
            message: 'Internal server error',
            details: process.env.NODE_ENV === 'development' ? err.message : undefined
        });
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

        // Fetch user profile to get role
        console.log('[LOGIN DEBUG] User ID:', data.user.id);

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role, id, username')
            .eq('id', data.user.id)
            .single();

        console.log('[LOGIN DEBUG] Profile fetched:', profile);
        console.log('[LOGIN DEBUG] Profile error:', profileError);

        if (profileError) {
            console.error('Error fetching profile during login:', profileError);
        }

        const roleToReturn = profile?.role || 'user';
        console.log('[LOGIN DEBUG] Role to return:', roleToReturn);

        res.json({
            session: data.session,
            user: data.user,
            role: roleToReturn
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { register, login };
