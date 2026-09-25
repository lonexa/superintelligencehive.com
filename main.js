// Hero: four agent panes type out their work in parallel; then one pauses
// for approval and raises a "needs you" alert — the moment SI Hive is built for.
(function () {
  const panes = Array.from(document.querySelectorAll('.pane'));
  const toast = document.querySelector('.toast');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function render(pre, lines, count, ask) {
    const html = lines.slice(0, count).map((line, i) =>
      i === 0 ? `<span class="prompt">${escape(line)}</span>` : escape(line)
    );
    if (ask) html.push(`<span class="ask">${escape(ask)}</span>`);
    pre.innerHTML = html.join('\n') + (ask ? ' ' : '\n') + '<span class="caret"></span>';
  }

  function escape(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function setState(pane, state, label) {
    pane.dataset.state = state;
    pane.querySelector('.chip').textContent = label;
  }

  const jobs = panes.map((pane) => {
    const pre = pane.querySelector('pre');
    return { pane, pre, lines: pre.dataset.lines.split('\n'), ask: pre.dataset.needs || null };
  });

  if (reduce) {
    jobs.forEach((j) => {
      render(j.pre, j.lines, j.lines.length, j.ask);
      if (j.ask) setState(j.pane, 'needs', 'Needs you');
    });
    if (toast) toast.hidden = false;
    return;
  }

  jobs.forEach((j) => render(j.pre, j.lines, 1, null));

  const stagger = [0, 350, 700, 1050];
  jobs.forEach((j, idx) => {
    for (let n = 2; n <= j.lines.length; n++) {
      setTimeout(() => render(j.pre, j.lines, n, null), stagger[idx] + (n - 1) * 1100);
    }
    const end = stagger[idx] + j.lines.length * 1100;
    setTimeout(() => {
      if (j.ask) {
        render(j.pre, j.lines, j.lines.length, j.ask);
        setState(j.pane, 'needs', 'Needs you');
        if (toast) toast.hidden = false;
      } else {
        setState(j.pane, 'done', 'Done');
      }
    }, end);
  });
})();
