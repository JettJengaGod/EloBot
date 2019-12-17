// test/truncate.js
import map from 'lodash/map';
import { User } from '../src/models';
export default async function truncate() {
    return await User.sync({force : true});
}