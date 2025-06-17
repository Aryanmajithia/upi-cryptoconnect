#!/bin/bash

# Custom build script to fix gOPD module issue
echo "Starting custom build process..."

# Clean install
rm -rf node_modules package-lock.json
npm install

# Fix gOPD module issue if it exists
if [ -f "node_modules/gopd/index.js" ]; then
    echo "Fixing gOPD module..."
    # Create the missing gOPD.js file
    cat > node_modules/gopd/gOPD.js << 'EOF'
'use strict';

var GetIntrinsic = require('get-intrinsic');

var $gOPD = GetIntrinsic('%Object.getOwnPropertyDescriptor%', true);
if ($gOPD) {
	try {
		$gOPD([], 'length');
	} catch (e) {
		// IE 8 has a broken gOPD
		$gOPD = null;
	}
}

module.exports = $gOPD;
EOF
    echo "gOPD module fixed!"
fi

echo "Build completed successfully!" 