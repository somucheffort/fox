const { KitsuneParser } = require('@sooomucheffort/kitsune')

class FoxError extends Error {
    constructor (message) {
        super(message)
        this.name = 'FoxError'
        this.message = message
    }
}

class FoxDispatcher {
    /**
     * FoxDispatcher is a command dispatcher
     * @class
     * @constructor
     * @public
     */
    constructor () {
        this._commands = new Map()
        this.parser = new KitsuneParser()
    }

    /**
     * Add a command to dispatcher
     * @param {FoxCommand} cmd Command object
     * @public
     */
    add (cmd) {
        const command = new FoxCommand(cmd)

        this._commands.set(command.base, command)
    }

    /**
     * Remove a command using it's base
     * @param {string} command Command base
     * @public
     */
    remove (command) {
        if (this.find(command))
            this._commands.delete(cmd)
    }

    /**
     * Find a command using it's base
     * @param {string} command Command base
     * @returns {FoxCommand} Command
     * @public
     */
    find (command) {
        return this._commands.has(command) ? this._commands.get(command) : undefined
    }

    /**
     * Use a command
     * @param {string} command Command base
     * @param {Array} args Command's arguments
     * @param {Message} msg Message
     * @public
     */
    async use (command, commandArgs, ...otherArgs) {
        const cmd = await this.find(command)

        if (!cmd) {
            throw new FoxError('Unknown command')
        }

        // no usage basically
        if (!cmd.args) {
            return await cmd.execute(commandArgs, otherArgs)
        }

        const parsedArgs = await this.parser.parse(commandArgs, cmd.args)
        return await cmd.execute(parsedArgs, otherArgs)
    }

    /**
     * Parse a command
     * @param {string} commandToParse Command to parse
     * @returns {[command, args]} Command base, it's arguments
     * @public
     */
    parse (commandToParse) {
        const args = commandToParse.split(/ +/)
        const command = args.shift().toLowerCase()
        args.forEach((val, i) => {
            if (Number(val)) args[i] = Number(val)
        })
        return [command, args]
    }
}

class FoxCommand {
    constructor ({ base, aliases, info, args, execute }) {
        if (!base || !execute) throw new FoxError('No base or execute()')

        this.base = base
        this.aliases = aliases
        this.info = info
        this.args = args
        this.execute = execute
    }

    /**
     * Rebase old type command to new type
     * @param {{ name:string, description:string, usage:Array<string> }} cmd Command object
     * @returns {{ base:string, info:string, args:Array<string> }} rebasedCmd
     */
    static rebase (cmd) {
        const rebasedCmd = {}

        Object.entries(cmd).forEach(([key, val]) => {
            if (key === 'name') rebasedCmd.base = val
            else if (key === 'description') rebasedCmd.info = val
            else if (key === 'usage') rebasedCmd.args = val
            else rebasedCmd[key] = val
        })

        return rebasedCmd
    }

    getUsage () {
        if (!this.args) return undefined

        const toRequiredType = name => '<' + name + '>'
        const toNotRequiredType = name => '[' + name + ']'

        const keyNames = this.args.map(({ type, required, count, name: keyName }) => {
            let name = keyName || type

            if (Array.isArray(type)) {
                name = keyName || type.join('|')
            }

            if (count) {
                name += ':' + count
            }

            return required ? toRequiredType(name) : toNotRequiredType(name)
        })

        return keyNames.join(' ')
    }
}

module.exports = {
    FoxDispatcher,
    FoxCommand,
    FoxError
}
