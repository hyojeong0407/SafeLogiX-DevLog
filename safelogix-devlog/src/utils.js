export async function splitCommits(commits, getDetails) {
  const results = await Promise.all(
    commits.map(async (c) => {
      try {
        const details = await getDetails(c.sha);
        if (!details.files) return { type: null, commit: c };

        const files = details.files.map(f => f.filename);
        console.log("Commit files:", files); // 디버깅용

        if (files.some(f => f.includes('frontend'))) {
          return { type: 'frontend', commit: c };
        }
        if (files.some(f => f.includes('backend'))) {
          return { type: 'backend', commit: c };
        }
        return { type: null, commit: c };
      } catch (err) {
        console.error("Commit detail error:", err);
        return { type: null, commit: c };
      }
    })
  );

  const frontend = results.filter(r => r.type === 'frontend').map(r => r.commit);
  const backend = results.filter(r => r.type === 'backend').map(r => r.commit);

  return { frontend, backend };
}