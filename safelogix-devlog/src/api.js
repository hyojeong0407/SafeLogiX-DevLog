import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com/repos/hyojeong0407/SafeLogiX',
  headers: {
    Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
  },
});

// 모든 커밋 가져오기 (페이지네이션)
export async function getAllCommits(maxPages = 5) {
  let page = 1;
  let allCommits = [];

  while (page <= maxPages) {
    const res = await api.get(`/commits?per_page=100&page=${page}`);
    const commits = res.data;

    if (!commits || commits.length === 0) {
      break;
    }

    allCommits = [...allCommits, ...commits];
    page++;
  }

  return allCommits;
}

// 특정 커밋 상세 (파일 경로 포함)
export async function getCommitDetails(sha) {
  const res = await api.get(`/commits/${sha}`);
  return res.data;
}