// Main JavaScript file
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready!');
    
    // Get all sections and navigation links
    const sections = document.querySelectorAll('.scroll-section');
    const navLinks = document.querySelectorAll('.section-nav a');
    const scrollContainer = document.querySelector('.scroll-container');
    
    // Video functionality variables
    const videoPlaceholders = document.querySelectorAll('.video-placeholder');
    const videoOverlays = document.querySelectorAll('.video-overlay');
    const fullscreenVideoContainers = document.querySelectorAll('.fullscreen-video-container');
    
    // Function to determine which section is in view
    function getCurrentSection() {
        let current = '';
        let minDistance = Infinity;
        
        sections.forEach(section => {
            // Get the distance from the top of the viewport to the top of the section
            const sectionTop = section.getBoundingClientRect().top;
            const distance = Math.abs(sectionTop);
            
            // Find the closest section to the top of the viewport
            if (distance < minDistance) {
                minDistance = distance;
                current = section.getAttribute('id');
            }
        });
        
        return current;
    }
    
    // Update navigation and reveal content when scrolling
    scrollContainer.addEventListener('scroll', function() {
        const currentSection = getCurrentSection();
        
        // Update navigation dots
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
        
        // Reveal content of visible section
        sections.forEach(section => {
            // Skip the title slide as it has its own animations
            if (section.id === 'title-slide') return;
            
            // Special animations for the last two sections
            if (section.classList.contains('animation-section')) {
                // Check if section is in view
                const sectionTop = section.getBoundingClientRect().top;
                const isInView = sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5;
                handleSpecialSectionAnimations(section, isInView);
                return;
            }
            
            const content = section.querySelector('.content');
            if (!content) return;
            
            const sectionTop = section.getBoundingClientRect().top;
            
            // Check if the section is almost in view
            if (sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5) {
                content.classList.add('visible');
            } else {
                content.classList.remove('visible');
            }
        });
    });
    
    // Click event for navigation dots
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('data-section');
            const targetSection = document.getElementById(targetId);
            
            // Smooth scroll to the target section
            targetSection.scrollIntoView({ behavior: 'smooth' });
            
            // Update active dot
            navLinks.forEach(dot => dot.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Handle keyboard navigation (arrow keys)
    document.addEventListener('keydown', function(e) {
        const currentSection = getCurrentSection();
        const currentIndex = Array.from(sections).findIndex(section => section.id === currentSection);
        let targetIndex;
        
        // Determine which section to go to
        if (e.key === 'ArrowDown' || e.key === 'PageDown') {
            targetIndex = Math.min(currentIndex + 1, sections.length - 1);
        } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            targetIndex = Math.max(currentIndex - 1, 0);
        } else {
            return; // Not an arrow key, exit
        }
        
        // Scroll to the target section
        if (targetIndex !== currentIndex) {
            sections[targetIndex].scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Add wheel event for more controlled scrolling (optional)
    document.addEventListener('wheel', function(e) {
        // This can be used to add custom scroll behavior
        // if desired, beyond the native scroll-snap
    }, { passive: true });
    
    // Video functionality for all video sections
    videoPlaceholders.forEach((placeholder) => {
        if (!placeholder) return;
        
        const section = placeholder.closest('.scroll-section');
        if (!section) return;
        
        const sectionId = section.id;
        // Hunter videos have been removed
        // Skip video initialization for removed sections
        // Skip logic for Hunter sections removed
        
        const videoId = section.getAttribute('data-video-id');
        const videoPlayer = document.getElementById(videoId);
        const videoOverlay = section.querySelector('.video-overlay');
        const fullscreenVideoContainer = section.querySelector('.fullscreen-video-container');
        
        if (!videoPlayer || !videoOverlay || !fullscreenVideoContainer) return;
        
        // Click event for video placeholder
        placeholder.addEventListener('click', function() {
            // Show darkened overlay
            videoOverlay.classList.add('active');
            
            // Show fullscreen container
            fullscreenVideoContainer.classList.add('active');
            
            // Disable page scrolling
            document.body.style.overflow = 'hidden';
            scrollContainer.style.overflow = 'hidden';
            
            // Play the video without controls
            videoPlayer.removeAttribute('controls'); // No controls as per requirements
            videoPlayer.play();
            
            // Handle click on overlay to close video
            videoOverlay.addEventListener('click', closeVideo);
            
            // Handle click on the fullscreen video container to close video
            function handleContainerClick(e) {
                // Only close if clicking on the container but not directly on the video
                if (e.target === fullscreenVideoContainer) {
                    closeVideo();
                }
            }
            fullscreenVideoContainer.addEventListener('click', handleContainerClick);
            
            function closeVideo() {
                // Pause video
                videoPlayer.pause();
                videoPlayer.currentTime = 0; // Reset to beginning
                
                // Hide overlay and container
                videoOverlay.classList.remove('active');
                fullscreenVideoContainer.classList.remove('active');
                
                // Re-enable scrolling
                document.body.style.overflow = '';
                scrollContainer.style.overflow = 'scroll';
                
                // Remove event listeners to prevent multiple bindings
                videoOverlay.removeEventListener('click', closeVideo);
                fullscreenVideoContainer.removeEventListener('click', handleContainerClick);
            }
            
            // Video ended event
            videoPlayer.addEventListener('ended', closeVideo);
        });
    });
    
    // Update visibility of story sections when scrolled to
    function updateStoryVisibility() {
        // Hunter sections removed
    }
    
    function updateSectionVisibility(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return;
        
        // Hunter text content reference removed
        const textContent = section.querySelector('.text-content');
        const videoContainer = section.querySelector('.video-container');
        
        const sectionTop = section.getBoundingClientRect().top;
        
        // Check if the section is almost in view
        if (sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5) {
            if (textContent) textContent.classList.add('visible');
            if (videoContainer) videoContainer.classList.add('visible');
        } else {
            if (textContent) textContent.classList.remove('visible');
            if (videoContainer) videoContainer.classList.remove('visible');
        }
    }
    
    // Timeline section visibility and animations
    const timelineSections = document.querySelectorAll('.timeline-section');
    const timelineVideos = document.querySelectorAll('.slide-video');
    
    function updateTimelineVisibility() {
        timelineSections.forEach((section, index) => {
            const sectionTop = section.getBoundingClientRect().top;
            const isActive = sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5;
            
            // Add or remove active class
            if (isActive) {
                section.classList.add('active');
                
                // Activate appropriate timeline dot
                const dot = section.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.add('active');
                    
                    // Add pulse animation for specific slides
                    if (section.id === 'slide-4-1' || section.id === 'slide-4-3' || section.id === 'slide-4-5') {
                        dot.classList.add('pulse');
                    }
                }
                
                // Add glowing effect for slide 4.4's timeline
                if (section.id === 'slide-4-4') {
                    const line = section.querySelector('.timeline-line');
                    if (line) line.style.boxShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
                }
                
                // Play the video
                const video = section.querySelector('.slide-video');
                if (video) {
                    video.play().catch(error => {
                        console.log('Video play prevented by browser:', error);
                    });
                }
            } else {
                section.classList.remove('active');
                
                // Deactivate timeline dot
                const dot = section.querySelector('.timeline-dot');
                if (dot) {
                    dot.classList.remove('active');
                    dot.classList.remove('pulse');
                }
                
                // Remove glowing effect
                if (section.id === 'slide-4-4') {
                    const line = section.querySelector('.timeline-line');
                    if (line) line.style.boxShadow = 'none';
                }
                
                // Pause the video
                const video = section.querySelector('.slide-video');
                if (video) {
                    video.pause();
                }
            }
            
            // Update timeline lines between slides
            if (index < timelineSections.length - 1) {
                const currentSectionId = section.id;
                const nextSectionId = timelineSections[index + 1].id;
                const nextSection = document.getElementById(nextSectionId);
                
                // If current section is active, start extending the line to the next dot
                if (isActive && nextSection) {
                    const nextDot = nextSection.querySelector('.timeline-dot');
                    if (nextDot) {
                        // Make the next dot partially visible to show progression
                        nextDot.style.opacity = '0.7';
                        nextDot.style.transform = 'scale(0.9)';
                    }
                }
            }
        });
    }
    
    // Symptoms and Progression Tab Functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');
    
    function updateSymptomsVisibility() {
        const symptomsSection = document.getElementById('symptoms-progression');
        if (!symptomsSection) return;
        
        const symptomsTitle = symptomsSection.querySelector('.symptoms-title');
        const introText = symptomsSection.querySelector('.slide-intro-text');
        const tabContainer = symptomsSection.querySelector('.tab-container');
        
        const sectionTop = symptomsSection.getBoundingClientRect().top;
        
        // Check if the section is almost in view
        if (sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5) {
            if (symptomsTitle) {
                symptomsTitle.style.opacity = '1';
            }
            if (introText) {
                introText.style.opacity = '1';
                introText.style.transform = 'translateY(0)';
            }
            if (tabContainer) tabContainer.classList.add('visible');
            
            // Automatically animate rows for the active tab with a dramatic sequence
            const activePane = symptomsSection.querySelector('.tab-pane.active');
            if (activePane) {
                const rows = activePane.querySelectorAll('tbody tr');
                
                // Reset animations if they were previously applied
                rows.forEach(row => {
                    row.classList.remove('animated');
                    row.style.opacity = '0';
                    row.style.transform = 'translateY(20px)';
                });
                
                // Apply animations with increased delays between each row
                rows.forEach((row, index) => {
                    setTimeout(() => {
                        row.classList.add('animated');
                    }, 300 * (index + 1)); // Increased delay for more dramatic effect
                });
                
                // Reset and animate images with staggered delays
                const images = activePane.querySelectorAll('.symptom-image');
                images.forEach(img => {
                    img.classList.remove('animated');
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.6) translateX(30px)';
                });
                
                images.forEach((img, index) => {
                    setTimeout(() => {
                        img.classList.add('animated');
                    }, 400 * (index + 1)); // Even longer delay for images
                });
            }
        } else {
            if (symptomsTitle) {
                symptomsTitle.style.opacity = '0';
            }
            if (introText) {
                introText.style.opacity = '0';
                introText.style.transform = 'translateY(30px)';
            }
            if (tabContainer) tabContainer.classList.remove('visible');
            
            // Reset animations when scrolled away, so they replay when we come back
            const allPanes = symptomsSection.querySelectorAll('.tab-pane');
            allPanes.forEach(pane => {
                const rows = pane.querySelectorAll('tbody tr');
                const images = pane.querySelectorAll('.symptom-image');
                
                rows.forEach(row => {
                    row.classList.remove('animated');
                    row.style.opacity = '0';
                    row.style.transform = 'translateY(20px)';
                });
                
                images.forEach(img => {
                    img.classList.remove('animated');
                    img.style.opacity = '0';
                    img.style.transform = 'scale(0.6) translateX(30px)';
                });
            });
        }
    }
    
    // Add tab switching functionality with enhanced animations
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Don't do anything if this tab is already active
            if (button.classList.contains('active')) return;
            
            const targetTabId = button.dataset.tab;
            const targetTab = document.getElementById(targetTabId);
            const currentTab = document.querySelector('.tab-pane.active');
            
            // Determine slide direction based on button order
            const isMovingRight = Array.from(tabButtons).indexOf(button) > 
                                 Array.from(tabButtons).findIndex(b => b.classList.contains('active'));
            
            // Update active button with a subtle pulse effect
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Animate current tab out
            if (currentTab) {
                if (isMovingRight) {
                    currentTab.classList.add('exit-left');
                } else {
                    currentTab.classList.add('enter-right');
                }
                
                // After animation completes, hide it and show the new tab
                setTimeout(() => {
                    currentTab.classList.remove('active', 'exit-left', 'enter-right');
                    
                    // Animate new tab in
                    if (targetTab) {
                        targetTab.style.transform = isMovingRight ? 'translateX(50px)' : 'translateX(-50px)';
                        targetTab.classList.add('active');
                        
                        // Reset rows for dramatic sequential animation
                        const rows = targetTab.querySelectorAll('tbody tr');
                        rows.forEach(row => {
                            row.classList.remove('animated');
                            row.style.opacity = '0';
                            row.style.transform = 'translateY(20px)';
                        });
                        
                        // Reset images
                        const images = targetTab.querySelectorAll('.symptom-image');
                        images.forEach(img => {
                            img.classList.remove('animated');
                            img.style.opacity = '0';
                            img.style.transform = 'scale(0.6) translateX(30px)';
                        });
                        
                        // Force browser reflow
                        void targetTab.offsetWidth;
                        
                        // Animate tab container in first
                        setTimeout(() => {
                            targetTab.style.transform = 'translateX(0)';
                        }, 50);
                        
                        // Animate table header with a subtle flash
                        const tableHeader = targetTab.querySelector('thead');
                        if (tableHeader) {
                            tableHeader.style.opacity = '0.6';
                            setTimeout(() => {
                                tableHeader.style.opacity = '1';
                            }, 200);
                        }
                        
                        // Animate rows in with dramatic staggered delay
                        rows.forEach((row, index) => {
                            setTimeout(() => {
                                // Add the class that triggers the keyframe animation
                                row.classList.add('animated');
                            }, 300 * (index + 1)); // Longer delay between each row (300ms)
                        });
                        
                        // Animate images in with even more dramatic delay
                        images.forEach((img, index) => {
                            setTimeout(() => {
                                img.classList.add('animated');
                            }, 400 * (index + 1)); // Even longer delay for images (400ms)
                        });
                    }
                }, 350); // Slightly longer transition
            }
        });
    });
    
    // HSCT Treatment Section animation
    function updateHSCTVisibility() {
        const hsctSection = document.getElementById('hsct-treatment');
        if (!hsctSection) return;
        
        const hsctTitle = hsctSection.querySelector('.hsct-title');
        const hsctVideoContainer = hsctSection.querySelector('.hsct-video-container');
        const hsctBullets = hsctSection.querySelectorAll('.hsct-bullet');
        
        const sectionTop = hsctSection.getBoundingClientRect().top;
        
        // Check if the section is almost in view
        if (sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5) {
            if (hsctTitle) {
                hsctTitle.classList.add('visible');
            }
            if (hsctVideoContainer) {
                hsctVideoContainer.classList.add('visible');
            }
            
            // Animate bullets with staggered delay
            hsctBullets.forEach((bullet, index) => {
                setTimeout(() => {
                    bullet.classList.add('visible');
                }, 500 + (400 * index)); // Start after title/video and then stagger each bullet
            });
            
            // Start the video if it's visible
            const hsctVideo = hsctSection.querySelector('.hsct-video');
            if (hsctVideo) {
                hsctVideo.play().catch(error => {
                    console.log('HSCT video play prevented by browser:', error);
                });
            }
        } else {
            if (hsctTitle) {
                hsctTitle.classList.remove('visible');
            }
            if (hsctVideoContainer) {
                hsctVideoContainer.classList.remove('visible');
            }
            
            // Reset bullet animations
            hsctBullets.forEach(bullet => {
                bullet.classList.remove('visible');
            });
            
            // Pause the video when not visible
            const hsctVideo = hsctSection.querySelector('.hsct-video');
            if (hsctVideo) {
                hsctVideo.pause();
            }
        }
    }

    // HSCT Limits Section animation
    // Store the wall transformation timeout ID to be able to cancel it
    let wallTransformationTimeout = null;
    
    // Track if the section is currently visible
    let hsctLimitsVisible = false;
    
    function updateHSCTLimitsVisibility() {
        const limitsSection = document.getElementById('hsct-limits');
        if (!limitsSection) return;
        
        const limitsTitle = limitsSection.querySelector('.limits-title');
        const blocks = limitsSection.querySelectorAll('.limit-block');
        const wallContainer = limitsSection.querySelector('.wall-container');
        
        const sectionTop = limitsSection.getBoundingClientRect().top;
        const isInView = sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5;
        
        // Detect entering or leaving the section
        if (isInView && !hsctLimitsVisible) {
            // Section just became visible - start animations
            hsctLimitsVisible = true;
            
            if (limitsTitle) {
                limitsTitle.classList.add('visible');
            }
            
            // Reset blocks to initial state
            blocks.forEach(block => {
                // Reset inline styles and remove visible class to ensure clean animation state
                block.style.opacity = '';
                block.classList.remove('visible');
            });
            
            // Reset wall container
            if (wallContainer) {
                wallContainer.classList.remove('visible');
            }
            
            // Pop in blocks from bottom one by one with staggered delay
            blocks.forEach((block, index) => {
                setTimeout(() => {
                    block.classList.add('visible');
                }, 800 + (400 * index)); 
            });
            
            // Removed wall transformation to ensure blocks stay visible
            if (blocks.length > 0) {
                // No timeout or wall transformation needed
                const lastBlockIndex = blocks.length - 1;
                const lastBlockVisibleTime = 800 + (400 * lastBlockIndex);
                
                // Keep blocks visible without transforming into a wall
                if (wallTransformationTimeout) {
                    clearTimeout(wallTransformationTimeout);
                    wallTransformationTimeout = null;
                }
            }
        } else if (!isInView && hsctLimitsVisible) {
            // Section just became invisible - reset all animations
            hsctLimitsVisible = false;
            
            // No wall transformation timeout to cancel
            
            // Reset all elements to their initial state
            if (limitsTitle) {
                limitsTitle.classList.remove('visible');
            }
            
            // Only reset blocks when user has actually scrolled to the next section,
            // not when just hovering at the edge of this section
            if (sectionTop < -window.innerHeight * 0.8) {
                blocks.forEach(block => {
                    block.classList.remove('visible');
                    block.style.opacity = ''; // Remove inline style to ensure proper reset
                });
            }
            
            // No need to reset wall as it's permanently hidden
        }
    }

    // Gene Therapy vs HSCT Comparison section animations
    function updateTherapyComparisonVisibility() {
        const comparisonSection = document.getElementById('therapy-comparison');
        if (!comparisonSection) return;
        
        const comparisonTitle = comparisonSection.querySelector('.comparison-title');
        const comparisonRows = comparisonSection.querySelectorAll('.comparison-row');
        const finalVerdict = comparisonSection.querySelector('.final-verdict');
        
        const sectionTop = comparisonSection.getBoundingClientRect().top;
        const isInView = sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5;
        
        if (isInView) {
            // Make the title visible
            if (comparisonTitle) {
                comparisonTitle.classList.add('visible');
            }
            
            // Animate each row sequentially
            comparisonRows.forEach((row, index) => {
                setTimeout(() => {
                    // Make the row visible first
                    row.classList.add('visible');
                    
                    // Then animate the panels with a short delay
                    const leftPanel = row.querySelector('.left-panel');
                    const rightPanel = row.querySelector('.right-panel');
                    
                    setTimeout(() => {
                        if (leftPanel) leftPanel.classList.add('visible');
                    }, 300);
                    
                    setTimeout(() => {
                        if (rightPanel) rightPanel.classList.add('visible');
                    }, 600);
                    
                    // Finally, animate the winner badge
                    setTimeout(() => {
                        const winnerBadge = row.querySelector('.winner-badge');
                        if (winnerBadge) winnerBadge.classList.add('visible');
                    }, 1200);
                    
                }, 600 * index); // Staggered delay between each row
            });
            
            // Animate the final verdict after all rows
            if (finalVerdict && comparisonRows.length > 0) {
                const lastRowDelay = 600 * (comparisonRows.length - 1) + 1500;
                setTimeout(() => {
                    finalVerdict.classList.add('visible');
                }, lastRowDelay);
            }
        } else {
            // Reset animations when scrolled away
            if (comparisonTitle) {
                comparisonTitle.classList.remove('visible');
            }
            
            comparisonRows.forEach(row => {
                row.classList.remove('visible');
                
                const leftPanel = row.querySelector('.left-panel');
                const rightPanel = row.querySelector('.right-panel');
                const winnerBadge = row.querySelector('.winner-badge');
                
                if (leftPanel) leftPanel.classList.remove('visible');
                if (rightPanel) rightPanel.classList.remove('visible');
                if (winnerBadge) winnerBadge.classList.remove('visible');
            });
            
            if (finalVerdict) {
                finalVerdict.classList.remove('visible');
            }
        }
    }

    // Vector Delivery Section Animation & Interaction
    function updateVectorDeliveryVisibility() {
        const deliverySection = document.getElementById('vector-delivery');
        if (!deliverySection) return;
        
        const vectorTitle = deliverySection.querySelector('.vector-title');
        const introParagraph = deliverySection.querySelector('.intro-paragraph');
        const deliveryCards = deliverySection.querySelectorAll('.delivery-card');
        
        const sectionTop = deliverySection.getBoundingClientRect().top;
        const isInView = sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5;
        
        if (isInView) {
            // Make the title visible with sliding up animation
            if (vectorTitle) {
                vectorTitle.classList.add('visible');
            }
            
            // Make the intro paragraph visible with sliding up animation
            if (introParagraph) {
                introParagraph.classList.add('visible');
            }
            
            // Staggered animation for delivery cards
            deliveryCards.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('visible');
                }, 600 + (300 * index)); // Staggered delay for each card
            });
        } else {
            // Reset animations when scrolled away
            if (vectorTitle) {
                vectorTitle.classList.remove('visible');
            }
            
            if (introParagraph) {
                introParagraph.classList.remove('visible');
            }
            
            deliveryCards.forEach(card => {
                card.classList.remove('visible');
            });
        }
    }
    
    // Setup interaction for delivery method cards
    function setupDeliveryCardInteraction() {
        const deliveryCards = document.querySelectorAll('.delivery-card');
        
        deliveryCards.forEach(card => {
            const selectBtn = card.querySelector('.select-btn');
            const resultBadge = card.querySelector('.result-badge');
            const reason = card.querySelector('.reason');
            const mvpBadge = card.querySelector('.mvp-badge');
            
            if (!selectBtn) return;
            
            selectBtn.addEventListener('click', () => {
                // Hide MVP badge from all cards first
                document.querySelectorAll('.mvp-badge').forEach(badge => {
                    badge.classList.remove('show');
                });
                
                // Remove correct-answer class and glow from all cards
                deliveryCards.forEach(c => {
                    c.classList.remove('selected', 'correct-answer', 'glow');
                });
                
                // Mark this card as selected
                card.classList.add('selected');
                
                // Show the result badge with animation
                if (resultBadge) {
                    resultBadge.classList.add('show');
                }
                
                // Show the reason with animation
                if (reason) {
                    reason.classList.add('show');
                    
                    // Setup close button for reason
                    const closeButton = reason.querySelector('.close-reason');
                    if (closeButton) {
                        closeButton.addEventListener('click', (e) => {
                            e.stopPropagation(); // Prevent event from bubbling up
                            reason.classList.remove('show');
                        });
                    }
                }
                
                // If this is the correct answer (injection), show MVP badge and add glow
                if (card.id === 'injection-card' && mvpBadge) {
                    setTimeout(() => {
                        mvpBadge.classList.add('show');
                        card.classList.add('correct-answer', 'glow');
                    }, 1000); // Delay to show MVP badge after the result
                }
                
                // For other cards, hide their reasons after selection
                deliveryCards.forEach(otherCard => {
                    if (otherCard !== card) {
                        const otherReason = otherCard.querySelector('.reason');
                        const otherResultBadge = otherCard.querySelector('.result-badge');
                        
                        if (otherReason) otherReason.classList.remove('show');
                        if (otherResultBadge) otherResultBadge.classList.remove('show');
                    }
                });
            });
            
            // Hover effect for cards
            card.addEventListener('mouseenter', () => {
                // Only show select button on hover if card is not already selected
                if (!card.classList.contains('selected') && selectBtn) {
                    selectBtn.style.opacity = '1';
                    selectBtn.style.transform = 'scale(1)';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                // Hide select button when not hovering, unless card is selected
                if (!card.classList.contains('selected') && selectBtn) {
                    selectBtn.style.opacity = '0';
                    selectBtn.style.transform = 'scale(0.8)';
                }
            });
        });
    }
    
    // Call setup function when document is ready
    setupDeliveryCardInteraction();
    
    // Update visibility on scroll for all sections
    scrollContainer.addEventListener('scroll', function() {
        updateStoryVisibility();
        updateTimelineVisibility();
        updateSymptomsVisibility();
        updateHSCTVisibility();
        updateHSCTLimitsVisibility();
        updateTherapyComparisonVisibility();
        updateVectorDeliveryVisibility();
        updateDeliveryMethodsVisibility();
        updateTherapyDataVisibility();
    });
    
    // Initial check for visibility
    updateStoryVisibility();
    updateTimelineVisibility();
    updateSymptomsVisibility();
    updateHSCTVisibility();
    updateHSCTLimitsVisibility();
    updateTherapyComparisonVisibility();
    updateVectorDeliveryVisibility();
    updateDeliveryMethodsVisibility();
    updateTherapyDataVisibility();
    
    // Setup the therapy data carousel
    setupTherapyDataCarousel();
    updateTherapyDataVisibility();
    
    // Initialize the delivery methods carousel
    setupDeliveryMethodsCarousel();
});

