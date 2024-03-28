import jwt from "jsonwebtoken";

export const generateInvitationToken = (email: string, groupId: string): string => {
  const payload = {
    email: email,
    groupId: groupId,
  };

  const secret = 'your-secret-key';
  const options = { expiresIn: '30d' };

  return jwt.sign(payload, secret, options);
}

export const verifyInvitationToken = (token: string): { success: boolean; data?: { email: string, groupId: string }; error?: string; } => {
  const secret = 'your-secret-key';
  try {
    const decoded = jwt.verify(token, secret) as any;
    return { success: true, data: decoded };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
}
