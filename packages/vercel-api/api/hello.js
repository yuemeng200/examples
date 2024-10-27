// import axios from 'axios';

export default async function handler(req, res) {
  // const response = awaitgit  axios.get('https://jsonplaceholder.typicode.com/todos/1');
  res.status(200).json({
    message: 'Hello, world!',
  });
}