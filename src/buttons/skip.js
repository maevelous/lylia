module.exports = async ({ inter, queue }) => {
  if (!queue || !queue.isPlaying())
    return inter.editReply({
      content: `No music currently playing... try again ? ❌`,
      ephemeral: true,
    });

  const success = queue.node.skip();

  // return inter.editReply({ content: success ? `Current music ${queue.currentTrack.title} skipped ✅` : `Something went wrong ${inter.member}... try again ? ❌`, ephemeral: true })

  // remove the above comment if you want the bot to announce that the song has been skipped
  inter.deleteReply();
};
