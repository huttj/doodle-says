import { useEffect, useState } from "react";


export default () => {


  let _data = null;
  let listeners = [];

  function _useData() {
    const [data, setData] = useState();

    useEffect(() => {
      listeners.push(setData);
      return () => { listeners = listeners.filter(fn => fn != setData) };
    }, [setData]);

    return [_data, _setData];
  }

  function _setData(data) {
    if (typeof data === 'function') {
      _data = data(_data);
    } else {
      _data = data;
    }
    listeners.forEach(fn => fn(_data));
  }


  return [_useData, _setData];
}