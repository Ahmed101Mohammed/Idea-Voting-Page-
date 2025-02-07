document.addEventListener('DOMContentLoaded', () => {
    const ideaInput = document.getElementById('ideaInput');
    const submitIdea = document.getElementById('submitIdea');
    const ideasContainer = document.getElementById('ideasContainer');
    const loading = document.getElementById('loading');
    const errorMessage = document.getElementById('errorMessage');

    submitIdea.addEventListener('click', async () => {
        const ideaText = ideaInput.value.trim();
        if (ideaText) {
            showLoading();
            try {
                const response = await fetch('/api/ideas', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ idea: ideaText })
                });

                if (!response.ok) {
                    throw new Error('Failed to submit idea');
                }

                ideaInput.value = '';
                loadIdeas();
            } catch (error) {
                showError('Failed to submit idea. Please try again.');
            } finally {
                hideLoading();
            }
        }
    });

    async function loadIdeas() {
        showLoading();
        try {
            const response = await fetch('/api/ideas');
            if (!response.ok) {
                throw new Error('Failed to load ideas');
            }
            const ideas = await response.json();
            ideasContainer.innerHTML = ideas.map(idea => `
                <div class="p-4 border rounded shadow flex justify-between items-center">
                    <div>
                        <p class="text-lg font-semibold">${idea.idea}</p>
                        <p class="text-gray-600">Votes: ${idea.votingUp - idea.votingDown}</p>
                    </div>
                    <div class="flex space-x-2">
                        <button onclick="vote('${idea._id}', 'up')" class="text-green-500 hover:text-green-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                            </svg>
                        </button>
                        <button onclick="vote('${idea._id}', 'down')" class="text-red-500 hover:text-red-600">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                    </div>
                </div>
            `).join('');
        } catch (error) {
            showError('Failed to load ideas. Please try again.');
        } finally {
            hideLoading();
        }
    }

    window.vote = async (ideaId, direction) => {
        showLoading();
        try {
            const response = await fetch(`/api/ideas/${ideaId}/vote`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ direction })
            });

            if (!response.ok) {
                throw new Error('Failed to vote');
            }

            loadIdeas();
        } catch (error) {
            showError('Failed to vote. Please try again.');
        } finally {
            hideLoading();
        }
    };

    function showLoading() {
        loading.classList.remove('hidden');
    }

    function hideLoading() {
        loading.classList.add('hidden');
    }

    function showError(message) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
        setTimeout(() => {
            errorMessage.classList.add('hidden');
        }, 3000);
    }

    loadIdeas();
});
