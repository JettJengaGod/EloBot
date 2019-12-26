// test/truncate.js
import { User, Match } from '../src/models';
export default async function truncate() {
    await Match.sync({force : true});
    return await User.sync({force : true});
}