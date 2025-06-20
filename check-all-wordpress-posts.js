async function checkAllWordPressPosts() {
    console.log('🔍 Checking ALL WordPress posts (including drafts)...\n');
    
    try {
        // Kiểm tra tất cả posts với status bất kỳ
        const allStatuses = ['publish', 'draft', 'private', 'pending', 'future'];
        
        for (const status of allStatuses) {
            console.log(`\n📋 Checking posts with status: ${status.toUpperCase()}`);
            console.log('='.repeat(50));
            
            try {
                const response = await fetch(`http://vhdcom.local/wp-json/wp/v2/posts?status=${status}&per_page=20&orderby=date&order=desc`, {
                    headers: {
                        'User-Agent': 'Frontend-Sync-Checker'
                    }
                });
                
                if (!response.ok) {
                    console.log(`❌ HTTP ${response.status}: ${response.statusText}`);
                    continue;
                }
                
                const posts = await response.json();
                
                if (posts.length === 0) {
                    console.log(`   No posts with status: ${status}`);
                } else {
                    console.log(`   Found ${posts.length} posts with status: ${status}`);
                    
                    posts.forEach((post, index) => {
                        console.log(`   ${index + 1}. ID: ${post.id} | "${post.title.rendered}" | ${post.date}`);
                    });
                }
                
            } catch (error) {
                console.log(`❌ Error checking ${status} posts:`, error.message);
            }
        }
        
        // Kiểm tra với authentication để xem draft posts
        console.log('\n🔐 Checking with authentication for draft posts...');
        console.log('='.repeat(50));
        
        try {
            const authString = Buffer.from('duong:kUgT g3ox OJcE yvN3 BCgp tyyZ').toString('base64');
            
            const authResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?status=draft&per_page=20&orderby=date&order=desc', {
                headers: {
                    'Authorization': `Basic ${authString}`,
                    'User-Agent': 'Frontend-Sync-Checker'
                }
            });
            
            if (authResponse.ok) {
                const draftPosts = await authResponse.json();
                console.log(`✅ Found ${draftPosts.length} draft posts with authentication:`);
                
                draftPosts.forEach((post, index) => {
                    console.log(`   ${index + 1}. ID: ${post.id} | "${post.title.rendered}" | ${post.date}`);
                    
                    // Kiểm tra xem có posts 22, 23 không
                    if ([22, 23].includes(post.id)) {
                        console.log(`   🎯 FOUND TARGET POST ${post.id}!`);
                    }
                });
            } else {
                console.log(`❌ Auth failed: ${authResponse.status}`);
            }
            
        } catch (error) {
            console.log('❌ Error with authenticated request:', error.message);
        }
        
        // Kiểm tra các post ID cụ thể
        console.log('\n🎯 Checking specific post IDs...');
        console.log('='.repeat(50));
        
        const targetIds = [22, 23, 20, 21];
        
        for (const id of targetIds) {
            try {
                const response = await fetch(`http://vhdcom.local/wp-json/wp/v2/posts/${id}`, {
                    headers: {
                        'User-Agent': 'Frontend-Sync-Checker'
                    }
                });
                
                if (response.ok) {
                    const post = await response.json();
                    console.log(`✅ Post ${id}: "${post.title.rendered}" | Status: ${post.status} | Date: ${post.date}`);
                } else {
                    console.log(`❌ Post ${id}: HTTP ${response.status} - ${response.statusText}`);
                }
                
            } catch (error) {
                console.log(`❌ Post ${id}: Error - ${error.message}`);
            }
        }
        
    } catch (error) {
        console.error('❌ Main error:', error.message);
    }
    
    console.log('\n🔍 SUMMARY:');
    console.log('- If posts 22, 23 show "404 Not Found" = They were deleted or never created');
    console.log('- If posts 22, 23 are found with status "draft" = They exist but hidden from public');
    console.log('- Check WordPress admin: http://vhdcom.local/wp-admin/edit.php?post_status=draft');
}

checkAllWordPressPosts(); 