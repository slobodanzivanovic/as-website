<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

require '../vendor/PHPMailer/src/Exception.php';
require '../vendor/PHPMailer/src/PHPMailer.php';
require '../vendor/PHPMailer/src/SMTP.php';

class ContactFormHandler {
    private $config;
    private $maxSubmissionsPerHour = 1;
    private $rateLimitFile = 'contact_rate_limit.json';
    private $userEmailTemplate;
    private $adminEmailTemplate;

    public function __construct() {
        $this->config = require __DIR__ . '/config.php';
        $this->userEmailTemplate = file_get_contents(__DIR__ . '/user-email-template.html');
        $this->adminEmailTemplate = file_get_contents(__DIR__ . '/admin-email-template.html');
    }

    private function checkRateLimit($ip) {
        $now = time();
        $limits = file_exists($this->rateLimitFile) 
            ? json_decode(file_get_contents($this->rateLimitFile), true) 
            : [];
    
        $limits[$ip] = array_filter($limits[$ip] ?? [], fn($time) => $now - $time < 3600);
    
        if (count($limits[$ip] ?? []) >= $this->maxSubmissionsPerHour) {
            return false;
        }
    
        $limits[$ip][] = $now;
        file_put_contents($this->rateLimitFile, json_encode($limits));
        return true;
    }

    private function validateInput($input, $isHeroForm = false) {
        if ($isHeroForm) {
            $name = trim($input['name'] ?? '');
            $email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
            $phone = trim($input['phone'] ?? '');
            $topic = trim($input['topic'] ?? '');
            $message = trim($input['message'] ?? '');

            if (empty($name) || !$email || empty($phone) || strlen($message) > 1000) {
                return false;
            }

            return [
                'name' => htmlspecialchars($name),
                'email' => $email,
                'phone' => htmlspecialchars($phone),
                'topic' => htmlspecialchars($topic),
                'message' => htmlspecialchars($message),
                'form_type' => 'hero'
            ];
        } else {
            $name = trim($input['name'] ?? '');
            $email = filter_var(trim($input['email'] ?? ''), FILTER_VALIDATE_EMAIL);
            $phone = trim($input['phone'] ?? '');
            $subject = trim($input['subject'] ?? '');
            $message = trim($input['message'] ?? '');

            if (empty($name) || !$email || empty($message) || strlen($message) > 1000) {
                return false;
            }

            return [
                'name' => htmlspecialchars($name),
                'email' => $email,
                'phone' => htmlspecialchars($phone),
                'subject' => htmlspecialchars($subject),
                'message' => htmlspecialchars($message),
                'form_type' => 'contact'
            ];
        }
    }

    private function isBot($input) {
        $honeypotTrap = !empty($input['honeypot']);
        $suspiciousPatterns = [
            '/http:\/\//i', 
            '/\[url=/i', 
            '/<a\s+href/i'
        ];
        $containsSuspiciousContent = array_reduce($suspiciousPatterns, 
            fn($carry, $pattern) => $carry || 
            preg_match($pattern, $input['message'] ?? '') || 
            preg_match($pattern, $input['name'] ?? ''), 
            false
        );

        return $honeypotTrap || $containsSuspiciousContent;
    }

    private function prepareUserEmailTemplate($validInput) {
        $emailBody = $this->userEmailTemplate;
        
        $emailBody = str_replace('{{NAME}}', $validInput['name'], $emailBody);
        
        return $emailBody;
    }
    
