import * as core from '@actions/core';
import { Octokit } from '@octokit/action';

const octokit = new Octokit();

export async function run(): Promise<void> {
  try {
    core.debug('hello from workflow-runs action');
    const inputGithubRepository = core.getInput('github-repository', {
      required: false,
    });
    const workflowRunStatus = core.getInput('workflow-run-status', {
      required: false,
    });
    const workflowRunCreated = core.getInput('workflow-run-created', {
      required: false,
    });
    const workflowRunBranch = core.getInput('workflow-run-branch', {
      required: false,
    });
    const workflowRunActor = core.getInput('workflow-run-actor', {
      required: false,
    });
    const githubRepository =
      inputGithubRepository === ''
        ? process.env.GITHUB_REPOSITORY!
        : inputGithubRepository;
    const [owner, repo] = githubRepository.split('/');

    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/actions/runs',
      {
        owner,
        repo,
        status:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          workflowRunStatus === '' ? undefined : (workflowRunStatus as any),
        created:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          workflowRunCreated === '' ? undefined : (workflowRunCreated as any),
        branch:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          workflowRunBranch === '' ? undefined : (workflowRunBranch as any),
        actor:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          workflowRunActor === '' ? undefined : (workflowRunActor as any),
        headers: {
          'X-GitHub-Api-Version': '2022-11-28',
        },
      },
    );
    core.info('Output of GitHub API call ->');
    core.info(JSON.stringify(response.data, undefined, 2));
    core.setOutput('runs-summary', JSON.stringify(response.data, undefined, 2));
    core.setOutput('runs-count', response.data.total_count);
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message);
  }
}
