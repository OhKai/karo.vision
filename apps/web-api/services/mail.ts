import { env } from "@/env";
import {
  Resend,
  type CreateContactResponse,
  type CreateEmailOptions,
  type CreateEmailResponse,
} from "resend";
import { v4 as uuidv4 } from "uuid";

const resend = new Resend(env.RESEND_API_KEY);

const KAROVISION_EMAIL_ADDRESSES = [
  "Karo.Vision <hi@updates.karo.vision>",
  "Karo.Vision Support <support@mail.karo.vision>",
] as const;

type KaroVisionEmailOptions = CreateEmailOptions & {
  from: (typeof KAROVISION_EMAIL_ADDRESSES)[number];
};

export const sendMail = async (
  payload: KaroVisionEmailOptions,
): Promise<CreateEmailResponse> => {
  if (!env.USE_RESEND) {
    console.log("NOT SENT Mail Payload:", payload);

    return {
      data: { id: "test-email-id" },
      error: null,
    };
  }

  const data = await resend.emails.send({
    ...payload,
    headers: {
      // Ensure each email has a unique X-Entity-Ref-ID to prevent gmail threading.
      "X-Entity-Ref-ID": uuidv4(),
      ...payload.headers,
    },
  });

  return data;
};

/**
 * Adds a contact to an audience.
 *
 * The contact may or may not be connected to an user account. This way we can allow non-users to
 * subscribe to newsletters (only contact) as well as users (contact + user) using the same audience
 * logic. A simple email list would not update user data if the user updates their email. This could
 * also be used to differentiate between user and non-user contacts in the emails we send (e.g. new
 * user benefits, promotions, disclaimer and wording) if existing users sign up to newsletters or
 * non-users convert to users since signing up.
 */
export const addContactToAudience = async (
  email: string,
  audienceId: string,
): Promise<CreateContactResponse> => {
  if (!env.USE_RESEND) {
    console.log(
      `NOT ADDED Contact to Audience: ${email} to audience ${audienceId}`,
    );

    return {
      data: { id: "test-contact-id", object: "contact" as const },
      error: null,
    };
  }

  // TODO: Logic for own implementation would be: 1) check if contact exists by email 2) create if
  // not exists 3) add to audience 4) at sending time if needed, check if contact is user for
  // context in mails
  const data = await resend.contacts.create({
    email,
    unsubscribed: false,
    audienceId,
  });

  return data;
};
