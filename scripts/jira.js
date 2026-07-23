const axios = require('axios');

async function addComment(issueKey, comment) {
  const body = {
    body: {
      type: 'doc',
      version: 1,
      content: [
        {
          type: 'paragraph',
          content: [
            {
              type: 'text',
              text: comment,
            },
          ],
        },
      ],
    },
  };

  const response = await axios.post(`${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/comment`, body, {
    auth: {
      username: process.env.JIRA_EMAIL,
      password: process.env.JIRA_API_TOKEN
    },
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  });

  return response.data;
}

module.exports = {
  addComment,
};