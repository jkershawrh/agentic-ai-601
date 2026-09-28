import { writeFileSync } from 'node:fs';

const required = [
  'GITHUB_REPOSITORY',
  'GITHUB_SHA',
  'GITHUB_RUN_ID',
  'GITHUB_RUN_ATTEMPT',
  'GITHUB_WORKFLOW_REF',
  'IMAGE_NAME',
  'IMAGE_DIGEST',
];

for (const name of required) {
  if (!process.env[name]) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
}

const repositoryUrl = `https://github.com/${process.env.GITHUB_REPOSITORY}`;
const runUrl = `${repositoryUrl}/actions/runs/${process.env.GITHUB_RUN_ID}/attempts/${process.env.GITHUB_RUN_ATTEMPT}`;

const predicate = {
  buildDefinition: {
    buildType: 'https://github.com/Attestations/GitHubActionsWorkflow@v1',
    externalParameters: {
      workflow: {
        ref: process.env.GITHUB_WORKFLOW_REF,
        repository: repositoryUrl,
      },
    },
    internalParameters: {
      image: process.env.IMAGE_NAME,
      platform: 'linux/amd64',
    },
    resolvedDependencies: [
      {
        uri: `git+${repositoryUrl}.git`,
        digest: { gitCommit: process.env.GITHUB_SHA },
      },
    ],
  },
  runDetails: {
    builder: {
      id: process.env.GITHUB_WORKFLOW_REF,
    },
    metadata: {
      invocationId: runUrl,
    },
  },
};

writeFileSync('provenance.json', `${JSON.stringify(predicate, null, 2)}\n`);
