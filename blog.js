const form = document.getElementById('blogForm');
const output = document.getElementById('output');
const status = document.getElementById('status');

function escapeHtml(value='') {
  return value.replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
}

function markdownToHtml(md='') {
  let html = escapeHtml(md).replace(/^### (.*)$/gm, '<h3>$1</h3>').replace(/^## (.*)$/gm, '<h2>$1</h2>').replace(/^# (.*)$/gm, '<h1>$1</h1>');
  html = html.replace(/^[-*] (.*)$/gm, '<li>$1</li>').replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\*(.*?)\*/g, '<em>$1</em>');
  return html.split(/\n\s*\n/).map(block => /^<(h[1-3]|ul)>/.test(block.trim()) ? block : `<p>${block.replace(/\n/g,'<br>')}</p>`).join('');
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const button = form.querySelector('button');
  button.disabled = true;
  status.textContent = 'Writing your article...';
  output.innerHTML = '<div class="empty">AI is drafting your article ✨</div>';

  try {
    const response = await fetch('/api/generate-blog', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({
        topic: document.getElementById('topic').value,
        audience: document.getElementById('audience').value,
        tone: document.getElementById('tone').value,
        length: document.getElementById('length').value,
        notes: document.getElementById('notes').value
      })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Generation failed');
    output.innerHTML = `<h2>${escapeHtml(data.title)}</h2><div class="meta">AI-generated draft · Edit before publishing</div><div class="content">${markdownToHtml(data.content)}</div>`;
    status.textContent = 'Draft ready.';
  } catch (error) {
    output.innerHTML = `<div class="empty">${escapeHtml(error.message)}<br><small>Make sure the Vercel AI API key is configured.</small></div>`;
    status.textContent = 'Something went wrong.';
  } finally {
    button.disabled = false;
  }
});
