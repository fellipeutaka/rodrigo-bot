import { Client } from "discord.js";

import { commands } from "./commands";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";

export const client = new Client({
  intents: ["Guilds", "GuildVoiceStates", "DirectMessages"],
});

client.once("ready", () => {
  // client.guilds.cache.forEach((guild) => deployCommands({ guildId: guild.id }));
  console.log("Discord bot is ready! 🤖");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }
  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
