module.exports = async ({ inter, queue }) => {
  if (!queue || !queue.isPlaying()) return

  if (!queue.history.previousTrack) return

  await queue.history.back();

  // inter.editReply({ content: `Playing the **previous** track ✅`, ephemeral: true });
  inter.deleteReply();
}
