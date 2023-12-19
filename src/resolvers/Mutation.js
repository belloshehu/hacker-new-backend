const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const post = async (parent, args, context, info) => {
  const { userId } = context;
  const newLink = await context.prisma.link.create({
    data: {
      url: args.url,
      description: args.description,
      postedBy: { connect: { id: userId } },
    },
  });
  context.pubsub.publish("NEW_LINK", newLink);
  return newLink;
};

const signup = async (parent, args, context, info) => {
  const salt = await bcrypt.genSalt(10);
  const password = await bcrypt.hash(args.password, salt);
  const user = await context.prisma.user.create({
    data: {
      ...args,
      password,
    },
  });

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);

  return {
    user,
    token,
  };
};

const login = async (parent, args, context) => {
  const user = await context.prisma.user.findUnique({
    where: { email: args.email },
  });
  if (!user) {
    throw new Error("User not found!");
  }
  const isMatch = await bcrypt.compare(args.password, user.password);
  if (!isMatch) {
    throw new Error("Invalid credentials");
  }
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
  return { token, user };
};

const vote = async (parent, args, context, info) => {
  const { userId } = context;
  const existingVote = await context.prisma.vote.findUnique({
    where: {
      linkId_userId: {
        userId: userId,
        linkId: Number(args.linkId),
      },
    },
  });

  if (existingVote) {
    throw new Error("You vote already!");
  }
  const newVote = context.prisma.vote.create({
    data: {
      user: { connect: { id: userId } },
      link: { connect: { id: Number(args.linkId) } },
    },
  });
  context.pubsub.publish("NEW_VOTE", newVote);

  return newVote;
};
module.exports = {
  signup,
  post,
  login,
  vote,
};