// Delivery Methods Carousel Functionality
function setupDeliveryMethodsCarousel() {
    const cardsContainer = document.querySelector('#delivery-methods .cards-container');
    const cards = document.querySelectorAll('.delivery-method-card');
    const prevArrow = document.querySelector('.prev-arrow');
    const nextArrow = document.querySelector('.next-arrow');
    
    if (!cardsContainer || cards.length === 0) return;
    
    // Initialize carousel
    let currentIndex = 0;
    
    // Function to update card positions
    function updateCarousel() {
        cards.forEach((card, index) => {
            // Remove all position classes
            card.classList.remove('active', 'prev', 'next');
            
            if (index === currentIndex) {
                // Current card
                card.classList.add('active');
            } else if (index === (currentIndex - 1 + cards.length) % cards.length) {
                // Previous card
                card.classList.add('prev');
            } else if (index === (currentIndex + 1) % cards.length) {
                // Next card
                card.classList.add('next');
            }
        });
    }
    
    // Initial setup
    updateCarousel();
    
    // Click event for previous arrow
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + cards.length) % cards.length;
            updateCarousel();
        });
    }
    
    // Click event for next arrow
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateCarousel();
        });
    }
}

// Function to update delivery methods section visibility
function updateDeliveryMethodsVisibility() {
    const deliverySection = document.getElementById('delivery-methods');
    if (!deliverySection) return;
    
    const deliveryTitle = deliverySection.querySelector('.delivery-title');
    const deliveryIntro = deliverySection.querySelector('.delivery-intro');
    const cardsCarousel = deliverySection.querySelector('.cards-carousel-container');
    
    const sectionTop = deliverySection.getBoundingClientRect().top;
    const isInView = sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5;
    
    if (isInView) {
        // Make elements visible with staggered animation
        if (deliveryTitle) {
            deliveryTitle.classList.add('visible');
        }
        
        setTimeout(() => {
            if (deliveryIntro) {
                deliveryIntro.classList.add('visible');
            }
        }, 400);
        
        setTimeout(() => {
            if (cardsCarousel) {
                cardsCarousel.classList.add('visible');
            }
        }, 800);
    } else {
        // Reset animations when scrolled away
        if (deliveryTitle) {
            deliveryTitle.classList.remove('visible');
        }
        if (deliveryIntro) {
            deliveryIntro.classList.remove('visible');
        }
        if (cardsCarousel) {
            cardsCarousel.classList.remove('visible');
        }
    }
}

