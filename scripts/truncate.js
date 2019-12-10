// test/truncate.js
import map from 'lodash/map';
const { User } = require('../src/models');
export default async function truncate() {
    return await User.sync({force : true});
}