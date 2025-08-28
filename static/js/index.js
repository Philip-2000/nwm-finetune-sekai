// Main JavaScript for NWM Fine-tuning Project Page
window.HELP_IMPROVE_VIDEOJS = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('NWM Fine-tuning project page loaded');
    // Initialize three separate quantitative visualizations
    initializeQuantitativeComparison();
    initializeQuantiResultsTable();
    
    // Listen for quanti data loaded event
    document.addEventListener('quantiDataLoaded', function(event) {
        const D = window.dataLoader.getQuantiData();
        populateQuantiResultsTable(D, "time");
        populateQuantiResultsTable(D, "rollout_1fps");
        populateQuantiResultsTable(D, "rollout_4fps");
    });
    
    // If quanti data is already loaded
    // while(!(window.dataLoader && window.dataLoader.getQuantiData())) {
        // Wait until dataLoader is available
    // }
    // Initialize results table

    if (window.dataLoader && window.dataLoader.getQuantiData()) {
        const D = window.dataLoader.getQuantiData();
        populateQuantiResultsTable(D, "time");
        populateQuantiResultsTable(D, "rollout_1fps");
        populateQuantiResultsTable(D, "rollout_4fps");
    }


    // Initialize original carousel and slider functionality
    initializeCarouselAndSlider();
    
    
    // Add GIF loading effects
    addGifLoadingEffects();
});

function initializeCarouselAndSlider() {
    // Familiar carousel starts immediately
    var familiarOptions = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 6000, // 6 seconds as requested
    }

    // Half-familiar carousel starts with 5-second delay
    var halfFamiliarOptions = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: true,
        autoplaySpeed: 7000, // 7 seconds as requested
    }

    // Initialize carousels
    if (typeof bulmaCarousel !== 'undefined') {
        // Initialize familiar carousel immediately
        var familiarCarousel = bulmaCarousel.attach('#familiar-carousel', familiarOptions);
        
        // Initialize half-familiar carousel with 5-second delay
        var halfFamiliarCarousel = bulmaCarousel.attach('#half-familiar-carousel', halfFamiliarOptions);
        
        // Start half-familiar carousel after 5 seconds
        setTimeout(() => {
            if (halfFamiliarCarousel && halfFamiliarCarousel[0]) {
                halfFamiliarCarousel[0].start();
            }
        }, 5000);
    }
    
    if (typeof bulmaSlider !== 'undefined') {
        bulmaSlider.attach();
    }
}

function initializeQuantitativeComparison() {
    // Create visualization instances for different categories
    
    // Time-based visualizations
    var lpipsTimeViz = new QuantiVisualization('#lpips-time-visualization', 'time');
    var dreamsimTimeViz = new QuantiVisualization('#dreamsim-time-visualization', 'time');
    var fidTimeViz = new QuantiVisualization('#fid-time-visualization', 'time');
    
    // 1FPS rollout visualizations
    var lpips1fpsViz = new QuantiVisualization('#lpips-rollout-1fps-visualization', 'rollout_1fps');
    var dreamsim1fpsViz = new QuantiVisualization('#dreamsim-rollout-1fps-visualization', 'rollout_1fps');
    var fid1fpsViz = new QuantiVisualization('#fid-rollout-1fps-visualization', 'rollout_1fps');
    
    // 4FPS rollout visualizations
    var lpips4fpsViz = new QuantiVisualization('#lpips-rollout-4fps-visualization', 'rollout_4fps');
    var dreamsim4fpsViz = new QuantiVisualization('#dreamsim-rollout-4fps-visualization', 'rollout_4fps');
    var fid4fpsViz = new QuantiVisualization('#fid-rollout-4fps-visualization', 'rollout_4fps');
    
    // Store all visualizations globally
    window.visualizations = {
        time: { lpipsViz: lpipsTimeViz, dreamsimViz: dreamsimTimeViz, fidViz: fidTimeViz },
        rollout_1fps: { lpipsViz: lpips1fpsViz, dreamsimViz: dreamsim1fpsViz, fidViz: fid1fpsViz },
        rollout_4fps: { lpipsViz: lpips4fpsViz, dreamsimViz: dreamsim4fpsViz, fidViz: fid4fpsViz }
    };
    
    // Attach button event handlers
    attachQuantitativeButtonHandlers();
    
    // Initialize section toggle functionality
    initializeSectionToggles();
}

