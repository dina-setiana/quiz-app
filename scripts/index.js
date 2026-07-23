const { getEvent, extractJiraKey } = require('./github');
const { addComment } = require('./jira');

async function main() {
  try {
    const event = getEvent();
    console.log("Action:", event.action);
    const jiraKey = extractJiraKey(event);
    await addComment(jiraKey, 'This is a test comment.');

    if (!jiraKey) {
      console.log("No Jira ticket found.");
      return;
    }

    console.log("Jira:", jiraKey);

    const pr = event.pull_request;

    const message = `
      🚀 Pull Request Opened
      Title: ${pr.title}
      Author: ${event.sender.login}
      URL: ${pr.html_url}
    `;

    await addComment(jiraKey, message);
    console.log("Comment added!");
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();