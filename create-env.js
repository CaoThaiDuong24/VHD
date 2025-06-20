const fs = require('fs');

const envContent = `# WordPress Configuration
NEXT_PUBLIC_WORDPRESS_API_URL=http://vhdcom.local/wp-json/wp/v2
WORDPRESS_USERNAME=duong
WORDPRESS_PASSWORD=kUgT g3ox OJcE yvN3 BCgp tyyZ
`;

fs.writeFileSync('.env.local', envContent);
console.log('✅ Created .env.local file with WordPress credentials');
console.log('📋 Environment variables:');
console.log('  NEXT_PUBLIC_WORDPRESS_API_URL=http://vhdcom.local/wp-json/wp/v2');
console.log('  WORDPRESS_USERNAME=duong');
console.log('  WORDPRESS_PASSWORD=kUgT g3ox OJcE yvN3 BCgp tyyZ'); 