// CHECK SERVER STATUS - Quick Check
console.log('🔍 CHECKING SERVER STATUS...\n')

const checkServerStatus = async () => {
  const ports = [3000, 3001, 3002, 3003]
  
  console.log('📡 Testing ports...')
  
  for (const port of ports) {
    try {
      const response = await fetch(`http://localhost:${port}`, {
        method: 'GET',
        timeout: 3000
      })
      
      if (response.ok) {
        console.log(`✅ Port ${port}: WORKING`)
        console.log(`🔗 URL: http://localhost:${port}`)
        
        // Test API endpoint
        try {
          const apiResponse = await fetch(`http://localhost:${port}/api/sync/wordpress/?action=health`)
          if (apiResponse.ok) {
            console.log(`   📡 API endpoint: WORKING`)
          } else {
            console.log(`   ❌ API endpoint: FAILED (${apiResponse.status})`)
          }
        } catch (e) {
          console.log(`   ❌ API endpoint: ERROR`)
        }
        
        console.log('')
      } else {
        console.log(`❌ Port ${port}: FAILED (${response.status})`)
      }
    } catch (error) {
      console.log(`❌ Port ${port}: NOT ACCESSIBLE`)
    }
  }
  
  console.log('\n🎯 RECOMMENDED ACTIONS:')
  console.log('1. Use the working port URL above')
  console.log('2. If no ports working, restart: npm run dev')
  console.log('3. Run fix-all-errors.js script for comprehensive fix')
  console.log('4. Test WordPress sync after fixing')
}

checkServerStatus().catch(console.error) 