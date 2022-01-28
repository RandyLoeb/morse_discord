import * as DotEnv from 'dotenv';
import fs from 'fs';
import { Client, WebhookClient } from 'discord.js';
import MorseCWWave from './morse-pro/morse-pro-cw-wave.js';
import * as RiffWave from './morse-pro/morse-pro-util-riffwave.js';

DotEnv.config();

const client = new Client({ 
  partials: ['MESSAGE', 'REACTION']
});


client.on('ready', () => {
  console.log(`${client.user.tag} has logged in.`);
});

client.on('message', async (message) => {
  if (message.author.bot) return;
  console.log(message.author.username);
  console.log(message.channel.name);
  console.log(message.content);
  var morseCWWave = new MorseCWWave();
  morseCWWave.translate(message.content);
  var wav = RiffWave.getData(morseCWWave.getSample());  

  //POC we save to physical file
  fs.writeFileSync('test.wav',new Int8Array( wav));
  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel) {
      console.log("not in a voice channel");
  } else {
      console.log("in a voice channel");
  }
  
    var connection = voiceChannel.join();
  
  //POC play the physical file. TODO: skip need for physical file  
  (await connection).play('test.wav');
  
});

client.login(process.env.DISCORDJS_BOT_TOKEN);