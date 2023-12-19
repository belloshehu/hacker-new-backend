const link = async (parent, args, context, info) => {
  const singleLink = await context.prisma.link.findUnique({
    where: { id: args.id },
  });
  const topVotedLinks = await context.prisma.link.findMany({
    orderBy: { createdAt: "desc" },
    skip: 0,
    take: 5,
  });
  return { singleLink, topVotedLinks };
};

const feed = async (parent, args, context, info) => {
  const where = args.filter
    ? {
        OR: [
          {
            url: { contains: args.filter },
          },
          {
            description: { contains: args.filter },
          },
        ],
      }
    : {};
  const count = await context.prisma.link.count({ where });
  const links = await context.prisma.link.findMany({
    where,
    skip: args.skip,
    take: args.take,
    orderBy: args.orderBy,
  });
  return {
    links,
    count,
  };
};

module.exports = {
  feed,
  link,
};