// Add event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the delivery methods carousel
    setupDeliveryMethodsCarousel();
    
    // Initialize the therapy data carousel
    setupTherapyDataCarousel();
    
    // Add delivery methods and therapy data visibility check to scroll event
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', function() {
            updateDeliveryMethodsVisibility();
            updateTherapyDataVisibility();
        });
    }
    
    // Initial check for visibility
    updateDeliveryMethodsVisibility();
    updateTherapyDataVisibility();
});

// Recent Therapy Data Carousel Functionality
function setupTherapyDataCarousel() {
    console.log('Setting up therapy data carousel');
    const cardsContainer = document.querySelector('.therapy-cards');
    const cards = document.querySelectorAll('.therapy-card');
    const prevBtn = document.querySelector('.therapy-carousel-container .prev-btn');
    const nextBtn = document.querySelector('.therapy-carousel-container .next-btn');
    
    if (!cardsContainer || cards.length === 0) {
        console.log('Therapy carousel elements not found');
        return;
    }
    
    console.log(`Found ${cards.length} therapy cards`);
    
    // Set initial position and card states
    let currentIndex = 0;
    let previousIndex = null;
    
    // Update card positions and classes for sliding animation
    function updateActiveCards() {
        cards.forEach((card, index) => {
            // Remove all position classes first
            card.classList.remove('active', 'prev', 'next');
            
            // Add appropriate position class based on index
            if (index === currentIndex) {
                card.classList.add('active');
                
                // Check if this is the injection route card (now at index 0)
                if (index === 0) {
                    console.log('Injection route card is now active');
                    // Get the container element inside this card
                    const injectionChart = card.querySelector('#injection-route-chart');
                    if (injectionChart) {
                        console.log('Found injection chart in active card:', injectionChart);
                        // Force the chart to be visible
                        injectionChart.style.display = 'block';
                        injectionChart.style.visibility = 'visible';
                        injectionChart.style.height = '300px';
                        // Trigger chart initialization if not already initialized
                        setTimeout(() => {
                            if (!window.injectionRouteChartInitialized) {
                                createInjectionRouteChart();
                                window.injectionRouteChartInitialized = true;
                                console.log('Initialized injection route chart from updateActiveCards');
                            }
                        }, 100);
                    }
                }
                
                // Initialize charts when their cards become visible
                if (index === 2) { // Index 2 is now the BMT chart (was index 4 before removing cards)
                    setTimeout(() => {
                        if (!window.bmtChartInitialized) {
                            createBMTChart();
                            window.bmtChartInitialized = true;
                        }
                    }, 300); // Small delay to ensure the card is visible
                } else if (index === 0) { // Index 0 is now the Injection Route chart
                    setTimeout(() => {
                        if (!window.injectionRouteChartInitialized) {
                            createInjectionRouteChart();
                            window.injectionRouteChartInitialized = true;
                        }
                    }, 300); // Small delay to ensure the card is visible
                } else if (index === 1) { // Index 1 is now the Route Combination chart (was index 3 before removing cards)
                    setTimeout(() => {
                        // Always reinitialize when switching to this card
                        window.routeCombinationChartInitialized = false;
                        createRouteCombinationChart();
                        window.routeCombinationChartInitialized = true;
                        console.log('Initialized route combination chart from updateActiveCards');
                    }, 300); // Small delay to ensure the card is visible
                }
            } else if (previousIndex !== null) {
                // If we just changed cards, mark the previous card accordingly
                if (index === previousIndex) {
                    // If we went forward, mark as prev, otherwise as next
                    const direction = (previousIndex === (currentIndex + 1) % cards.length) ? 'next' : 'prev';
                    card.classList.add(direction);
                } else {
                    // Cards that are not active or previous should be positioned off-screen
                    if ((currentIndex + 1) % cards.length === index) {
                        card.classList.add('next');
                    } else if ((currentIndex - 1 + cards.length) % cards.length === index) {
                        card.classList.add('prev');
                    }
                }
            } else {
                // Initial setup - position cards appropriately
                if ((currentIndex + 1) % cards.length === index) {
                    card.classList.add('next');
                } else if ((currentIndex - 1 + cards.length) % cards.length === index) {
                    card.classList.add('prev');
                }
            }
        });
    }
    
    // Function to navigate to a specific card
    function navigateToCard(index) {
        // Store the current index as previous before changing
        previousIndex = currentIndex;
        
        // Handle wrapping at the beginning and end of the carousel
        if (index < 0) index = cards.length - 1;
        if (index >= cards.length) index = 0;
        
        // Update current index and update the UI
        currentIndex = index;
        updateActiveCards();
        
        // Reinitialize Route Combination chart if navigating to that specific card (now at index 1)
        if (currentIndex === 1) {
            console.log('Navigating to Route Combination chart card (index 1)');
            const container = document.getElementById('route-combination-chart');
            
            if (container) {
                // Force visibility before initialization
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.height = '300px'; // Explicit height
                container.style.width = '100%'; // Full width
                
                // Update parent container as well
                const chartContainer = container.closest('.chart-container');
                if (chartContainer) {
                    chartContainer.style.display = 'flex';
                }
                
                // Reinitialize chart with small delay
                setTimeout(() => {
                    // Always reinitialize the chart when navigating to it
                    console.log('Reinitializing Route Combination chart after navigation');
                    // Reset the initialization flag to ensure proper animation
                    window.routeCombinationChartInitialized = false;
                    createRouteCombinationChart();
                    window.routeCombinationChartInitialized = true;
                }, 200);
            }
        }
        
        // Reinitialize Injection Route chart if navigating to that specific card (now at index 0)
        if (currentIndex === 0) { 
            console.log('Navigating to Injection Route chart card (index 0)');
            const container = document.getElementById('injection-route-chart');
            
            if (container) {
                // Force visibility before initialization
                container.style.display = 'block';
                container.style.visibility = 'visible';
                container.style.height = '300px'; // Explicit height
                container.style.width = '100%'; // Full width
                
                // Update parent container as well
                const chartContainer = container.closest('.chart-container');
                if (chartContainer) {
                    chartContainer.style.display = 'flex';
                    chartContainer.style.visibility = 'visible';
                    chartContainer.style.height = '300px';
                }
                
                console.log('Set container styles to force visibility');
            }
            
            // Use longer timeout to ensure DOM is ready
            setTimeout(() => {
                console.log('Now initializing Injection Route chart after timeout');
                const container = document.getElementById('injection-route-chart');
                console.log('Injection Route container visibility:', container?.offsetParent !== null);
                
                // Force visibility again just before chart creation
                if (container) {
                    container.style.display = 'block';
                    container.style.visibility = 'visible';
                }
                
                // Create chart and mark as initialized
                createInjectionRouteChart();
                window.injectionRouteChartInitialized = true;
                console.log('Injection Route Chart initialized from navigation');
            }, 800); // Longer delay to ensure card is fully visible
        }
        
        // Reinitialize BMT chart if navigating to that specific card
        if (currentIndex === 2) { // BMT chart card index
            setTimeout(() => {
                createBMTChart();
                window.bmtChartInitialized = true;
            }, 300); // Small delay to ensure card is visible
        }
    }
    
    // Initialize with first card as active
    navigateToCard(0);
    previousIndex = null; // Reset after initial setup
    
    // Click event for previous button
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            navigateToCard(currentIndex - 1);
        });
    }
    
    // Click event for next button
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            navigateToCard(currentIndex + 1);
        });
    }
    
    // Touch support for mobile swipe
    let touchStartX = 0;
    let touchEndX = 0;
    
    cardsContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    cardsContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50; // Minimum distance for swipe gesture
        
        if (touchStartX - touchEndX > swipeThreshold) {
            // Swipe left, go to next card
            navigateToCard(currentIndex + 1);
        } else if (touchEndX - touchStartX > swipeThreshold) {
            // Swipe right, go to previous card
            navigateToCard(currentIndex - 1);
        }
    }
}

// Function to update the visibility of the Recent Therapy Data section
function updateTherapyDataVisibility() {
    const therapyDataSection = document.getElementById('recent-therapy-data');
    if (!therapyDataSection) return;
    
    const sectionTop = therapyDataSection.getBoundingClientRect().top;
    const isInView = sectionTop < window.innerHeight * 0.5 && sectionTop > -window.innerHeight * 0.5;
    
    if (isInView) {
        therapyDataSection.classList.add('active');
        
        // Initialize the charts when section becomes visible
        // Check if the injection route chart is in the active card
        const activeCard = therapyDataSection.querySelector('.therapy-card.active');
        if (activeCard && activeCard.querySelector('#injection-route-chart')) {
            if (!window.injectionRouteChartInitialized) {
                console.log('Initializing Injection Route Chart from visibility function');
                createInjectionRouteChart();
                window.injectionRouteChartInitialized = true;
            }
        }
        
        // Initialize the BMT chart when section becomes visible
        if (!window.bmtChartInitialized) {
            createBMTChart();
            window.bmtChartInitialized = true;
        }
    } else {
        therapyDataSection.classList.remove('active');
    }
}

