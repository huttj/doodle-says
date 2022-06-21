const axios = require('axios').default;

const NULL_ADDRESS = '0x0000000000000000000000000000000000000000';

const cache = {};


async function fetchAssetsFromCollection(contractAddress, id) {
  const key = `${contractAddress}:${id}`;

  if (!cache[key]) {
    const { data } = await axios({
      method: 'GET',
      headers: {
        'x-api-key': process.env.OPENSEA_API_KEY,
      },
      url: `https://api.opensea.io/api/v1/asset/${contractAddress}/${id}/?include_orders=false`,
    });
    cache[key] = data;
  }

  return cache[key];
}

module.exports = {
  fetchAssetsFromCollection
};
