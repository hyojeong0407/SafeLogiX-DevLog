import React, { useEffect, useState } from 'react';
import { getAllCommits, getCommitDetails } from './api';
import { splitCommits } from './utils';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

function App() {
  const [allCommits, setAllCommits] = useState([]);
  const [frontend, setFrontend] = useState([]);
  const [backend, setBackend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const commits = await getAllCommits(5); // 최근 500개
        setAllCommits(commits);

        const { frontend, backend } = await splitCommits(commits, getCommitDetails);
        setFrontend(frontend);
        setBackend(backend);
      } catch (err) {
        console.error("API Error:", err);
        setError(`GitHub API 오류: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{color:"red"}}>{error}</div>;

  const pieData = {
    labels: ['Frontend', 'Backend'],
    datasets: [
      {
        data: [frontend.length, backend.length],
        backgroundColor: ['#36A2EB', '#FF6384'],
      },
    ],
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>SafeLogiX Dev Log</h1>
      <div style={{ width: '400px', height: '400px', margin: '0 auto' }}>
        <Pie data={pieData} options={{ maintainAspectRatio: false }} />
      </div>

      <h2>All Commits ({allCommits.length})</h2>
      <ul>
        {allCommits.map(c => (
          <li key={c.sha}>
            <strong>{c.commit.author.name}</strong> - {c.commit.message}
            <br />
            <small>{new Date(c.commit.author.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <h2>Frontend Commits ({frontend.length})</h2>
      <ul>
        {frontend.map(c => (
          <li key={c.sha}>
            <strong>{c.commit.author.name}</strong> - {c.commit.message}
            <br />
            <small>{new Date(c.commit.author.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>

      <h2>Backend Commits ({backend.length})</h2>
      <ul>
        {backend.map(c => (
          <li key={c.sha}>
            <strong>{c.commit.author.name}</strong> - {c.commit.message}
            <br />
            <small>{new Date(c.commit.author.date).toLocaleString()}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;