// Route Combination Chart Function
function createRouteCombinationChart() {
    console.log('Creating Route Combination Chart');
    const chartContainer = document.getElementById('route-combination-chart');
    console.log('Route Combination chart container found:', chartContainer);
    if (!chartContainer) {
        console.error('Route Combination chart container not found!');
        return;
    }
    
    // Force chart container to be visible
    chartContainer.style.display = 'block';
    chartContainer.style.visibility = 'visible';
    chartContainer.style.height = '300px';
    
    // Clear any existing chart to prevent duplicates
    chartContainer.innerHTML = '';
    
    // Create loading animation - we'll use only this one and remove the SVG one
    const loadingContainer = document.createElement('div');
    loadingContainer.id = 'route-chart-loading';
    loadingContainer.style.position = 'absolute';
    loadingContainer.style.left = '50%';
    loadingContainer.style.top = '50%';
    loadingContainer.style.transform = 'translate(-50%, -50%)';
    loadingContainer.style.color = 'white';
    loadingContainer.style.fontSize = '18px';
    loadingContainer.textContent = 'Loading chart...';
    chartContainer.appendChild(loadingContainer);
    
    // Data for the route combination chart
    const routeCombinationData = [
        { group: 'Single', route: 'IC only', survival: 54.3, publications: 'Lin et al. (2005, 2007*, 2011)' },
        { group: 'Single', route: 'IV only', survival: 112.5, publications: 'Rafi et al. (2015); Pan et al. (2019)' },
        { group: 'Single', route: 'IT only', survival: 52.5, publications: 'Karumuthil‐Melethil et al. (2016)' },
        { group: 'Combo', route: 'ICV + IC', survival: 55, publications: 'Rafi et al. (2005)' },
        { group: 'Combo', route: 'IC + IT', survival: 160.5, publications: 'Reddy et al. (2011); Li et al. (2021)' },
        { group: 'Combo', route: 'IV + ICV', survival: 300, publications: 'Bradbury et al. (2018)' }
    ];
    
    // Sort data by group and then by survival days
    routeCombinationData.sort((a, b) => {
        if (a.group === b.group) {
            return a.survival - b.survival;
        }
        return a.group === 'Single' ? -1 : 1;
    });

    // Setup dimensions
    const containerWidth = chartContainer.clientWidth || 300;
    const containerHeight = chartContainer.clientHeight || 300;
    const margin = { top: 30, right: 60, bottom: 120, left: 70 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', containerWidth);
    svg.setAttribute('height', containerHeight);
    chartContainer.appendChild(svg);
    
    // Create group for chart elements with margins
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Create scales
    const barWidth = width / routeCombinationData.length * 0.8; // Allow some space between bars
    
    // Function to map x position based on index
    const xScale = (index) => {
        return (width / routeCombinationData.length) * index + (width / routeCombinationData.length - barWidth) / 2;
    };
    
    // Function to calculate y position
    const yScale = (value) => {
        const maxValue = Math.max(...routeCombinationData.map(d => d.survival));
        return height - (value / maxValue) * height;
    };
    
    // Calculate max value for y-axis scaling
    const maxYValue = Math.max(...routeCombinationData.map(d => d.survival));
    const yTickValues = [0, 100, 200, 300, 400];
    
    // Draw axes
    // Y-axis line
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', height);
    yAxis.setAttribute('stroke', '#777');
    yAxis.setAttribute('stroke-width', 1);
    g.appendChild(yAxis);
    
    // X-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', height);
    xAxis.setAttribute('x2', width);
    xAxis.setAttribute('y2', height);
    xAxis.setAttribute('stroke', '#777');
    xAxis.setAttribute('stroke-width', 1);
    g.appendChild(xAxis);
    
    // Add y-axis ticks and labels
    yTickValues.forEach(tickValue => {
        const y = yScale(tickValue);
        
        // Draw tick line
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', -5);
        tick.setAttribute('y1', y);
        tick.setAttribute('x2', 0);
        tick.setAttribute('y2', y);
        tick.setAttribute('stroke', '#777');
        tick.setAttribute('stroke-width', 1);
        g.appendChild(tick);
        
        // Add tick label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', -10);
        label.setAttribute('y', y);
        label.setAttribute('text-anchor', 'end');
        label.setAttribute('dominant-baseline', 'central');
        label.setAttribute('fill', '#fff');
        label.setAttribute('font-size', '10px');
        label.textContent = tickValue;
        g.appendChild(label);
        
        // Add grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('y1', y);
        gridLine.setAttribute('x2', width);
        gridLine.setAttribute('y2', y);
        gridLine.setAttribute('stroke', '#444');
        gridLine.setAttribute('stroke-width', 0.5);
        gridLine.setAttribute('stroke-dasharray', '4,4');
        g.appendChild(gridLine);
    });
    
    // Add y-axis label
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('transform', `rotate(-90)`);
    yLabel.setAttribute('x', -height/2);
    yLabel.setAttribute('y', -margin.left + 20);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', '#fff');
    yLabel.setAttribute('font-size', '14px');
    yLabel.setAttribute('font-weight', 'bold');
    yLabel.textContent = 'Survival (average days)';
    g.appendChild(yLabel);
    
    // Define color scale for groups
    const getColor = (group) => {
        return group === 'Single' ? '#3498db' : '#e74c3c';
    };
    
    // Remove loading container after delay, then start animating bars
    setTimeout(() => {
        // Remove the main loading container
        if (chartContainer.contains(loadingContainer)) {
            chartContainer.removeChild(loadingContainer);
        }
        
        // Now add and animate bars
        routeCombinationData.forEach((d, i) => {
            // Create bar with initial height of 0
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', xScale(i));
            bar.setAttribute('y', height); // Start from the bottom
            bar.setAttribute('width', barWidth);
            bar.setAttribute('height', 0); // Initial height is 0
            bar.setAttribute('fill', getColor(d.group));
            bar.setAttribute('stroke', 'none');
            bar.setAttribute('stroke-width', 0);
            bar.setAttribute('rx', 3);
            bar.setAttribute('ry', 3);
            
            // Add data attributes for tooltip
            bar.dataset.route = d.route;
            bar.dataset.survival = d.survival;
            bar.dataset.publications = d.publications;
            
            // Add hover effect
            bar.addEventListener('mouseover', function(e) {
                this.setAttribute('fill-opacity', 0.8);
                
                // Show tooltip with data
                const tooltip = document.getElementById('route-combination-tooltip');
                if (tooltip) {
                    tooltip.style.display = 'block';
                    tooltip.innerHTML = `
                        <div class="tooltip-content">
                            <strong>${d.route}</strong><br>
                            <span>Survival: ${d.survival} days</span><br>
                            <span>Publications: ${d.publications}</span>
                        </div>
                    `;
                    
                    // Position tooltip
                    const rect = this.getBoundingClientRect();
                    const chartRect = chartContainer.getBoundingClientRect();
                    tooltip.style.left = (rect.x - chartRect.x + rect.width/2) + 'px';
                    tooltip.style.top = (rect.y - chartRect.y - 5) + 'px';
                }
            });
            
            bar.addEventListener('mouseout', function() {
                this.setAttribute('fill-opacity', 1);
                // Hide tooltip
                const tooltip = document.getElementById('route-combination-tooltip');
                if (tooltip) tooltip.style.display = 'none';
            });
            
            g.appendChild(bar);
            
            // Add x-axis label
            const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            label.setAttribute('x', xScale(i) + barWidth / 2);
            label.setAttribute('y', height + 20);
            label.setAttribute('text-anchor', 'middle');
            label.setAttribute('fill', '#fff');
            label.setAttribute('font-size', '10px');
            label.setAttribute('transform', `rotate(45, ${xScale(i) + barWidth / 2}, ${height + 20})`);
            label.textContent = d.route;
            g.appendChild(label);
            
            // Create survival value text but keep it hidden initially
            const value = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            value.setAttribute('x', xScale(i) + barWidth / 2);
            value.setAttribute('y', yScale(d.survival) - 5);
            value.setAttribute('text-anchor', 'middle');
            value.setAttribute('fill', '#fff');
            value.setAttribute('font-size', '10px');
            value.setAttribute('font-weight', 'normal');
            value.setAttribute('opacity', '0'); // Start hidden
            value.textContent = d.survival;
            g.appendChild(value);
            
            // Animate the bar after a delay
            setTimeout(() => {
                bar.style.transition = 'y 0.8s ease-out, height 0.8s ease-out';
                bar.setAttribute('y', yScale(d.survival));
                bar.setAttribute('height', height - yScale(d.survival));
                
                // Show the label only after the bar finishes growing
                setTimeout(() => {
                    value.style.transition = 'opacity 0.5s ease';
                    value.setAttribute('opacity', '1');
                }, 800); // Add delay after the bar animation (which takes 0.8s)
                
            }, 100 + i * 100); // Staggered delay between bars
        });
    }, 1500); // 1.5s delay to show loading text
    
    // Add x-axis label
    const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xLabel.setAttribute('x', width / 2);
    xLabel.setAttribute('y', height + 60);
    xLabel.setAttribute('text-anchor', 'middle');
    xLabel.setAttribute('fill', '#fff');
    xLabel.setAttribute('font-size', '14px');
    xLabel.setAttribute('font-weight', 'bold');
    xLabel.textContent = 'Injection Route';
    g.appendChild(xLabel);

    // Add legend with dark grey background
    const legendItems = ['Single injections', 'Combination injections'];
    const legendColors = ['#3498db', '#e74c3c'];
    
    // Create background rectangle for legend
    const legendBg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    legendBg.setAttribute('x', width - 160);
    legendBg.setAttribute('y', height + 60);
    legendBg.setAttribute('width', 160);
    legendBg.setAttribute('height', 50);
    legendBg.setAttribute('fill', '#333');
    legendBg.setAttribute('rx', 5);
    legendBg.setAttribute('ry', 5);
    legendBg.setAttribute('opacity', '0.8');
    g.appendChild(legendBg);
    
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    legendGroup.setAttribute('transform', `translate(${width - 150}, ${height + 70})`);
    
    legendItems.forEach((item, i) => {
        // Add colored rectangle
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', 0);
        rect.setAttribute('y', i * 20);
        rect.setAttribute('width', 15);
        rect.setAttribute('height', 15);
        rect.setAttribute('fill', legendColors[i]);
        rect.setAttribute('rx', 2);
        rect.setAttribute('ry', 2);
        legendGroup.appendChild(rect);
        
        // Add label text with white color
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', 25);
        text.setAttribute('y', i * 20 + 12);
        text.setAttribute('fill', '#fff');
        text.setAttribute('font-size', '10px');
        text.textContent = item;
        legendGroup.appendChild(text);
    });
    
    g.appendChild(legendGroup);
    
    console.log('Route Combination Chart created successfully');
}

// Bone Marrow Transplant Chart Function
function createBMTChart() {
    const chartContainer = document.getElementById('bmt-chart');
    if (!chartContainer) return;
    
    console.log('Initializing BMT Chart');
    // Clear any existing chart to prevent duplicates
    chartContainer.innerHTML = '';
    
    // Extract the BMT comparison data from the provided dataset with detailed metadata
    const bmtData = [
        { 
            type: 'IV', 
            withoutBMT: 112.5, 
            withBMT: 350, 
            withoutBMTDetails: {
                publication: "Rafi et al., 2012",
                year: 2012,
                vector: "AAV9",
                promoter: "CMV",
                modifications: "Codon-optimized GALC",
                route: "Intravenous",
                study_size: "n=12"
            },
            withBMTDetails: {
                publication: "Hawkins-Salsbury et al., 2015",
                year: 2015,
                vector: "AAV9",
                promoter: "CMV",
                modifications: "Codon-optimized GALC",
                route: "Intravenous + BMT",
                range: "350 days",
                study_size: "n=15"
            }
        },
        { 
            type: 'IC', 
            withoutBMT: 54.3, 
            withBMT: 104,
            withoutBMTDetails: {
                publication: "Bradbury et al., 2018",
                year: 2018,
                vector: "AAVrh10",
                promoter: "CBA",
                modifications: "None",
                route: "Intracranial",
                study_size: "n=8"
            },
            withBMTDetails: {
                publication: "Bradbury et al., 2018",
                year: 2018,
                vector: "AAVrh10",
                promoter: "CBA",
                modifications: "None",
                route: "Intracranial + BMT",
                study_size: "n=8"
            }
        },
        { 
            type: 'IC+IT', 
            withoutBMT: 160.5, 
            withBMT: 211.5,
            withoutBMTDetails: {
                publication: "Karumuthil-Melethil et al., 2016",
                year: 2016,
                vector: "AAV2/9",
                promoter: "CB",
                modifications: "miRNA suppression",
                route: "Intracranial + Intrathecal",
                study_size: "n=10"
            },
            withBMTDetails: {
                publication: "Karumuthil-Melethil et al., 2016",
                year: 2016,
                vector: "AAV2/9",
                promoter: "CB",
                modifications: "miRNA suppression",
                route: "Intracranial + Intrathecal + BMT",
                study_size: "n=10"
            }
        }
    ];
    
    // Sort data by improvement percentage for better visualization
    bmtData.sort((a, b) => (b.withBMT/b.withoutBMT) - (a.withBMT/a.withoutBMT));
    
    // Setup dimensions
    const containerWidth = chartContainer.clientWidth;
    const containerHeight = chartContainer.clientHeight;
    const margin = { top: 30, right: 20, bottom: 50, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', containerWidth);
    svg.setAttribute('height', containerHeight);
    chartContainer.appendChild(svg);
    
    // Create group for chart elements with margins
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Tooltip functionality removed as requested
    
    // Create scales
    const xScale = (pos, i) => {
        const groupWidth = width / bmtData.length;
        const barWidth = groupWidth * 0.35; // Each bar takes up 35% of group width
        const groupPos = (i * groupWidth) + (groupWidth / 2) - barWidth;
        return groupPos + (pos === 'withBMT' ? barWidth : 0);
    };
    
    const yScale = (value) => {
        const maxValue = Math.max(...bmtData.map(d => Math.max(d.withoutBMT, d.withBMT)));
        return height - (value / maxValue) * height;
    };
    
    // Calculate max value for y-axis scaling and ticks
    const maxYValue = Math.max(...bmtData.map(d => Math.max(d.withoutBMT, d.withBMT)));
    const yTickValues = [0, Math.round(maxYValue/3), Math.round(2*maxYValue/3), maxYValue];
    
    // Draw axes
    // Y-axis line
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', height);
    yAxis.setAttribute('stroke', '#777');
    yAxis.setAttribute('stroke-width', 1);
    g.appendChild(yAxis);
    
    // X-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', height);
    xAxis.setAttribute('x2', width);
    xAxis.setAttribute('y2', height);
    xAxis.setAttribute('stroke', '#777');
    xAxis.setAttribute('stroke-width', 1);
    g.appendChild(xAxis);
    
    // Add y-axis ticks and grid lines
    yTickValues.forEach(tickValue => {
        const yPos = yScale(tickValue);
        
        // Tick mark
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', -5);
        tick.setAttribute('y1', yPos);
        tick.setAttribute('x2', 0);
        tick.setAttribute('y2', yPos);
        tick.setAttribute('stroke', '#777');
        tick.setAttribute('stroke-width', 1);
        g.appendChild(tick);
        
        // Grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('y1', yPos);
        gridLine.setAttribute('x2', width);
        gridLine.setAttribute('y2', yPos);
        gridLine.setAttribute('stroke', '#444');
        gridLine.setAttribute('stroke-width', 0.5);
        gridLine.setAttribute('stroke-dasharray', '4,4');
        g.appendChild(gridLine);
        
        // Tick label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', -10);
        label.setAttribute('y', yPos + 4);
        label.setAttribute('fill', 'white');
        label.setAttribute('font-size', '10px');
        label.setAttribute('text-anchor', 'end');
        label.textContent = tickValue;
        g.appendChild(label);
    });
    
    // Draw y-axis label
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('transform', 'rotate(-90)');
    yLabel.setAttribute('x', -height / 2);
    yLabel.setAttribute('y', -margin.left + 15);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', 'white');
    yLabel.setAttribute('font-size', '14px');
    yLabel.setAttribute('font-weight', 'bold');
    yLabel.textContent = 'Survival (average days)';
    g.appendChild(yLabel);
    
    // Add x-axis title
    const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xTitle.setAttribute('x', width / 2);
    xTitle.setAttribute('y', height + 40);
    xTitle.setAttribute('text-anchor', 'middle');
    xTitle.setAttribute('fill', 'white');
    xTitle.setAttribute('font-size', '14px');
    xTitle.setAttribute('font-weight', 'bold');
    xTitle.textContent = 'Treatment Route';
    g.appendChild(xTitle);
    
    // Add chart title
    const chartTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    chartTitle.setAttribute('x', width / 2);
    chartTitle.setAttribute('y', -10);
    chartTitle.setAttribute('text-anchor', 'middle');
    chartTitle.setAttribute('fill', 'white');
    chartTitle.setAttribute('font-size', '16px');
    chartTitle.setAttribute('font-weight', 'bold');
    chartTitle.textContent = 'Impact of BMT on Survival in Krabbe Disease Gene Therapy';
    g.appendChild(chartTitle);
    
    // Add loading animation first
    const loadingText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    loadingText.setAttribute('x', width / 2);
    loadingText.setAttribute('y', height / 2);
    loadingText.setAttribute('text-anchor', 'middle');
    loadingText.setAttribute('fill', 'white');
    loadingText.setAttribute('font-size', '18px');
    loadingText.textContent = 'Loading chart...';
    g.appendChild(loadingText);
    
    // Remove loading text after a delay and draw bars
    setTimeout(() => {
        g.removeChild(loadingText);
        
        // Function to create formatted tooltip content
        // Tooltip content creation functionality removed as requested
        
        // Draw bars with animation and improved tooltips
        bmtData.forEach((data, i) => {
            // Create group for each bar pair
            const barGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            barGroup.classList.add('bar-group');
            g.appendChild(barGroup);
            
            // Calculate bar dimensions
            const groupWidth = width / bmtData.length;
            const barWidth = groupWidth * 0.35; // Each bar takes 35% of group width
            
            // Calculate heights with animation (starting from 0)
            const withoutBMTHeight = height - yScale(data.withoutBMT);
            const withBMTHeight = height - yScale(data.withBMT);
            
            // Draw the first bar (without BMT) with animation
            const bar1 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar1.setAttribute('x', xScale('withoutBMT', i));
            bar1.setAttribute('y', height); // Start at bottom
            bar1.setAttribute('width', barWidth);
            bar1.setAttribute('height', 0); // Start with height 0
            bar1.setAttribute('fill', '#e74c3c'); // Red for without BMT
            bar1.setAttribute('rx', 3); // Rounded corners
            bar1.setAttribute('ry', 3);
            bar1.classList.add('bar');
            bar1.setAttribute('data-value', data.withoutBMT);
            barGroup.appendChild(bar1);
            
            // Animate height
            setTimeout(() => {
                bar1.style.transition = 'height 1s ease, y 1s ease';
                bar1.setAttribute('height', withoutBMTHeight);
                bar1.setAttribute('y', yScale(data.withoutBMT));
            }, i * 200); // Stagger animations
            
            // Tooltip hover functionality removed as requested
            
            // Draw value label on bar
            const valueLabel1 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueLabel1.setAttribute('x', xScale('withoutBMT', i) + barWidth/2);
            valueLabel1.setAttribute('y', yScale(data.withoutBMT) - 5);
            valueLabel1.setAttribute('text-anchor', 'middle');
            valueLabel1.setAttribute('fill', 'white');
            valueLabel1.setAttribute('font-size', '10px');
            valueLabel1.setAttribute('opacity', '0');
            valueLabel1.textContent = data.withoutBMT;
            barGroup.appendChild(valueLabel1);
            
            // Animate label
            setTimeout(() => {
                valueLabel1.style.transition = 'opacity 0.5s ease';
                valueLabel1.setAttribute('opacity', '1');
            }, i * 200 + 800);
            
            // Draw the second bar (with BMT) with animation
            const bar2 = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar2.setAttribute('x', xScale('withBMT', i));
            bar2.setAttribute('y', height); // Start at bottom
            bar2.setAttribute('width', barWidth);
            bar2.setAttribute('height', 0); // Start with height 0
            bar2.setAttribute('fill', '#2ecc71'); // Green for with BMT
            bar2.setAttribute('rx', 3); // Rounded corners
            bar2.setAttribute('ry', 3);
            bar2.classList.add('bar');
            bar2.setAttribute('data-value', data.withBMT);
            barGroup.appendChild(bar2);
            
            // Animate height with delay
            setTimeout(() => {
                bar2.style.transition = 'height 1s ease, y 1s ease';
                bar2.setAttribute('height', withBMTHeight);
                bar2.setAttribute('y', yScale(data.withBMT));
            }, i * 200 + 300); // Slightly delay second bar
            
            // Tooltip hover functionality removed as requested
            
            // Draw value label on bar
            const valueLabel2 = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueLabel2.setAttribute('x', xScale('withBMT', i) + barWidth/2);
            valueLabel2.setAttribute('y', yScale(data.withBMT) - 5);
            valueLabel2.setAttribute('text-anchor', 'middle');
            valueLabel2.setAttribute('fill', 'white');
            valueLabel2.setAttribute('font-size', '10px');
            valueLabel2.setAttribute('opacity', '0');
            if (data.type === 'IV') {
                valueLabel2.textContent = '350';
            } else {
                valueLabel2.textContent = data.withBMT;
            }
            barGroup.appendChild(valueLabel2);
            
            // Animate label
            setTimeout(() => {
                valueLabel2.style.transition = 'opacity 0.5s ease';
                valueLabel2.setAttribute('opacity', '1');
            }, i * 200 + 1000);
            
            // Add x-axis labels with improved styling
            const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            xLabel.setAttribute('x', xScale('withoutBMT', i) + barWidth);
            xLabel.setAttribute('y', height + 20);
            xLabel.setAttribute('text-anchor', 'middle');
            xLabel.setAttribute('fill', 'white');
            xLabel.setAttribute('font-size', '12px');
            xLabel.setAttribute('font-weight', 'bold');
            xLabel.textContent = data.type;
            g.appendChild(xLabel);
        });
    }, 500); // 500ms delay to show loading
    
    // Create improved legend with a background and better styling
    const legendGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const legendY = 10;
    const legendItemWidth = 100;
    const legendPadding = 10;
    const legendItemHeight = 20;
    const legendItemSpacing = 5;
    const legendWidth = legendItemWidth * 2 + legendPadding * 2;
    const legendHeight = legendItemHeight + legendPadding * 2;
    
    // Legend background
    const legendBackground = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    legendBackground.setAttribute('x', width - legendWidth);
    legendBackground.setAttribute('y', legendY - legendPadding);
    legendBackground.setAttribute('width', legendWidth);
    legendBackground.setAttribute('height', legendHeight);
    legendBackground.setAttribute('rx', 5);
    legendBackground.setAttribute('ry', 5);
    legendBackground.setAttribute('fill', 'rgba(0, 0, 0, 0.5)');
    legendBackground.setAttribute('stroke', 'rgba(255, 255, 255, 0.3)');
    legendBackground.setAttribute('stroke-width', 1);
    legendGroup.appendChild(legendBackground);
    
    // Without BMT
    const withoutBmtRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    withoutBmtRect.setAttribute('x', width - legendWidth + legendPadding);
    withoutBmtRect.setAttribute('y', legendY);
    withoutBmtRect.setAttribute('width', 12);
    withoutBmtRect.setAttribute('height', 12);
    withoutBmtRect.setAttribute('rx', 2);
    withoutBmtRect.setAttribute('ry', 2);
    withoutBmtRect.setAttribute('fill', '#e74c3c');
    legendGroup.appendChild(withoutBmtRect);
    
    const withoutBmtText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    withoutBmtText.setAttribute('x', width - legendWidth + legendPadding + 16);
    withoutBmtText.setAttribute('y', legendY + 10);
    withoutBmtText.setAttribute('fill', 'white');
    withoutBmtText.setAttribute('font-size', '11px');
    withoutBmtText.textContent = 'Without BMT';
    legendGroup.appendChild(withoutBmtText);
    
    // With BMT
    const withBmtRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    withBmtRect.setAttribute('x', width - legendItemWidth);
    withBmtRect.setAttribute('y', legendY);
    withBmtRect.setAttribute('width', 12);
    withBmtRect.setAttribute('height', 12);
    withBmtRect.setAttribute('rx', 2);
    withBmtRect.setAttribute('ry', 2);
    withBmtRect.setAttribute('fill', '#2ecc71');
    legendGroup.appendChild(withBmtRect);
    
    const withBmtText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    withBmtText.setAttribute('x', width - legendItemWidth + 16);
    withBmtText.setAttribute('y', legendY + 10);
    withBmtText.setAttribute('fill', 'white');
    withBmtText.setAttribute('font-size', '11px');
    withBmtText.textContent = 'With BMT';
    legendGroup.appendChild(withBmtText);
    
    // Add the legend group to the chart
    g.appendChild(legendGroup);
    
    // Source note removed as requested
}

// Injection Route Chart Function
function createInjectionRouteChart() {
    console.log('Creating Injection Route Chart');
    const chartContainer = document.getElementById('injection-route-chart');
    console.log('Chart container found:', chartContainer);
    console.log('Chart container dimensions:', chartContainer ? { width: chartContainer.clientWidth, height: chartContainer.clientHeight } : 'N/A');
    if (!chartContainer) {
        console.error('Injection Route chart container not found!');
        return;
    }
    
    console.log('Initializing Injection Route Chart');
    // Force chart container to be visible
    chartContainer.style.display = 'block';
    chartContainer.style.visibility = 'visible';
    chartContainer.style.height = '300px'; // Set a specific height
    
    // Clear any existing chart to prevent duplicates
    chartContainer.innerHTML = '';
    
    // Extract the Injection Route data from the provided dataset
    const routeData = [
        { route: 'IC', days: 49 },
        { route: 'IC', days: 52 },
        { route: 'IT', days: 53 }, // Average of 50-55 range
        { route: 'ICV + IC', days: 55 },
        { route: 'IC', days: 62 },
        { route: 'IC + IT', days: 71 },
        { route: 'IV', days: 75 },
        { route: 'IV + BMT', days: 350 }, // Updated to exact value
        { route: 'IC + BMT', days: 104 },
        { route: 'ICV + IC + IV', days: 104 },
        { route: 'IC + IT + BMT', days: 123 },
        { route: 'IV + ICV', days: 300 },
        { route: 'ICV + IT + IV', days: 263 },
        { route: 'IC + IT', days: 250 },
        { route: 'IC + IT + BMT', days: 300 },
        { route: 'IV + BMT', days: 475 }, // Average of 450-500 range
        { route: 'ICM', days: 900 }
    ];
    
    // Sort data by survival days for better visualization
    routeData.sort((a, b) => a.days - b.days);
    
    // Setup dimensions
    const containerWidth = chartContainer.clientWidth;
    const containerHeight = chartContainer.clientHeight;
    const margin = { top: 30, right: 20, bottom: 120, left: 60 };
    const width = containerWidth - margin.left - margin.right;
    const height = containerHeight - margin.top - margin.bottom;
    
    // Create SVG element
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', containerWidth);
    svg.setAttribute('height', containerHeight);
    chartContainer.appendChild(svg);
    
    // Create group for chart elements with margins
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('transform', `translate(${margin.left},${margin.top})`);
    svg.appendChild(g);
    
    // Create scales
    const barWidth = width / routeData.length * 0.8; // Allow some space between bars
    
    // Function to map x position based on index
    const xScale = (index) => {
        return (width / routeData.length) * index + (width / routeData.length - barWidth) / 2;
    };
    
    // Function to calculate y position
    const yScale = (value) => {
        const maxValue = Math.max(...routeData.map(d => d.days));
        return height - (value / maxValue) * height;
    };
    
    // Calculate max value for y-axis scaling and ticks
    const maxYValue = Math.max(...routeData.map(d => d.days));
    const yTickValues = [0, 200, 400, 600, 800, Math.ceil(maxYValue / 100) * 100];
    
    // Draw axes
    // Y-axis line
    const yAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    yAxis.setAttribute('x1', 0);
    yAxis.setAttribute('y1', 0);
    yAxis.setAttribute('x2', 0);
    yAxis.setAttribute('y2', height);
    yAxis.setAttribute('stroke', '#777');
    yAxis.setAttribute('stroke-width', 1);
    g.appendChild(yAxis);
    
    // X-axis line
    const xAxis = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    xAxis.setAttribute('x1', 0);
    xAxis.setAttribute('y1', height);
    xAxis.setAttribute('x2', width);
    xAxis.setAttribute('y2', height);
    xAxis.setAttribute('stroke', '#777');
    xAxis.setAttribute('stroke-width', 1);
    g.appendChild(xAxis);
    
    // Add y-axis ticks and grid lines
    yTickValues.forEach(tickValue => {
        // Skip values that exceed the maximum
        if (tickValue > maxYValue) return;
        
        const yPos = yScale(tickValue);
        
        // Tick mark
        const tick = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        tick.setAttribute('x1', -5);
        tick.setAttribute('y1', yPos);
        tick.setAttribute('x2', 0);
        tick.setAttribute('y2', yPos);
        tick.setAttribute('stroke', '#777');
        tick.setAttribute('stroke-width', 1);
        g.appendChild(tick);
        
        // Grid line
        const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        gridLine.setAttribute('x1', 0);
        gridLine.setAttribute('y1', yPos);
        gridLine.setAttribute('x2', width);
        gridLine.setAttribute('y2', yPos);
        gridLine.setAttribute('stroke', '#444');
        gridLine.setAttribute('stroke-width', 0.5);
        gridLine.setAttribute('stroke-dasharray', '4,4');
        g.appendChild(gridLine);
        
        // Tick label
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', -10);
        label.setAttribute('y', yPos + 4);
        label.setAttribute('fill', 'white');
        label.setAttribute('font-size', '10px');
        label.setAttribute('text-anchor', 'end');
        label.textContent = tickValue;
        g.appendChild(label);
    });
    
    // Draw y-axis label
    const yLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    yLabel.setAttribute('transform', 'rotate(-90)');
    yLabel.setAttribute('x', -height / 2);
    yLabel.setAttribute('y', -margin.left + 15);
    yLabel.setAttribute('text-anchor', 'middle');
    yLabel.setAttribute('fill', 'white');
    yLabel.setAttribute('font-size', '14px');
    yLabel.setAttribute('font-weight', 'bold');
    yLabel.textContent = 'Survival (average days)';
    g.appendChild(yLabel);
    
    // Add x-axis title
    const xTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    xTitle.setAttribute('x', width / 2);
    xTitle.setAttribute('y', height + 100); // Position it below the rotated labels
    xTitle.setAttribute('text-anchor', 'middle');
    xTitle.setAttribute('fill', 'white');
    xTitle.setAttribute('font-size', '14px');
    xTitle.setAttribute('font-weight', 'bold');
    xTitle.textContent = 'Injection Route';
    g.appendChild(xTitle);
    
    // Add chart title
    const chartTitle = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    chartTitle.setAttribute('x', width / 2);
    chartTitle.setAttribute('y', -10);
    chartTitle.setAttribute('text-anchor', 'middle');
    chartTitle.setAttribute('fill', 'white');
    chartTitle.setAttribute('font-size', '16px');
    chartTitle.setAttribute('font-weight', 'bold');
    chartTitle.textContent = 'Survival by Injection Route';
    g.appendChild(chartTitle);
    
    // Add loading animation first
    const loadingText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    loadingText.setAttribute('x', width / 2);
    loadingText.setAttribute('y', height / 2);
    loadingText.setAttribute('text-anchor', 'middle');
    loadingText.setAttribute('fill', 'white');
    loadingText.setAttribute('font-size', '18px');
    loadingText.textContent = 'Loading chart...';
    g.appendChild(loadingText);
    
    // Remove loading text after a delay and draw bars
    setTimeout(() => {
        g.removeChild(loadingText);
        
        // Generate a color scale based on days value
        const getBarColor = (days) => {
            if (days < 100) return '#e74c3c'; // Red for lowest values
            if (days < 200) return '#f39c12'; // Orange for mid-low values
            if (days < 300) return '#f1c40f'; // Yellow for mid values
            if (days < 500) return '#2ecc71'; // Green for mid-high values
            return '#3498db'; // Blue for highest values
        };
        
        // Draw bars with animation and labels
        routeData.forEach((data, i) => {
            // Draw bar with animation
            const bar = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bar.setAttribute('x', xScale(i));
            bar.setAttribute('y', height); // Start at bottom
            bar.setAttribute('width', barWidth);
            bar.setAttribute('height', 0); // Start with height 0
            bar.setAttribute('fill', getBarColor(data.days));
            bar.setAttribute('rx', 3); // Rounded corners
            bar.setAttribute('ry', 3);
            bar.classList.add('bar');
            g.appendChild(bar);
            
            // Calculate bar height
            const barHeight = height - yScale(data.days);
            
            // Animate height with delay
            setTimeout(() => {
                bar.style.transition = 'height 1s ease, y 1s ease';
                bar.setAttribute('height', barHeight);
                bar.setAttribute('y', yScale(data.days));
            }, i * 40); // Stagger animations
            
            // Add value label on bar
            const valueLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            valueLabel.setAttribute('x', xScale(i) + barWidth/2);
            valueLabel.setAttribute('y', yScale(data.days) - 5);
            valueLabel.setAttribute('text-anchor', 'middle');
            valueLabel.setAttribute('fill', 'white');
            valueLabel.setAttribute('font-size', '10px');
            valueLabel.setAttribute('opacity', '0');
            valueLabel.textContent = data.days;
            g.appendChild(valueLabel);
            
            // Animate label
            setTimeout(() => {
                valueLabel.style.transition = 'opacity 0.5s ease';
                valueLabel.setAttribute('opacity', '1');
            }, i * 40 + 800);
            
            // Add x-axis labels (route names) with rotation
            const xLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            xLabel.setAttribute('x', xScale(i) + barWidth/2);
            xLabel.setAttribute('y', height + 10);
            xLabel.setAttribute('text-anchor', 'end');
            xLabel.setAttribute('fill', 'white');
            xLabel.setAttribute('font-size', '10px');
            xLabel.setAttribute('transform', `rotate(-65, ${xScale(i) + barWidth/2}, ${height + 10})`);
            xLabel.textContent = data.route;
            g.appendChild(xLabel);
        });
        
        // Source note removed as requested
    }, 500);
}

// Add event listeners after DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Document ready - initializing therapy carousel');
    // Initialize the therapy data carousel
    setupTherapyDataCarousel();
    
    // Special handling for injection route chart
    const injectionChartContainer = document.getElementById('injection-route-chart');
    console.log('Injection chart container found:', injectionChartContainer ? true : false);
    
    if (injectionChartContainer) {
        console.log('Initializing injection route chart at document load');
        // Force the container to be visible
        injectionChartContainer.style.display = 'block';
        injectionChartContainer.style.visibility = 'visible';
        injectionChartContainer.style.height = '300px';
        
        // Initialize chart with a delay to ensure container is ready
        setTimeout(() => {
            createInjectionRouteChart();
            window.injectionRouteChartInitialized = true;
            console.log('Initialized injection route chart from document load');
        }, 500);
    }
    
    // Add therapy data visibility check to scroll event
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', function() {
            updateTherapyDataVisibility();
        });
    }
    
    // Initial check for visibility
    updateTherapyDataVisibility();
});

