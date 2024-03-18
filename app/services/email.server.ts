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
      from: { name: "Mailtrap Test", email: env.MAILTRAP_SENDER_EMAIL },
      to: [{ email }],
      template_uuid: "ea875258-b394-4409-a4b8-6caf5146b140",
      template_variables: {
        "group_name": group.name,
        "join_link": joinLink
      }
    });
}
