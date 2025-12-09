document.addEventListener('DOMContentLoaded', () => {
    const REPO = 'crabamongtech/CrabOS';
    const API_URL = `https://api.github.com/repos/${REPO}`;
    const outputArea = document.getElementById('output-area');
    const DELAY = 50;

    const fetchRetry = async (url, retries = 3) => {
        for (let i = 0; i < retries; i++) {
            try {
                const res = await fetch(url);
                if (res.ok) return res.json();
                if (res.status === 403) {
                    await new Promise(r => setTimeout(r, 2000 * Math.pow(2, i)));
                } else { throw new Error(`Request failed: ${res.status}`); }
            } catch (e) {
                if (i === retries - 1) throw e;
            }
        }
    };
    
    const printLine = (content, cls = 'info') => {
        const line = document.createElement('p');
        line.className = `output-line ${cls}`;
        line.innerHTML = content;
        outputArea.appendChild(line);
        outputArea.scrollTop = outputArea.scrollHeight;
        return new Promise(r => setTimeout(r, DELAY));
    };

    const toggleCursor = (show) => {
        let cursor = document.getElementById('cursor');
        if (show) {
            if (!cursor) {
                cursor = document.createElement('span');
                cursor.id = 'cursor';
                cursor.className = 'cursor';
                outputArea.appendChild(cursor);
            }
        } else if (cursor) {
            cursor.remove();
        }
    };

    const runTerminalSequence = async () => {
        toggleCursor(true);

        // --- Add LOGO at top ---
        const logo = document.createElement('img');
        logo.src = "https://raw.githubusercontent.com/crabamongtech/CrabOS/refs/heads/main/logo.png";
        logo.className = "repo-logo";
        outputArea.appendChild(logo);

        await printLine('[INFO] Fetching repository data from GitHub...');

        let repo;
        try {
            repo = await fetchRetry(API_URL);
        } catch (err) {
            toggleCursor(false);
            await printLine('[ERROR] Failed to connect or rate limit exceeded.', 'error');
            await printLine(`[DETAIL] Error: ${err.message || 'Unknown error'}`, 'detail');
            return;
        }

        await printLine('[SUCCESS] Repository data retrieved.');
        await printLine('');
        
        toggleCursor(false);

        // Core Info
        await printLine(`NAME: <span class="success">${repo.name}</span>`);
        await printLine(`DESC: <span class="detail">${repo.description || 'No description provided.'}</span>`);
        await printLine(`URL: <span class="detail">${repo.html_url}</span>`);
        await printLine('');

        // Stats
        await printLine('[STAT] Metrics:');
        await printLine(`\tSTARS: <span class="value">${repo.stargazers_count}</span>`);
        await printLine(`\tFORKS: <span class="value">${repo.forks_count}</span>`);
        await printLine(`\tISSUES: <span class="value">${repo.open_issues_count}</span>`);
        await printLine('');

        // Details
        await printLine('[INFO] Details:');
        await printLine(`\tSIZE: <span class="value">${(repo.size / 1024).toFixed(2)} MB</span>`);
        await printLine(`\tLICENSE: <span class="value">${repo.license?.spdx_id || repo.license?.name || 'N/A'}</span>`);
        await printLine(`\tUPDATED: <span class="value">${new Date(repo.updated_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>`);
        await printLine('');
        
        // Download link
        const downloadUrl = `${repo.html_url}/archive/refs/heads/${repo.default_branch}.zip`;
        const downloadLine = `<span class="success">[ACTION] Download:</span> <a href="${downloadUrl}" target="_blank" class="rainbow-link">DOWNLOAD HERE</a>`;
        await printLine(downloadLine);
        await printLine('');

        toggleCursor(true);
    };

    runTerminalSequence();
});
