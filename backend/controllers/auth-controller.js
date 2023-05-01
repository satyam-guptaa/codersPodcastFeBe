const otpService = require('../services/otp-service');
const hashService = require('../services/hash-service');
const userService = require('../services/user-service');
const tokenService = require('../services/token-service');
const UserDto = require('../dtos/user-dto')

class AuthController {
    //made async just to perform better
    async senOtp(req, res) {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ message: 'Phone field is required' });
        }
        // generate otp
        // made async to work properly
        const otp = await otpService.generateOtp();
        // data to hash with phone number and otp expire time
        const ttl = 1000 * 60 * 2  // 2mins
        const expires = Date.now() + ttl;
        const data = `${phone}${expires}${otp}`;
        const hash = hashService.hashOtp(data);
        // Send OTP
        try {
            // commented out to save money of free sms
            // await otpService.sendBySms(phone, otp);
            return res.json({
                hash: `${hash}.${expires}`,
                phone,
                otp,
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "Unable to send message" });
        }
    }

    async verifyOtp(req, res) {
        const { otp, phone, hash } = req.body;
        if (!otp || !hash || !phone) {
            return res.status(400).json({ message: 'All fields are required!' });
        };
        const [hashedOtp, expires] = hash.split('.');
        if (Date.now() > +expires) {
            return res.status(400).json({ message: 'Otp has beed expired!' });
        };
        // we will verify the hashing of below data with the sent data as they should be same
        const data = `${phone}${expires}${otp}`;
        const isValid = otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            return res.status(400).json({ message: "Invalid OTP!" });
        };

        let user;
        try {
            user = await userService.findUser({ phone });
            if (!user) {
                user = await userService.createUser({ phone });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: "DB error" });
        }

        // Generate Token
        const { accessToken, refreshToken } = tokenService.generateTokens({ _id: user._id, activated: false });
        //using cookies, 30days expiry, using http only making it secure so that client dont have access to it and only server can read it
        // Need to store this token in db so that on logout we can remove the token
        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie('refreshtoken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
        res.cookie('accesstoken', accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });

        const userDto = new UserDto(user);
        // so that client understands its authencticated hence a flag auth
        return res.json({ user: userDto, auth: true });
    }

    async refresh(req, res) {
        //get refresh token from cookie
        const { refreshtoken: refreshTokenFromCookie } = req.cookies;
        //check if refresh token valid
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(refreshTokenFromCookie);
        } catch (error) {
            return res.status(401).json({ message: 'Invalid Token' })
        }
        //check if refresh token is in database since on logout it will not there
        try {
            const token = await tokenService.findRefreshToken(userData._id, refreshTokenFromCookie);
            if (!token) {
                return res.status(401).json({ message: 'Invalid Token' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'Internal Error' });
        }
        //check or confirm if valid user
        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: 'No user' })
        }
        //generate new tokens
        const { refreshToken, accessToken } = tokenService.generateTokens({
            _id: userData._id
        })
        //update refresh token
        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken)
        } catch (error) {
            return res.status(500).json({ message: 'Internal Error' });
        }
        // and put in cookie and then send response, both new tokens
        res.cookie('refreshtoken', refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true
        });
        res.cookie('accesstoken', accessToken, {
            maxAge: 1000 * 60 * 60,
            httpOnly: true
        });
        //response
        const userDto = new UserDto(user);
        return res.json({ user: userDto, auth: true });
    }

    async logout(req, res) {
        const { refreshtoken } = req.cookies;
        //delete refresh token from db
        await tokenService.removeToken(refreshtoken);
        //delete cookies from browser
        res.clearCookie('refreshtoken');
        res.clearCookie('accesstoken');
        res.json({ user: null, auth: false });
    }
}

module.exports = new AuthController(); 