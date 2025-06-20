// Simple script to check latest WordPress posts status
async function checkLatestPosts() {
    console.log('🔍 Checking latest WordPress posts status...\n');
    
    try {
        // Check public posts
        console.log('1️⃣ Public Posts (Published):');
        console.log('='.repeat(40));
        
        const publicResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=5&orderby=date&order=desc');
        if (publicResponse.ok) {
            const publicPosts = await publicResponse.json();
            console.log(`Found ${publicPosts.length} public posts:`);
            publicPosts.forEach((post, i) => {
                console.log(`   ${i+1}. ID: ${post.id} | ${post.title.rendered} | Status: ${post.status}`);
            });
        } else {
            console.log('❌ Failed to fetch public posts');
        }
        
        // Check all posts with authentication
        console.log('\n2️⃣ All Posts (Including Drafts):');
        console.log('='.repeat(40));
        
        const authString = Buffer.from('duong:kUgT g3ox OJcE yvN3 BCgp tyyZ').toString('base64');
        const allResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=5&orderby=date&order=desc&status=any', {
            headers: {
                'Authorization': `Basic ${authString}`
            }
        });
        
        if (allResponse.ok) {
            const allPosts = await allResponse.json();
            console.log(`Found ${allPosts.length} total posts:`);
            allPosts.forEach((post, i) => {
                const statusEmoji = post.status === 'publish' ? '✅' : '📝';
                console.log(`   ${statusEmoji} ${i+1}. ID: ${post.id} | ${post.title.rendered} | Status: ${post.status}`);
                
                // Highlight recent posts
                if ([27, 26, 25, 24, 23, 22].includes(post.id)) {
                    console.log(`       🎯 RECENT POST - Status: ${post.status.toUpperCase()}`);
                }
            });
        } else {
            console.log('❌ Failed to fetch all posts');
        }
        
        console.log('\n🎯 STATUS CHECK:');
        console.log('✅ = PUBLISHED (visible to public)');
        console.log('📝 = DRAFT (hidden from public)');
        
        if (allResponse.ok) {
            const allPosts = await allResponse.json();
            const publishedCount = allPosts.filter(p => p.status === 'publish').length;
            const draftCount = allPosts.filter(p => p.status === 'draft').length;
            
            console.log(`\n📊 Summary: ${publishedCount} Published, ${draftCount} Draft`);
            
            if (publishedCount > 2) {
                console.log('🎉 SUCCESS: New posts are being published!');
            } else {
                console.log('❌ ISSUE: Posts are still being created as drafts');
            }
        }
        
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

checkLatestPosts(); 