import {MailtrapClient} from "mailtrap";
import {getEnv} from "~/utils/get-env";
import {Group} from "~/models/group";
import {generateInvitationToken} from "~/services/token.server";

export const inviteGroupMember = async (email: string, group: Group) => {
  const env = getEnv();

  const invitationToken = generateInvitationToken(email, group.id);
  const joinLink = `http://localhost:3000/groups/join?token=${invitationToken}`;

  const client = new MailtrapClient({ token: env.MAILTRAP_TOKEN });
  await client
    .send({
      from: { name: env.MAILTRAP_SENDER_NAME, email: env.MAILTRAP_SENDER_EMAIL },
      to: [{ email }],
      template_uuid: env.MAILTRAP_GROUP_INVITATION_TEMPLATE_ID,
      template_variables: {
        "group_name": group.name,
        "join_link": joinLink,
      }
    });
}
