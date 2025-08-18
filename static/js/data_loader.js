// Data loader for NWM fine-tuning experiment results
class DataLoader {
    constructor() {
        this.data = null;
        this.quantiData = null;
        //this.loadData();
        this.loadQuantiData();
    }

    async loadData() {
        try {
            // Try to load from external JSON file first
            // If you include the JSON data in your HTML (e.g., via a <script type="application/json"> tag),
            // you can access it here. Example:
            // <script id="results-json" type="application/json" src="static/data/results.json"></script>
            // However, 'src' is not supported for <script type="application/json">, so you must inline the JSON:
            // <script id="results-json" type="application/json">
            //   { ... your JSON data ... }
            // </script>
            // Then in JS:
            const jsonScript = document.getElementById('results-json');
            let response = { ok: false };
            if (jsonScript) {
                try {
                    this.data = JSON.parse(jsonScript.textContent);
                    response.ok = true;
                } catch (e) {
                    response.ok = false;
                }
            }
            // If not found, fallback to fetch:
            if (!response.ok) {
                response = await fetch('static/data/results.json');
            }
            if (response.ok) {
                this.data = await response.json();
            } else {
                // Fallback to hardcoded data
                this.data = this.getDefaultData();
            }
        } catch (error) {
            console.log('Loading default data due to:', error.message);
            this.data = this.getDefaultData();
        }
        
        // Trigger data loaded event
        document.dispatchEvent(new CustomEvent('dataLoaded', { detail: this.data }));
    }

    async loadQuantiData() {
        try {
            // Load quantitative comparison data
            const files = [
                'sekaibt_same_merged.json',
                'sekaibt_half_merged.json', 
                'sekaibt_unknown_merged.json',
                'sekaift_same_merged.json',
                'sekaift_half_merged.json',
                'sekaift_unknown_merged.json'
            ];
            
            const quantiData = {};
            
            // Try to load from quanti data folder
            for (const file of files) {
                try {

                    // <script id="results-json" type="application/json">
                    //   { ... your JSON data ... }
                    // </script>
                    // Then in JS:
                    const jsonScript = document.getElementById('data-' + file.replace('.json', ''));
                    let response = { ok: false };
                    if (jsonScript) {
                        try {
                            quantiData[file] = JSON.parse(jsonScript.textContent);
                            response.ok = true;
                        } catch (e) {
                            response.ok = false;
                        }
                    }
                    // If not found, fallback to fetch:
                if (!response.ok) {
                    response = await fetch('static/data/' + file);
                    if (response.ok) {
                        quantiData[file] = await response.json();
                    }
                    }       
                
                } catch (e) {
                    console.warn(`Failed to load ${file}, generating mock data. Error:`, e);
                    quantiData[file] = this.generateMockQuantiData(file);
                }
            }
            
            this.quantiData = quantiData;
            
        } catch (error) {
            console.log('Loading mock quanti data due to:', error.message);
            this.quantiData = this.getDefaultQuantiData();
        }
        
        // Trigger quanti data loaded event
        document.dispatchEvent(new CustomEvent('quantiDataLoaded', { detail: this.quantiData }));
    }

    generateMockQuantiData(filename) {
        // Generate mock data based on filename
        const timePoints = ['1s', '2s', '4s', '6s', '8s'];
        const categories = ['time', 'rollout_1fps', 'rollout_4fps'];
        const metrics = ['dreamsim', 'lpips', 'fid'];
        
        const data = {};
        
        // Extract scene type and training status from filename
        const isAfter = filename.includes('ft');
        const sceneType = filename.includes('same') ? 'same' : 
                         filename.includes('half') ? 'half' : 'unknown';
        
        categories.forEach(category => {
            metrics.forEach(metric => {
                timePoints.forEach(time => {
                    const key = `sekai_${category}_${metric}_${time}`;
                    // Generate realistic values based on metric type
                    let baseValue;
                    if (metric === 'fid') {
                        baseValue = Math.random() * 50 + 20; // FID: 20-70
                    } else {
                        baseValue = Math.random() * 0.3 + 0.1; // LPIPS/DreamSim: 0.1-0.4
                    }
                    
                    // Add variation based on scene type and training status
                    if (isAfter) baseValue *= 0.8; // Better performance after fine-tuning
                    if (sceneType === 'unknown') baseValue *= 1.2; // Worse for unknown scenes
                    
                    data[key] = baseValue;
                });
            });
        });
        
        return data;
    }

