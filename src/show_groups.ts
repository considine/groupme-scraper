import * as rp from 'request-promise';
import * as _ from 'lodash';

const base = 'https://api.groupme.com/v3/groups?page=1&per_page=100';
if (process.argv.length < 3) {
  console.error(
    'Argument 1 is your access_key'
  );
  process.exit(1);
}

const accessToken = process.argv[2];

(async function() {
  try {
    const { response } = await rp(base, {
      headers: {
        'X-Access-Token': accessToken
      },
      json: true
    });
    response.forEach(({  id, name }) => {
        console.log(`Group ID: ${id} \nName: ${name}\n`);
    });
  } catch (err) {
    console.log(
      err.statusCode ? `Got status code ${err.statusCode}` : err.message
    );
  }
})();