// Initialize Tableau visualization for newborn screenings section
function initializeTableauViz() {
    // Check if the viz element exists
    const vizElement = document.getElementById('viz1748903170085');
    if (!vizElement) {
        console.log('Tableau viz element not found');
        showFallbackImage();
        return;
    }

    console.log('Initializing Tableau visualization');
    
    try {
        // Show the tableau container explicitly and ensure proper dimensions
        const tableauContainer = document.querySelector('.tableau-container');
        if (tableauContainer) {
            tableauContainer.style.display = 'block';
            tableauContainer.style.height = 'auto';
            tableauContainer.style.minHeight = '600px';
            tableauContainer.style.visibility = 'visible';
        }
        
        // Ensure viz element is displayed properly
        vizElement.style.position = 'relative';
        vizElement.style.display = 'block';
        vizElement.style.height = '991px';
        vizElement.style.width = '100%';
        vizElement.style.maxWidth = '1016px';
        vizElement.style.margin = '0 auto';
        
        // Set up the tableau object
        const vizObj = vizElement.querySelector('object.tableauViz');
        if (vizObj) {
            vizObj.style.display = 'block';
            vizObj.style.width = '100%';
            vizObj.style.height = '600px';
            vizObj.style.visibility = 'visible';
            vizObj.style.maxWidth = '1016px';
            vizObj.style.margin = '0 auto';
        } else {
            console.log('Tableau object not found inside viz element');
            showFallbackImage();
            return;
        }
        
        // Create and insert the API script
        if (!document.querySelector('script[src="https://public.tableau.com/javascripts/api/viz_v1.js"]')) {
            const scriptElement = document.createElement('script');
            scriptElement.src = 'https://public.tableau.com/javascripts/api/viz_v1.js';
            document.head.appendChild(scriptElement);
        }
        
        console.log('Tableau initialization complete');
        
        // Set a timeout to check if Tableau loaded properly
        setTimeout(function() {
            // If we can't find the vizCanvas, show fallback image
            if (!document.querySelector('#viz1748903170085 canvas')) {
                console.log('Tableau canvas not found after loading, showing fallback');
                showFallbackImage();
            }
        }, 5000);
    } catch (e) {
        console.error('Error initializing Tableau:', e);
        showFallbackImage();
    }
}

