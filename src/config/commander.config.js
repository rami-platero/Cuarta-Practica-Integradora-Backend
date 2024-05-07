import {Command} from 'commander'

const program = new Command()

program.option('--persist <persist>', 'persistence mode', 'mongodb').parse()

export default program