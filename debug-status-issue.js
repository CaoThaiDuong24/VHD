// Debug script để tìm lỗi status issue
async function debugStatusIssue() {
    console.log('🔍 DEBUG: WordPress Status Issue');
    console.log('==================================\n');
    
    const testData = {
        title: 'DEBUG STATUS TEST - ' + new Date().toLocaleTimeString(),
        content: 'Testing status issue - should be PUBLISH not DRAFT',
        excerpt: 'Debug status test',
        status: 'publish' // Explicitly set to publish
    };
    
    console.log('📋 Test data being sent:');
    console.log(JSON.stringify(testData, null, 2));
    console.log('');
    
    try {
        console.log('📡 Sending POST request...');
        const response = await fetch('http://localhost:3000/api/sync/wordpress', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action: 'create',
                data: testData
            })
        });
        
        const result = await response.json();
        
        console.log('📊 Response status:', response.status);
        console.log('📊 Response data:');
        console.log(JSON.stringify(result, null, 2));
        
        if (result.success && result.data?.wpId) {
            const wpId = result.data.wpId;
            console.log('\n🎯 Created WordPress post ID:', wpId);
            
            // Wait a moment then check the post status directly
            console.log('\n⏳ Waiting 2 seconds then checking post status...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            try {
                // Check with authentication
                const authString = Buffer.from('duong:kUgT g3ox OJcE yvN3 BCgp tyyZ').toString('base64');
                
                const checkResponse = await fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${wpId}`, {
                    headers: {
                        'Authorization': `Basic ${authString}`,
                        'User-Agent': 'Status-Debug-Checker'
                    }
                });
                
                if (checkResponse.ok) {
                    const postData = await checkResponse.json();
                    console.log(`\n✅ Post ${wpId} details:`);
                    console.log(`   - Title: ${postData.title.rendered}`);
                    console.log(`   - Status: ${postData.status}`);
                    console.log(`   - Date: ${postData.date}`);
                    console.log(`   - Link: ${postData.link}`);
                    
                    if (postData.status === 'publish') {
                        console.log('\n🎉 SUCCESS: Post is PUBLISHED!');
                    } else {
                        console.log('\n❌ PROBLEM: Post status is still DRAFT!');
                        console.log('   This means the fix is not working yet.');
                    }
                } else {
                    console.log(`\n❌ Error checking post: ${checkResponse.status}`);
                }
                
            } catch (error) {
                console.log('\n❌ Error checking post status:', error.message);
            }
        } else {
            console.log('\n❌ Failed to create post or no wpId returned');
        }
        
    } catch (error) {
        console.log('❌ Request error:', error.message);
    }
    
    console.log('\n🔧 TROUBLESHOOTING:');
    console.log('1. If post is still DRAFT → Need to restart Next.js server');
    console.log('2. If post is PUBLISH → Fix is working!');
    console.log('3. If creation fails → Check server logs');
}

debugStatusIssue(); 