    getDefaultQuantiData() {
        const files = [
            'sekaibt_same_merged.json',
            'sekaibt_half_merged.json', 
            'sekaibt_unknown_merged.json',
            'sekaift_same_merged.json',
            'sekaift_half_merged.json',
            'sekaift_unknown_merged.json'
        ];
        
        const data = {};
        files.forEach(file => {
            data[file] = this.generateMockQuantiData(file);
        });
        
        return data;
    }

    getDefaultData() {
        return {
            metrics: {
                lpips: [
                    { method: 'Baseline NWM', familiar: 0.245, half_familiar: 0.312, unfamiliar: 0.398 },
                    { method: 'Fine-tuned NWM', familiar: 0.189, half_familiar: 0.267, unfamiliar: 0.356 },
                    { method: 'Our Method', familiar: 0.156, half_familiar: 0.221, unfamiliar: 0.298 }
                ],
                dreamsim: [
                    { method: 'Baseline NWM', familiar: 0.267, half_familiar: 0.334, unfamiliar: 0.421 },
                    { method: 'Fine-tuned NWM', familiar: 0.198, half_familiar: 0.289, unfamiliar: 0.378 },
                    { method: 'Our Method', familiar: 0.167, half_familiar: 0.243, unfamiliar: 0.321 }
                ],
                fid: [
                    { method: 'Baseline NWM', familiar: 45.2, half_familiar: 67.8, unfamiliar: 89.4 },
                    { method: 'Fine-tuned NWM', familiar: 32.1, half_familiar: 48.6, unfamiliar: 72.3 },
                    { method: 'Our Method', familiar: 24.8, half_familiar: 36.2, unfamiliar: 58.7 }
                ]
            },
            table_data: [
                // ... existing table data ...
            ]
        };
    }

    getData() {
        return this.data;
    }

    getQuantiData() {
        return this.quantiData;
    }

    getMetricData(metric) {
        return this.data?.metrics[metric] || [];
    }

    getTableData() {
        return this.data?.table_data || [];
    }

    // Extract data for quantitative visualization
    extractQuantiMetric(data, category, metric, timePoint) {
        const key = `sekai_${category}_${metric}_${timePoint}`;
        return data[key] || null;
    }

    getQuantiVisualizationData(metric, category = 'time') {
        if (!this.quantiData) return null;
        
        const timePoints = ['1s', '2s', '4s', '6s', '8s'];
        const result = {
            same: { before: [], after: [] },
            half: { before: [], after: [] },
            unknown: { before: [], after: [] }
        };
        
        // Extract data for each scene type and training status
        timePoints.forEach(time => {
            // Same (familiar) scenes
            const sameBefore = this.extractQuantiMetric(
                this.quantiData['sekaibt_same_merged.json'] || {}, 
                category, metric, time
            );
            const sameAfter = this.extractQuantiMetric(
                this.quantiData['sekaift_same_merged.json'] || {}, 
                category, metric, time
            );
            
            // Half-familiar scenes
            const halfBefore = this.extractQuantiMetric(
                this.quantiData['sekaibt_half_merged.json'] || {}, 
                category, metric, time
            );
            const halfAfter = this.extractQuantiMetric(
                this.quantiData['sekaift_half_merged.json'] || {}, 
                category, metric, time
            );
            
            // Unknown scenes
            const unknownBefore = this.extractQuantiMetric(
                this.quantiData['sekaibt_unknown_merged.json'] || {}, 
                category, metric, time
            );
            const unknownAfter = this.extractQuantiMetric(
                this.quantiData['sekaift_unknown_merged.json'] || {}, 
                category, metric, time
            );
            
            result.same.before.push(sameBefore);
            result.same.after.push(sameAfter);
            result.half.before.push(halfBefore);
            result.half.after.push(halfAfter);
            result.unknown.before.push(unknownBefore);
            result.unknown.after.push(unknownAfter);
        });
        
        return result;
    }
}

// Global data loader instance
window.dataLoader = new DataLoader();
