// .github/actions/my-script.js
import { Octokit } from "@octokit/action";
import fs from "fs";

const octokit = new Octokit();

const filename = `data.json`;
const owner = 'novelrt';
const timestamp = new Date().toISOString();

/* List of repos to be queried for contributors */
const repos = [
  "NovelRT",
  "novelrt.github.io",
  "NovelRT-Azure-Functions",
  "NovelRT.Sdk",
  "Fabulist",
  "NovelRT-Gradle-Plugin",
  "FumoCement",
  "Touhou-NovelRT",
];

/*
 Set up object for data to go into JSON file.
 Each repo has an object with the following properties:
 {
  "repo_name": "repo_name",
  "repo_url": "repo_url",
  "contributors": [] // array of contributors
 }
*/
const jsonData = {
  "timestamp": timestamp,
  "repos": [
  ]
}

/* Octokit request (which does the GH auth for us) */
const getData = async (repoName) => {
  try {
    const { data } = await octokit.request('GET /repos/{owner}/{repo}/contributors', {
    owner: owner,
    repo: repoName
  })
  return data;
  } catch (error) {
    console.log(`error with repo: ${repoName}: ${error}`);
    return;
  }
};

/* Need a plain "for loop" because of the await call */
for (let i = 0; i < repos.length; i++) {
  const obj = {}
  const repoName = repos[i];
  obj.repo_name = repoName;
  obj.repo_url = `https://github.com/${owner}/${repoName}`;
  const data = await getData(repoName);
  if (Array.isArray(data) && data.length > 0) {
    obj.contributors = data.sort((a, b) => b.contributions > a.contributions ? 1 : -1);
    jsonData.repos.push(obj);
    console.log(`repo ${repoName} has ${data.length} contributors`);
  }
}

/* Keep data formatted for easy reading */
fs.writeFile(filename, JSON.stringify(jsonData, null, 2), (err) => {
  if (err) {
    console.error(`error writing file ${filename} with error ${err}`);
    return;
  }
  console.log(`${timestamp}: ${filename} has been saved! It has ${jsonData.repos.length} repos`);
});
