module.exports = async ({ inter, queue }) => {
  if (!queue || !queue.isPlaying()) return inter.deferUpdate();

  if (!queue.history.previousTrack) {
    queue.node.seek(0)
    return inter.deferUpdate();
  }

  const progress = queue.node.createProgressBar().split(" ")[0]
  const seconds = +progress.split(":")[1]

  if (seconds > 4) {
    queue.node.seek(0)
    return inter.deferUpdate();
  }

  await queue.history.back();

  // inter.editReply({ content: `Playing the **previous** track ✅`, ephemeral: true });
  inter.deferUpdate();
}
