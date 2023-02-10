import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import {
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from "@discordjs/voice";
import path from "node:path";
import { readdir } from "node:fs/promises";
import { getRandomItemFromArray } from "../utils/getRandomItemFromArray";

async function getRandomAudio() {
  const audiosPath = path.resolve(__dirname, "../assets/audios");
  const audios = await readdir(audiosPath);
  const selectedAudio = getRandomItemFromArray(audios);
  return {
    path: `${audiosPath}/${selectedAudio}`,
    name: selectedAudio.split(".")[0],
  };
}

export const data = new SlashCommandBuilder()
  .setName("rodrigo")
  .setDescription("Testa ai parceiro!");

export async function execute(interaction: CommandInteraction) {
  const voiceChannel = interaction.guild?.members.cache.get(
    interaction.member?.user.id ?? ""
  )?.voice.channel;
  if (!voiceChannel) {
    return interaction.reply({
      content: "You need to join a voice channel first",
      ephemeral: true,
    });
  }

  try {
    const selectedAudio = await getRandomAudio();
    const resource = createAudioResource(selectedAudio.path);
    const audioPlayer = createAudioPlayer();

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    const subscription = connection.subscribe(audioPlayer);
    audioPlayer.play(resource);

    subscription?.player.on(AudioPlayerStatus.Idle, () => {
      subscription.unsubscribe();
      connection.destroy();
    });

    subscription?.player.on("error", () => {
      return interaction.reply({
        content: "An error has occurred!",
        ephemeral: true,
      });
    });

    subscription?.player.once(AudioPlayerStatus.Playing, () => {
      if (subscription.player.checkPlayable()) {
        interaction.reply({
          content: selectedAudio.name,
          ephemeral: true,
        });
      } else {
        interaction.reply({
          content: "This audio is not playable!",
          ephemeral: true,
        });
      }
    });
  } catch (err) {
    console.error(err);
    return interaction.reply({
      content: "An error has occurred!",
      ephemeral: true,
    });
  }
}
