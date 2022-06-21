import axios from "axios";
import io from './socket';
import useFactory from "./useFactory";
import events from '../../socketEvents.json';


const [useMessages, setMessages] = useFactory();

// function initialLoad() {
//   axios({
//     method: 'GET',
//     url: `/list`,
//   })
//     .then(setMessages)
//     .then(randomize);
// }

// initialLoad();

io.on(events.NEW_MESSAGE, message => setMessages(list => list.concat(message)));
io.on(events.LIST_REFRESH, list => {
  setMessages(list);
  randomize();
});

const SWAP_INTERVAL_MS = 1000 * 30;

function randomize() {
  setMessages(list => [...list.sort(() => Math.random() - .5)]);
}
setInterval(randomize, SWAP_INTERVAL_MS);

export default useMessages;