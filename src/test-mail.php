<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require 'vendor/PHPMailer/src/Exception.php';
require 'vendor/PHPMailer/src/PHPMailer.php';
require 'vendor/PHPMailer/src/SMTP.php';

$config = require __DIR__ . '/php/config.php';

$mail = new PHPMailer(true);

try {
    $mail->SMTPDebug = SMTP::DEBUG_SERVER;
    $mail->isSMTP();
    $mail->Host       = 'mailcluster.loopia.se';
    $mail->SMTPAuth   = true;
    $mail->Username   = 'info@programiraj.rs';
    $mail->Password   = $config["password"];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port       = 587;
    $mail->CharSet    = 'UTF-8';

    $mail->setFrom('info@programiraj.rs', 'AS Test');
    $mail->addAddress('info@programiraj.rs');
    
    $mail->isHTML(true);
    $mail->Subject = 'Test Email from Docker';
    $mail->Body    = 'This is a test email sent from the Docker environment. If you see this, your email setup is working correctly!';
    $mail->AltBody = 'This is a test email sent from the Docker environment.';

    $mail->send();
    echo 'Message has been sent successfully!';
} catch (Exception $e) {
    echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
}