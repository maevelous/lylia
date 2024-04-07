module.exports = async ({ inter, queue }) => {
  if (!queue || !queue.isPlaying()) return inter.deferUpdate();

  if (!queue.history.previousTrack) return inter.deferUpdate();

  await queue.history.back();

  // inter.editReply({ content: `Playing the **previous** track ✅`, ephemeral: true });
  inter.deleteUpdate();
}
