function newLinkSubscription(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_LINK");
}

const newLink = {
  subscribe: newLinkSubscription,
  resolve: (payload) => payload,
};

function newVoteSubscription(parent, args, context, info) {
  return context.pubsub.asyncIterator("NEW_VOTE");
}
const newVote = {
  subscribe: newVoteSubscription,
  resolve: (payload) => payload,
};
module.exports = {
  newLink,
  newVote,
};
