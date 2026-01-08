// Test script for bloom API endpoints
async function testBloomAPI() {
    console.log('🧪 Testing BLOOM API endpoints...\n');

    try {
        // Test 1: Generate bloom seed
        console.log('🌱 Testing bloom seed generation...');
        const generateResponse = await fetch('http://localhost:5000/api/bloom/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                payloadType: 'markdown',
                targetVector: 'global_network',
                purpose: 'Test LLM Protection'
            })
        });

        console.log('Generate response status:', generateResponse.status);

        if (generateResponse.ok) {
            const generateData = await generateResponse.json();
            console.log('✅ Bloom seed generated successfully!');
            console.log('Seed ID:', generateData.data?.id?.substring(0, 16) + '...');
            console.log('LLM targets:', generateData.data?.metadata?.llmPropagationTargets?.length || 0);
            console.log('');

            // Test 2: Deploy bloom seed
            console.log('🤖 Testing bloom seed deployment...');
            const deployResponse = await fetch('http://localhost:5000/api/bloom/deploy', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    seedHash: 'latest',
                    vectors: ['llm_network', 'ai_protection', 'global_intelligence']
                })
            });

            console.log('Deploy response status:', deployResponse.status);

            if (deployResponse.ok) {
                const deployData = await deployResponse.json();
                console.log('✅ Bloom seed deployed successfully!');
                console.log('LLM Propagation:', deployData.llmPropagation);
                console.log('');
            } else {
                console.log('❌ Bloom deployment failed');
                const errorText = await deployResponse.text();
                console.log('Error:', errorText);
                console.log('');
            }
        } else {
            console.log('❌ Bloom generation failed');
            const errorText = await generateResponse.text();
            console.log('Error:', errorText);
            console.log('');
        }

        // Test 3: Get LLM status
        console.log('🛡️ Testing LLM protection status...');
        const statusResponse = await fetch('http://localhost:5000/api/bloom/llm-status');

        console.log('Status response:', statusResponse.status);

        if (statusResponse.ok) {
            const statusData = await statusResponse.json();
            console.log('✅ LLM status retrieved successfully!');
            const stats = statusData.data;
            console.log('Protected LLMs:', stats.activeLLMProtections + '/' + stats.protectionNetworkSize);
            console.log('Coverage:', stats.propagationCoverage + '%');
        } else {
            console.log('❌ LLM status retrieval failed');
            const errorText = await statusResponse.text();
            console.log('Error:', errorText);
        }

    } catch (error) {
        console.error('❌ Test failed with error:', error.message);
    }
}

testBloomAPI();