    private function prepareAdminEmailTemplate($validInput) {
        $emailBody = $this->adminEmailTemplate;
        
        $formTypeHtml = '';
        if ($validInput['form_type'] === 'hero') {
            $formTypeHtml = '<div class="form-type hero-form">Hero Form</div>';
        } else {
            $formTypeHtml = '<div class="form-type contact-form">Contact Form</div>';
        }
        
        $dateTime = date('d. F Y. H:i');
        
        $subject = !empty($validInput['subject']) ? $validInput['subject'] : $validInput['topic'];
        
        $emailBody = str_replace('{{FORM_TYPE_HTML}}', $formTypeHtml, $emailBody);
        $emailBody = str_replace('{{DATE}}', $dateTime, $emailBody);
        $emailBody = str_replace('{{NAME}}', $validInput['name'], $emailBody);
        $emailBody = str_replace('{{EMAIL}}', $validInput['email'], $emailBody);
        $emailBody = str_replace('{{PHONE}}', $validInput['phone'], $emailBody);
        $emailBody = str_replace('{{SUBJECT}}', $subject, $emailBody);
        $emailBody = str_replace('{{MESSAGE}}', nl2br($validInput['message']), $emailBody);
        $emailBody = str_replace('{{IP}}', $_SERVER['REMOTE_ADDR'], $emailBody);
        $emailBody = str_replace('{{REPLY_LINK}}', 'mailto:' . $validInput['email'], $emailBody);
        
        return $emailBody;
    }

    private function sendConfirmationEmail($validInput) {
        $mail = new PHPMailer(true);
        try {
            $mail->CharSet = "UTF-8";
            $mail->isSMTP();
            $mail->Host = "mailcluster.loopia.se";
            $mail->SMTPAuth = true;
            $mail->Username = "info@programiraj.rs";
            $mail->Password = $this->config["password"];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->setFrom("info@programiraj.rs", "AS Traffic And Technical Consulting");
            $mail->addAddress($validInput['email'], $validInput['name']);

            $mail->isHTML(true);
            $mail->Subject = "Hvala na poruci - AS Traffic And Technical Consulting";
            $mail->Body = $this->prepareUserEmailTemplate($validInput);
            
            $mail->send();
        } catch (Exception $e) {
            error_log("Confirmation email error: " . $mail->ErrorInfo);
        }
    }

    public function handleSubmission() {
        header('Content-Type: application/json');

        $clientIP = $_SERVER['REMOTE_ADDR'];
        if (!$this->checkRateLimit($clientIP)) {
            http_response_code(429);
            die(json_encode(['success' => false, 'error' => 'Molimo vas da popunite formu samo jedan put u toku sat vremena. Previše često slanje forme nije dozvoljeno.']));
        }

        if ($_SERVER["REQUEST_METHOD"] !== "POST") {
            http_response_code(405);
            die(json_encode(['success' => false, 'error' => 'Nije dozvoljeno!']));
        }

        if ($this->isBot($_POST)) {
            http_response_code(403);
            die(json_encode(['success' => false, 'error' => 'Bot detektovan!']));
        }

        $isHeroForm = isset($_POST['form_type']) && $_POST['form_type'] === 'hero';
        
        $validInput = $this->validateInput($_POST, $isHeroForm);
        if (!$validInput) {
            http_response_code(400);
            die(json_encode(['success' => false, 'error' => 'Pogrešno ste popunili']));
        }

        try {
            $mail = new PHPMailer(true);
            $mail->CharSet = "UTF-8";
            $mail->isSMTP();
            $mail->Host = "mailcluster.loopia.se";
            $mail->SMTPAuth = true;
            $mail->Username = "info@programiraj.rs";
            $mail->Password = $this->config["password"];
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
            $mail->Port = 587;

            $mail->setFrom("info@programiraj.rs", "AS Traffic And Technical Consulting");
            $mail->addAddress("info@programiraj.rs");
            $mail->addReplyTo($validInput['email'], $validInput['name']);

            $mail->isHTML(true);
            
            if ($validInput['form_type'] === 'hero') {
                $mail->Subject = "AS Traffic - Hero Form: {$validInput['name']}";
            } else {
                $mail->Subject = "AS Traffic - Contact Form: {$validInput['name']}";
            }
            
            $mail->Body = $this->prepareAdminEmailTemplate($validInput);
            
            $mail->send();

            $this->sendConfirmationEmail($validInput);

            echo json_encode(['success' => true]);
        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => $mail->ErrorInfo]);
        }
    }
}

$handler = new ContactFormHandler();
$handler->handleSubmission();