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

      const { width, height } = innerSize(messageRef.current.parentElement);

      messageRef.current.style.height = height + 'px';
      messageRef.current.style.width = width + 'px';
      // ref.current.style.flex = 0;

      textFit(messageRef.current, {
        multiLine: true,
        maxFontSize: 100,
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
          <p className='attribution floating tilting'>by <img src={twitterSvg} /> @CarlTheDoodle</p>
          {authKey && <div>
            <a href={`/post?key=${authKey}`}>
              <Code text={`${window.location.origin}/post?key=${authKey}`} />
            </a>
            <p className="you-happy">what makes your Doodle happy?</p>
          </div>}
        </Footer>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Message>
        <Image  className="floating tilting offset-3" image={item.imageUrl} />
        <div className="text">
          <p className="floating tilting offset-1">what makes Doodle #{item.id} happy?</p>
          <p className="floating tilting offset-2" ref={messageRef}>{item.message}</p>
        </div>
      </Message>
      <Footer>
        <p className='attribution floating tilting offset-4'>by <img src={twitterSvg} /> @CarlTheDoodle</p>
        {authKey && <div>
          <a href={`/post?key=${authKey}`}>
            <Code text={`${window.location.origin}/post?key=${authKey}`} />
          </a>
          <p className="you-happy">what makes your Doodle happy?</p>
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
      text-shadow: 1px 1px rgba(0,0,0,.33);
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

  .you-happy {
    font-size: 26px;
    line-height: 1.15;
    margin-left: 16px;
  }
`;

const Image = styled('div')`
  border-radius: 10000px;
  border: 12px solid white;
  margin-right: 48px;
  margin-left: 48px;
  flex: 0 0 50vh;
  width: 50vh;
  height: 50vh;
  max-width: 50vh;
  max-height: 50vh;
  background: url(${p => p.image}) center center;
  background-size: cover;
`;

const Wrapper = styled('div')`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100vh;

  .offset-1 {
    animation-delay: 1s;
  }
  
  .offset-2 {
    animation-delay: 2s;
  }

  .offset-3 {
    animation-delay: 3s;
  }

  .offset-4 {
    animation-delay: 3s;
  }
`;

const Message = styled('div')`
  margin: 0 ;
  padding-top: 0;
  display: flex;
  margin-bottom: 128px;

  img {
    border-radius: 10000px;
    border: 16px solid white;
    margin-right: 96px;

  }

  .text {
    flex: 1;
    margin-right: 48px;
    min-width: 50vw;
    display: flex;
    flex-direction: column;

    p {

      flex: 1;
      font-family: 'Chalkboard';
      color: #FFFFFF;
      -webkit-text-stroke: 1px #897EE3;
      text-shadow: .02em .06em 0 #897ee3, .04em .1em 0 rgb(0 0 0 / 15%);
      font-size: 80px;
      margin: 0;
      
      &:first-of-type {
        flex: 0;
        font-weight: 700;
        font-size: 36px;
        /* line-height: 71px; */
      }
      
      &:last-of-type {
        -webkit-text-stroke: transparent;
        margin-top: 32px;
        line-height: 1.1;
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
