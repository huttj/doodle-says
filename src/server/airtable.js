const axios = require('axios').default;

const { AIRTABLE_KEY, AIRTABLE_TABLE_ID } = process.env;

// One server, so cache it all in memory
let messages = [];

async function getMessages(force = false) {
  if (!force && (messages && messages.length)) {
    return messages;
  }

  const { data } = await axios({
    method: 'GET',
    url: `https://api.airtable.com/v0/${AIRTABLE_TABLE_ID}/Messages?maxRecords=100&view=Grid%20view`,
    headers: {
      authorization: `Bearer ${AIRTABLE_KEY}`,
    },
  });
  messages = data.records.map(r => ({ ...r.fields, airtableId: r.id }));
  return messages;
}


async function writeMessage({ id, message, imageUrl, walletAddress, airtableId }, index = messages.length) {

  console.log({
    id, message, imageUrl, walletAddress, airtableId
  })

  const method = airtableId ? 'PATCH' : 'POST';

  const { data } = await axios({
    method,
    url: `https://api.airtable.com/v0/${AIRTABLE_TABLE_ID}/Messages`,
    headers: {
      authorization: `Bearer ${AIRTABLE_KEY}`,
    },
    data: {
      records: [{
        id: airtableId,
        fields: {
          id: '' + id,
          message,
          imageUrl,
          walletAddress,
        },
      }],
    },
  });

  const response = data.records.map(r => ({ ...r.fields, airtableId: r.id }))[0];

  if (!airtableId) {
    messages.splice(index, 0, response);
  } else {
    const oldIndex = messages.findIndex(n => n.id == id);
    messages[oldIndex] = response;
  }

  return response;
}

function getExisting(id) {
  return messages.find(m => m.id === id);
}


module.exports = {
  getMessages,
  writeMessage,
  getExisting,
};