// Show fallback static image if Tableau visualization fails to load
function showFallbackImage() {
    console.log('Showing fallback map image');
    const fallbackContainer = document.querySelector('.static-map-fallback');
    if (fallbackContainer) {
        fallbackContainer.style.display = 'block';
    }
}

// Ensure the newborn screenings section is fully visible
function fixNewbornScreeningsSection() {
    const section = document.getElementById('newborn-screenings');
    if (!section) return;
    
    // Force proper display
    section.style.display = 'flex';
    section.style.visibility = 'visible';
    section.style.height = '100vh';
    section.style.minHeight = '100vh';
    
    // Make sure the section container is properly displayed
    const container = section.querySelector('.newborn-screenings-container');
    if (container) {
        container.style.display = 'flex';
        container.style.visibility = 'visible';
    }
    
    // Ensure the content is visible
    const content = section.querySelector('.newborn-screenings-content');
    if (content) {
        content.style.display = 'flex';
        content.style.visibility = 'visible';
    }
    
    // Adjust the map container to ensure it's sized correctly
    const mapContainer = section.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.style.height = '600px';
    }
    
    console.log('Fixed newborn screenings section display');
}

// Initialize Tableau on page load and set up event listeners for scroll navigation
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing Tableau and fixing section');
    
    // Fix section display
    fixNewbornScreeningsSection();
    
    // Add enhanced fade-in animation for the last section
    const newbornSection = document.getElementById('newborn-screenings');
    if (newbornSection) {
        const content = newbornSection.querySelector('.newborn-screenings-content');
        if (content) {
            // Reset animation for better control
            content.style.opacity = '0';
            content.style.transform = 'translateY(40px)';
            content.style.transition = 'opacity 1.5s ease-out, transform 1.5s ease-out';
        }
    }
    
    // Initialize immediately and also after a delay to ensure it catches
    initializeTableauViz();
    setTimeout(initializeTableauViz, 1000);
    setTimeout(initializeTableauViz, 3000);
    
    // Handle navigation click events
    document.querySelectorAll('.section-nav a').forEach(function(navLink) {
        navLink.addEventListener('click', function(e) {
            const sectionId = this.getAttribute('href');
            if (sectionId === '#newborn-screenings') {
                setTimeout(function() {
                    initializeTableauViz();
                    fixNewbornScreeningsSection();
                }, 500);
            }
        });
    });
    
    // Also initialize when scrolled to the section
    const scrollContainer = document.querySelector('.scroll-container');
    if (scrollContainer) {
        scrollContainer.addEventListener('scroll', function() {
            const newbornSection = document.getElementById('newborn-screenings');
            if (newbornSection && isElementInViewport(newbornSection)) {
                initializeTableauViz();
                fixNewbornScreeningsSection();
                
                // Trigger fade-in animation when section is scrolled into view
                const content = newbornSection.querySelector('.newborn-screenings-content');
                if (content) {
                    content.style.opacity = '1';
                    content.style.transform = 'translateY(0)';
                }
            }
        });
    }
});

// Helper function to check if an element is in the viewport
function isElementInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Debounce function to limit scroll event firing
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function() {
            func.apply(context, args);
        }, wait);
    };
}

// Add animation functionality for How You Can Help section
document.addEventListener('DOMContentLoaded', function() {
    // Check if elements are in viewport and add visible class
    function checkVisibility() {
        // Handle regular fade-in animations
        const fadeElements = document.querySelectorAll('.fade-in');
        
        fadeElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            // Check if element is in viewport
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
        
        // Handle top-to-bottom fade animations
        const topToBottomElements = document.querySelectorAll('.fade-top-to-bottom');
        
        topToBottomElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementBottom = element.getBoundingClientRect().bottom;
            
            // Check if element is in viewport
            if (elementTop < window.innerHeight - 100 && elementBottom > 0) {
                element.classList.add('visible');
            }
        });
        
        // Setup intersection observer for animation sections to handle animations and resets
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                const section = entry.target;
                
                // If section is in view
                if (entry.isIntersecting) {
                    handleSpecialSectionAnimations(section, true); // Apply animations
                } else {
                    // When section is out of view, reset animations
                    handleSpecialSectionAnimations(section, false);
                }
            });
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.15 // Trigger when 15% of the section is visible
        });
        
        // Observe all animation sections
        const animationSections = document.querySelectorAll('.animation-section');
        animationSections.forEach(section => {
            animationObserver.observe(section);
        });
    }
    
    // Initial check for elements
    checkVisibility();
    
    // Check on scroll
    document.querySelector('.scroll-container').addEventListener('scroll', function() {
        checkVisibility();
    });
});

