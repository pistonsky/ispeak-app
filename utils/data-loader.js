import axios from 'axios';

async function loadData() {
  const result = await axios.get('https://ispeakapp.herokuapp.com/');
  return result.data;
}

export default loadData;
