import Discord from 'discord.js';
import DiscordBaseMessageUpdater from './discord-base-message-updater.js';
import fs from 'fs';

export default class LayerRotationLogger extends DiscordBaseMessageUpdater {
    static get description() {
        return 'The <code>DiscordServerStatus</code> plugin can be used to get the server status in Discord.';
    }

    static get defaultEnabled() {
        return true;
    }

    static get optionsSpecification() {
        return {
            ...DiscordBaseMessageUpdater.optionsSpecification,
            command: {
                required: false,
                description: 'Command name to get message.',
                default: '!rotation'
            },
            updateInterval: {
                required: false,
                description: 'How frequently to update the time in Discord.',
                default: 15 * 1000
            },
            rotationFilePath: {
                required: false,
                description: 'Path to the LayerRotation.cfg file',
                default: '/home/container/ServerConfig/LayerRotation.cfg'
            }
        };
    }

    constructor(server, options, connectors) {
        super(server, options, connectors);

        this.updateMessages = this.updateMessages.bind(this);
    }

    async mount() {
        await super.mount();
        this.updateMessages();
        this.updateInterval = setInterval(this.updateMessages, this.options.updateInterval);
    }

    async unmount() {
        await super.unmount();
        clearInterval(this.updateInterval);
    }

    async generateMessage() {
        const embed = new Discord.MessageEmbed();

        const rotation = fs.readFileSync(this.options.rotationFilePath);

        embed.setTitle(`Server Layer Rotation`);
        embed.setDescription(`\`\`\`${rotation}\`\`\``)
        embed.setTimestamp(new Date());
        embed.setColor('#00ff00')

        return embed;
    }
}