function attachQuantitativeButtonHandlers() {
    // Scene type buttons (affect all visualizations)
    $('#btn-same-time').click(function() {
        toggleGlobalVisualizationLine($(this), 'familiar', 'time');
    });
    
    $('#btn-half-time').click(function() {
        toggleGlobalVisualizationLine($(this), 'half-familiar', 'time');
    });
    
    $('#btn-unknown-time').click(function() {
        toggleGlobalVisualizationLine($(this), 'unfamiliar', 'time');
    });
    
    // Training status buttons (affect all visualizations)
    $('#btn-before-time').click(function() {
        toggleGlobalTrainingStatus($(this), 'before', 'time');
    });

    $('#btn-after-time').click(function() {
        toggleGlobalTrainingStatus($(this), 'after', 'time');
    });

    
    $('#btn-same-rollout-1fps').click(function() {
        toggleGlobalVisualizationLine($(this), 'familiar', 'rollout_1fps');
    });

    $('#btn-half-rollout-1fps').click(function() {
        toggleGlobalVisualizationLine($(this), 'half-familiar', 'rollout_1fps');
    });
    
    $('#btn-unknown-rollout-1fps').click(function() {
        toggleGlobalVisualizationLine($(this), 'unfamiliar', 'rollout_1fps');
    });
    
    // Training status buttons (affect all visualizations)
    $('#btn-before-rollout-1fps').click(function() {
        toggleGlobalTrainingStatus($(this), 'before', 'rollout_1fps');
    });

    $('#btn-after-rollout-1fps').click(function() {
        toggleGlobalTrainingStatus($(this), 'after', 'rollout_1fps');
    });

    $('#btn-same-rollout-4fps').click(function() {
        toggleGlobalVisualizationLine($(this), 'familiar', 'rollout_4fps');
    });

    $('#btn-half-rollout-4fps').click(function() {
        toggleGlobalVisualizationLine($(this), 'half-familiar', 'rollout_4fps');
    });
    
    $('#btn-unknown-rollout-4fps').click(function() {
        toggleGlobalVisualizationLine($(this), 'unfamiliar', 'rollout_4fps');
    });
    
    // Training status buttons (affect all visualizations)
    $('#btn-before-rollout-4fps').click(function() {
        toggleGlobalTrainingStatus($(this), 'before', 'rollout_4fps');
    });

    $('#btn-after-rollout-4fps').click(function() {
        toggleGlobalTrainingStatus($(this), 'after', 'rollout_4fps');
    });
}

function toggleGlobalVisualizationLine(button, sceneType, category) {
    // Toggle button visual state
    var isActive = button.attr('data-active') === 'true';
    
    if (isActive) {
        button.attr('data-active', 'false');
        // Button will automatically become gray/inactive via CSS
    } else {
        button.attr('data-active', 'true');
        // Button will automatically restore its original color via CSS
    }
    
    // Apply to all visualizations across all categories
    const visible = !isActive;
    if (window.visualizations) {
        // Object.keys(window.visualizations).forEach(category => {
        //     const categoryViz = window.visualizations[category];
        //     if (categoryViz) {
        //         categoryViz.lpipsViz.toggleLine(sceneType, visible);
        //         categoryViz.dreamsimViz.toggleLine(sceneType, visible);
        //         categoryViz.fidViz.toggleLine(sceneType, visible);
        //     }
        // });
        const categoryViz = window.visualizations[category];
        if (categoryViz) {
            categoryViz.lpipsViz.toggleLine(sceneType, visible);
            categoryViz.dreamsimViz.toggleLine(sceneType, visible);
            categoryViz.fidViz.toggleLine(sceneType, visible);
        }
    }
}

