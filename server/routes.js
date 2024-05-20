import {
    generateAuthenticationOptions, generateRegistrationOptions, verifyAuthenticationResponse, verifyRegistrationResponse
} from '@simplewebauthn/server';
import express from 'express';
const router = express.Router();

// states =====================================================
const userStore = {};
const challengeStore = {};

// routes & controllers =======================================
router.post('/register', (req, res) => {
    const { username, password } = req.body;
    const userId = `user_${Date.now()}`;

    const user = {
        userId, username, password
    };
    userStore[userId] = user;
    console.log(`register successful`, userStore[userId]);

    return res.status(201).json({ userId });
});

router.post('/register-challenge', async (req, res) => {
    const { userId } = req.body;
    if (!userStore[userId]) {
        return res.status(404).json({
            error: 'User not found!'
        });
    }

    const user = userStore[userId];
    const challengePayload = await generateRegistrationOptions({
        // eslint-disable-next-line no-undef
        rpID: process.env.RP_ID,
        rpName: 'Client Machine',
        userName: user.username,
    })

    challengeStore[userId] = challengePayload.challenge;

    console.log('/register-challenge route called, OPTIONS:', challengePayload);
    return res.status(201).json({ options: challengePayload });
});

router.post('/register-verify', async (req, res) => {
    const { userId, cred } = req.body;
    if (!userStore[userId]) {
        return res.status(404).json({
            error: 'User not found!'
        });
    }

    const user = userStore[userId];
    const challenge = challengeStore[userId];

    const verificationResult = await verifyRegistrationResponse({
        expectedChallenge: challenge,
        expectedOrigin: process.env.CLIENT_URL,
        expectedRPID: process.env.RP_ID,
        response: cred,
    });

    if (!verificationResult.verified) {
        return res.status(500).json({
            error: 'Could not verify'
        });
    }
    userStore[userId].passkey = verificationResult.registrationInfo;
    return res.status(200).json({
        verified: true
    })
});

router.post('/login-challenge', async (req, res) => {
    const { userId } = req.body;
    if (!userStore[userId]) return res.status(404).json({
        error: 'User not found!'
    })
    const opts = await generateAuthenticationOptions({
        rpID: process.env.RP_ID,
    });
    challengeStore[userId] = opts.challenge;

    return res.status(200).json({ options: opts });
})

router.post('/login-verify', async (req, res) => {
    const { userId, cred } = req.body;
    if (!userStore[userId]) {
        return res.status(404).json({
            error: 'User not found!'
        });
    }

    const user = userStore[userId];
    const challenge = challengeStore[userId];

    const verificationResult = await verifyAuthenticationResponse({
        expectedChallenge: challenge,
        expectedOrigin: process.env.CLIENT_URL,
        expectedRPID: process.env.RP_ID,
        response: cred,
        authenticator: user.passkey
    });

    if (!verificationResult.verified) {
        return res.status(500).json({
            error: 'Could not verify the login'
        });
    }

    // Login the user: Session, Cookies,JWT
    return res.status(200).json({
        success: true,
        userId
    })
});
export default router;