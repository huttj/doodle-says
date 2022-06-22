import axios from "axios";
import React, { useEffect, useState } from "react";
import styled from 'styled-components';
import getQuery from "./getQuery";
import carlImage from '../carl.gif';
import { SERVER_URL } from "./config";


const key = getQuery().key || '';

export default function Form() {

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (key) {
      // Hide key
      window.history.replaceState(null, null, window.location.origin + window.location.pathname)
    } else {
      setError(true);
    }
  }, []);

  
  const [data, setData] = useState({
    id: '',
    message: '',
    walletAddress: '',
  });

  const [image, setImage] = useState('');

  useEffect(() => {
    if (data.id) {
      let timeout = setTimeout(() => {
        setImage(`${SERVER_URL}/image/${data.id}`)
      }, 1000);

      return () => clearTimeout(timeout);
    } else {
      setImage('');
    }

  }, [data.id]);

  async function submit(e) {
    e.preventDefault();

    if (loading) {
      return;
    }

    if (!data.id) {
      return alert("Please enter your Dood's ID");
    }
    if (!data.message) {
      return alert("You forgot to say what makes your Dood happy!");
    }

    if (data.message.length > 280) {
      return alert('Your message is too long!');
    }

    if (!key) {
      throw new Error('Missing key');
    }

    try {
      await axios({
        method: 'POST',
        url: `${SERVER_URL}/list?key=${key}`,
        data,
      });
      setSubmitted(true);
      setLoading(false);
    } catch (e) {
      setError(e);
      setLoading(false);
    }
  }

  if (error) {
    return (
      <Submitted>
        <div>
          <p className="sent">oops...</p>
          <p>this link expired. you'll need to scan the QR code in the Holder's Lounge</p>
        </div>

        <div className="footer">
          <img src={carlImage} /><p>made by <a href="https://twitter.com/carlthedoodle">Carl</a> for the Doodle Holder's Lounge</p>
        </div>
      </Submitted>
    )
  }


  if (submitted) {
    return (
      <Submitted>
        <div>
          <p className="sent">Sent!</p>
          <p>your Dood should display in a few seconds</p>
        </div>

        <div className="footer">
          <img src={carlImage} /><p>made by <a href="https://twitter.com/carlthedoodle">Carl</a> for the Doodle Holder's Lounge</p>
        </div>
      </Submitted>
    )
  }


  return (
    <Wrapper>
      <div className="header">
        <div className="inner">
          <h1>Happy Doods <span>by <a href="https://twitter.com/carlthedoodle">Carl</a></span></h1>
        </div>
      </div>
      <div className="inner">
        <form onSubmit={submit} className={loading ? 'loading' : ''}>
          <label>
            what's your Doodle's ID?
            <div className="row">
              <input placeholder="1523" type="number" onChange={e => setData({ ...data, id: e.target.value })} />
              {image && <img src={image} />}
            </div>
          </label>

          <label>
            what makes your Dood happy?
            <p>This will be public. Keep it PG.</p>
            <textarea placeholder="Type here" rows="3" value={data.message} onChange={e => setData({ ...data, message: e.target.value })} />
            <span className={`limit ${data.message.length > 280 ? 'is-over' : ''}`}>{data.message.length}/280</span>
          </label>

          <label>
            what's your ETH NFT wallet address?
            <p>Optional, for a special surprise.</p>
            <input placeholder="0x... or vitalik.eth" />
          </label>

          <button type="submit">Send to screen</button>
        </form>
      </div>
    </Wrapper>
  )
}


const Submitted = styled('div')`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: white;

  text-align: center;

  display: flex;
  flex-direction: column;
  align-items: space-around;
  justify-content: space-around;

  div {
    flex: 0;
    margin: auto;
  }

  p {
    margin: 0;
    font-family: 'Chalkboard';
    font-style: normal;
    font-weight: 700;
    font-size: 16px;
    line-height: 150%;
    /* or 24px */

    text-align: center;

    color: #4D4D4D;
  }

  .sent {
    font-family: 'Chalkboard';
    font-style: normal;
    font-weight: 700;
    font-size: 72px;

    color: #FFFFFF;
    -webkit-text-stroke: 2px #4D4D4D;
    text-shadow: 0px 2px 0px #4D4D4D;
  }

  .footer {
    flex: 0;
    margin: 0;
    /* margin-top: auto; */
    justify-self: flex-end;
    
    width: 100%;

    text-align: center;
    
    img {
      margin: 0;
      margin-bottom: -4px;
    }


    p {
      background-color: #A9E0FC;
      margin: 0;
      padding: 16px;
    }

    a {
      text-decoration-style: dotted;
      color: black !important;
    }
  }
`;

const Wrapper = styled('div')`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #A9E0FC;

  .loading {
    pointer-events: none;
  }


  .header {
    padding: 16px;
    background-color: #FFC2DF;
    margin-bottom: 32px;

    h1 {
      margin: 0;
      font-family: 'Chalkboard';
      font-style: normal;
      font-weight: 700;
      color: white;
      -webkit-text-stroke: 2px black;
      text-shadow: 0 2px 0px black;
      font-size: 32px;

      a {
      text-decoration-style: dotted;
      color: black !important;
    }

      span {
        /* font-weight: normal; */
        font-size: 18px;
        color: black;
        -webkit-text-stroke: transparent;
        text-shadow: none;
      }

    }
  }

  .inner {
    max-width: 800px;
    margin: auto;
    padding: 0 12px 0 12px;
  }

  label {
    display: block;
    margin-top: 16px;
    font-family: 'Chalkboard';
    font-weight: 700;
    font-size: 18px;
    color: #FFFFFF;
    -webkit-text-stroke: 1px #897EE3;
    text-shadow: 1px 2px 0px #897ee3;

    .row {
      display: flex;
      flex-direction: row;
      align-items: center;

      input {
        width: auto;
      }

      img {
        height: 40px;
        width: 40px;
        border: 2px solid white;
        border-radius: 100px;
        margin-left: 12px;
      }
    }

    .limit {
      color: black;
      text-align: right;
      -webkit-text-stroke: transparent;
      text-shadow: none;
      font-weight: normal;
      font-size: 14px;
      display: block;

      &.is-over {
        font-weight: bold;
        color: red;
      }
    }


    input,
    textarea {
      display: block;
      margin: 8px 0;

      color: black;
      border: 2px solid #bebebe;
      border-radius: 8px;
      padding: 12px;
      font-size: 16px;
      font-weight: normal;
      -webkit-text-stroke: transparent;
      text-shadow: transparent;
      font-family: sans-serif;
    }

    textarea, input {
      width: 100%;
      box-sizing: border-box;
    }

    p {
      margin: 8px 0;
      font-size: 14px;
      font-weight: normal;
      color: black;
      -webkit-text-stroke: transparent;
      text-shadow: none;
    }
  }

  button {
    margin-top: 48px;
    font-family: 'Chalkboard';
    font-style: normal;
    font-weight: 700;
    font-size: 18px;
    padding: 12px;
    color: white;
    background: #897EE3;
    box-shadow: 0px 4px 0px #8AB0F9;
    border-radius: 8px;
    width: 100%;
    border: none;
    cursor: pointer;

    &:active {
      margin-top: 50px;
      margin-bottom: -2px;
      box-shadow: 0px 2px 0px #8AB0F9;
    }
  }
`;