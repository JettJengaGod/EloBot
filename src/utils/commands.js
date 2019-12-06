function default_handle(args, target, client) {
    client.say(target, 'This command isn\'t properly setup')
}
export class Command{
    constructor(com='', help='', handle=default_handle) {
        this.com = com;
        this.help = help;
        this.handle = handle;
    }

    helpPrompt() {
        return this.help
    }

}

function base(args, target, client) {
    client.say(target, 'Works');
}

let baseCom = new Command(
    'Base',
    'No help',
    base);


export let CommandList = {
    'base' : baseCom
};