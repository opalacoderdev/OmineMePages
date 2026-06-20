/* ==========================================================================
   OmniMe Landing Page Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Card Hover Glow Effect ---
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--x', `${x}px`);
            card.style.setProperty('--y', `${y}px`);
        });
    });

    // --- 2. Copy to Clipboard Utility ---
    const copyButtons = document.querySelectorAll('.copy-btn');
    copyButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const textToCopy = btn.getAttribute('data-clipboard');
            if (!textToCopy) return;

            try {
                await navigator.clipboard.writeText(textToCopy);
                
                // Success state UI
                const originalHtml = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                btn.classList.add('copied');
                
                setTimeout(() => {
                    btn.innerHTML = originalHtml;
                    btn.classList.remove('copied');
                }, 2000);
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        });
    });

    // --- 3. Interactive Tabs Manager ---
    function setupTabs(tabContainerClass, tabBtnClass, tabContentClass, activeClass) {
        const containers = document.querySelectorAll(tabContainerClass);
        
        containers.forEach(container => {
            const tabs = container.querySelectorAll(tabBtnClass);
            
            tabs.forEach(tab => {
                tab.addEventListener('click', () => {
                    const targetId = tab.getAttribute('data-tab') || tab.getAttribute('data-install');
                    if (!targetId) return;

                    // Remove active from sibling tabs
                    tabs.forEach(t => t.classList.remove(activeClass));
                    tab.classList.add(activeClass);

                    // Toggle contents
                    const contents = container.querySelectorAll(tabContentClass);
                    contents.forEach(content => {
                        const contentId = content.id;
                        if (contentId.endsWith(targetId)) {
                            content.classList.add(activeClass);
                        } else {
                            content.classList.remove(activeClass);
                        }
                    });
                });
            });
        });
    }

    // Initialize tabs
    setupTabs('.gui-tabs-container', '.gui-tab-btn', '.gui-tab-content', 'active');
    setupTabs('.install-tabs-wrapper', '.install-tab-btn', '.install-content', 'active');

    // --- 4. Interactive Architecture Flow Chart ---
    const archNodes = document.querySelectorAll('.arch-node');
    const detailTitle = document.getElementById('arch-detail-title');
    const detailText = document.getElementById('arch-detail-text');
    const detailPanel = document.getElementById('arch-details-panel');

    archNodes.forEach(node => {
        const updateDetail = () => {
            // Remove active from all nodes
            archNodes.forEach(n => n.classList.remove('active'));
            node.classList.add('active');

            const title = node.querySelector('h4').innerText;
            const description = node.getAttribute('data-desc');

            // Quick fade transition effect
            detailPanel.style.opacity = 0.5;
            setTimeout(() => {
                detailTitle.innerText = title;
                detailText.innerText = description;
                detailPanel.style.opacity = 1;
            }, 100);
        };

        node.addEventListener('mouseenter', updateDetail);
        node.addEventListener('click', updateDetail);
    });

    // --- 5. Hero Terminal Typing Simulation ---
    const commandText1 = 'pip install omnime';
    const commandText2 = 'omnime start';
    const typedSpan1 = document.querySelector('.typed-command-1');
    const typedSpan2 = document.querySelector('.typed-command-2');
    const cursorLine = document.querySelector('.cursor-line');
    
    const logs = [
        document.querySelector('.log-init'),
        document.querySelector('.log-vcs'),
        document.querySelector('.log-ollama'),
        document.querySelector('.log-agent')
    ];

    function typeWriter(text, element, speed, callback) {
        let i = 0;
        element.innerHTML = '';
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else if (callback) {
                setTimeout(callback, 500);
            }
        }
        type();
    }

    function showLogsOneByOne(index) {
        if (index < logs.length) {
            logs[index].style.display = 'block';
            setTimeout(() => {
                showLogsOneByOne(index + 1);
            }, 600);
        } else {
            // After logs are fully printed, reveal next input prompt line and type command
            setTimeout(() => {
                cursorLine.style.display = 'block';
                typeWriter(commandText2, typedSpan2, 100, () => {
                    // Stop on final prompt typing complete
                });
            }, 800);
        }
    }

    // Start simulation when the page loads
    setTimeout(() => {
        typeWriter(commandText1, typedSpan1, 80, () => {
            showLogsOneByOne(0);
        });
    }, 600);
});
