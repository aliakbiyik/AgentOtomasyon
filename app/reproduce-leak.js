const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function reproduce() {
    console.log('🧪 Reproducing Order Leakage...');

    // 1. Create a dummy admin & customer session simulation
    // We don't need to actually login, just fake the cookies as the API expects
    // Admin cookie is just value='authenticated'
    // Customer cookie needs to be a valid JSON string of a user user structure

    const fakeCustomer = JSON.stringify({ id: 99999, email: 'fake@test.com', name: 'Fake' });

    const headers = {
        'Cookie': `admin_session=authenticated; customer_session=${encodeURIComponent(fakeCustomer)}`
    };

    try {
        // Now testing WITH the fix
        console.log('   Testing with ?scope=me...');
        const res = await axios.get(`${BASE_URL}/orders?scope=me`, { headers });
        console.log(`   Received ${res.data.length} orders`);

        if (res.data.length > 0) {
            // Check if we got orders NOT belonging to user 99999
            const leaked = res.data.filter(o => o.customerId !== 99999);
            if (leaked.length > 0) {
                console.log('❌ BUG REPRODUCED: Found orders not belonging to current customer!');
                console.log(`   User ID: 99999`);
                console.log(`   Leaked Order ID: ${leaked[0].id}, Customer ID: ${leaked[0].customerId}`);
            } else {
                console.log('✅ No leakage (but maybe no other orders exist in DB?)');
            }
        } else {
            console.log('⚠️ No orders found to check against.');
        }

    } catch (e) {
        console.error('Request failed', e.message);
    }
}

reproduce();
