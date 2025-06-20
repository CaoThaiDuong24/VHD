const https = require('https');
const http = require('http');

async function checkWordPressPosts() {
    console.log('🔍 Checking latest WordPress posts...');
    
    try {
        const response = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=10&orderby=date&order=desc', {
            headers: {
                'User-Agent': 'Frontend-Sync-Checker'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const posts = await response.json();
        
        console.log(`\n📊 Found ${posts.length} posts on WordPress:`);
        console.log('================================');
        
        posts.forEach((post, index) => {
            console.log(`${index + 1}. ID: ${post.id}`);
            console.log(`   Title: ${post.title.rendered}`);
            console.log(`   Status: ${post.status}`);
            console.log(`   Date: ${post.date}`);
            console.log(`   Link: ${post.link}`);
            console.log('   ---');
        });
        
        // Kiểm tra các post ID gần đây
        const recentIds = posts.map(p => p.id);
        console.log(`\n🆔 Recent Post IDs: ${recentIds.join(', ')}`);
        
        // Kiểm tra xem có post 22, 23 không
        const hasPost22 = posts.some(p => p.id === 22);
        const hasPost23 = posts.some(p => p.id === 23);
        
        console.log(`\n✅ Post 22 exists: ${hasPost22}`);
        console.log(`✅ Post 23 exists: ${hasPost23}`);
        
        if (posts.length === 0) {
            console.log('❌ No posts found on WordPress!');
        }
        
    } catch (error) {
        console.error('❌ Error checking WordPress posts:', error.message);
    }
}

checkWordPressPosts(); 