// Function to handle animations for special sections
function handleSpecialSectionAnimations(section, isInView) {
    if (!section) return;
    
    // For the newborn-screenings section - fade in and expand
    if (section.id === 'newborn-screenings') {
        const elements = section.querySelectorAll('.newborn-screenings-content, .map-container, .screening-info, .screening-states h3, .screening-states p, .explore-button-container');
        
        if (isInView) {
            // Apply animations with staggered delay
            elements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 300); // 300ms delay between each element
            });
        } else {
            // Reset animations when scrolling away
            elements.forEach(element => {
                element.classList.remove('visible');
            });
        }
    }
    
    // For the how-you-can-help section - top to bottom fade
    if (section.id === 'how-you-can-help') {
        // First ensure we select ALL animated elements, especially the help-bullets which contain advocate/donate/educate text
        const titleElements = section.querySelectorAll('.help-title, .help-header');
        const helpBullets = section.querySelector('.help-bullets'); // Direct reference to bullets list
        const actionButtonsContainer = section.querySelector('.action-buttons'); // Direct reference to action buttons container
        
        // Double check for action buttons specifically
        const actionButtons = section.querySelectorAll('.action-buttons, .action-buttons .action-button');
        
        if (isInView) {
            // Apply animations with staggered delay for top elements
            titleElements.forEach((element, index) => {
                setTimeout(() => {
                    element.classList.add('visible');
                }, index * 300); // 300ms delay between each element
            });
            
            // Animate help bullets with a slight delay after the headers
            if (helpBullets) {
                setTimeout(() => {
                    helpBullets.classList.add('visible');
                }, titleElements.length * 300 + 100);
            }
            
            // Ensure action buttons container animates with a slight delay after bullets
            if (actionButtonsContainer) {
                setTimeout(() => {
                    actionButtonsContainer.classList.add('visible');
                    
                    // Make sure each button inside also gets animated
                    const buttons = actionButtonsContainer.querySelectorAll('.action-button');
                    buttons.forEach((button, buttonIndex) => {
                        setTimeout(() => {
                            button.classList.add('visible');
                        }, buttonIndex * 150); // Shorter delay between buttons
                    });
                }, titleElements.length * 300 + 100); // Additional delay after top elements
            }
        } else {
            // Reset animations when scrolling away - separately handle top and bottom elements
            titleElements.forEach(element => {
                element.classList.remove('visible');
            });
            
            // Reset help bullets
            if (helpBullets) {
                helpBullets.classList.remove('visible');
            }
            
            // Explicitly reset action buttons container
            if (actionButtonsContainer) {
                actionButtonsContainer.classList.remove('visible');
                
                // Also reset each individual button
                const buttons = actionButtonsContainer.querySelectorAll('.action-button');
                buttons.forEach(button => {
                    button.classList.remove('visible');
                });
            }
            
            // Extra check to reset all action buttons found
            actionButtons.forEach(button => {
                button.classList.remove('visible');
            });
        }
    }
}

// Race Against Time section animations
document.addEventListener('DOMContentLoaded', function() {
    // Observer for the Race Against Time section
    const raceObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startRaceAnimations();
            } else {
                resetRaceAnimations();
            }
        });
    }, {
        threshold: 0.3 // Start animation when 30% of the section is visible
    });
    
    // Observe the Race Against Time section
    const raceSection = document.getElementById('race-against-time');
    if (raceSection) {
        raceObserver.observe(raceSection);
        raceSection.classList.add('animation-observed');
    }
    
    // Update section navigation to include the new section
    const sectionNav = document.querySelector('.section-nav ul');
    if (sectionNav) {
        // Find the first li element
        const firstLi = sectionNav.querySelector('li');
        if (firstLi) {
            // Create new li for Race Against Time section
            const newLi = document.createElement('li');
            const newLink = document.createElement('a');
            newLink.href = '#race-against-time';
            newLink.setAttribute('data-section', 'race-against-time');
            newLi.appendChild(newLink);
            
            // Insert after the first li
            if (firstLi.nextSibling) {
                sectionNav.insertBefore(newLi, firstLi.nextSibling);
            } else {
                sectionNav.appendChild(newLi);
            }
        }
    }
});

// Function to start the Race Against Time animations
function startRaceAnimations() {
    const section = document.getElementById('race-against-time');
    if (!section) return;
    
    // Add active class to the section
    section.classList.add('active');
    
    // Animate the title
    const title = section.querySelector('.race-title');
    if (title) {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }
    
    // Animate each statistic item with delay
    const stats = section.querySelectorAll('.statistic-item');
    stats.forEach((stat, index) => {
        setTimeout(() => {
            // Make the statistic visible
            stat.classList.add('visible');
            
            // Animate the digits with scrolling effect
            const digitContainers = stat.querySelectorAll('.digit-container');
            digitContainers.forEach((container) => {
                const digit = container.querySelector('.digit');
                if (digit) {
                    // Get the final digit value that should be displayed
                    const finalDigit = digit.textContent;
                    
                    // Create the scrolling animation effect
                    animateDigit(digit, finalDigit);
                }
            });
        }, 2000 * index); // 2 seconds delay between each stat
    });
}

// Function to animate a digit through random values before settling
function animateDigit(digitElement, finalValue) {
    // Duration of the animation in milliseconds (2 seconds)
    const duration = 2000;
    // How many times per second to change the number (higher = smoother, but more resource intensive)
    const updatesPerSecond = 25; // Increased for smoother animation
    // Total number of updates during the animation
    const totalUpdates = (duration / 1000) * updatesPerSecond;
    // Current update count
    let updateCount = 0;
    
    // Store the final value that should be displayed at the end of animation
    // This ensures we're restoring to the intended final value (100000 not 111111)
    const originalContent = finalValue;
    
    // For percentage value like '90%', we only animate the number part
    const isPercentage = finalValue.includes('%');
    const finalValueNumeric = isPercentage ? finalValue.replace('%', '') : finalValue;
    
    // Apply flickering animation for visual effect
    digitElement.style.animation = 'digitFlicker 0.1s infinite alternate';
    
    // Set up the interval for the animation
    const interval = setInterval(() => {
        // Calculate animation progress (0 to 1)
        const progress = updateCount / totalUpdates;
        
        // Only show the final value when the animation is completely done
        if (progress >= 1.0) {
            digitElement.textContent = originalContent;
            clearInterval(interval);
            // Remove flickering and apply the countUp animation
            digitElement.style.animation = 'countUp 0.5s ease-out forwards';
            return;
        }
        
        // Otherwise, show a random digit based on the type of the final value
        if (!isNaN(finalValueNumeric)) {
            // It's a number, show random digits
            digitElement.textContent = Math.floor(Math.random() * 10).toString();
        } else {
            // For non-numeric content, flicker between random characters
            const randomChars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
            digitElement.textContent = randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        
        updateCount++;
    }, 1000 / updatesPerSecond);
}

// Function to reset the Race Against Time animations
function resetRaceAnimations() {
    const section = document.getElementById('race-against-time');
    if (!section) return;
    
    // Remove active class from the section
    section.classList.remove('active');
    
    // Reset the title
    const title = section.querySelector('.race-title');
    if (title) {
        title.style.opacity = '0';
        title.style.transform = 'translateY(-20px)';
    }
    
    // Reset each statistic item
    const stats = section.querySelectorAll('.statistic-item');
    stats.forEach((stat) => {
        stat.classList.remove('visible');
        
        // Reset the digits
        const digitContainers = stat.querySelectorAll('.digit-container');
        digitContainers.forEach((container) => {
            const digit = container.querySelector('.digit');
            if (digit) {
                // Reset animation and ensure the original content is preserved
                digit.style.animation = 'none';
                
                // Check if the digit is in stat-1 (1 in 100000) and reset to original value
                const stat1 = container.closest('#stat-1');
                const stat2 = container.closest('#stat-2');
                const stat3 = container.closest('#stat-3');
                
                // Reset specific digits based on their statistics
                if (stat1) {
                    // For "1 in 100000" stat
                    // If the container is before the separator (the "1" in "1 in 100000")
                    if (container.parentNode.querySelector('.stat-separator')?.textContent === 'in') {
                        const allContainers = Array.from(container.parentNode.querySelectorAll('.digit-container'));
                        const containerIndex = allContainers.indexOf(container);
                        // If it's the first digit container (before the 'in' separator)
                        if (containerIndex === 0) {
                            digit.textContent = '1';
                        }
                    } else {
                        // This is for the "100000" part after the "in" separator
                        // Get all digit containers after the separator
                        const afterInSeparator = Array.from(container.parentNode.querySelectorAll('.digit-container')).filter(c => {
                            // Find the separator index
                            const separator = container.parentNode.querySelector('.stat-separator');
                            if (!separator) return true;
                            // Get index of separator and current container
                            const containers = Array.from(container.parentNode.children);
                            const separatorIndex = containers.indexOf(separator);
                            const containerIndex = containers.indexOf(c);
                            // Return true if container comes after separator
                            return containerIndex > separatorIndex;
                        });
                        
                        // Now get the index of this specific container among those after the separator
                        const indexAfterSeparator = afterInSeparator.indexOf(container);
                        
                        // First digit is 1, all others are 0 for "100000"
                        if (indexAfterSeparator === 0) digit.textContent = '1';
                        else digit.textContent = '0';
                    }
                } else if (stat2) {
                    // For "90%" stat
                    const index = Array.from(container.parentNode.querySelectorAll('.digit-container')).indexOf(container);
                    if (index === 0) digit.textContent = '9';
                    else if (index === 1) digit.textContent = '0';
                } else if (stat3) {
                    // For "0 cures" stat
                    digit.textContent = '0';
                }
            }
        });
    });
}

// Krabbe Therapy Lab functionality
const therapyLabData = {
  AAV1: {
    "ICV+IC": { no: 55 }
  },
  AAV5: {
    IC: { no: [52, 62], yes: 104 },
    "IC+IT": { no: 71, yes: 123 }
  },
  AAV9: {
    "IC+IT": { yes: 275 },
    "ICV+IT+IV": { no: 263 },
    ICM: { no: 900 },
    IV: { no: 150 }
  },
  AAVrh10: {
    "ICV+IC+IV": { no: 104 },
    IV: { no: 75, yes: [100, 350, 450, 500] },
    "IV+ICV": { no: 300 },
    IT: { no: 52.5 }
  }
};

// Vector descriptions for UI display
const vectorDescriptions = {
  AAV1: "Adeno-associated virus serotype 1",
  AAV5: "Adeno-associated virus serotype 5",
  AAV9: "Adeno-associated virus serotype 9",
  AAVrh10: "Adeno-associated virus serotype rh10"
};

// Route descriptions
const routeDescriptions = {
  "IC": "Intracerebral injection",
  "ICV": "Intracerebroventricular",
  "IV": "Intravenous",
  "IT": "Intrathecal",
  "ICM": "Intracisterna magna",
  "ICV+IC": "Combined ICV and IC approach",
  "IC+IT": "Combined IC and IT approach",
  "ICV+IT+IV": "Triple injection approach",
  "IV+ICV": "Combined IV and ICV approach",
  "ICV+IC+IV": "Triple injection approach"
};

// Store selected options
let selectedVector = '';
let selectedRoute = '';
let selectedBMT = '';

// Initialize the lab
document.addEventListener('DOMContentLoaded', function() {
  // Set up vector buttons
  setupVectorButtons();
  
  // Add Krabbe Therapy Lab to the navigation if needed
  const sectionNav = document.querySelector('.section-nav ul');
  if (sectionNav) {
    const navItem = document.createElement('li');
    const navLink = document.createElement('a');
    navLink.setAttribute('href', '#krabbe-therapy-lab');
    navLink.setAttribute('data-section', 'krabbe-therapy-lab');
    navItem.appendChild(navLink);
    sectionNav.appendChild(navItem);
  }
  
  // Set up next buttons
  document.getElementById('step1-next').addEventListener('click', function() {
    nextStep('step1', 'step2');
  });
  
  document.getElementById('step2-next').addEventListener('click', function() {
    nextStep('step2', 'step3');
  });
  
  document.getElementById('submit-btn').addEventListener('click', function() {
    showResult();
  });
});

function setupVectorButtons() {
  const vectorButtons = document.querySelectorAll('.vector-btn');
  vectorButtons.forEach(btn => {
    // Add click event listener
    btn.addEventListener('click', function() {
      // Remove active class from all buttons
      vectorButtons.forEach(b => b.classList.remove('active'));
      // Add active class to clicked button
      this.classList.add('active');
      // Enable next button
      document.getElementById('step1-next').disabled = false;
      // Store selected vector
      selectedVector = this.getAttribute('data-value');
      
      // Show image for the selected vector
      const vectorDisplay = document.getElementById('vector-display');
      vectorDisplay.innerHTML = `<img src="assets/images/${selectedVector}.jpg" alt="${selectedVector} vector image">`;
      vectorDisplay.classList.add('visible');
    });
    
    // Add tooltip with description
    const vector = btn.getAttribute('data-value');
    btn.setAttribute('title', vectorDescriptions[vector] || vector);
  });
}

function nextStep(current, next) {
  // Hide current step with fade out
  document.getElementById(current).classList.remove('active');
  
  // Show next step with fade in
  setTimeout(() => {
    document.getElementById(next).classList.add('active');
  }, 300);

  if (current === 'step1') {
    // Generate route buttons based on selected vector
    const routeButtonsContainer = document.getElementById('route-buttons');
    routeButtonsContainer.innerHTML = ''; // Clear previous buttons
    
    const routes = Object.keys(therapyLabData[selectedVector]);
    routes.forEach(route => {
      const btn = document.createElement('button');
      btn.className = 'route-btn';
      btn.setAttribute('data-value', route);
      btn.textContent = route;
      btn.setAttribute('title', routeDescriptions[route] || route);
      
      // Add click event listener to route buttons
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.route-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Enable next button
        document.getElementById('step2-next').disabled = false;
        // Store selected route
        selectedRoute = this.getAttribute('data-value');

        // Show iframe(s) for the selected injection route
        const injectionDisplay = document.getElementById('injection-display');
        
        // Check if the route has multiple parts (separated by '+')
        if (selectedRoute.includes('+')) {
          // Clear previous content
          injectionDisplay.innerHTML = '';
          
          // Split the route into individual parts
          const routeParts = selectedRoute.split('+');
          
          // Create a container for the iframe and navigation
          const frameContainer = document.createElement('div');
          frameContainer.className = 'multi-frame-container';
          
          // Create iframe container
          const iframeContainer = document.createElement('div');
          iframeContainer.className = 'iframe-container';
          
          // Add images or iframes for each route part (initially hidden)
          routeParts.forEach((route, index) => {
            if(route === 'IV') {
              const iframe = document.createElement('div');
              iframe.innerHTML = `<iframe id="embedded-human" frameBorder="0" style="aspect-ratio: 4 / 3; width: 100%" allowFullScreen="true" loading="lazy" src="https://human.biodigital.com/viewer/?id=6BJt&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M4QFb&paid=o_1846bd5e"></iframe>`;
              const embedElement = iframe.firstChild;
              embedElement.style.display = index === 0 ? 'block' : 'none';
              embedElement.setAttribute('data-route-index', index);
              iframeContainer.appendChild(embedElement);
            } else if(route === 'IT') {
              const iframe = document.createElement('div');
              iframe.innerHTML = `<iframe id="embedded-human" frameBorder="0" style="aspect-ratio: 4 / 3; width: 100%" allowFullScreen="true" loading="lazy" src="https://human.biodigital.com/viewer/?id=6BJx&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M4QFl&paid=o_1846bd5e"></iframe>`;
              const embedElement = iframe.firstChild;
              embedElement.style.display = index === 0 ? 'block' : 'none';
              embedElement.setAttribute('data-route-index', index);
              iframeContainer.appendChild(embedElement);
            } else {
              const img = document.createElement('img');
              if(route === 'IC') {
                img.src = 'IC.jpg';
              } else if(route === 'ICV') {
                img.src = 'ICV.jpg';
              } else if(route === 'ICM') {
                img.src = 'ICM.jpg';
              } else {
                img.src = `placeholder_${route}.jpg`;
              }
              img.alt = `${route} injection route information`;
              img.style.width = '100%';
              img.style.height = 'auto';
              img.className = 'route-image';
              img.style.display = index === 0 ? 'block' : 'none';
              img.setAttribute('data-route-index', index);
              iframeContainer.appendChild(img);
            }
          });
          
          frameContainer.appendChild(iframeContainer);
          
          // Create navigation controls if there are multiple routes
          if (routeParts.length > 1) {
            const navControls = document.createElement('div');
            navControls.className = 'frame-nav-controls';
            
            // Add previous button
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '&larr; Previous';
            prevBtn.className = 'frame-nav-btn prev-frame';
            prevBtn.disabled = true;
            
            // Add next button
            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = 'Next &rarr;';
            nextBtn.className = 'frame-nav-btn next-frame';
            
            // Add route indicator
            const routeIndicator = document.createElement('div');
            routeIndicator.className = 'route-indicator';
            routeIndicator.innerHTML = `<span class="current-index">1</span>/${routeParts.length} - <span class="current-route">${routeParts[0]}</span>`;
            
            navControls.appendChild(prevBtn);
            navControls.appendChild(routeIndicator);
            navControls.appendChild(nextBtn);
            
            // Set up navigation functionality
            let currentFrameIndex = 0;
            
            prevBtn.addEventListener('click', () => {
              if (currentFrameIndex > 0) {
                // Hide current frame
                iframeContainer.querySelector(`[data-route-index="${currentFrameIndex}"]`).style.display = 'none';
                // Update index
                currentFrameIndex--;
                // Show new frame
                iframeContainer.querySelector(`[data-route-index="${currentFrameIndex}"]`).style.display = 'block';
                // Update navigation buttons
                nextBtn.disabled = false;
                prevBtn.disabled = currentFrameIndex === 0;
                // Update indicator
                routeIndicator.querySelector('.current-index').textContent = currentFrameIndex + 1;
                routeIndicator.querySelector('.current-route').textContent = routeParts[currentFrameIndex];
              }
            });
            
            nextBtn.addEventListener('click', () => {
              if (currentFrameIndex < routeParts.length - 1) {
                // Hide current frame
                iframeContainer.querySelector(`[data-route-index="${currentFrameIndex}"]`).style.display = 'none';
                // Update index
                currentFrameIndex++;
                // Show new frame
                iframeContainer.querySelector(`[data-route-index="${currentFrameIndex}"]`).style.display = 'block';
                // Update navigation buttons
                prevBtn.disabled = false;
                nextBtn.disabled = currentFrameIndex === routeParts.length - 1;
                // Update indicator
                routeIndicator.querySelector('.current-index').textContent = currentFrameIndex + 1;
                routeIndicator.querySelector('.current-route').textContent = routeParts[currentFrameIndex];
              }
            });
            
            frameContainer.appendChild(navControls);
          }
          
          injectionDisplay.appendChild(frameContainer);
        } else {
          // For single routes, use images for IC, ICV, ICM and iframes for IV and IT
          if(selectedRoute === 'IV') {
            injectionDisplay.innerHTML = `<iframe id="embedded-human" frameBorder="0" style="aspect-ratio: 4 / 3; width: 100%" allowFullScreen="true" loading="lazy" src="https://human.biodigital.com/viewer/?id=6BJt&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M4QFb&paid=o_1846bd5e"></iframe>`;
          } else if(selectedRoute === 'IT') {
            injectionDisplay.innerHTML = `<iframe id="embedded-human" frameBorder="0" style="aspect-ratio: 4 / 3; width: 100%" allowFullScreen="true" loading="lazy" src="https://human.biodigital.com/viewer/?id=6BJx&ui-anatomy-descriptions=true&ui-anatomy-pronunciations=true&ui-anatomy-labels=true&ui-audio=true&ui-chapter-list=false&ui-fullscreen=true&ui-help=true&ui-info=true&ui-label-list=true&ui-layers=true&ui-skin-layers=true&ui-loader=circle&ui-media-controls=full&ui-menu=true&ui-nav=true&ui-search=true&ui-tools=true&ui-tutorial=false&ui-undo=true&ui-whiteboard=true&initial.none=true&disable-scroll=false&uaid=M4QFl&paid=o_1846bd5e"></iframe>`;
          } else if(selectedRoute === 'IC') {
            injectionDisplay.innerHTML = `<img src="IC.jpg" alt="${selectedRoute} injection route information" style="width: 100%; height: auto;">`;
          } else if(selectedRoute === 'ICV') {
            injectionDisplay.innerHTML = `<img src="ICV.jpg" alt="${selectedRoute} injection route information" style="width: 100%; height: auto;">`;
          } else if(selectedRoute === 'ICM') {
            injectionDisplay.innerHTML = `<img src="ICM.jpg" alt="${selectedRoute} injection route information" style="width: 100%; height: auto;">`;
          } else {
            injectionDisplay.innerHTML = `<img src="placeholder_${selectedRoute}.jpg" alt="${selectedRoute} injection route information" style="width: 100%; height: auto;">`;
          }
        }
        
        injectionDisplay.classList.add('visible');
      });
      
      routeButtonsContainer.appendChild(btn);
    });
    
    // Disable next button until a route is selected
    document.getElementById('step2-next').disabled = true;
  }

  if (current === 'step2') {
    // Generate BMT buttons based on selected vector and route
    const bmtButtonsContainer = document.getElementById('bmt-buttons');
    bmtButtonsContainer.innerHTML = ''; // Clear previous buttons
    
    // Initialize BMT display
    const bmtDisplay = document.getElementById('bmt-display');
    bmtDisplay.innerHTML = `<img src="BMT.jpg" alt="Bone Marrow Transplant image">`;
    bmtDisplay.classList.add('visible');
    
    const bmtOptions = Object.keys(therapyLabData[selectedVector][selectedRoute]);
    bmtOptions.forEach(option => {
      const btn = document.createElement('button');
      btn.className = `bmt-btn ${option}`; // Add class based on yes/no
      btn.setAttribute('data-value', option);
      btn.textContent = option === 'yes' ? 'Yes' : 'No';
      
      // Add click event listener to BMT buttons
      btn.addEventListener('click', function() {
        // Remove active class from all buttons
        document.querySelectorAll('.bmt-btn').forEach(b => b.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
        // Enable submit button
        document.getElementById('submit-btn').disabled = false;
        // Store selected BMT option
        selectedBMT = this.getAttribute('data-value');
        
        // Show image based on BMT selection
        const bmtDisplay = document.getElementById('bmt-display');
        bmtDisplay.innerHTML = `<img src="BMT.jpg" alt="Bone Marrow Transplant image">`;
        bmtDisplay.classList.add('visible');
      });
      
      bmtButtonsContainer.appendChild(btn);
    });
    
    // Disable submit button until a BMT option is selected
    document.getElementById('submit-btn').disabled = true;
  }
}

