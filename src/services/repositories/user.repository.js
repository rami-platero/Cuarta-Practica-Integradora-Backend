import { config } from "../../config/variables.config.js";
import { AppError } from "../../helpers/AppError.js";
import bcrypt from "bcrypt";
import { EErrors } from "../errors/enums.js";
import { sendMail } from "../email/mailing.service.js";
import jwt from "jsonwebtoken";

export default class UserRepository {
  constructor(dao) {
    this.dao = dao;
  }

  register = async ({
    firstName,
    lastName,
    age,
    email,
    password: pass,
    strategy,
    username,
  }) => {
    try {
      // registering with GitHub
      if (strategy === "github") {
        return await this.dao.create({
          email,
          password: null,
          username,
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(pass, salt);

      const { password, ...newUser } = await this.dao.create({
        email,
        password: hashedPassword,
        firstName,
        lastName,
        username: `${firstName} ${lastName}`,
        age: Number(age),
      });

      return newUser;
    } catch (err) {
      if (err.code === 11000 && "email" in err.keyPattern) {
        throw new AppError({
          name: "Registration error.",
          message: "Error while trying to register.",
          code: EErrors.DUPLICATED,
          cause: `Email is already in use!`,
        });
      }
      throw new Error(err);
    }
  };

  login = async ({ email, password: pass }) => {
    if (email === config.ADMIN_EMAIL && pass === config.ADMIN_PASSWORD) {
      return {
        email,
        username: "Coderhouse",
        role: "admin",
      };
    }

    const foundUser = await this.dao.findOne({ email });
    if (!foundUser) {
      throw new AppError({
        name: "Login error.",
        message: "Error while trying to login.",
        code: EErrors.NOT_FOUND,
        cause: `User not found!`,
      });
    }

    const matches = bcrypt.compare(foundUser.password, pass);
    if (!matches) {
      throw new AppError({
        name: "Login error.",
        message: "Error while trying to login.",
        code: EErrors.INVALID_CREDENTIALS,
        cause: `Credentials don't match!`,
      });
    }

    this.updateLastConnection(foundUser._id);

    const { password, ...loggedUser } = foundUser;
    return loggedUser;
  };

  findGitHubEmail = async (accessToken) => {
    const res = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });
    const emails = await res.json();
    if (!emails || emails.length === 0) {
      throw new AppError({
        name: "Github Auth error.",
        message: "Error while trying to login/register.",
        code: EErrors.EXTERNAL,
        cause: `Couldn't find any emails from the github emails request.`,
      });
    }
    // Sort by primary email - the user may have several emails, but only one of them will be primary
    const sortedEmails = emails.sort((a, b) => b.primary - a.primary);
    return sortedEmails[0].email;
  };

  forgotPassword = async (email) => {
    const foundUser = await this.dao.findOne({ email });

    if (!foundUser) {
      throw new AppError({
        name: "Forgot password error.",
        message: "Error while trying to send reset email.",
        code: EErrors.NOT_FOUND,
        cause: `We can't find a user with the email you provided.`,
      });
    }

    const resetPasswordToken = jwt.sign({ email }, config.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    const resetPasswordLink = `${config.BASE_URL}/reset-password?token=${resetPasswordToken}`;

    await sendMail({
      targetUser: email,
      subject: "Reset password",
      html: `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h1 style="color: #444;">Password Reset Request</h1>
    <p>Hello,</p>
    <p>We received a request to reset your password for your Gaming Components account. If you did not make this request, you can ignore this email.</p>
    <p>Click the button below to reset your password. This link will expire in 1 hour for your security.</p>
    <a href="${resetPasswordLink}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; font-size: 16px; color: #fff; background-color: #007bff; border-radius: 5px; text-decoration: none;">Reset Password</a>
    <p>If the button above does not work, copy and paste the following link into your web browser:</p>
    <p><a href="${resetPasswordLink}" style="color: #007bff;">${resetPasswordLink}</a></p>
    <p>Thank you,<br/>The Gaming Components Team</p>
</div>`,
    });
  };

  resetPassword = async ({ token, password }) => {
    const decoded = jwt.verify(token, config.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        switch (err.name) {
          case "JsonWebTokenError":
            throw new AppError({
              name: "Reset password error.",
              message: "Error while trying to reset password.",
              code: EErrors.TOKEN_ERROR,
              cause: `The token provided is invalid.`,
            });
          case "TokenExpiredError":
            throw new AppError({
              name: "Reset password error.",
              message: "Error while trying to reset password.",
              code: EErrors.TOKEN_ERROR,
              cause: `The token provided has expired.`,
            });
          default:
            throw new AppError({
              name: "Reset password error.",
              message: "Error while trying to reset password.",
              code: EErrors.TOKEN_ERROR,
              cause: `The token provided is invalid.`,
            });
        }
      }
      return decoded;
    });

    const foundUser = await this.dao.findOne({ email: decoded.email });
    if (!foundUser) {
      throw new AppError({
        name: "Reset password error.",
        message: "Error while trying to reset password.",
        code: EErrors.NOT_FOUND,
        cause: `User not found!.`,
      });
    }

    // avoids comparison error if password is null, in cases of users registered using other services (i.e: google, github)
    if (foundUser.password) {
      const matches = bcrypt.compare(foundUser.password, password);
      if (matches) {
        throw new AppError({
          name: "Reset password error.",
          message: "Error while trying to reset password.",
          code: EErrors.CREDENTIALS_ERROR,
          cause: `You cannot use the same old password for the reset.`,
        });
      }
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    return await this.dao.updateOne(
      { _id: foundUser._id },
      { password: hashedPassword }
    );
  };

  changeRole = async (uid) => {
    const foundUser = await this.dao.findOne({ _id: uid });
    if (!foundUser) {
      throw new AppError({
        name: "Change role error.",
        message: "Error while trying to change the role.",
        code: EErrors.NOT_FOUND,
        cause: `User not found!.`,
      });
    }

    const newRole = foundUser.role === "premium" ? "user" : "premium";

    if(newRole === "premium"){
      const documents = foundUser.documents || []
      const hasAllDocuments = ["identificacion", "comprobanteEstado", "comprobanteDomicilio"].every((docName)=>{
        return documents.some((doc)=>{
          return doc.name === docName
        })
      })

      if(!hasAllDocuments){
        throw new AppError({
          name: "Change role error.",
          message: "Error while trying to change the role.",
          code: EErrors.NOT_FOUND,
          cause: `Missing documents.`,
        });
      }
    }

    await this.dao.updateOne({ _id: foundUser._id }, { role: newRole });
    return newRole;
  };

  updateLastConnection = async (uid) => {
    return this.dao.updateOne({_id: uid}, { last_connection: new Date() });
  };

  updateDocuments = async (uid, files) => {
    const foundUser = await this.dao.findOne({ _id: uid });
    if (!foundUser) {
      throw new AppError({
        name: "Update documents role error.",
        message: "Error while trying to update user's documents.",
        code: EErrors.NOT_FOUND,
        cause: `User not found!.`,
      });
    }

    let documents = foundUser.documents || [];

    const previousDocsNames = documents.map((d) => {
      return d.name;
    });

    Object.keys(files).forEach((field) => {
      const file = files[field][0];
      if (previousDocsNames.includes(field)) {
        documents = documents.map((d) => {
          if (d.name === file.name) {
            return {
              ...d,
              reference: file.path.split("public")[1].replace(/\\/g, "/"),
            };
          }
          return d;
        });
      } else {
        documents.push({
          name: field,
          reference: file.path.split("public")[1].replace(/\\/g, "/"),
        });
      }
    });

    return this.dao.updateOne({_id: uid}, { documents });
  };

  updateProfilePicture = async (uid, file) => {
    const foundUser = await this.dao.findOne({ _id: uid });
    if (!foundUser) {
      throw new AppError({
        name: "Update documents role error.",
        message: "Error while trying to update user's documents.",
        code: EErrors.NOT_FOUND,
        cause: `User not found!.`,
      });
    }

    return await this.dao.updateOne({_id: uid}, {
      profilePicture: file.path.split("public")[1].replace(/\\/g, "/"),
    });
  };
}
