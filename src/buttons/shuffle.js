const { updateQueue } = require('../../utils/queue.js');

module.exports = async ({ client, inter, queue }) => {
  inter.deleteReply();
  if (!queue || !queue.isPlaying()) return

  if (!queue.tracks.toArray().length === 0) return

  await queue.tracks.shuffle();
  updateQueue(queue);
}
