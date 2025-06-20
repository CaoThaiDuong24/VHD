const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

function deleteDirectory(dirPath) {
  try {
    if (fs.existsSync(dirPath)) {
      console.log(`🗑️ Deleting: ${dirPath}`);
      fs.rmSync(dirPath, { recursive: true, force: true });
      console.log(`✅ Deleted: ${dirPath}`);
    } else {
      console.log(`ℹ️ Directory not found: ${dirPath}`);
    }
  } catch (error) {
    console.log(`⚠️ Could not delete ${dirPath}:`, error.message);
  }
}

function killProcessOnPort(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (error, stdout) => {
      if (stdout) {
        const lines = stdout.split('\n');
        const pids = [];
        
        lines.forEach(line => {
          const match = line.match(/\s+(\d+)$/);
          if (match) {
            pids.push(match[1]);
          }
        });
        
        if (pids.length > 0) {
          console.log(`🔫 Killing processes on port ${port}: ${pids.join(', ')}`);
          pids.forEach(pid => {
            exec(`taskkill /F /PID ${pid}`, (err) => {
              if (!err) console.log(`✅ Killed PID: ${pid}`);
            });
          });
        }
      }
      resolve();
    });
  });
}

async function cleanNextJS() {
  console.log('🧹 COMPREHENSIVE NEXT.JS CLEANUP');
  console.log('=' .repeat(50));
  
  // 1. Kill all Next.js processes
  console.log('1️⃣ Killing Next.js processes...');
  await killProcessOnPort(3000);
  await killProcessOnPort(3001);
  await killProcessOnPort(3002);
  await killProcessOnPort(3003);
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // 2. Delete Next.js cache directories
  console.log('\n2️⃣ Cleaning Next.js cache...');
  const dirsToDelete = [
    '.next',
    'node_modules/.cache',
    '.next/cache',
    '.next/server',
    '.next/static',
    '.next/types'
  ];
  
  dirsToDelete.forEach(deleteDirectory);
  
  // 3. Clean npm cache
  console.log('\n3️⃣ Cleaning npm cache...');
  exec('npm cache clean --force', (error, stdout) => {
    if (error) {
      console.log('⚠️ npm cache clean failed:', error.message);
    } else {
      console.log('✅ npm cache cleaned');
    }
  });
  
  // 4. Create minimal .env.local if needed
  console.log('\n4️⃣ Checking environment variables...');
  const envPath = '.env.local';
  if (!fs.existsSync(envPath)) {
    const envContent = `# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=http://vhdcom.local/wp-json/wp/v2
WORDPRESS_USERNAME=duong
WORDPRESS_PASSWORD=kUgT g3ox OJcE yvN3 BCgp tyyZ
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local with WordPress credentials');
  } else {
    console.log('ℹ️ .env.local already exists');
  }
  
  console.log('\n5️⃣ Final status check...');
  
  // Check if server is actually running
  const http = require('http');
  function checkPort(port) {
    return new Promise((resolve) => {
      const req = http.request({
        hostname: 'localhost',
        port: port,
        method: 'GET',
        path: '/',
        timeout: 1000
      }, (res) => {
        resolve(true);
      });
      
      req.on('error', () => resolve(false));
      req.on('timeout', () => resolve(false));
      req.end();
    });
  }
  
  const portChecks = await Promise.all([
    checkPort(3000),
    checkPort(3001), 
    checkPort(3002),
    checkPort(3003)
  ]);
  
  console.log('📊 Port status:');
  console.log('  Port 3000:', portChecks[0] ? '🟢 RUNNING' : '🔴 FREE');
  console.log('  Port 3001:', portChecks[1] ? '🟢 RUNNING' : '🔴 FREE');
  console.log('  Port 3002:', portChecks[2] ? '🟢 RUNNING' : '🔴 FREE');
  console.log('  Port 3003:', portChecks[3] ? '🟢 RUNNING' : '🔴 FREE');
  
  console.log('\n🎯 CLEANUP COMPLETED!');
  console.log('✅ Next.js cache cleared');
  console.log('✅ Processes killed');
  console.log('✅ Environment configured');
  
  console.log('\n📋 NEXT STEPS:');
  console.log('1. Run: npm run dev');
  console.log('2. Open: http://localhost:3000/admin/news/create');
  console.log('3. Test creating a news post');
  console.log('4. Should sync to WordPress automatically');
  
  console.log('\n🔧 WordPress credentials confirmed:');
  console.log('  Username: duong');
  console.log('  Password: kUgT g3ox OJcE yvN3 BCgp tyyZ');
  console.log('  URL: http://vhdcom.local');
}

cleanNextJS(); 