function backStep(current, previous) {
  // Hide current step with fade out
  document.getElementById(current).classList.remove('active');
  
  // Show previous step with fade in
  setTimeout(() => {
    document.getElementById(previous).classList.add('active');
  }, 300);
}

function showResult() {
  // Get survival data
  const values = therapyLabData[selectedVector][selectedRoute][selectedBMT];
  const survivalDays = Array.isArray(values) ? 
    Math.round(values.reduce((a, b) => a + b, 0) / values.length) : 
    Math.round(values);
  
  // Calculate percentage of maximum survival (900 days)
  const MAX_SURVIVAL = 900;
  const survivalPercentage = Math.round((survivalDays / MAX_SURVIVAL) * 100);
  
  // Determine effectiveness rating based on survival days percentage
  let effectivenessRating = '';
  if (survivalPercentage >= 90) {
    effectivenessRating = "Excellent";
  } else if (survivalPercentage >= 70) {
    effectivenessRating = "Very Good";
  } else if (survivalPercentage >= 50) {
    effectivenessRating = "Good";
  } else if (survivalPercentage >= 30) {
    effectivenessRating = "Fair";
  } else {
    effectivenessRating = "Limited";
  }
  
  // Hide step 3
  document.getElementById('step3').classList.remove('active');
  
  // Show result section with fade in
  setTimeout(() => {
    document.getElementById('result').classList.add('active');
    
    // Update result text
    const resultDiv = document.getElementById('survival');
    resultDiv.textContent = survivalDays;
    
    // Add animation class after a short delay
    setTimeout(() => {
      resultDiv.classList.add('active');
      
      // Update result details
      const resultDetails = document.getElementById('result-details');
      let detailsText = `<strong>Treatment Selected:</strong> ${selectedVector} with ${selectedRoute} administration`;
      detailsText += selectedBMT === 'yes' ? 
        " combined with bone marrow transplant.<br><br>" : 
        " without bone marrow transplant.<br><br>";
      
      detailsText += `<strong>Effectiveness Rating:</strong> ${effectivenessRating}<br>`;
      detailsText += `<strong>Survival Percentage:</strong> ${survivalPercentage}% of maximum observed survival`;
        
      resultDetails.innerHTML = detailsText;
      resultDetails.classList.add('active');
    }, 300);
  }, 300);
}

function restart() {
  // Reset all selections
  selectedVector = '';
  selectedRoute = '';
  selectedBMT = '';
  
  // Remove active states from all buttons
  document.querySelectorAll('#krabbe-therapy-lab button').forEach(btn => {
    btn.classList.remove('active');
  });
  
  // Reset result animations
  document.getElementById('survival').classList.remove('active');
  
  if (document.getElementById('result-details')) {
    document.getElementById('result-details').classList.remove('active');
  }
  
  // Hide result container
  document.getElementById('result').classList.remove('active');
  
  // Show step 1 again with animation
  setTimeout(() => {
    // Reset all step containers
    document.querySelectorAll('#krabbe-therapy-lab .lab-step-container').forEach(container => {
      container.classList.remove('active');
    });
    
    document.getElementById('step1').classList.add('active');
    
    // Disable next buttons
    document.getElementById('step1-next').disabled = true;
  }, 300);
}

// Navigation Menu Functionality
document.addEventListener('DOMContentLoaded', function() {
    const navMenuBtn = document.getElementById('navMenuBtn');
    const navigationMenu = document.getElementById('navigationMenu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    // Toggle navigation menu when clicking the menu button
    navMenuBtn.addEventListener('click', function() {
        navigationMenu.classList.toggle('active');
    });
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        const isClickInsideMenu = navigationMenu.contains(event.target);
        const isClickOnButton = navMenuBtn.contains(event.target);
        
        if (!isClickInsideMenu && !isClickOnButton && navigationMenu.classList.contains('active')) {
            navigationMenu.classList.remove('active');
        }
    });
    
    // Handle dropdown toggles
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            // Prevent the click from closing the menu
            e.stopPropagation();
            
            // Toggle the active class on the clicked item
            this.classList.toggle('active');
            
            // Close other dropdown menus
            dropdownToggles.forEach(otherToggle => {
                if (otherToggle !== this && otherToggle.classList.contains('active')) {
                    otherToggle.classList.remove('active');
                }
            });
        });
    });
    
    // Handle menu item clicks (smooth scroll to section)
    const menuLinks = document.querySelectorAll('.navigation-menu a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Smooth scroll to the section
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Close the menu after clicking a link
                navigationMenu.classList.remove('active');
                
                // Update URL hash without scrolling
                history.pushState(null, null, targetId);
            }
        });
    });
});
