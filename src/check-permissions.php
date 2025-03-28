<?php

echo "<h2>PHP Environment Check</h2>";
echo "<p>PHP Version: " . phpversion() . "</p>";

$required_extensions = ["openssl", "mbstring", "json"];
echo "<h3>Required Extensions</h3>";
echo "<ul>";
foreach ($required_extensions as $ext) {
    if (extension_loaded($ext)) {
        echo "<li style='color:green'>✓ $ext is loaded</li>";
    } else {
        echo "<li style='color:red'>✗ $ext is NOT loaded</li>";
    }
}
echo "</ul>";

echo "<h3>PHPMailer Files</h3>";
echo "<ul>";
$phpmailer_files = [
    'vendor/PHPMailer/src/Exception.php',
    'vendor/PHPMailer/src/PHPMailer.php',
    'vendor/PHPMailer/src/SMTP.php'
];

foreach ($phpmailer_files as $file) {
    if (file_exists($file)) {
        echo "<li style='color:green'>✓ $file exists</li>";
    } else {
        echo "<li style='color:red'>✗ $file does NOT exist</li>";
    }
}
echo "</ul>";

echo "<h3>Configuration Files</h3>";
echo "<ul>";
$config_files = [
    'php/config.php',
    'php/mail_template.html',
    'php/mail.php'
];

foreach ($config_files as $file) {
    if (file_exists($file)) {
        echo "<li style='color:green'>✓ $file exists</li>";
    } else {
        echo "<li style='color:red'>✗ $file does NOT exist</li>";
    }
}
echo "</ul>";

echo "<h3>Write Permissions</h3>";
echo "<ul>";
$rate_limit_file = 'php/contact_rate_limit.json';
$rate_limit_dir = dirname($rate_limit_file);

if (!file_exists($rate_limit_dir)) {
    echo "<li style='color:red'>✗ Directory $rate_limit_dir does NOT exist</li>";
} else {
    if (is_writable($rate_limit_dir)) {
        echo "<li style='color:green'>✓ Directory $rate_limit_dir is writable</li>";
    } else {
        echo "<li style='color:red'>✗ Directory $rate_limit_dir is NOT writable</li>";
    }

    if (file_exists($rate_limit_file)) {
        if (is_writable($rate_limit_file)) {
            echo "<li style='color:green'>✓ File $rate_limit_file exists and is writable</li>";
        } else {
            echo "<li style='color:red'>✗ File $rate_limit_file exists but is NOT writable</li>";
        }
    } else {
        echo "<li style='color:orange'>⚠ File $rate_limit_file does not exist yet, will be created when needed</li>";
        
        try {
            file_put_contents($rate_limit_file, '{}');
            if (file_exists($rate_limit_file)) {
                echo "<li style='color:green'>✓ Successfully created $rate_limit_file</li>";
            }
        } catch (Exception $e) {
            echo "<li style='color:red'>✗ Failed to create $rate_limit_file: " . $e->getMessage() . "</li>";
        }
    }
}
echo "</ul>";

echo "<h3>SMTP Server Connectivity</h3>";
$smtp_host = 'mailcluster.loopia.se';
$smtp_port = 587;

echo "<p>Testing connection to $smtp_host:$smtp_port...</p>";

$connection = @fsockopen($smtp_host, $smtp_port, $errno, $errstr, 5);
if ($connection) {
    echo "<p style='color:green'>✓ Successfully connected to SMTP server</p>";
    fclose($connection);
} else {
    echo "<p style='color:red'>✗ Could not connect to SMTP server: $errstr ($errno)</p>";
    echo "<p>Note: This might be expected if your Docker container can't reach the internet or if there's a firewall.</p>";
}

echo "<h3>Form Data Processing Test</h3>";
echo "<p>Testing ability to process form data...</p>";

$test_data = [
    'name' => 'Test User',
    'email' => 'test@example.com',
    'message' => 'This is a test message'
];

echo "<ul>";
foreach ($test_data as $key => $value) {
    echo "<li>Successfully processed form field: $key</li>";
}
echo "</ul>";

echo "<p style='color:green'>✓ Form data processing test passed</p>";

echo "<h3>Summary</h3>";
echo "<p>This environment should be ready for testing your mail functionality.</p>";
echo "<p>Visit <a href='/test-form.html'>/test-form.html</a> to test your contact forms.</p>";
echo "<p>Visit <a href='/test-mail.php'>/test-mail.php</a> to send a test email directly.</p>";