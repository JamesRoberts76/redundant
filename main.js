(function() {
    const openBtn = document.getElementById('openPortalBtn');
    const portal = document.getElementById('immersivePortal');
    const closeBtn = document.getElementById('closePortalBtn');
    const submitBtn = document.getElementById('portalSubmit');
    const inputField = document.getElementById('portalInput');
    const feedContainer = document.getElementById('portalFeed');

    let userUuid = localStorage.getItem('sovereign_user_uuid') || 'user_' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('sovereign_user_uuid', userUuid);

    function togglePortal(e) {
        if (e) e.preventDefault();
        portal.classList.toggle('active');
        if (portal.classList.contains('active')) {
            inputField.focus();
        }
    }

    if (openBtn) openBtn.addEventListener('click', togglePortal);
    if (closeBtn) closeBtn.addEventListener('click', () => portal.classList.remove('active'));

    async function handlePortalMessage() {
        const text = inputField.value.trim();
        if (!text) return;

        const userDiv = document.createElement('div');
        userDiv.className = 'portal-message user';
        userDiv.textContent = text;
        feedContainer.appendChild(userDiv);
        inputField.value = '';
        portal.scrollTo({ top: portal.scrollHeight, behavior: 'smooth' });

        const loadingDiv = document.createElement('div');
        loadingDiv.className = 'portal-message system';
        loadingDiv.innerHTML = '<strong>James:</strong> Analyzing structural efficiency across network matrix...';
        feedContainer.appendChild(loadingDiv);
        portal.scrollTo({ top: portal.scrollHeight, behavior: 'smooth' });

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    siteId: 'redundant.guide',
                    message: text,
                    uuid: userUuid
                })
            });

            const data = await response.json();
            loadingDiv.remove();

            const systemDiv = document.createElement('div');
            systemDiv.className = 'portal-message system';
            systemDiv.innerHTML = `<strong>James:</strong> ${data.message || 'Error processing request.'}`;
            feedContainer.appendChild(systemDiv);
            portal.scrollTo({ top: portal.scrollHeight, behavior: 'smooth' });
        } catch (err) {
            loadingDiv.remove();
            const errDiv = document.createElement('div');
            errDiv.className = 'portal-message system';
            errDiv.innerHTML = '<strong>James:</strong> Connection error across network matrix. Verify worker bindings.';
            feedContainer.appendChild(errDiv);
            portal.scrollTo({ top: portal.scrollHeight, behavior: 'smooth' });
        }
    }

    if (submitBtn) submitBtn.addEventListener('click', handlePortalMessage);
    if (inputField) {
        inputField.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handlePortalMessage();
            }
        });
    }
})();
