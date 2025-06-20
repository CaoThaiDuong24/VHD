#!/usr/bin/env node

console.log('🚀 FINAL FIX - WordPress Sync Authentication\n');

async function finalFix() {
  console.log('🔍 Diagnosing WordPress sync issue...\n');
  
  // Step 1: Check server status
  console.log('1️⃣ Server Status Check...');
  try {
    const serverResponse = await fetch('http://localhost:3000');
    if (serverResponse.ok) {
      console.log('✅ Next.js server is running on port 3000');
    } else {
      console.log('❌ Next.js server issue');
      return;
    }
  } catch (error) {
    console.log('❌ Next.js server not running');
    console.log('🔧 Run: npm run dev');
    return;
  }

  // Step 2: Check WordPress
  console.log('\n2️⃣ WordPress Connection Check...');
  try {
    const wpResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1');
    if (wpResponse.ok) {
      console.log('✅ WordPress is accessible at vhdcom.local');
    } else {
      console.log('❌ WordPress connection failed');
      console.log('🔧 Make sure WordPress is running and accessible');
      return;
    }
  } catch (error) {
    console.log('❌ WordPress not accessible');
    console.log('🔧 Check if WordPress is running on vhdcom.local');
    return;
  }

  // Step 3: Test API without authentication
  console.log('\n3️⃣ API Health Check...');
  try {
    const healthResponse = await fetch('http://localhost:3000/api/sync/wordpress?action=health');
    const healthResult = await healthResponse.json();
    
    if (healthResult.success) {
      console.log('✅ WordPress sync API is healthy');
    } else {
      console.log('❌ WordPress sync API issue');
    }
  } catch (error) {
    console.log('❌ API health check failed');
  }

  // Step 4: Test authentication (will fail without App Password)
  console.log('\n4️⃣ Authentication Test...');
  try {
    const testResponse = await fetch('http://localhost:3000/api/sync/wordpress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'create',
        data: {
          title: 'Auth Test - ' + new Date().toLocaleString('vi-VN'),
          content: 'Testing authentication',
          status: 'published'
        }
      })
    });

    const testResult = await testResponse.json();
    
    if (testResult.success) {
      console.log('✅ Authentication working! WordPress post created');
      console.log(`📝 Post ID: ${testResult.wpId}`);
      console.log(`🔗 Edit: http://vhdcom.local/wp-admin/post.php?post=${testResult.wpId}&action=edit`);
      
      console.log('\n🎉 SYNC IS WORKING! You can now:');
      console.log('1. Go to: http://localhost:3000/admin/news/create');
      console.log('2. Create news articles');
      console.log('3. They will auto-sync to WordPress');
      
    } else {
      console.log('❌ Authentication failed (EXPECTED)');
      console.log(`Error: ${testResult.error}`);
      
      if (testResult.details && testResult.details.includes('xác thực')) {
        console.log('\n🔧 SOLUTION: Create WordPress Application Password');
        showApplicationPasswordInstructions();
      }
    }
    
  } catch (error) {
    console.log('❌ Authentication test failed');
    console.log(`Error: ${error.message}`);
  }
}

function showApplicationPasswordInstructions() {
  console.log('\n' + '='.repeat(60));
  console.log('📋 WORDPRESS APPLICATION PASSWORD SETUP:');
  console.log('='.repeat(60));
  
  console.log('\n🔗 Step 1: Go to WordPress Admin');
  console.log('   URL: http://vhdcom.local/wp-admin/');
  console.log('   Login with: admin / [your-admin-password]');
  
  console.log('\n👤 Step 2: Go to User Profile');
  console.log('   URL: http://vhdcom.local/wp-admin/profile.php');
  console.log('   Or: Users → Profile from menu');
  
  console.log('\n🔑 Step 3: Create Application Password');
  console.log('   1. Scroll down to "Application Passwords" section');
  console.log('   2. In "New Application Password Name" field, enter: Frontend Sync');
  console.log('   3. Click "Add New Application Password"');
  console.log('   4. COPY the generated password (format: xxxx xxxx xxxx xxxx)');
  console.log('   5. KEEP this password safe - you can\'t see it again!');
  
  console.log('\n⚙️ Step 4: Configure Frontend');
  console.log('   1. Go to: http://localhost:3000/admin/wordpress-settings');
  console.log('   2. Enable WordPress Sync: ✅');
  console.log('   3. Enable Auto Sync: ✅');
  console.log('   4. WordPress URL: http://vhdcom.local');
  console.log('   5. Username: admin');
  console.log('   6. Password: [PASTE the Application Password here]');
  console.log('   7. Click "Save Settings"');
  
  console.log('\n🧪 Step 5: Test Sync');
  console.log('   1. Go to: http://localhost:3000/admin/news/create');
  console.log('   2. Create a test news article');
  console.log('   3. Check browser console (F12) for sync logs');
  console.log('   4. Check WordPress admin: http://vhdcom.local/wp-admin/edit.php');
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 EXPECTED CONSOLE OUTPUT WHEN WORKING:');
  console.log('='.repeat(60));
  console.log('🔍 Sync Settings Check: {wpSyncEnabled: true, autoSyncEnabled: true}');
  console.log('🚀 Starting WordPress sync for news: [Article Title]');
  console.log('📡 API Response status: 200');
  console.log('✅ WordPress post created via API: {wpId: 123}');
  
  console.log('\n💡 Quick Enable Script (paste in browser console):');
  console.log(`
localStorage.setItem('wpSyncEnabled', 'true');
localStorage.setItem('autoSyncEnabled', 'true'); 
localStorage.setItem('wpUrl', 'http://vhdcom.local');
localStorage.setItem('wpUsername', 'admin');
console.log('✅ Settings enabled - now set password in UI');
location.reload();
  `);
}

// Run the final fix
finalFix().then(() => {
  console.log('\n🏁 Final Fix Complete!');
  console.log('📖 Full instructions: See FIX_WORDPRESS_SYNC_FINAL.md');
}).catch(console.error); 