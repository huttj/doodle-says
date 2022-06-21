import React, { useState, useRef } from 'react'
import { useEffect } from 'react';
import styled from 'styled-components';
import twitterSvg from '../twitter.svg';
import Code from './Code';
import axios from 'axios';
import getQuery from './getQuery';
import useMessages from './useMessages';
import socket, { useKey } from './socket';



const textFit = window['textFit'];


function App() {

  const messageRef = useRef(null);
  const [messages] = useMessages();
  const [authKey] = useKey();

  const item = (messages || []).slice(-1)[0];

  useEffect(() => {
    if (messageRef.current && item) {
      console.log('text fitting')

      const { width, height } = innerSize(messageRef.current);

      messageRef.current.style.height = height + 'px';
      messageRef.current.style.width = width + 'px';
      // ref.current.style.flex = 0;

      textFit(messageRef.current, {
        multiLine: true,
        maxFontSize: 200,
        reprocess: true,
      });
    }
  }, [messageRef.current, item]);




  if (!messages || !messages.length) {
    return (
      <Wrapper>
        <Message>

        </Message>
        <Footer>
          <p className='attribution'>by <img src={twitterSvg} /> @CarlTheDoodle</p>
          {authKey && <div>
            <a href={`/post?key=${authKey}`}>
              <Code text={`/post?key=${authKey}`} />
            </a>
          </div>}
        </Footer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Message>
        <Image image={item.imageUrl} />
        <div className='text'>
          <p>What makes Doodle #{item.id} happy?</p>
          <p ref={messageRef}>{item.message}</p>
        </div>
      </Message>
      <Footer>
        <p className='attribution'>by <img src={twitterSvg} /> @CarlTheDoodle</p>
        {authKey && <div>
          <a href={`/post?key=${authKey}`}>
            <Code text={`/post?key=${authKey}`} />
          </a>

        </div>}
      </Footer>
    </Wrapper>
  )
}

const Footer = styled('div')`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-end;

  p {
    font-family: 'Chalkboard';
    font-style: normal;
    font-weight: 400;
    font-size: 32px;
    line-height: 41px;
    color: white;
    margin: 24px;

    &.attribution {
      text-shadow: 1px 1px rgba(0,0,0,.25);
    }

    img {
      vertical-align: middle;
      margin-bottom: 5px;
    }
  }

  > div {
    flex: 0;
    /* flex-basis: 350px; */
    padding: 24px;
    border-radius: 32px 0 0 0;
    background-color: #897EE3;

    display: flex;
    flex-direction: row;

    p {

      margin: 0;
      margin-left: 24px;
      font-weight: 700;
      font-size: 32px;
      line-height: 36px;
    }
  }
`;

const Image = styled('div')`
  border-radius: 10000px;
  border: 16px solid white;
  margin-right: 72px;
  flex: 0 0 33vw;
  width: 33vw;
  height: 33vw;
  max-width: 33vw;
  max-height: 33vw;
  background: url(${p => p.image}) center center;
  background-size: cover;
`;

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100vh;
`;

const Message = styled('div')`
  padding: 5%;
  padding-top: 0;
  display: flex;

  img {
    border-radius: 10000px;
    border: 16px solid white;
    margin-right: 128px;

  }

  .text {
    display: flex;
    flex-direction: column;
    margin-left: 32px;

    p {

      flex: 1;
      font-family: 'Chalkboard';
      color: #FFFFFF;
      -webkit-text-stroke: 1px #897EE3;
      text-shadow: 1px 2px 0px #897ee3, 2px 5px 0px rgb(0 0 0 / 15%);
      font-size: 100px;
      margin: 0;

      &:first-of-type {
        flex: 0;
        font-weight: 700;
        font-size: calc(12px + 3vw);
        /* line-height: 71px; */
      }

      &:last-of-type {
        margin-top: 32px;
      }
    }
  }
`;

export default App

function innerSize(el) {
  var style = window.getComputedStyle(el, null);
  return {
    width: el.getBoundingClientRect().width -
      parseInt(style.getPropertyValue('padding-left'), 10) -
      parseInt(style.getPropertyValue('padding-right'), 10),
    height: el.getBoundingClientRect().height -
      parseInt(style.getPropertyValue('padding-top'), 10) -
      parseInt(style.getPropertyValue('padding-bottom'), 10)
  }
}
