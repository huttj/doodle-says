require('dotenv-safe').config();

const express = require('express');
const airtable = require('./airtable');
const opensea = require('./opensea');
const http = require('http');
const socketio = require("socket.io");
const events = require('../socketEvents.json');
const cors = require('cors');
const { default: axios } = require('axios');
const path = require('path');

const MASTER_KEY = process.env.MASTER_KEY;
const DOODLES_CONTRACT_ADDRESS = '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e';

// Express server
const app = express();

const httpServer = new http.Server(app);

// Socket server
const io = new socketio.Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});


async function notifyAllSockets(event, payload, authenticatedOnly = false) {

  console.log('notifyAllSockets', event);

  const sockets = await io.fetchSockets();

  for (const socket of sockets) {
    if (!authenticatedOnly || socket.authenticated) {
      socket.emit(event, payload);
    }
  }
}



// Cycle temporary auth keys every X minutes
const AUTH_KEY_EXPIRY_MS = 1000 * 60 * 20;
let currentAuthKey = null;
async function updateAuthKey() {
  currentAuthKey = '' + Math.abs((Math.random() * 10e10) | 0);
  notifyAllSockets(events.KEY, currentAuthKey, true);
}
updateAuthKey();
setInterval(updateAuthKey, AUTH_KEY_EXPIRY_MS);



// Manual poll every minute
const REFRESH_INTERVAL_MS = 1000 * 60;
setInterval(reloadList, REFRESH_INTERVAL_MS);
async function reloadList() {
  const list = await airtable.getMessages(true);
  notifyAllSockets(events.LIST_REFRESH, list);
}

const DISPLAY_TIMEOUT_MS = 1000 * 10;
let index = 0;
let nextTimeout = null;
async function getNext() {
  const messages = await airtable.getMessages();

  // I don't know what happens when it hits Infinity, and I don't want to find out
  if (index > 10e9) {
    index = index % messages.length;
  }

  const message = messages[index % messages.length];

  console.log('Next message', index, message.message);

  notifyAllSockets(events.CURRENT_MESSAGE, message);

  index++;

  nextTimeout = setTimeout(getNext, DISPLAY_TIMEOUT_MS);
}
getNext();

function play(message) {
  clearTimeout(nextTimeout);
  notifyAllSockets(events.CURRENT_MESSAGE, message);
  nextTimeout = setTimeout(getNext, DISPLAY_TIMEOUT_MS);
}


io.on('connection', socket => {
  console.log('New socket connection', socket.id);

  airtable.getMessages().then(messages => {
    if (messages) {
      socket.emit(events.CURRENT_MESSAGE, messages[index % messages.length]);
    }
  });

  socket.on(events.AUTHENTICATE, key => {
    socket.authenticated = !!(key === MASTER_KEY);
    socket.emit(events.AUTHENTICATE, socket.authenticated);
    if (socket.authenticated) {
      socket.emit(events.KEY, currentAuthKey);
    }
  });

  airtable.getMessages().then(list => socket.emit(events.LIST_REFRESH, list));
});


app
  .use(cors())
  .use(express.json())
  .use('/', express.static(`./dist`, {
    setHeaders: (res, path, stat) => {
      if (path.includes('.jsx')) {
        res.setHeader('content-type', 'text/javascript');
        return;
      }
    }
  }))

  // Should get new key every minute
  .get('/auth', (req, res) => {
    if (req.query.key === MASTER_KEY) {
      res.send(currentAuthKey);
    }
    throw new Error('Unauthorized');
  })

  .get('/reload', async (req, res, next) => {
    try {
      if (req.query.key === MASTER_KEY) {
        reloadList();
        res.send('Reloaded');
      }
    } catch (e) {
      return next(e)
    }
    throw new Error('Unauthorized');
  })

  .get('/list', async (req, res, next) => {
    try {
      const messages = await airtable.getMessages();
      res.send(messages);
    } catch (e) {
      next(e);
    }
  })

  .post('/list', async (req, res, next) => {
    try {
      console.log({
        'req.query.key': req.query.key,
        currentAuthKey,
      });
      if (req.query.key !== currentAuthKey) {
        throw new Error('Sorry, the form timed out. Please go back and try again.');
      }

      const { id, message, walletAddress } = req.body;

      const existing = airtable.getExisting(id) || {};

      const asset = await opensea.fetchAssetsFromCollection(DOODLES_CONTRACT_ADDRESS, id);

      const result = await airtable.writeMessage({ id, message, imageUrl: asset.image_url, walletAddress, airtableId: existing.airtableId }, index);

      play(result);

      res.send(result);

      notifyAllSockets(events.NEW_MESSAGE, result);

    } catch (e) {
      next(e);
    }
  })
  .get('/image/:id', async (req, res) => {
    const { id } = req.params;
    const asset = await opensea.fetchAssetsFromCollection(DOODLES_CONTRACT_ADDRESS, id);
    const stream = await axios({
      method: 'GET',
      url: asset.image_url,
      responseType: 'stream',
    });

    stream.data.pipe(res);
  })
  .use((req, res, next) => {
    //Capture All 404 errors
    res.sendFile(path.resolve(`${__dirname}/../../dist/index.html`));
  })

// TODO: Webhook for server deletion
// .post('/update', async (req, res, next) => {})
httpServer
  .listen(process.env.PORT, () => console.log(`Listening on ${process.env.PORT}`));