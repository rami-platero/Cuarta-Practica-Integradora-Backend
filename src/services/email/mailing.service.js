import { mailingTransport } from "../../config/mailing.config.js";
import { config } from "../../config/variables.config.js";

export const sendMail = async ({
  targetUser,
  subject,
  html,
  attachments = [],
}) => {
  await mailingTransport.sendMail({
    from: {
      name: "Gaming Components",
      address: config.mailing.user,
    },
    to: targetUser,
    subject,
    html,
    attachments,
  });
};
