import React, { useEffect, useRef } from 'react'

const QRCode = window['QRCode'];

export default function Code(props) {
  const code = useRef(null);
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && !code.current) {
      code.current = new QRCode(ref.current, {
        height: 150,
        width: 150,
        text: '',
        colorDark: "#FFFFFF",
        colorLight: "rgba(0,0,0,0)",
      })
    }
  }, [code.current, ref.current]);

  useEffect(() => {
    if (props.text && code.current) {
      code.current.makeCode(props.text);
    }
  }, [code.current, props.text]);

  return <div ref={ref} />
}