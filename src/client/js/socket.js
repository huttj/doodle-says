import getQuery from "./getQuery";
import events from '../../socketEvents.json';
import useFactory from "./useFactory";
import { SERVER_URL } from "./config";


const [useKey, setKey] = useFactory();

const socket = window['io'](SERVER_URL);

socket.on(events.KEY, setKey);

const { key } = getQuery();
if (key) {
  socket.on('connect', () => {
    socket.emit(events.AUTHENTICATE, key);
  });
}

export default socket;

export { useKey };