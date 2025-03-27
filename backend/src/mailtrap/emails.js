import { transporter } from "./email.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, WELCOME_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, PASSWORD_RESET_OTP_TEMPLATE } from "./emailTemplate.js";


export const sendVerificationEmail = async(email,verificationCode)=>{
    try {
     const response = await transporter.sendMail({
            from: '"Chat friendly" <chatfriendlybits@gmail.com>',

            to: email, // list of receivers
            subject: "Verify your Email", // Subject line
            text: "Verify your Email", // plain text body
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}",verificationCode)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}
export const sendWelcomeEmail = async(email,name)=>{
    try {
     const response = await transporter.sendMail({
            from: '"Chat friendly" <chatfriendlybits@gmail.com>',

            to: email, // list of receivers
            subject: "Welcome Email", // Subject line
            text: "Welcome Email", // plain text body
            html: WELCOME_EMAIL_TEMPLATE.replace("{name}",name)
        })
        console.log('Email send Successfully',response)
    } catch (error) {
        console.log('Email error',error)
    }
}

export const sendResetSuccessEmail = async (email) => {
	try {
		const response = await transporter.sendMail({
			from: '"Chat friendly" <chatfriendlybits@gmail.com>',
			to: email,
			subject: "Password Reset Successful",
			text:"Password Reset Successful",
			html: PASSWORD_RESET_SUCCESS_TEMPLATE,
			category: "Password Reset",
		});

		console.log("Password reset email sent successfully", response);
	} catch (error) {
		console.error(`Error sending password reset success email`, error);

		throw new Error(`Error sending password reset success email: ${error}`);
	}
};
export const sendPasswordResetOTPEmail = async (email, otp) => {
    try {
        const emailContent = PASSWORD_RESET_OTP_TEMPLATE.replace("{otp}", otp); // ✅ Replace `{otp}`

        const response = await transporter.sendMail({
            from: '"Chat Friendly" <chatfriendlybits@gmail.com>',
            to: email,
            subject: "Your OTP for Password Reset",
            text: `Your OTP for password reset is: ${otp}`,  // ✅ Send OTP in plain text
            html: emailContent,  // ✅ Send the updated email template
            category: "Password Reset",
        });

        console.log(`✅ Password reset OTP email sent successfully to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending password reset OTP email`, error);
        throw new Error(`Error sending password reset OTP email: ${error}`);
    }
};


