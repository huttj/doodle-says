import axios from "axios";
import io from './socket';
import useFactory from "./useFactory";
import events from '../../socketEvents.json';


const [useMessage, setMessage] = useFactory();

// function initialLoad() {
//   axios({
//     method: 'GET',
//     url: `/list`,
//   })
//     .then(setMessages)
//     .then(randomize);
// }

// initialLoad();

io.on(events.CURRENT_MESSAGE, message => setMessage(message));

export default useMessage;
