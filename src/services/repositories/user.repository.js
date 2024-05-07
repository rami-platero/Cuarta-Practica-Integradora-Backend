import { config } from "../../config/variables.config.js";
import { AppError } from "../../helpers/AppError.js";
import bcrypt from "bcrypt";

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

      const { password, ...newUser } = (
        await this.dao.create({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          username: `${firstName} ${lastName}`,
          age: Number(age),
        })
      )

      return newUser;
    } catch (err) {
      if (err.code === 11000 && "email" in err.keyPattern) {
        throw new AppError(400, { message: "Email is already in use!" });
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
      throw new AppError(404, { message: "User not found!" });
    }

    const matches = bcrypt.compare(foundUser.password, pass);
    if (!matches) {
      throw new AppError(401, { message: "Credentials don't match!" });
    }

    const { password, ...loggedUser } = foundUser
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
      throw new AppError(500, { message: "Internal server error." });
    }
    // Sort by primary email - the user may have several emails, but only one of them will be primary
    const sortedEmails = emails.sort((a, b) => b.primary - a.primary);
    return sortedEmails[0].email;
  };
}