function toggleGlobalTrainingStatus(button, status, category) {
    // Toggle button visual state
    var isActive = button.attr('data-active') === 'true';
    
    if (isActive) {
        button.attr('data-active', 'false');
        // Button will automatically become gray/inactive via CSS
    } else {
        button.attr('data-active', 'true');
        // Button will automatically restore its original color via CSS
    }
    
    // Apply to all visualizations across all categories
    const visible = !isActive;
    if (window.visualizations) {
        // Object.keys(window.visualizations).forEach(category => {
        //     const categoryViz = window.visualizations[category];
        //     if (categoryViz) {
        //         categoryViz.lpipsViz.toggleTrainingStatus(status, visible);
        //         categoryViz.dreamsimViz.toggleTrainingStatus(status, visible);
        //         categoryViz.fidViz.toggleTrainingStatus(status, visible);
        //     }
        // });
        const categoryViz = window.visualizations[category];
        if (categoryViz) {
            categoryViz.lpipsViz.toggleTrainingStatus(status, visible);
            categoryViz.dreamsimViz.toggleTrainingStatus(status, visible);
            categoryViz.fidViz.toggleTrainingStatus(status, visible);
        }
    }
}

function initializeSectionToggles() {
    // Time section toggle
    $('#toggle-time-section').click(function() {
        const content = $('#time-evaluation-container');
        const button = $(this);
        const icon = button.find('svg');
        
        if (content.is(':visible')) {
            content.slideUp(300);
            // Change icon to right arrow (collapsed)
            icon.html('<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>');
        } else {
            content.slideDown(300);
            // Change icon to down arrow (expanded)
            icon.html('<path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>');
        }
    });
    
    // 1FPS section toggle
    $('#toggle-rollout-1fps-section').click(function() {
        const content = $('#rollout-1fps-evaluation-container');
        const button = $(this);
        const icon = button.find('svg');
        
        if (content.is(':visible')) {
            content.slideUp(300);
            // Change icon to right arrow (collapsed)
            icon.html('<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>');
        } else {
            content.slideDown(300);
            // Change icon to down arrow (expanded)
            icon.html('<path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>');
        }
    });
    
    // 4FPS section toggle
    $('#toggle-rollout-4fps-section').click(function() {
        const content = $('#rollout-4fps-evaluation-container');
        const button = $(this);
        const icon = button.find('svg');
        
        if (content.is(':visible')) {
            content.slideUp(300);
            // Change icon to right arrow (collapsed)
            icon.html('<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>');
        } else {
            content.slideDown(300);
            // Change icon to down arrow (expanded)
            icon.html('<path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>');
        }
    });
}

// Keep the old function for backward compatibility but rename it
function toggleVisualizationLine(button, visualization, dataType) {
    var isActive = button.hasClass('is-active');
    
    if (isActive) {
        button.removeClass('is-active').addClass('is-light');
        visualization.toggleLine(dataType, false);
    } else {
        button.removeClass('is-light').addClass('is-active');
        visualization.toggleLine(dataType, true);
    }
}

function initializeQuantiResultsTable() {
    const tabletime = document.getElementById('quanti-results-table-time');
    const table1fps = document.getElementById('quanti-results-table-rollout_1fps');
    const table4fps = document.getElementById('quanti-results-table-rollout_4fps');
    if (!tabletime || !table1fps || !table4fps) return;
    
    // Add hover effects and styling
    tabletime.classList.add('is-hoverable');
    table1fps.classList.add('is-hoverable');
    table4fps.classList.add('is-hoverable');
}

