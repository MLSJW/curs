import nodemailer from 'nodemailer';

// For testing, use Ethereal (fake SMTP)
// In production, replace with real SMTP or service like SendGrid

const transporter = nodemailer.createTestAccount().then(account => {
    return nodemailer.createTransporter({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: account.user, // generated ethereal user
            pass: account.pass, // generated ethereal password
        },
    });
}).catch(err => {
    console.error('Failed to create test account:', err);
    // Fallback to console logging
    return {
        sendMail: (mailOptions) => {
            console.log('Email would be sent:', mailOptions);
            return Promise.resolve({ messageId: 'console-logged' });
        }
    };
});

export const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify?token=${token}`;

    const mailOptions = {
        from: '"Telega3" <noreply@telega3.com>', // sender address
        to: email, // list of receivers
        subject: 'Verify your email for Telega3', // Subject line
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2>Welcome to Telega3!</h2>
                <p>Thank you for signing up. Please verify your email address by clicking the link below:</p>
                <a href="${verificationUrl}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 10px 0;">Verify Email</a>
                <p>If the button doesn't work, copy and paste this link into your browser:</p>
                <p>${verificationUrl}</p>
                <p>This link will expire in 24 hours.</p>
                <p>If you didn't sign up for Telega3, please ignore this email.</p>
            </div>
        `,
    };

    try {
        const transporterInstance = await transporter;
        const info = await transporterInstance.sendMail(mailOptions);
        console.log('Verification email sent:', nodemailer.getTestMessageUrl(info));
        // For Ethereal, it provides a URL to view the email
    } catch (error) {
        console.error('Error sending email:', error);
    }
};