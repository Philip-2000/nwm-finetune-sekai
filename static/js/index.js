// Main JavaScript for NWM Fine-tuning Project Page
window.HELP_IMPROVE_VIDEOJS = false;

document.addEventListener('DOMContentLoaded', function() {
    console.log('NWM Fine-tuning project page loaded');
    // Initialize three separate quantitative visualizations
    initializeQuantitativeComparison();
    
    // Initialize original carousel and slider functionality
    initializeCarouselAndSlider();
    
    // Initialize results table
    initializeQuantiResultsTable();
    
    // Listen for quanti data loaded event
    document.addEventListener('quantiDataLoaded', function(event) {
        populateQuantiResultsTable(event.detail);
    });
    
    // If quanti data is already loaded
    if (window.dataLoader && window.dataLoader.getQuantiData()) {
        populateQuantiResultsTable(window.dataLoader.getQuantiData());
    }
    
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
        autoplaySpeed: 10000, // 10 seconds as requested
    }

    // Half-familiar carousel starts with 5-second delay
    var halfFamiliarOptions = {
        slidesToScroll: 1,
        slidesToShow: 1,
        loop: true,
        infinite: true,
        autoplay: false, // Will be started manually with delay
        autoplaySpeed: 10000, // 10 seconds as requested
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
    // Create three separate visualization instances
    var lpipsViz = new QuantiVisualization('#lpips-visualization');
    var dreamsimViz = new QuantiVisualization('#dreamsim-visualization');
    var fidViz = new QuantiVisualization('#fid-visualization');
    
    // Attach button event handlers
    attachQuantitativeButtonHandlers(lpipsViz, dreamsimViz, fidViz);
}

function attachQuantitativeButtonHandlers(lpipsViz, dreamsimViz, fidViz) {
    // Store visualization instances globally so they can be accessed by all buttons
    window.visualizations = { lpipsViz, dreamsimViz, fidViz };
    
    // Scene type buttons (affect all three visualizations)
    $('#btn-same').click(function() {
        toggleGlobalVisualizationLine($(this), 'familiar');
    });
    
    $('#btn-half').click(function() {
        toggleGlobalVisualizationLine($(this), 'half-familiar');
    });
    
    $('#btn-unknown').click(function() {
        toggleGlobalVisualizationLine($(this), 'unfamiliar');
    });
    
    // Training status buttons (affect all three visualizations)
    $('#btn-before').click(function() {
        toggleGlobalTrainingStatus($(this), 'before');
    });
    
    $('#btn-after').click(function() {
        toggleGlobalTrainingStatus($(this), 'after');
    });
}

function toggleGlobalVisualizationLine(button, sceneType) {
    // Toggle button visual state
    var isActive = button.attr('data-active') === 'true';
    
    if (isActive) {
        button.attr('data-active', 'false');
        // Button will automatically become gray/inactive via CSS
    } else {
        button.attr('data-active', 'true');
        // Button will automatically restore its original color via CSS
    }
    
    // Apply to all three visualizations
    const visible = !isActive;
    if (window.visualizations) {
        window.visualizations.lpipsViz.toggleLine(sceneType, visible);
        window.visualizations.dreamsimViz.toggleLine(sceneType, visible);
        window.visualizations.fidViz.toggleLine(sceneType, visible);
    }
}

function toggleGlobalTrainingStatus(button, status) {
    // Toggle button visual state
    var isActive = button.attr('data-active') === 'true';
    
    if (isActive) {
        button.attr('data-active', 'false');
        // Button will automatically become gray/inactive via CSS
    } else {
        button.attr('data-active', 'true');
        // Button will automatically restore its original color via CSS
    }
    
    // Apply to all three visualizations
    const visible = !isActive;
    if (window.visualizations) {
        window.visualizations.lpipsViz.toggleTrainingStatus(status, visible);
        window.visualizations.dreamsimViz.toggleTrainingStatus(status, visible);
        window.visualizations.fidViz.toggleTrainingStatus(status, visible);
    }
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
    const table = document.getElementById('quanti-results-table');
    if (!table) return;
    
    // Add hover effects and styling
    table.classList.add('is-hoverable');
}

function populateQuantiResultsTable(quantiData) {
    const table = document.getElementById('quanti-results-table');
    if (!table || !quantiData) return;
    
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
                
                const beforeKey = `sekai_time_${metric.key}_${timePoint}`;
                const afterKey = `sekai_time_${metric.key}_${timePoint}`;
                
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