function populateQuantiResultsTable(D, category) {
    const quantiData = D;//#[category];
    const table = document.getElementById('quanti-results-table-' + category);
    if (!table || !quantiData) return;
    console.log("populateQ")
    console.log(D)
    
    // Clear existing content
    table.innerHTML = '';
    
    const timePoints = ['1s', '2s', '4s', '6s', '8s'];
    const metrics = [
        { key: 'dreamsim', label: 'DreamSim', decimals: 3 },
        { key: 'lpips', label: 'LPIPS', decimals: 3 },
        { key: 'fid', label: 'FID', decimals: 1 }
    ];
    const sceneTypes = [
        { key: 'same', label: 'Familiar' },
        { key: 'half', label: 'Half-Familiar' }, 
        { key: 'unknown', label: 'Unfamiliar' }
    ];
    
    // Create table structure
    const thead = document.createElement('thead');
    const tbody = document.createElement('tbody');
    
    // Create first header row (scene types)
    const headerRow1 = document.createElement('tr');
    
    // Empty cells for row headers
    const emptyCell1 = document.createElement('th');
    emptyCell1.textContent = 'Metric';
    emptyCell1.rowSpan = 2;
    emptyCell1.style.verticalAlign = 'middle';
    emptyCell1.style.backgroundColor = '#f5f5f5';
    emptyCell1.style.fontWeight = 'bold';
    emptyCell1.style.width = '70px'; // Reduce width by 30%
    emptyCell1.style.textAlign = 'center'; // Center align
    headerRow1.appendChild(emptyCell1);
    
    const emptyCell2 = document.createElement('th');
    emptyCell2.textContent = 'Time';
    emptyCell2.rowSpan = 2;
    emptyCell2.style.verticalAlign = 'middle';
    emptyCell2.style.backgroundColor = '#f5f5f5';
    emptyCell2.style.fontWeight = 'bold';
    emptyCell2.style.textAlign = 'center'; // Center align
    headerRow1.appendChild(emptyCell2);
    
    // Scene type headers (each spans 4 columns: before, after, improvement, ratio)
    sceneTypes.forEach(sceneType => {
        const th = document.createElement('th');
        th.textContent = sceneType.label;
        th.colSpan = 4;
        th.style.textAlign = 'center';
        th.style.backgroundColor = '#e8f4f8';
        th.style.fontWeight = 'bold';
        th.style.borderBottom = '2px solid #ddd';
        headerRow1.appendChild(th);
    });
    
    // Create second header row (before/after/improvement/ratio)
    const headerRow2 = document.createElement('tr');
    
    sceneTypes.forEach(sceneType => {
        // Before column
        const beforeTh = document.createElement('th');
        beforeTh.textContent = 'Before';
        beforeTh.style.textAlign = 'center';
        beforeTh.style.backgroundColor = '#f9f9f9';
        beforeTh.style.fontSize = '0.9em';
        headerRow2.appendChild(beforeTh);
        
        // After column
        const afterTh = document.createElement('th');
        afterTh.textContent = 'After';
        afterTh.style.textAlign = 'center';
        afterTh.style.backgroundColor = '#f9f9f9';
        afterTh.style.fontSize = '0.9em';
        headerRow2.appendChild(afterTh);
        
        // Improvement column (before - after)
        const improvementTh = document.createElement('th');
        improvementTh.textContent = 'Improve';
        improvementTh.style.textAlign = 'center';
        improvementTh.style.backgroundColor = '#e8f5e8';
        improvementTh.style.fontSize = '0.9em';
        improvementTh.title = 'Improvement (Before - After)';
        headerRow2.appendChild(improvementTh);
        
        // Ratio column (after / before)
        const ratioTh = document.createElement('th');
        ratioTh.textContent = 'Ratio';
        ratioTh.style.textAlign = 'center';
        ratioTh.style.backgroundColor = '#fff3e0';
        ratioTh.style.fontSize = '0.9em';
        ratioTh.title = 'Ratio (After / Before) as percentage';
        headerRow2.appendChild(ratioTh);
    });
    
    thead.appendChild(headerRow1);
    thead.appendChild(headerRow2);
    
    // Create data rows
    metrics.forEach((metric, metricIndex) => {
        // Add separator row between metrics (except before the first metric)
        if (metricIndex > 0) {
            const separatorRow = document.createElement('tr');
            separatorRow.style.height = '8px';
            separatorRow.style.backgroundColor = '#f8f9fa';
            
            // Create empty cells for the separator row
            for (let i = 0; i < 14; i++) { // 2 header columns + 12 data columns
                const emptyCell = document.createElement('td');
                emptyCell.style.backgroundColor = '#f8f9fa';
                emptyCell.style.borderTop = '1px solid #e9ecef';
                emptyCell.style.borderBottom = '1px solid #e9ecef';
                separatorRow.appendChild(emptyCell);
            }
            tbody.appendChild(separatorRow);
        }
        
        timePoints.forEach((timePoint, timeIndex) => {
            const tr = document.createElement('tr');
            
            // Metric column (only for first time point of each metric)
            if (timeIndex === 0) {
                const metricCell = document.createElement('td');
                metricCell.textContent = metric.label;
                metricCell.rowSpan = timePoints.length;
                metricCell.style.verticalAlign = 'middle';
                metricCell.style.fontWeight = 'bold';
                metricCell.style.backgroundColor = '#f5f5f5';
                metricCell.style.borderRight = '2px solid #ddd';
                metricCell.style.textAlign = 'center'; // Center align
                tr.appendChild(metricCell);
            }
            
            // Time column
            const timeCell = document.createElement('td');
            timeCell.textContent = timePoint;
            timeCell.style.fontFamily = 'monospace';
            timeCell.style.textAlign = 'center';
            timeCell.style.backgroundColor = '#f9f9f9';
            timeCell.style.borderRight = '2px solid #ddd';
            tr.appendChild(timeCell);
            
            // Data columns for each scene type
            sceneTypes.forEach(sceneType => {
                // Get data for before and after
                const beforeFilename = `sekaibt_${sceneType.key}_merged.json`;
                const afterFilename = `sekaift_${sceneType.key}_merged.json`;
                const beforeData = quantiData[beforeFilename];
                const afterData = quantiData[afterFilename];
                
                const beforeKey = `sekai_${category}_${metric.key}_${timePoint}`;
                const afterKey = `sekai_${category}_${metric.key}_${timePoint}`;
                
                const beforeValue = beforeData ? beforeData[beforeKey] : null;
                const afterValue = afterData ? afterData[afterKey] : null;
                
                // Before column
                const beforeCell = document.createElement('td');
                if (beforeValue !== null && beforeValue !== undefined) {
                    let formattedValue = beforeValue.toFixed(metric.decimals);
                    // Remove leading zero for values < 1
                    if (beforeValue < 1 && beforeValue >= 0) {
                        formattedValue = formattedValue.substring(1);
                    } else if (beforeValue > -1 && beforeValue < 0) {
                        formattedValue = '-' + formattedValue.substring(2);
                    }
                    beforeCell.textContent = formattedValue;
                } else {
                    beforeCell.textContent = 'N/A';
                }
                beforeCell.style.fontFamily = 'monospace';
                beforeCell.style.textAlign = 'center';
                tr.appendChild(beforeCell);
                
                // After column
                const afterCell = document.createElement('td');
                if (afterValue !== null && afterValue !== undefined) {
                    let formattedValue = afterValue.toFixed(metric.decimals);
                    // Remove leading zero for values < 1
                    if (afterValue < 1 && afterValue >= 0) {
                        formattedValue = formattedValue.substring(1);
                    } else if (afterValue > -1 && afterValue < 0) {
                        formattedValue = '-' + formattedValue.substring(2);
                    }
                    afterCell.textContent = formattedValue;
                } else {
                    afterCell.textContent = 'N/A';
                }
                afterCell.style.fontFamily = 'monospace';
                afterCell.style.textAlign = 'center';
                tr.appendChild(afterCell);
                
                // Improvement column (before - after, positive is better)
                const improvementCell = document.createElement('td');
                if (beforeValue !== null && afterValue !== null && 
                    beforeValue !== undefined && afterValue !== undefined) {
                    const improvement = beforeValue - afterValue;
                    let formattedValue = improvement.toFixed(metric.decimals);
                    // Remove leading zero for values < 1
                    if (improvement < 1 && improvement >= 0) {
                        formattedValue = formattedValue.substring(1);
                    } else if (improvement > -1 && improvement < 0) {
                        formattedValue = '-' + formattedValue.substring(2);
                    }
                    improvementCell.textContent = formattedValue;
                    // Color code: green for positive (good), red for negative (bad)
                    if (improvement > 0) {
                        improvementCell.style.color = '#27ae60';
                        improvementCell.style.fontWeight = 'bold';
                    } else if (improvement < 0) {
                        improvementCell.style.color = '#e74c3c';
                    }
                } else {
                    improvementCell.textContent = 'N/A';
                }
                improvementCell.style.fontFamily = 'monospace';
                improvementCell.style.textAlign = 'center';
                improvementCell.style.backgroundColor = '#f8fff8';
                tr.appendChild(improvementCell);
                
                // Ratio column (after / before, lower is better for these metrics)
                const ratioCell = document.createElement('td');
                if (beforeValue !== null && afterValue !== null && 
                    beforeValue !== undefined && afterValue !== undefined && beforeValue !== 0) {
                    const ratio = afterValue / beforeValue;
                    const percentage = (ratio * 100).toFixed(1);
                    ratioCell.textContent = percentage + '%';
                    // Color code: green for ratio < 100% (improvement), red for ratio > 100% (worse)
                    if (ratio < 1.0) {
                        ratioCell.style.color = '#27ae60';
                        ratioCell.style.fontWeight = 'bold';
                    } else if (ratio > 1.0) {
                        ratioCell.style.color = '#e74c3c';
                    }
                } else {
                    ratioCell.textContent = 'N/A';
                }
                ratioCell.style.fontFamily = 'monospace';
                ratioCell.style.textAlign = 'center';
                ratioCell.style.backgroundColor = '#fffaf0';
                tr.appendChild(ratioCell);
            });
            
            // Add row hover effect
            tr.addEventListener('mouseenter', function() {
                this.style.backgroundColor = '#f0f8ff';
            });
            
            tr.addEventListener('mouseleave', function() {
                this.style.backgroundColor = '';
                // Restore specific cell backgrounds
                this.querySelectorAll('td').forEach((cell, index) => {
                    // Check if this row has the metric cell (first time point of each metric)
                    const hasMetricCell = timeIndex === 0;
                    
                    if (hasMetricCell) {
                        // For rows with metric cell: metric(0), time(1), then data columns(2+)
                        if (index === 0) {
                            cell.style.backgroundColor = '#f5f5f5'; // Metric column
                        } else if (index === 1) {
                            cell.style.backgroundColor = '#f9f9f9'; // Time column
                        } else {
                            const cellIndex = index - 2;
                            if (cellIndex % 4 === 2) cell.style.backgroundColor = '#f8fff8'; // Improvement
                            if (cellIndex % 4 === 3) cell.style.backgroundColor = '#fffaf0'; // Ratio
                        }
                    } else {
                        // For rows without metric cell: time(0), then data columns(1+)
                        if (index === 0) {
                            cell.style.backgroundColor = '#f9f9f9'; // Time column
                        } else {
                            const cellIndex = index - 1;
                            if (cellIndex % 4 === 2) cell.style.backgroundColor = '#f8fff8'; // Improvement
                            if (cellIndex % 4 === 3) cell.style.backgroundColor = '#fffaf0'; // Ratio
                        }
                    }
                });
            });
            
            tbody.appendChild(tr);
        });
    });
    
    table.appendChild(thead);
    table.appendChild(tbody);
    
    // Add table styling
    table.className = 'table is-bordered is-striped is-hoverable is-fullwidth';
    table.style.fontSize = '0.95em'; // Increased from 0.85em
}

function addGifLoadingEffects() {
    const gifs = document.querySelectorAll('img[src$=".gif"]');
    
    gifs.forEach(gif => {
        gif.style.opacity = '0';
        gif.style.transition = 'opacity 0.3s ease-in-out';
        
        gif.addEventListener('load', function() {
            this.style.opacity = '1';
        });
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
