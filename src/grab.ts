import * as rp from 'request-promise';
import * as _ from 'lodash';
import * as fs from 'fs';

if (process.argv.length < 4) {
  console.error(
    'Argument 1 is your access_key and Argument 2 is your group_id'
  );
  process.exit(1);
}

const group_id = process.argv[3];
const base = `https://api.groupme.com/v3/groups/${group_id}/messages?acceptFiles=1&limit=50`;
const beforeId = '&before_id=';
const accessToken = process.argv[2];

(async () => {
  let fetching = true;
  let lastId = null;
  const messages = [];
  while (fetching) {
    const URL = `${base}${lastId ? `${beforeId}${lastId}` : ''}`;
    try {
      const resp = await rp(URL, {
        headers: {
          'X-Access-Token': accessToken
        },
        json: true
      });
      const newMessages = resp.response.messages;
      const oldestMessage = _.minBy(newMessages, 'created_at');
      lastId = _.get(oldestMessage, 'id');
      messages.push(newMessages);
      if (newMessages.length === 0) fetching = false;
      console.log(`Adding ${newMessages.length} message(s)`);
    } catch (err) {
      if (err.statusCode === 304) {
        console.log('DONE!');
        break;
      }
      console.log(
        err.statusCode ? `Got status code ${err.statusCode}` : err.message
      );
      fetching = false;
    }
  }
  const json = JSON.stringify(messages, null, 4);
  fs.writeFile('./out.json', json, 'utf8', err => {
    console.log(err);
  });
})();
