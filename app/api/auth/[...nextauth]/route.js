import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { connectToDB } from "@utils/database";
import User from "@models/User";

// Helper function to generate valid username
const generateValidUsername = (name, email) => {
  // Use email prefix if name is not suitable
  const base = name
    ? name.replace(/\s+/g, "").toLowerCase()
    : email.split("@")[0];

  // Remove all non-alphanumeric characters
  const cleaned = base.replace(/[^a-z0-9]/g, "");

  // Ensure length between 3-20 characters
  let username = cleaned.substring(0, 20);
  if (username.length < 3) {
    // If too short, pad with random numbers
    username += Math.floor(Math.random() * 900 + 100);
  }

  return username;
};

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile }) {
      try {
        await connectToDB();

        // Generate a valid username
        const username = generateValidUsername(profile.name, profile.email);

        // Check if user exists
        const userExists = await User.findOne({ email: profile.email });

        if (!userExists) {
          // Create new user with valid username
          await User.create({
            email: profile.email,
            username: username,
            image: profile.picture,
          });
        }
        return true;
      } catch (error) {
        console.error("SignIn error:", error);
        return false;
      }
    },
    async session({ session }) {
      try {
        await connectToDB();
        const sessionUser = await User.findOne({ email: session.user.email });
        if (sessionUser) {
          session.user.id = sessionUser._id.toString();
          session.user.username = sessionUser.username;
        }
        return session;
      } catch (error) {
        console.error("Session error:", error);
        return session;
      }
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
