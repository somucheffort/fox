# fox
fox is a command parser library, which was introduced in [@modularium/discord](https://github.com/modularium/discord).

```sh
$ npm i @sooomucheffort/fox
$ yarn add @sooomucheffort/fox
```

## Example
```js
const { FoxDispatcher } = require('@sooomucheffort/fox')

const fd = new FoxDispatcher()

fd.add({
    base: 'ping',
    info: 'pongs to you',
    execute() {
        return 'pong!'
    }
})

const [command, args] = fd.parse('ping')

fd.use(command, args)
.then(_ => console.log(_)) // pong!
.catch(e => console.log(_))
```

## Example with argument parsing
```js
const { FoxDispatcher } = require('@sooomucheffort/fox')
const { KitsuneParserType } = require('@sooomucheffort/kitsune')

const fd = new FoxDispatcher()

fd.add({
    base: 'ping',
    info: 'pongs to you',
    args: [{
        type: KitsuneParserType.STRING,
        count: -1
    }],
    execute([ st ]) {
        return st ? 'pong with ' + st + '!' : 'pong!'
    }
})

const [command, args] = fd.parse('ping abracadabra alakazam')

fd.use(command, args)
.then(_ => console.log(_)) // pong with abracadabra alakazam!
.catch(e => console.log(_))
```