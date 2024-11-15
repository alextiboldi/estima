interface JiraSettings {
  jiraHost: string;
  jiraEmail: string;
  jiraApiToken: string;
}

export function getJiraClient(settings: JiraSettings) {
  const { jiraHost, jiraEmail, jiraApiToken } = settings;
  const auth = Buffer.from(`${jiraEmail}:${jiraApiToken}`).toString("base64");

  const getAllProjects = async () => {
    const response = await fetch(`${jiraHost}/rest/api/3/project`, {
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch Jira projects");
    }

    return response.json();
  };

  const getProjectStatuses = async (projectKey: string) => {
    const response = await fetch(
      `${jiraHost}/rest/api/3/project/${projectKey}/statuses`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch project statuses");
    }

    const data = await response.json();
    // Flatten the status categories and return unique statuses
    const statuses = new Set();
    const uniqueStatuses: string[] = [];

    data.forEach((issueType: any) => {
      issueType.statuses.forEach((status: any) => {
        if (!statuses.has(status.id)) {
          statuses.add(status.id);
          uniqueStatuses.push(status);
        }
      });
    });

    return uniqueStatuses;
  };

  const getProjectIssues = async (projectKey: string, statusId: string) => {
    console.log(
      `${jiraHost}/rest/api/3/search?jql=project=${projectKey} AND status=${statusId}`
    );
    const response = await fetch(
      `${jiraHost}/rest/api/3/search?jql=project=${projectKey} AND status=${statusId}`,
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch project issues");
    }

    return response.json();
  };

  return {
    getAllProjects,
    getProjectStatuses,
    getProjectIssues,
  };
}
