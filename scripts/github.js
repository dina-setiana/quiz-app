const fs = require('fs');

function getEvent() {
  const eventPath = process.env.GITHUB_EVENT_PATH;
  if (!eventPath) {
    throw new Error('GITHUB_EVENT_PATH environment variable is not set.');
  }

  return JSON.parse(fs.readFileSync(eventPath, 'utf8'));
}

function extractJiraKey($event) {
  const branch = event.pull_request.head.ref;
  const title = event.pull_request.title;

  const regex = /[A-Z][A-Z0-9]+-\d+/;

  return (branch.match(regex)?.[0] ?? title.match(regex)?.[0] ?? null);
}

module.exports = {
  getEvent,
  extractJiraKey,
};