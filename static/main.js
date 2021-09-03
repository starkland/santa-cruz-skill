const content = document.querySelector('#content');

const displayContent = (str) => {
  content.innerHTML = str;
}

const getData = () => {
  const API_URL = 'https://santa-cruz-skill.herokuapp.com/santa-cruz';

  const options = {
    method: 'GET',
    headers: {
      Accept: 'application/json',
    }
  };

  const request = fetch(API_URL, options);

  return request
    .then((response) => response.json())
    .then(data => {
      const { payload } = data
      displayContent(payload.content)
    })
    .catch((e) => {
      // add a log system here
      console.info("there is an error:", e)
    });
}

getData()