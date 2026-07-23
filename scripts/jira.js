const axios = require('axios');

async function addComment(issueKey, comment) {
  const url = `${process.env.JIRA_BASE_URL}/rest/api/3/issue/${issueKey}/comment`;
  const auth = Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64');
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

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${auth}`,
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error);
  }

  return response.json();
}

module.exports = {
  addComment,
};