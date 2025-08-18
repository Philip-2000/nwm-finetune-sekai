// D3.js Interactive Visualization for NWM Fine-tuning Quantitative Results
class QuantiVisualization {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = d3.select(containerId);
        
        // Extract metric from container ID
        if (containerId.includes('lpips')) {
            this.currentMetric = 'lpips';
        } else if (containerId.includes('dreamsim')) {
            this.currentMetric = 'dreamsim';
        } else if (containerId.includes('fid')) {
            this.currentMetric = 'fid';
        } else {
            this.currentMetric = 'dreamsim'; // default
        }
        
        this.data = null;
        this.margin = { top: 40, right: 100, bottom: 80, left: 80 };
        this.width = 700 - this.margin.left - this.margin.right; // Smaller width for three-column layout
        this.height = 400 - this.margin.top - this.margin.bottom;
        
        // Line visibility states (all visible by default)
        this.lineVisibility = {
            'familiar': true,
            'half-familiar': true,
            'unfamiliar': true
        };
        
        // Training status visibility states (all visible by default)
        this.statusVisibility = {
            'before': true,
            'after': true
        };
        
        this.init();
        this.loadAndRender();
    }

    init() {
        // Clear container
        this.container.selectAll("*").remove();
        
        // Create SVG
        this.svg = this.container
            .append("svg")
            .attr("width", this.width + this.margin.left + this.margin.right)
            .attr("height", this.height + this.margin.top + this.margin.bottom);

        this.g = this.svg.append("g")
            .attr("transform", `translate(${this.margin.left},${this.margin.top})`);

        // Time points and positions (more compact spacing)
        this.timeLabels = ['1s', '2s', '4s', '6s', '8s'];
        this.xPositions = [1, 2, 4, 6, 8]; // More compact, centered spacing

        // Create scales with tighter domain and centered range
        const plotWidth = this.width * 0.56; // Use 60% of available width
        const plotOffset = 0;//this.width * 0.1; // Center the plot
        this.xScale = d3.scaleLinear()
            .domain([0, 8]) // Tighter domain with some padding
            .range([plotOffset, plotOffset + plotWidth]);

        this.yScale = d3.scaleLinear()
            .range([this.height, 0]);

        // Color mapping (matching Python script colors)
        this.colorMap = {
            familiar: { before: '#7ff6ec', after: '#249e97' },
            'half-familiar': { before: '#ff9a9a', after: '#b22d2d' },
            unfamiliar: { before: '#b3ffb3', after: '#008000' }
        };

        // Create axes
        this.xAxis = this.g.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0,${this.height})`);

        this.yAxis = this.g.append("g")
            .attr("class", "y-axis");

        // Add axis labels
        this.g.append("text")
            .attr("class", "x-label")
            .attr("text-anchor", "middle")
            .attr("x", this.width / 2)
            .attr("y", this.height + 50)
            .style("font-size", "14px")
            .text("Time (seconds)");

        this.yLabel = this.g.append("text")
            .attr("class", "y-label")
            .attr("text-anchor", "middle")
            .attr("y", -50)
            .attr("x", -this.height / 2)
            .attr("transform", "rotate(-90)")
            .style("font-size", "14px");
            
        // Update y-axis label based on metric
        const metricLabels = {
            'lpips': 'LPIPS (↓)',
            'dreamsim': 'DreamSim (↓)',
            'fid': 'FID (↓)'
        };
        this.yLabel.text(metricLabels[this.currentMetric] || this.currentMetric.toUpperCase());

        // Add title
        // this.title = this.g.append("text")
        //     .attr("class", "chart-title")
        //     .attr("text-anchor", "middle")
        //     .attr("x", this.width / 2)
        //     .attr("y", -15)
        //     .style("font-size", "16px")
        //     .style("font-weight", "bold")
        //     .text(`${this.currentMetric.toUpperCase()} Performance Over Time`);

        // Add legend
        this.createLegend();
    }

    createLegend() {
        const legend = this.g.append("g")
            .attr("class", "legend")
            .attr("transform", `translate(${this.width - 90}, 20)`);

        const legendData = [
            { type: 'familiar', status: 'before', label: 'Familiar Before', color: this.colorMap.familiar.before },
            { type: 'familiar', status: 'after', label: 'Familiar After', color: this.colorMap.familiar.after },
            { type: 'half-familiar', status: 'before', label: 'Half Before', color: this.colorMap['half-familiar'].before },
            { type: 'half-familiar', status: 'after', label: 'Half After', color: this.colorMap['half-familiar'].after },
            { type: 'unfamiliar', status: 'before', label: 'Unfamiliar Before', color: this.colorMap.unfamiliar.before },
            { type: 'unfamiliar', status: 'after', label: 'Unfamiliar After', color: this.colorMap.unfamiliar.after }
        ];
        
        legendData.forEach((d, i) => {
            const legendRow = legend.append("g")
                .attr("transform", `translate(0, ${i * 18})`);

            legendRow.append("line")
                .attr("x1", 0)
                .attr("x2", 15)
                .attr("y1", 6)
                .attr("y2", 6)
                .attr("stroke", d.color)
                .attr("stroke-width", 2);

            legendRow.append("text")
                .attr("x", 20)
                .attr("y", 9)
                .style("font-size", "11px")
                .text(d.label);
        });
    }

    loadAndRender() {
        // Wait for data to be loaded
        if (window.dataLoader && window.dataLoader.getQuantiData()) {
            this.renderVisualization();
        } else {
            // Listen for data loaded event
            document.addEventListener('quantiDataLoaded', () => {
                this.renderVisualization();
            });
        }
    }

    renderVisualization() {
        const quantiData = window.dataLoader.getQuantiData();
        if (!quantiData) return;

        const visualData = window.dataLoader.getQuantiVisualizationData(this.currentMetric);
        if (!visualData) return;
        console.log('Rendering visualization for metric:', this.currentMetric);
        console.log('Visual data structure:', visualData);

        // Prepare data for visualization
        const plotData = [];
        const sceneTypes = ['familiar', 'half-familiar', 'unfamiliar'];
        const statuses = ['before', 'after'];

        sceneTypes.forEach(sceneType => {
            statuses.forEach(status => {
                // Check visibility (both scene type and training status)
                if (!this.lineVisibility[sceneType] || !this.statusVisibility[status]) return;
                
                // Map scene type names to data keys
                const sceneMap = {
                    'familiar': 'same',
                    'half-familiar': 'half', 
                    'unfamiliar': 'unknown'
                };
                
                const dataSceneType = sceneMap[sceneType];
                if (visualData[dataSceneType] && visualData[dataSceneType][status]) {
                    const values = visualData[dataSceneType][status];
                    
                    this.xPositions.forEach((xPos, i) => {
                        const value = values[i]; // Array index instead of time label
                        if (value !== null && value !== undefined) {
                            plotData.push({
                                sceneType: sceneType,
                                status: status,
                                time: this.timeLabels[i],
                                x: xPos,
                                y: value
                            });
                        }
                    });
                }
            });
        });

        if (plotData.length === 0) return;

        // Update scales
        const yExtent = d3.extent(plotData, d => d.y);
        const yPadding = (yExtent[1] - yExtent[0]) * 0.1;
        this.yScale.domain([Math.max(0, yExtent[0] - yPadding), yExtent[1] + yPadding]);

        // Update axes
        this.xAxis.transition().duration(750)
            .call(d3.axisBottom(this.xScale)
                .tickValues(this.xPositions)
                .tickFormat((d, i) => this.timeLabels[i]));

        this.yAxis.transition().duration(750)
            .call(d3.axisLeft(this.yScale));

        // Group data by scene type and status
        const groupedData = d3.group(plotData, d => `${d.sceneType}_${d.status}`);

        // Remove existing lines
        this.g.selectAll(".line").remove();
        this.g.selectAll(".dot").remove();

        // Draw lines for each group
        groupedData.forEach((values, key) => {
            const [sceneType, status] = key.split('_');
            
            const line = d3.line()
                .x(d => this.xScale(d.x))
                .y(d => this.yScale(d.y))
                .curve(d3.curveMonotoneX);

            const color = this.colorMap[sceneType][status];

            // Draw line
            this.g.append("path")
                .datum(values.sort((a, b) => a.x - b.x))
                .attr("class", "line")
                .attr("fill", "none")
                .attr("stroke", color)
                .attr("stroke-width", 2)
                .attr("d", line);

            // Draw dots with different shapes based on scene type
            if (sceneType === 'familiar') {
                // Circle for familiar
                this.g.selectAll(`.dot-${sceneType}-${status}`)
                    .data(values)
                    .enter().append("circle")
                    .attr("class", `dot dot-${sceneType}-${status}`)
                    .attr("cx", d => this.xScale(d.x))
                    .attr("cy", d => this.yScale(d.y))
                    .attr("r", 4)
                    .attr("fill", color)
                    .on("mouseover", (event, d) => {
                        this.showTooltip(event, d);
                    })
                    .on("mouseout", () => {
                        d3.select(".tooltip").remove();
                    });
            } else if (sceneType === 'half-familiar') {
                // Triangle for half-familiar
                this.g.selectAll(`.dot-${sceneType}-${status}`)
                    .data(values)
                    .enter().append("path")
                    .attr("class", `dot dot-${sceneType}-${status}`)
                    .attr("d", d => {
                        const x = this.xScale(d.x);
                        const y = this.yScale(d.y);
                        const size = 5;
                        return `M${x},${y-size} L${x-size},${y+size} L${x+size},${y+size} Z`;
                    })
                    .attr("fill", color)
                    .on("mouseover", (event, d) => {
                        this.showTooltip(event, d);
                    })
                    .on("mouseout", () => {
                        d3.select(".tooltip").remove();
                    });
            } else if (sceneType === 'unfamiliar') {
                // Cross for unfamiliar
                this.g.selectAll(`.dot-${sceneType}-${status}`)
                    .data(values)
                    .enter().append("g")
                    .attr("class", `dot dot-${sceneType}-${status}`)
                    .attr("transform", d => `translate(${this.xScale(d.x)}, ${this.yScale(d.y)})`)
                    .each(function(d) {
                        const g = d3.select(this);
                        const size = 4;
                        // Horizontal line
                        g.append("line")
                            .attr("x1", -size)
                            .attr("x2", size)
                            .attr("y1", 0)
                            .attr("y2", 0)
                            .attr("stroke", color)
                            .attr("stroke-width", 2);
                        // Vertical line
                        g.append("line")
                            .attr("x1", 0)
                            .attr("x2", 0)
                            .attr("y1", -size)
                            .attr("y2", size)
                            .attr("stroke", color)
                            .attr("stroke-width", 2);
                    })
                    .on("mouseover", (event, d) => {
                        this.showTooltip(event, d);
                    })
                    .on("mouseout", () => {
                        d3.select(".tooltip").remove();
                    });
            }
        });
    }

    showTooltip(event, d) {
        // Create tooltip
        const tooltip = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("position", "absolute")
            .style("background", "rgba(0, 0, 0, 0.8)")
            .style("color", "white")
            .style("padding", "8px")
            .style("border-radius", "4px")
            .style("font-size", "12px")
            .style("pointer-events", "none")
            .style("opacity", 0);

        tooltip.transition().duration(200).style("opacity", 1);
        tooltip.html(`${d.sceneType.toUpperCase()} ${d.status.toUpperCase()}<br/>${d.time}: ${d.y.toFixed(3)}`)
            .style("left", (event.pageX + 10) + "px")
            .style("top", (event.pageY - 28) + "px");
    }

    toggleLine(sceneType, visible) {
        this.lineVisibility[sceneType] = visible;
        this.renderVisualization();
    }

    toggleTrainingStatus(status, visible) {
        this.statusVisibility[status] = visible;
        this.renderVisualization();
    }

}

// Remove the old initialization code since we'll handle it in index.js
