const { updateQueue } = require('../../utils/queue.js');

module.exports = async ({ client, inter, queue }) => {
  if (!queue || !queue.isPlaying()) return inter.deferUpdate();

  if (!queue.tracks.toArray().length === 0) return inter.deferUpdate();

  await queue.tracks.shuffle();
  updateQueue(queue);

  inter.deferUpdate();
}
