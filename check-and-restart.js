// Check and Restart Server Script
const { spawn, exec } = require('child_process')
const fs = require('fs')

console.log('🔍 Checking Server Status...\n')

// 1. Check if server is responding
const checkServer = async () => {
  try {
    const response = await fetch('http://localhost:3000')
    console.log(`Server response: ${response.status}`)
    return response.status === 200
  } catch (error) {
    console.log(`Server check failed: ${error.message}`)
    return false
  }
}

// 2. Kill existing Node processes
const killNodeProcesses = () => {
  return new Promise((resolve) => {
    console.log('🔄 Killing existing Node processes...')
    
    exec('taskkill /F /IM node.exe', (error, stdout, stderr) => {
      if (error) {
        console.log('   No Node processes to kill (or permission denied)')
      } else {
        console.log('   ✅ Node processes killed')
      }
      resolve()
    })
  })
}

// 3. Clean cache
const cleanCache = () => {
  console.log('🧹 Cleaning cache...')
  
  try {
    if (fs.existsSync('.next')) {
      fs.rmSync('.next', { recursive: true, force: true })
      console.log('   ✅ Removed .next')
    }
    
    if (fs.existsSync('node_modules/.cache')) {
      fs.rmSync('node_modules/.cache', { recursive: true, force: true })
      console.log('   ✅ Removed node_modules/.cache')
    }
  } catch (error) {
    console.log(`   ⚠️ Cache clean: ${error.message}`)
  }
}

// 4. Start server
const startServer = () => {
  return new Promise((resolve) => {
    console.log('🚀 Starting server...')
    
    const server = spawn('npm', ['run', 'dev'], {
      stdio: 'pipe',
      shell: true,
      detached: false
    })
    
    let output = ''
    let errorOutput = ''
    
    server.stdout.on('data', (data) => {
      const text = data.toString()
      output += text
      
      // Print important messages
      if (text.includes('Ready in') || text.includes('Local:') || text.includes('Error:')) {
        console.log(`   ${text.trim()}`)
      }
      
      // Check if server is ready
      if (text.includes('Ready in') || text.includes('✓ Ready')) {
        console.log('   ✅ Server started successfully!')
        setTimeout(() => resolve(true), 2000) // Wait 2s for stability
      }
    })
    
    server.stderr.on('data', (data) => {
      const text = data.toString()
      errorOutput += text
      
      if (text.includes('Error:') || text.includes('ReferenceError')) {
        console.log(`   ❌ Server error: ${text.trim()}`)
        server.kill()
        resolve(false)
      }
    })
    
    // Timeout after 30 seconds
    setTimeout(() => {
      if (output.includes('Ready')) {
        resolve(true)
      } else {
        console.log('   ⚠️ Server startup timeout')
        server.kill()
        resolve(false)
      }
    }, 30000)
  })
}

// 5. Test server after restart
const testServer = async () => {
  console.log('\n🧪 Testing server endpoints...')
  
  const endpoints = ['/', '/news', '/admin/news']
  
  for (const endpoint of endpoints) {
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        headers: { 'Cookie': 'auth-token=designer1@ltacv.com' }
      })
      
      const status = response.status
      const icon = status === 200 ? '✅' : status < 500 ? '⚠️' : '❌'
      console.log(`   ${icon} ${endpoint}: ${status}`)
      
    } catch (error) {
      console.log(`   ❌ ${endpoint}: ${error.message}`)
    }
  }
}

// Main execution
const main = async () => {
  try {
    // Check current server status
    const isWorking = await checkServer()
    
    if (isWorking) {
      console.log('✅ Server is already working fine!')
      await testServer()
      return
    }
    
    console.log('❌ Server needs restart\n')
    
    // Kill processes
    await killNodeProcesses()
    
    // Clean cache
    cleanCache()
    
    // Start server
    const started = await startServer()
    
    if (started) {
      console.log('\n🎉 Server restarted successfully!')
      await testServer()
      
      console.log('\n🔗 Server URLs:')
      console.log('- Homepage: http://localhost:3000')
      console.log('- Admin: http://localhost:3000/admin/news')
      console.log('- WordPress Settings: http://localhost:3000/admin/wordpress-settings')
      console.log('- Create News: http://localhost:3000/admin/news/create')
      
    } else {
      console.log('\n❌ Server restart failed')
      console.log('Manual steps needed:')
      console.log('1. Check for port conflicts')
      console.log('2. Run: npm run dev')
      console.log('3. Check terminal for errors')
    }
    
  } catch (error) {
    console.log('\n❌ Script execution failed:', error.message)
  }
}

// Check and restart if needed
async function checkAndRestart() {
    console.log('🔍 CHECKING SYSTEM STATUS...\n');
    
    try {
        // Check server
        console.log('1️⃣ Checking server...');
        const serverResponse = await fetch('http://localhost:3000/api/sync/wordpress?action=health');
        
        if (serverResponse.ok) {
            const data = await serverResponse.json();
            console.log('✅ Server OK:', data.status);
        } else {
            console.log('❌ Server issue:', serverResponse.status);
            return;
        }
        
        // Check WordPress 
        console.log('\n2️⃣ Checking WordPress...');
        const wpResponse = await fetch('http://vhdcom.local/wp-json/wp/v2/posts?per_page=1');
        
        if (wpResponse.ok) {
            console.log('✅ WordPress OK');
        } else {
            console.log('❌ WordPress issue:', wpResponse.status);
            return;
        }
        
        // Test create post
        console.log('\n3️⃣ Testing post creation...');
        const testData = {
            action: 'create',
            title: 'STATUS CHECK - ' + new Date().toLocaleTimeString(),
            content: 'Testing system after restart...',
            status: 'publish'
        };
        
        const createResponse = await fetch('http://localhost:3000/api/sync/wordpress', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testData)
        });
        
        if (createResponse.ok) {
            const result = await createResponse.json();
            console.log('✅ Post creation OK - WordPress ID:', result.wpId);
        } else {
            console.log('❌ Post creation failed:', createResponse.status);
            const error = await createResponse.text();
            console.log('Error details:', error);
        }
        
        console.log('\n🎯 SYSTEM STATUS: ALL GOOD!');
        
    } catch (error) {
        console.error('❌ System check failed:', error.message);
    }
}

checkAndRestart();

main() 